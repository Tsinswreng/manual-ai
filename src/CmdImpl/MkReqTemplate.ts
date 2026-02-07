import * as vscode from 'vscode';
import { RawReq } from '../Model/Impl/RawReq';

export const cmdMkReqTemplate = async () => {
	try {
		// 生成RawReq模板字符串
		const templateStr = RawReq.mkTemplateStr();
		
		// 将模板内容写入剪贴板
		await vscode.env.clipboard.writeText(templateStr);
		
		// 显示成功提示
		vscode.window.showInformationMessage('RawReq模板已生成并复制到剪贴板');
	} catch (error) {
		// 错误处理
		vscode.window.showErrorMessage(`生成RawReq模板失败: ${(error as Error).message}`);
	}
};