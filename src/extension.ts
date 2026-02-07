/* 
vsce package
*/
//TODO GenReq旹 彈窗㕥指定路徑、不輸則用默認路徑
import * as vscode from 'vscode';
import { cmdExeOpByPath } from './CmdImpl/ExeOpByPath';
import { cmdExeOp } from './CmdImpl/ExeOp';
import { cmdMkInitReq } from './CmdImpl/GenInitReq';
import { cmdMkReqTemplate } from './CmdImpl/MkReqTemplate';
import { cmdMkReq } from './CmdImpl/GenReq';
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
	let disposable1 = vscode.commands.registerCommand(CmdNames.ExeOpByPath, cmdExeOpByPath);
	

	let disposable2 = vscode.commands.registerCommand(CmdNames.MkInitReq, cmdMkInitReq);
	

	let disposable3 = vscode.commands.registerCommand(CmdNames.ExeOp, cmdExeOp);
	

	let disposable4 = vscode.commands.registerCommand(CmdNames.MkReq, cmdMkReq);
	
	let disposable5 = vscode.commands.registerCommand(CmdNames.MkReqTemplate, cmdMkReqTemplate);
	
	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
	context.subscriptions.push(disposable4);
	context.subscriptions.push(disposable5);
	
}

export function deactivate() {}
