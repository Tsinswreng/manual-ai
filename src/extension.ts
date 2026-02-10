/* 
vsce package
*/

import * as vscode from 'vscode';
import { cmdExeOpByPath } from './CmdImpl/ExeOpByPath';
import { cmdExeOp } from './CmdImpl/ExeOp';
import { cmdMkCommonLlmReq } from './CmdImpl/MkCommonLlmReq';
import { cmdMkReqTemplate } from './CmdImpl/MkReqTemplate';
import { cmdMkReq } from './CmdImpl/MkReq';
function c(s:string){
	return "manual-ai."+s
}
export const CmdNames = {
	/** 按路徑執行操作。若不傳路徑則用默認路徑 */
	ExeOpByPath: c("ExeOpByPath"),
	/** 讀貼板內容執行操作 */
	ExeOp: c("ExeOp"),
	/** 生成Llm請求體格式的yaml、會導致文本塊縮進過多 效果不佳 不建議用 */
	MkCommonLlmReq: c("MkCommonLlmReq"),
	/** 產生請求(FinalReq)、最終剪貼板內容爲 FinalReq*/
	MkReq: c("MkReq"),
	/** 在MkReq之前再帶上提示詞 */
	MkInitReq: c("MkInitReq"),
	MkReqTemplate: c("MkReqTemplate"),
}

export function activate(context: vscode.ExtensionContext) {
	let disposable1 = vscode.commands.registerCommand(CmdNames.ExeOpByPath, cmdExeOpByPath);
	let disposable2 = vscode.commands.registerCommand(CmdNames.MkCommonLlmReq, cmdMkCommonLlmReq);
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
