import type { IYamlSerial } from "../Tools/IYamlSerial";

export type ERole = 
|"system"
|"user"
|"assistant"
export interface RoleEtContent extends IYamlSerial{
	role: ERole;
	/** 用yaml多行文本塊規則 */
	content: string;
}

export interface ICommonLlmReq extends IYamlSerial{
	model?: string;
	messages: string[]
	//略
}

