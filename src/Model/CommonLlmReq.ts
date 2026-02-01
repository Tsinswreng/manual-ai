import { IFromEtToYaml } from "./IFromEtToYaml";

export type ERole = 
|"system"
|"user"
|"assistant"
export interface IRoleEtContent extends IFromEtToYaml{
	role: ERole;
	/** 用yaml多行文本塊規則 */
	content: string;
}

export interface ICommonLlmReq extends IFromEtToYaml{
	model?: string;
	messages: IRoleEtContent[]
	//略
}

