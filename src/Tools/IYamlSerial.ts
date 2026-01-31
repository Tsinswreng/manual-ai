







export const SymIYamlSerial = TypedSymbol.mk<IYamlSerial>('IYamlSerial')
export interface IYamlSerial {
	stringify(o:any):any
	parse<T=any>(o:T):T
}

