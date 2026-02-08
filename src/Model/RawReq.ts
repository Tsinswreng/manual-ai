import { NullableList } from "../NullableList"
import { IFromEtToYaml } from "./IFromEtToYaml"

/** @deprecated  */
export interface IRegexsObslt{
	/** 包含的文件 如 [".*svc.*ts$"] */
	includes?:string[]
	/** 排除的文件 */
	excludes?:string[]
}

export interface IRegexMatch{
	/** 查找操作所在的根目錄 */
	rootDir: string
	/** 包含的文件 */
	includes: string[]
	/** 排除的文件 */
	excludes: string[]
}

export interface IFiles{
	/** 多個文件路徑、支持文件通配符 */
	paths?:string[]
	regex: IRegexMatch[]
	/**
	 * 若 regex == null 則regex不生效
	 * 若regex.includes == null 則regex.includes不生效、regex.excludes同理
	 * 若regex.includes中 有元素爲null或空字符串 則該元素不生效、regex.excludes同理
	 */
	/** @deprecated  */
	//regexObslt?: IRegexsObslt
	
}


/**
 * 由人類手寫的提問內容
 * 被處理成 @see IFinalReq 後 纔發送給AI
 */
export interface IRawReq extends IFromEtToYaml{
	files?: IFiles
	/** 用yaml多行文本塊規則 */
	text?: string
}