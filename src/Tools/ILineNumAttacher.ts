export interface ILineNumAttacher {
	attachLineNum(line: string, lineNum: number, totLine: number): string;
}

export class LineNumAttacher implements ILineNumAttacher {
	static inst = new this();
	/**
	 * 格式化行号并附加到单行
	 * 1. 按总行数自动计算行号补零位数（总行数N位则行号占N位）
	 * 2. 行号后拼接 YAML 规范的 | + 制表符
	 * 3. 保证整个文件行号字符数完全一致
	 */
	attachLineNum(line: string, lineNum: number, totLine: number): string {
		// 获取总行号的字符长度，作为所有行号的固定长度
		const lineNumLength = totLine.toString().length;
		// 行号补前导零，保证长度一致（如总99行，行1则为01，行10则为10）
		const formattedLineNum = lineNum.toString().padStart(lineNumLength, '0');
		// 按YAML规则拼接：格式化行号 + | + 制表符 + 原始行文本
		return `${formattedLineNum}|	${line}`;
	}
}
