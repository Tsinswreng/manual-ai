/** 單個文件上下文 */
export interface IFileCtx{
	path: string;
	/** vscode提供 的 編譯錯誤信息
	 * 如
	 * issues:
	 *  - |
			[{
			"resource": "/E:/_code/_clone/cline/evals/diff-edits/ClineWrapper.ts",
			"owner": "typescript",
			"code": "2307",
			"severity": 8,
			"message": "找不到模块“../../src/api/providers/openrouter”或其相应的类型声明。",
			"source": "ts",
			"startLineNumber": 1,
			"startColumn": 35,
			"endLineNumber": 1,
			"endColumn": 71,
			"modelVersionId": 1,
			"origin": "extHost1"
			}]
		- |
			(第二個issue)...
	 * 
	 * 多個yaml多行文本塊(列表) 勿轉義。 因是給AI看的 故不需保持結構化
	 * 
	 */
	issues: string[]
	/** 帶有行號的原始內容。行號從1始
	 * 如
	 * 1|	#!/bin/bash
	 * 2|	echo "Hello, World!"
	 * 
	 * 整個文件中、文件行號的字符數要一致。
	 * 如當文件總行數在[1,9]行間、則第一行的行號是1; 
	 * 當文件總行數在[10,99]間、則第一行的行號是01;
	 * 當文件總行數在[100,999]間、則第一行的行號是001;
	 * 
	 * 文件換行符會被歸一化 為 \n
	 * 用yaml多行文本塊語法、勿轉義
	 */
	contentWithLineNum: string;
}

/** 最終給AI發送的內容 */
export interface IFinalReq{
	files: IFileCtx[];
	/** 用yaml多行文本塊語法、勿轉義 */
	text: string;
}