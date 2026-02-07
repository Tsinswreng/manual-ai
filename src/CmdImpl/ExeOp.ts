import * as vscode from 'vscode';
import { AiResp } from '../Model/Impl/AiResp';
import { ChangeApplyer } from '../ChangeApplyer';
import { IOpWriteFile } from '../Model/AiResp';

export const cmdExeOp = async () => {
	try {
		// 获取当前编辑器的取消令牌
		const ct = new vscode.CancellationTokenSource().token;
		
		// 从剪贴板读取 YAML 内容
		const yamlContent = await vscode.env.clipboard.readText();
		
		if (!yamlContent || yamlContent.trim() === '') {
			vscode.window.showErrorMessage('剪贴板内容为空，无法执行操作');
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
		vscode.window.showInformationMessage(`成功应用了 ${writeOperations.length} 个更改`);
	} catch (error) {
		vscode.window.showErrorMessage(`应用更改失败: ${(error as Error).message}`);
	}
};