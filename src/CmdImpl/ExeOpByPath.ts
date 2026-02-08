import * as vscode from 'vscode';
import { promises as fs } from 'fs';
import { AiResp } from '../Model/Impl/AiResp';
import { ChangeApplyer } from '../ChangeApplyer';
import { IOpWriteFile } from '../Model/AiResp';
import { InteractFilesGetter } from '../InteractFiles';
import { ensureFile } from '../Tools/FileUtils';

export const cmdExeOpByPath = async () => {
	// 让用户输入 YAML 文件路径
	let filePath = await vscode.window.showInputBox({
		placeHolder: 'Input the path of ExeOp.yaml to apply changes',
		prompt: 'If null, default path will be used'
	});

	// 当用户没传入文件路径时，使用默认路径
	if (!filePath || filePath.trim() === '') {
		filePath = InteractFilesGetter.inst.getInteractFiles().ExeOp;
	}

	try {
		// 获取当前编辑器的取消令牌
		const ct = new vscode.CancellationTokenSource().token;

		// 确保文件存在
		await ensureFile(filePath, ct);

		// 读取 YAML 文件内容
		const yamlContent = await fs.readFile(filePath, 'utf8');

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