import { IRawReq } from "../RawReq";
import { IFinalReq, IFileCtx } from "../FinalReq";
import { FinalReq, FileCtx } from "./FinalReq";
import { LineNumAttacher } from "../../Tools/ILineNumAttacher";
import { promises as fs } from "fs";
import { CT } from "../../CT";
import { glob } from "glob";

export interface IRawReqToFinalReqConvtr{
	convert(rawReq: IRawReq, ct?: CT): Promise<IFinalReq>;
}

/**
 * RawReq 转换为 FinalReq 的工具类
 */
export class RawReqToFinalReq implements IRawReqToFinalReqConvtr {
	static inst = new this();
	private lineNumAttacher = LineNumAttacher.inst;

	/**
	 * 将 RawReq 转换为 FinalReq
	 * @param rawReq 原始请求
	 * @param ct 取消令牌
	 * @returns 最终请求
	 */
	async convert(rawReq: IRawReq, ct?: CT): Promise<IFinalReq> {
		const finalReq = new FinalReq();
		finalReq.unixMs = Date.now();
		finalReq.text = rawReq.text || '';
		finalReq.files = [];

		// 处理文件
		if (rawReq.files) {
			// 处理直接指定的文件路径
			const filePaths = await this.getMatchedFiles(rawReq.files.paths, rawReq.files.regex);
			for (const filePath of filePaths) {
				const fileCtx = await this.createFileCtx(filePath, ct);
				finalReq.files.push(fileCtx);
			}
		}

		return finalReq;
	}

	/**
	 * 获取匹配的文件路径
	 * @param paths 文件路径数组（支持通配符）
	 * @param regex 正则表达式配置
	 * @returns 匹配的文件路径数组
	 */
	private async getMatchedFiles(paths: string[], regex: { includes: string[], excludes: string[] }): Promise<string[]> {
		const allFiles: string[] = [];

		for (const pathPattern of paths) {
			// 使用 glob 匹配文件
			const matchedFiles = await glob(pathPattern);
			// 应用正则表达式过滤
			const filteredFiles = matchedFiles.filter(filePath => this.matchesRegex(filePath, regex));
			allFiles.push(...filteredFiles);
		}

		// 去重
		return Array.from(new Set(allFiles));
	}

	/**
	 * 检查文件路径是否匹配正则表达式配置
	 * @param filePath 文件路径
	 * @param regex 正则表达式配置
	 * @returns 是否匹配
	 */
	private matchesRegex(filePath: string, regex: { includes: string[], excludes: string[] }): boolean {
		// 检查是否被排除
		if (regex.excludes.length > 0) {
			const matchExclude = regex.excludes.some(pattern => {
				const regex = new RegExp(pattern);
				return regex.test(filePath);
			});
			if (matchExclude) {
				return false;
			}
		}

		// 检查是否被包含（如果没有配置包含规则，则默认全部包含）
		if (regex.includes.length === 0) {
			return true;
		}

		return regex.includes.some(pattern => {
			const regex = new RegExp(pattern);
			return regex.test(filePath);
		});
	}

	/**
	 * 创建文件上下文
	 * @param filePath 文件路径
	 * @param ct 取消令牌
	 * @returns 文件上下文
	 */
	private async createFileCtx(filePath: string, ct?: CT): Promise<IFileCtx> {
		const fileCtx = new FileCtx();
		fileCtx.path = filePath;
		fileCtx.issues = []; // 暂时为空，需要时可以从其他来源获取

		// 读取文件内容
		try {
			const content = await fs.readFile(filePath, 'utf8');
			fileCtx.contentWithLineNum = this.attachLineNumbers(content);
		} catch (error) {
			console.error(`无法读取文件: ${filePath}`, error);
			fileCtx.contentWithLineNum = '';
		}

		return fileCtx;
	}

	/**
	 * 为文件内容添加行号
	 * @param content 文件内容
	 * @returns 带行号的内容
	 */
	private attachLineNumbers(content: string): string {
		const lines = content.split(/\r\n?/); // 处理所有换行符
		const maxLineNum = lines.length;
		const lineNumWidth = maxLineNum.toString().length;

		return lines.map((line, index) => {
			const lineNum = index + 1;
			const paddedLineNum = lineNum.toString().padStart(lineNumWidth, '0');
			return `${paddedLineNum}|${line}`;
		}).join('\n'); // 统一使用 \n 换行符
	}
}