import { CT } from "../CT";
import type { NullableList } from "../NullableList";
import { UnixPathNormalizer } from "./UnixPathNormalizer";
import fs from 'fs/promises';
import path from 'path';

/**
 * 
 * @param rootDir 在此目錄下搜尋
 * @param includes 包含的文件
 * @param excludes 排除的文件
 */
export async function regexMatchFiles(
	rootDir: string
	, includes?: NullableList<RegExp>
	, excludes?: NullableList<RegExp>
	,ct?:CT
) {


	// 规范化根目录路径
	const normalizedRootDir = UnixPathNormalizer.inst.normalizePath(rootDir);

	// 过滤掉undefined的正则表达式，只保留有效的RegExp实例
	const validIncludes = includes?.filter((reg): reg is RegExp => reg != void 0) ?? [];
	const validExcludes = excludes?.filter((reg): reg is RegExp => reg != void 0) ?? [];

	// 递归遍历目录，匹配符合条件的文件
	async function traverseDirectory(currentDir: string): Promise<string[]> {
		const entries = await fs.readdir(currentDir, { withFileTypes: true });
		const matchedFiles: string[] = [];

		for (const entry of entries) {
			const fullPath = path.join(currentDir, entry.name);
			// 对每个文件路径进行Unix格式规范化
			const normalizedPath = UnixPathNormalizer.inst.normalizePath(fullPath);

			if (entry.isDirectory()) {
				// 递归处理子目录
				const subDirFiles = await traverseDirectory(fullPath);
				matchedFiles.push(...subDirFiles);
			} else if (entry.isFile()) {
				// 判断是否匹配包含规则，无包含规则则默认匹配
				const matchesInclude = validIncludes.length === 0 || validIncludes.some(reg => reg.test(normalizedPath));
				// 判断是否匹配排除规则
				const matchesExclude = validExcludes.some(reg => reg.test(normalizedPath));

				// 仅保留匹配包含且不匹配排除的文件
				if (matchesInclude && !matchesExclude) {
					matchedFiles.push(normalizedPath);
				}
			}
		}

		return matchedFiles;
	}

	// 执行遍历并返回结果
	return traverseDirectory(normalizedRootDir);
}