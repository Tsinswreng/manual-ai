/* 
vsce package
*/
import * as vscode from 'vscode';
import { cmdExeOpByPath } from './CmdImpl/ExeOpByPath';
import { cmdExeOpYaml } from './CmdImpl/ExeOpYaml';
import { cmdMkCommonLlmReq } from './CmdImpl/MkCommonLlmReq';
import { cmdMkReqTemplate } from './CmdImpl/MkReqTemplate';
import { cmdMkReq } from './CmdImpl/MkReq';
import { cmdMkInitReq } from './CmdImpl/MkInitReq';
import { cmdExeOp } from './CmdImpl/ExeOp';
function c(s:string){
	return "manual-ai."+s
}
export const CmdNames = {
	/** 按路徑執行操作。若不傳路徑則用默認路徑 */
	ExeOpByPath: c("ExeOpByPath"),
	/** 讀貼板內容執行操作 */
	ExeOpYaml: c("ExeOpYaml"),
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

function r(cmdName:string, cmd: () => Promise<void>){
	context.subscriptions.push(vscode.commands.registerCommand(cmdName, cmd))
}
r(CmdNames.ExeOpByPath, cmdExeOpByPath)
r(CmdNames.MkCommonLlmReq, cmdMkCommonLlmReq)
r(CmdNames.ExeOp, cmdExeOp)
r(CmdNames.ExeOpYaml, cmdExeOpYaml)
r(CmdNames.MkReq, cmdMkReq)
r(CmdNames.MkInitReq, cmdMkInitReq)
r(CmdNames.MkReqTemplate, cmdMkReqTemplate)

}

export function deactivate() {}
