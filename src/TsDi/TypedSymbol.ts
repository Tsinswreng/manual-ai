import type { ITypedSymbol } from "./ITypedSymbol"

export class TypedSymbol<T> implements ITypedSymbol<T>{
	constructor(public symbol: symbol){}
	protected static _mkFromSym<T>(symbol: symbol): ITypedSymbol<T>{
		return new TypedSymbol(symbol)
	}
	protected static _mkFromStr<T>(str: string){
		return TypedSymbol._mkFromSym<T>(Symbol.for(str))
	}
	static mk<T>(sym: symbol | string){
		if(typeof sym ==='string'){
			return TypedSymbol._mkFromStr<T>(sym)
		}
		return TypedSymbol._mkFromSym<T>(sym)
	}
}