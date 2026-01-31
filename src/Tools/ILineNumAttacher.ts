export interface ILineNumAttacher {
	attachLineNum(line: string, lineNum: number): string;
}

export class LineNumAttacher implements ILineNumAttacher {
	static inst = new this();
	attachLineNum(line: string, lineNum: number): string {
		return lineNum+"|" + line;
	}
}
