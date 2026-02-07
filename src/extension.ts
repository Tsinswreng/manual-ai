/* 
vsce package
*/
//TODO GenReq旹 彈窗㕥指定路徑、不輸則用默認路徑
import * as vscode from 'vscode';
import { promises as fs } from 'fs';
import { AiResp } from './Model/Impl/AiResp';
import { ChangeApplyer } from './ChangeApplyer';
import { IOpWriteFile } from './Model/AiResp';
import { InteractFilesGetter } from './InteractFiles';
import { ensureFile, writeEnsuredFile } from './Tools/FileUtils';
import { RawReq } from './Model/Impl/RawReq';
import { FinalReq } from './Model/Impl/FinalReq';
import { RawReqToFinalReqConvtr, FinalReqToCommonLlmReqConvtr } from './Model/Impl/RawReqToFinalReq';
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
	GenInitReq: c("GenInitReq"),
	/** 產生請求(FinalReq)、最終剪貼板內容爲 FinalReq*/
	GenReq: c("GenReq"),
}

export function activate(context: vscode.ExtensionContext) {
	let disposable1 = vscode.commands.registerCommand(CmdNames.ExeOpByPath, exeOpByPathCommand);
	

	let disposable2 = vscode.commands.registerCommand(CmdNames.GenInitReq, genInitReqCommand);
	

	let disposable3 = vscode.commands.registerCommand(CmdNames.ExeOp, exeOpCommand);
	

	let disposable4 = vscode.commands.registerCommand(CmdNames.GenReq, genReqCommand);
	

	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
	context.subscriptions.push(disposable4);
}

export function deactivate() {}
