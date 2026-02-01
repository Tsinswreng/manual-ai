import { IFiles, IRawReq, IRegexs } from "../RawReq";
import { IFinalReq, IFileCtx } from "../FinalReq";
import { FinalReq, FileCtx } from "./FinalReq";
import { LineNumAttacher } from "../../Tools/ILineNumAttacher";
import { promises as fs } from "fs";
import { CT } from "../../CT";
import { glob } from "glob";
import { NullableList } from "../../NullableList";
import { LineNormalizer } from "../../Tools/LineNormalizer";
import { ICommonLlmReq } from "../CommonLlmReq";
import { CommonLlmReq, RoleEtContentImpl } from "./CommonLlmReq";
import { SysPrompt } from "../../SysPrompt";

export interface IRawReqToFinalReqConvtr {
	rawReqToFinalReq(rawReq: IRawReq, ct?: CT): Promise<IFinalReq>;
}

export interface IFinalReqToCommonLlmReq{
	
	finalReqToCommonLlmReq(finalReq: IFinalReq, ct?: CT): Promise<ICommonLlmReq>;
}



/**
 * 原始请求转最终AI请求 实现类
 * 核心职责：
 * 1. 解析文件路径（glob通配符 + includes/excludes正则过滤）
 * 2. 读取文件内容并附加行号
 * 3. 构建FileCtx和FinalReq实例
 * 4. 兼容空值、未定义等边界情况
 */
export class RawReqToFinalReqConvtr implements IRawReqToFinalReqConvtr {
	static inst = new this();
	/**
	 * 核心转换方法
	 * @param rawReq 人类手寫的原始请求
	 * @param ct 上下文对象（预留扩展，如后续获取文件语法错误issues）
	 * @returns 处理后的最终AI请求
	 */
	public async rawReqToFinalReq(rawReq: IRawReq, ct?: CT): Promise<IFinalReq> {
		// 初始化最终请求，设置当前时间戳
		const finalReq = new FinalReq();
		finalReq.unixMs = Date.now();
		// 处理文本内容，兼容undefined情况
		if (rawReq.text) {
			finalReq.text = {
				content: rawReq.text
			};
		}
		finalReq.files = [];

		// 无文件配置时，直接返回空文件的最终请求
		if (!rawReq.files) {
			return finalReq;
		}

		try {
			// 步骤1：解析并过滤出最终需要处理的文件路径
			const targetFilePaths = await this.resolveFilePaths(rawReq.files);
			if (targetFilePaths.length === 0) {
				return finalReq;
			}

			// 步骤2：初始化行号附加工具（项目现有工具，按约定使用）
			const lineNumAttacher = LineNumAttacher.inst;
			// 步骤3：批量处理文件，构建FileCtx实例
			const fileCtxList = await this.buildFileCtxList(
				targetFilePaths,
				lineNumAttacher,
				ct
			);

			// 步骤4：赋值到最终请求
			finalReq.files = fileCtxList
		} catch (error) {
			console.warn("[RawReqToFinalReq] 文件处理警告：", (error as Error).message);
		}

		return finalReq;
	}

	/**
	 * 解析文件路径：glob通配符解析 + includes/excludes正则过滤 + 路径去重
	 * @param files 原始文件配置（paths+regex）
	 * @returns 去重后的目标文件绝对/相对路径数组
	 */
	private async resolveFilePaths(files: IFiles): Promise<string[]> {
		const { paths = [], regex = {} } = files;
		const { includes, excludes } = regex;

		// 1. 解析glob通配符，获取初始文件列表
		let fileList: string[] = [];
		for (const path of paths) {
			const matched = await glob(path, { nodir: true }); // 只匹配文件，排除目录
			fileList = fileList.concat(matched);
		}

		// 2. 应用正则过滤（includes->保留，excludes->排除）
		fileList = this.filterByRegex(fileList, includes, excludes);

		// 3. 路径去重，避免重复处理同一文件
		return [...new Set(fileList)];
	}

