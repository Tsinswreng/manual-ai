import * as vscode from 'vscode';
import { AiResp } from '../Model/Impl/AiResp';
import { ChangeApplyer } from '../ChangeApplyer';
import { IOpWriteFile } from '../Model/AiResp';
import { yamlMdToYaml } from '../YamlMd/yamlMdToYaml';

export const cmdExeOp = async () => {
	try {
		// 获取当前编辑器的取消令牌
		const ct = new vscode.CancellationTokenSource().token;

		const yamlMdContent = await vscode.env.clipboard.readText();
		const yamlContent = await yamlMdToYaml(yamlMdContent, ct)

		if (!yamlContent || yamlContent.trim() === '') {
			vscode.window.showErrorMessage('Clipboard is empty, cannot execute operations');

			return;
		}

		// 反序列化为 AiResp 对象
		const aiResp = new AiResp();
		aiResp.fromYaml(yamlContent);

		// 应用更改
		const changeApplyer = new ChangeApplyer();

		// 只处理写操作
		const writeOperations = aiResp.operations.filter(op => op.type === 'replaceByLine' || op.type === 'replaceBySnippet') as IOpWriteFile[];

		// 执行所有写操作
		for (const operation of writeOperations) {
			await changeApplyer.applyChange(operation, ct);
		}

		// 显示成功信息
		vscode.window.showInformationMessage(`Successfully applied ${writeOperations.length} changes`);

	} catch (error) {
		vscode.window.showErrorMessage(`Failed to apply changes: ${(error as Error).message}`);

	}
};