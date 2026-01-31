export interface IFromEtToYaml {
	/**
	 * o 爲 undefined時 即把this作o
	 */
	toYaml(o?:any): string;
	/**
	 * 原地修改o。當o為undefined時，即把this作為o
	 * 
	 */
	fromYaml(yaml:string, o?:any):void;
	
}