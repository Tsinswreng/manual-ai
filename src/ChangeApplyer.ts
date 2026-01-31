import { IOpWriteFile } from "./Model/AiResp";

export interface IChangeApplyer {
	
	applyChange(change: IOpWriteFile):any
}

