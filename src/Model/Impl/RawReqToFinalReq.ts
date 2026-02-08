import { IFiles, IRawReq, IRegexsObslt } from "../RawReq";
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
import { DfltSysPrompt } from "../../SysPrompt";
import * as vscode from 'vscode';
import { UnixPathNormalizer } from "../../Tools/UnixPathNormalizer";
import { ensureFile } from "../../Tools/FileUtils";
import { InteractFilesGetter } from "../../InteractFiles";
import { regexMatchFiles } from "../../Tools/RegexFileMatcher";

export interface IRawReqToFinalReqConvtr {
	rawReqToFinalReq(rawReq: IRawReq, ct?: CT): Promise<IFinalReq>;
}

export interface IFinalReqToCommonLlmReq {

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
			let targetFilePaths = await this.resolveFilePaths(rawReq.files);
			targetFilePaths = targetFilePaths.map(x => UnixPathNormalizer.inst.normalizePath(x));
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
		const { paths = [] } = files;

		// 1. 解析glob通配符，获取初始文件列表
		let fileList: string[] = [];
		for (const path of paths) {
			const normalizedPath = UnixPathNormalizer.inst.normalizePath(path);
			let matched = await glob(normalizedPath, { nodir: true }); // 只匹配文件，排除目录

			matched = matched.map(x => UnixPathNormalizer.inst.normalizePath(x));
			fileList = fileList.concat(matched);
		}

		// 2. 应用正则过滤（includes->保留，excludes->排除）
		if (files.regex != void 0) {
			// 遍历每个正则匹配规则，获取匹配的文件
			for (const regexItem of files.regex) {
				// 将字符串类型的正则表达式转换为RegExp实例（兼容空数组）
				const includes = (regexItem.includes ?? []).map(pattern => new RegExp(pattern));
				const excludes = (regexItem.excludes ?? []).map(pattern => new RegExp(pattern));
				// 调用正则匹配文件工具函数，传入根目录、包含/排除规则和上下文
				const regexMatchedFiles = await regexMatchFiles(
					regexItem.rootDir,
					includes,
					excludes,
				);
				// 规范化路径格式并合并到文件列表
				const normalizedRegexFiles = regexMatchedFiles.map(x => UnixPathNormalizer.inst.normalizePath(x));
				fileList = fileList.concat(normalizedRegexFiles);
			}
		}



		// 3. 路径去重，避免重复处理同一文件
		return [...new Set(fileList)];
	}

	private async buildFileCtxList(
		filePaths: string[],
		lineNumAttacher: LineNumAttacher,
		ct?: CT
	): Promise<IFileCtx[]> {
		// 步骤1：获取「项目所有文件」的诊断，并按文件URI分组（解决激活编辑器问题）
		const allDiagnostics = vscode.languages.getDiagnostics(); // 传undefined获取所有文件诊断
		// 构建「URI路径 -> 错误诊断数组」的映射，提升后续匹配效率
		const diagnosticMap = new Map<string, vscode.Diagnostic[]>();
		allDiagnostics.forEach(([uri, diags]) => {
			const errorDiags = diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
			if (errorDiags.length > 0) {
				const path = UnixPathNormalizer.inst.normalizePath(uri.fsPath);
				diagnosticMap.set(path, errorDiags);
			}
		});

		// 步骤2：并行处理文件
		const fileCtxPromises = filePaths.map(async (filePath) => {
			try {
				// 读取文件内容（同方案1，略）
				let content = await fs.readFile(filePath, "utf8");
				content = content.replaceAll("\r\n", "\n");
				const lines = content.split('\n')
				const contentWithLineNum = lines
					.map((singleLine, index) => {
						const lineNum = index + 1;
						return lineNumAttacher.attachLineNum(singleLine, lineNum, lines.length);
					})
					.join('\n');

				// 步骤3：从预分组的映射中获取当前文件的错误诊断（O(1)匹配，效率更高）
				const fileErrorDiagnostics = diagnosticMap.get(filePath) || [];

				// 构建FileCtx（含序列化循环引用处理，同方案1）
				const fileCtx = new FileCtx();
				fileCtx.path = filePath;
				fileCtx.issues = fileErrorDiagnostics.map(d =>
					JSON.stringify(d, (key, value) => {
						if (key === 'uri' && value instanceof vscode.Uri) {
							return value.fsPath;
						}
						return value;
					})
				);
				fileCtx.contentWithLineNum = {
					content: contentWithLineNum
				};

				return fileCtx as IFileCtx;
			} catch (error) {
				console.warn(`[RawReqToFinalReq] 跳过文件${filePath}：`, (error as Error).message);
				return null;
			}
		});

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
		const sysPromptFilePath = InteractFilesGetter.inst.getInteractFiles().SysPrompt;
		const exists = await ensureFile(sysPromptFilePath, ct);
		if (!exists) {
			fs.writeFile(sysPromptFilePath, DfltSysPrompt, { encoding: "utf8" })
		}
		const sysPromptContent = await fs.readFile(sysPromptFilePath, "utf8");
		const systemMessage = new RoleEtContentImpl("system", sysPromptContent);
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
