import { IOpWriteFile, IOpReplaceByLine, IOpReplaceBySnippet, EOperateType } from "./Model/AiResp";
import { readFile, writeFile, ensureDir } from "./Tools/FileUtils";
import { CT } from "./CT";
import { YamlBlock } from "./Model/IYamlBlock";

export interface IChangeApplyer {
	applyChange(change: IOpWriteFile, ct: CT): Promise<any>
}

export class ChangeApplyer implements IChangeApplyer {
	async applyChange(change: IOpWriteFile, ct: CT): Promise<any> {
		if (change.type === 'replaceByLine') {
			return this.applyReplaceByLine(change as IOpReplaceByLine, ct);
		} else if (change.type === 'replaceBySnippet') {
			return this.applyReplaceBySnippet(change as IOpReplaceBySnippet, ct);
		}
		throw new Error(`Unsupported operation type: ${change.type}`);
	}

	private async applyReplaceByLine(change: IOpReplaceByLine, ct: CT): Promise<any> {
		// 确保目录存在
		await ensureDir(change.path, ct);

		let content: string;
		try {
			content = await readFile(change.path, ct);
		} catch (error) {
			// 文件不存在，创建新文件
			content = '';
		}

		// 将内容按行分割
		let lines = content.split('\n');

		// 对替换操作按行号倒序排序，避免行号错乱
		const sortedReplace = [...change.replace].sort((a, b) => b.startLine - a.startLine);

		// 执行替换

		for (const replace of sortedReplace) {
			if(replace.data == void 0){
				continue;
			}
			//當replace.data不爲undefined時、必以\n結尾;
			const replaceData = YamlBlock.getParsedContent(replace.data)
			if (replace.startLine === 0 && replace.endLine === 0) {
				// 新建文件
				lines = (replaceData ?? "").split('\n');
			} else {
				// 注意：用户指定的行号从1开始，而数组索引从0开始
				const start = replace.startLine - 1;
				const end = replace.endLine; // 数组的splice方法是从start开始删除end-start个元素

				if (replaceData == void 0) {
					// data为undefined时，删除指定行范围
					lines.splice(start, end - start);
				} else {
					// 替换指定范围的行（含空字符串替换场景）
					const newLines = replaceData.split('\n');
					// 移除split后末尾的空元素（因原数据末尾带\n导致），同时兼容空数据场景
					if (newLines.length > 1 && newLines[newLines.length - 1] === '') {
						newLines.pop();
					}
					lines.splice(start, end - start, ...newLines);
				}
			}
		}

		// 重新连接成字符串
		const newContent = lines.join('\n');

		// 写入文件
		await writeFile(change.path, newContent, ct);

		return {
			path: change.path,
			oldContent: content,
			newContent: newContent,
			changes: change.replace
		};
	}

	private async applyReplaceBySnippet(change: IOpReplaceBySnippet, ct: CT): Promise<any> {
		// 确保目录存在
		await ensureDir(change.path, ct);

		let content: string;
		try {
			content = await readFile(change.path, ct);
		} catch (error) {
			// 文件不存在，创建新文件
			content = '';
		}

		let newContent = content;

		// 执行片段替换
		for (const replace of change.replace) {
			// 使用全局替换可能会有风险，所以只替换第一个匹配的片段
			if(replace.match == void 0){
				continue;
			}
			const match = YamlBlock.getParsedContent(replace.match);
			if(match == void 0){
				continue
			}
			const replacement = replace.replacement == void 0?void 0 : YamlBlock.getParsedContent(replace.replacement);
			newContent = newContent.replace(match, replacement??'');
		}

		// 写入文件
		await writeFile(change.path, newContent, ct);

		return {
			path: change.path,
			oldContent: content,
			newContent: newContent,
			changes: change.replace
		};
	}
}