	/**
	 * 正则过滤文件路径
	 * @param fileList 待过滤的文件路径列表
	 * @param includes 包含正则（空则不过滤，全部保留）
	 * @param excludes 排除正则（空则不排除）
	 * @returns 过滤后的文件列表
	 */
	private filterByRegex(
		fileList: string[],
		includes?: string[],
		excludes?: string[]
	): string[] {
		// 处理包含正则：只有匹配任意一个includes的文件才保留
		if (includes && includes.length > 0) {
			const includeRegexs = includes.map(p => new RegExp(p, "i")); // 忽略大小写，适配不同系统路径
			fileList = fileList.filter(filePath =>
				includeRegexs.some(re => re.test(filePath))
			);
		}

		// 处理排除正则：匹配任意一个excludes的文件直接排除
		if (excludes && excludes.length > 0) {
			const excludeRegexs = excludes.map(p => new RegExp(p, "i"));
			fileList = fileList.filter(filePath =>
				!excludeRegexs.some(re => re.test(filePath))
			);
		}

		return fileList;
	}

	/**
	 * 批量构建文件上下文列表
	 * @param filePaths 目标文件路径数组
	 * @param lineNumAttacher 行号附加工具
	 * @param ct 上下文对象（预留，后续可从ct获取文件issues如语法错误）
	 * @returns 文件上下文实例数组
	 */
	private async buildFileCtxList(
		filePaths: string[],
		lineNumAttacher: LineNumAttacher,
		ct?: CT
	): Promise<IFileCtx[]> {
		// 并行处理文件，提高效率
		const fileCtxPromises = filePaths.map(async (filePath) => {
			try {
				// 1. 读取文件内容（utf8编码，适配所有文本文件）
				let content = await fs.readFile(filePath, "utf8");
				content = content.replaceAll("\r\n", "\n");
				const lines = content.split('\n')
				const contentWithLineNum = lines
					.map((singleLine, index) => {
						const lineNum = index + 1; // 行号从1开始，匹配项目所有注释约定
						const l = singleLine
						return lineNumAttacher.attachLineNum(l, lineNum, lines.length);
					})
					.join('\n');
				//const contentWithLineNum = content
				// 3. 构建FileCtx实例（issues暂留空，预留从ct扩展获取语法错误的能力）
				const fileCtx = new FileCtx();
				fileCtx.path = filePath;
				fileCtx.issues = []
				fileCtx.contentWithLineNum = {
					content: contentWithLineNum
				};

				return fileCtx as IFileCtx;
			} catch (error) {
				console.warn(`[RawReqToFinalReq] 跳过文件${filePath}：`, (error as Error).message);
				return null;
			}
		});

		// 过滤掉处理失败的文件，返回有效FileCtx
		const results = await Promise.all(fileCtxPromises);
		return results.filter((ctx): ctx is IFileCtx => ctx !== null);
	}
}

// 最终请求转通用LLM请求 实现类
export class FinalReqToCommonLlmReqConvtr implements IFinalReqToCommonLlmReq {
	static inst = new this();

	public async finalReqToCommonLlmReq(finalReq: IFinalReq, ct?: CT): Promise<ICommonLlmReq> {
		const commonLlmReq = new CommonLlmReq();
		commonLlmReq.messages = [];

		// 添加系统角色消息
		const systemMessage = new RoleEtContentImpl("system", SysPrompt);
		commonLlmReq.messages.push(systemMessage);

		// 添加用户角色消息，内容为 finalReq.toYaml()
		const userMessage = new RoleEtContentImpl("user", finalReq.toYaml());
		commonLlmReq.messages.push(userMessage);

		return commonLlmReq;
	}
}

// 导出单例（方便项目中直接使用，也可通过new实例化）
export const rawReqToFinalReqConvtr = new RawReqToFinalReqConvtr();
export const finalReqToCommonLlmReqConvtr = new FinalReqToCommonLlmReqConvtr();
