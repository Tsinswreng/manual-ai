/* 
vsce package
*/

import * as vscode from 'vscode';
import { promises as fs } from 'fs';
import { AiResp } from './Model/Impl/AiResp';
import { ChangeApplyer } from './ChangeApplyer';
import { IOpWriteFile } from './Model/AiResp';
import { InteractFilesGetter } from './InteractFiles';
import { ensureFile, writeFile } from './Tools/FileUtils';
import { RawReq } from './Model/Impl/RawReq';
import { FinalReq } from './Model/Impl/FinalReq';
import { RawReqToFinalReqConvtr, FinalReqToCommonLlmReqConvtr } from './Model/Impl/RawReqToFinalReq';

function c(s:string){
	return "manual-ai."+s
}
export const CmdNames = {
	ExeOp: c("ExeOp"),
	GenReq: c("GenReq"),
}

export function activate(context: vscode.ExtensionContext) {
	let disposable1 = vscode.commands.registerCommand(CmdNames.ExeOp, async () => {
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
			vscode.window.showInformationMessage(`成功应用了 ${writeOperations.length} 个更改`);
		} catch (error) {
			vscode.window.showErrorMessage(`应用更改失败: ${(error as Error).message}`);
		}
	});

	let disposable2 = vscode.commands.registerCommand(CmdNames.GenReq, async () => {
		try {
			// 获取当前编辑器的取消令牌
			const ct = new vscode.CancellationTokenSource().token;
			
			// 获取交互文件路径
			const interactFiles = InteractFilesGetter.inst.getInteractFiles();
			
			// 确保 UserInput 文件存在
			await ensureFile(interactFiles.UserInput, ct);
			
			// 读取 UserInput 文件内容
			const yamlContent = await fs.readFile(interactFiles.UserInput, 'utf8');
			
			if(yamlContent == void 0 || yamlContent.trim() == ''){
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

			// 写入到 FinalReq 文件
			await writeFile(interactFiles.FinalReq, finalReqYaml, ct);

			// 转换为 CommonLlmReq
			const commonLlmReqConverter = FinalReqToCommonLlmReqConvtr.inst;
			const commonLlmReq = await commonLlmReqConverter.finalReqToCommonLlmReq(finalReq, ct);

			// 序列化为 YAML 字符串
			const commonLlmReqYaml = commonLlmReq.toYaml();

			// 写入到 CommonLlmReq 文件
			await writeFile(interactFiles.CommonLlmReq, commonLlmReqYaml, ct);

			// 写入到剪贴板（放 CommonLlmReq 的内容）
			await vscode.env.clipboard.writeText(commonLlmReqYaml);

			// 显示成功信息
			//vscode.window.showInformationMessage('RawReq 转换成功，已写入 FinalReq 和 CommonLlmReq 文件，CommonLlmReq 内容已复制到剪贴板');
		} catch (error) {
			vscode.window.showErrorMessage(`GenReq Failed: ${(error as Error).message}`);
		}
	});

	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
}

export function deactivate() {}
