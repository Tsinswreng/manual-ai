

export class LineNormalizer {
	static inst = new this()
	normalize(line: string): string {
		//把換行符統一換成\n
		return line.replace(/\r\n|\r/g, '\n');
	}
}