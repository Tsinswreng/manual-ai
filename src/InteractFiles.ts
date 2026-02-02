import Path from "path";
import { BaseInteractDir } from "./BaseDir";
export interface IInteractFiles {
	get SysPrompt():string
	get UserInput():string;
	get FinalReq():string;
	get CommonLlmReq():string;
	get LlmResp():string;
	get ExeOp():string
	get Diff_Changes():string
	get Diff_Files():string
}

export interface I_getInteractFiles{
	getInteractFiles():IInteractFiles
}

export class InteractFilesGetter implements I_getInteractFiles{
	static inst = new InteractFilesGetter()
	_interactFiles:IInteractFiles = (void 0)!
	constructor(){
		const z = this
		z.init()
	}
	init(base:string=BaseInteractDir.inst.baseInteractDir){
		const z = this
		z._interactFiles = mkIInteractFiles(base);
	}
	getInteractFiles():IInteractFiles{
		const z = this
		if(z._interactFiles == void 0){
			throw new Error("InteractFilesGetter not initialized")
		}
		return z._interactFiles;
	}
}

export function mkIInteractFiles(base: string):IInteractFiles{
	const j = (path: string)=>{
		return Path.join(base, path);
	}
	const r:IInteractFiles = {
		SysPrompt: j("Io/SysPrompt"),
		UserInput: j("Io/UserInput.yaml"),
		FinalReq: j("Io/FinalReq.yaml"),
		CommonLlmReq: j("Io/CommonLlmReq.yaml"),
		LlmResp: j("Io/LlmResp.yaml"),
		/** 直接執行、不存入diff */
		ExeOp: j("Io/ExeOp.yaml"),
		Diff_Changes: j("Diff/Changes.yaml"),
		Diff_Files: j("Diff/Files/"),
	}
	return r;
}


