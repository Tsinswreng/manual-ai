/* 
vsce package
*/
//TODO GenReq旹 彈窗㕥指定路徑、不輸則用默認路徑
import * as vscode from 'vscode';
import { exeOpByPathCommand } from './CmdImpl/ExeOpByPath';
import { exeOpCommand } from './CmdImpl/ExeOp';
import { genInitReqCommand } from './CmdImpl/GenInitReq';
import { genReqCommand } from './CmdImpl/GenReq';
function c(s:string){
	return "manual-ai."+s
}
export const CmdNames = {
	/** 按路徑執行操作。若不傳路徑則用默認路徑 */
	ExeOpByPath: c("ExeOpByPath"),
	/** 讀貼板內容執行操作 */
	ExeOp: c("ExeOp"),
	/** 產生初始請求(FinalReq 和 CommonLlmReq)、最終剪貼板內容爲 CommonLlmReq */
	MkInitReq: c("MkInitReq"),
	/** 產生請求(FinalReq)、最終剪貼板內容爲 FinalReq*/
	MkReq: c("MkReq"),
	MkReqTemplate: c("MkReqTemplate"),
}

export function activate(context: vscode.ExtensionContext) {
	let disposable1 = vscode.commands.registerCommand(CmdNames.ExeOpByPath, exeOpByPathCommand);
	

	let disposable2 = vscode.commands.registerCommand(CmdNames.MkInitReq, genInitReqCommand);
	

	let disposable3 = vscode.commands.registerCommand(CmdNames.ExeOp, exeOpCommand);
	

	let disposable4 = vscode.commands.registerCommand(CmdNames.MkReq, genReqCommand);
	

	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
	context.subscriptions.push(disposable4);
}

export function deactivate() {}
