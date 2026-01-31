import { IFromEtToYaml } from "./IFromEtToYaml"

/** AI回答 之 操作類型 */
export type EOperateType =
//|'explain'//講解。給人看 不與編輯器交互
|'replaceByLine'//按行號替換
|'replaceBySnippet'//按文本替換
|'readFiles'//讀多個文件
|'seekDef'//查找符號定義
//TODO 重命名符號

export interface I_path{
	path:string
}

export interface I_type{
	type:EOperateType
}

/**
 * 操作基礎接口
 */
export interface IOperation extends I_type, I_path, IFromEtToYaml{

}

/**
 * 涉及寫的操作都要實現此接口
 */
export interface IOpWriteFile extends IOperation{
	
}

export interface ILineRangeReplace{
	/** 從1始, 含。可大於文件總行數。 */
	startLine: number
	/** 含。可大於文件總行數。 */
	endLine: number
	/** 序列化爲yaml時 要用多行文本塊語法 
	 * 注意: yaml中應當用 xxx: |- 而不是 xxx: | 因為後者會在末尾多加一個換行符
	 */
	data: string
}

/** 依行號替換文件 
 * 實現時需倒序執行 若正序則行號錯亂
 * 適用于 AI初次答旹。若用戶同意AI之改、則行號既變、後續追問旹則不可復依行號替換，需用文本片段匹配
 * 文件芝發予AI者皆帶行號、AI當不會數錯
 */
export interface IOpReplaceByLine extends 
	IOperation
	,IOpWriteFile
{
	/** 文件不存在時 自動創建
	 * 如需新建並寫入文件、則把path設爲新路徑、把始行與末行皆設爲1、data設爲要寫入的內容
	 */
	path: string
	/**
	 * 要對行號排序、倒序執行
	 */
	replace: ILineRangeReplace[]
}

export interface ISnippetReplace extends IFromEtToYaml{
	/**
	 * 爲防止錯配(即一個文件中匹配到多個相同的文本片段)、match應足夠長
	 * match應與原文出現的代碼片段嚴格相同、包括縮進, 首尾空白, 其他地方的空白符號等。
	 * 用戶的提問會經過正規化，其中的換行符統一用\n
	 * 用yaml多行文本塊語法
	 * 注意: yaml中應當用 xxx: |- 而不是 xxx: | 因為後者會在末尾多加一個換行符
	 */
	match: string
	/**
	 * 用yaml多行文本塊語法
	 * 注意: yaml中應當用 xxx: |- 而不是 xxx: | 因為後者會在末尾多加一個換行符
	 */
	replacement: string

}

/**
 * 按文本片段匹配替換
 * 
 */
export interface IOpReplaceBySnippet extends 
	IOperation
	,IOpWriteFile
{
	replace: ISnippetReplace[]
}

export interface ILineEtSymbol{
	line: number
	//col?: number //本欲用于精細定位與消岐、但所予AI之文件內容只有行號而無列號、今則暫定不設
	symbol: string
}

/** 查找符號定義 */
export interface IOpSeekDef extends IOperation, I_path{
	symbols: ILineEtSymbol[]
}

/** AI再請求讀多個文件
 * 當AI認爲需要讀其他文件時，會在回答中發出此請求、用戶則在下輪輸出 加上文件內容
 */
export interface IOpReadFiles extends IOperation{
	paths: string[]
}


/** AI 格式化輸出 */
export interface IAiResp extends IFromEtToYaml{
	/** 對應請求的Unix時間戳。
	 * 因 是網頁AI、使AI答今之時間則不善。故爲代碼中處理後自動添加
	 */
	reqUnixMs?:number
	operations: IOperation[]
	/** 講解。給人看 不與編輯器交互
	 * 用yaml多行文本塊語法 */
	text: string
}


