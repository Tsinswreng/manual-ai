import type { ITypedSymbol } from "./ITypedSymbol"

export interface IDi{
	getRequiredSvc<T>(sym: ITypedSymbol<T>): T
	getSvc<T>(sym: ITypedSymbol<T>): T|undefined
}