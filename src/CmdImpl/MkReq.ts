import * as vscode from 'vscode';
import { RawReq } from '../Model/Impl/RawReq';
import { RawReqToFinalReqConvtr } from '../Model/Impl/RawReqToFinalReq';
import { InteractFilesGetter } from '../InteractFiles';
import { writeEnsuredFile } from '../Tools/FileUtils';
import { yamlMdToYaml } from '../YamlMd/yamlMdToYaml';

export const cmdMkReq = async () => {
	try {
		// 获取当前编辑器的取消令牌
		const ct = new vscode.CancellationTokenSource().token;

		// 从剪贴板读取内容作为RawReq输入
		const yamlMdContent = await vscode.env.clipboard.readText();
		const yamlContent = await yamlMdToYaml(yamlMdContent, ct);
		if (yamlContent == void 0 || yamlContent.trim() == '') {
			vscode.window.showErrorMessage('Clipboard is empty, cannot generate request');

			return;
		}

		// 反序列化为 RawReq 对象
		const rawReq = new RawReq();
		rawReq.fromYaml(yamlContent);

		// 转换为 FinalReq
		const converter = RawReqToFinalReqConvtr.inst;
		const finalReq = await converter.rawReqToFinalReq(rawReq, ct);

		// 序列化为 YAML 字符串
		const finalReqYaml = finalReq.toYaml();

		// 获取交互文件路径
		const interactFiles = InteractFilesGetter.inst.getInteractFiles();
		// 写入到 FinalReq 文件
		await writeEnsuredFile(interactFiles.FinalReq, finalReqYaml, ct);

		// 写入到剪贴板（放 FinalReq 的内容）
		await vscode.env.clipboard.writeText(finalReqYaml);

		// 显示成功信息
		vscode.window.showInformationMessage('RawReq converted successfully, written to FinalReq file, FinalReq content copied to clipboard');

	} catch (error) {
		vscode.window.showErrorMessage(`Failed to generate request: ${(error as Error).message}`);

	}
};