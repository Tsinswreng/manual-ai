import { IFromEtToYaml } from "../IFromEtToYaml";
import {
	IAiResp,
	IOperation,
	IOpReplaceByLine,
	IOpReplaceBySnippet,
	IOpSeekDef,
	IOpReadFiles,
	IOpExplain,
	ILineRangeReplace,
	ISnippetReplace,
	ILineEtSymbol,
	EOperateType
} from "../AiResp";
import { parse, Document, Scalar } from 'yaml';

// 基础实现类，提供通用的 toYaml 和 fromYaml 方法
abstract class BaseYaml implements IFromEtToYaml {
	toYaml(o?: any): string {
		const target = o || this;
		const doc = new Document(target);
		return String(doc);
	}

	fromYaml(yaml: string, o?: any): void {
		const parsed = parse(yaml);
		const target = o || this;
		Object.assign(target, parsed);
	}
}

// 行范围替换实现
export class LineRangeReplace extends BaseYaml implements ILineRangeReplace {
	startLine: number = (void 0)!;
	endLine: number = (void 0)!;
	data: string = (void 0)!;

	constructor(startLine?: number, endLine?: number, data?: string) {
		super();
		if (arguments.length === 0) { return; }
		if (startLine !== undefined) this.startLine = startLine;
		if (endLine !== undefined) this.endLine = endLine;
		if (data !== undefined) this.data = data;
	}

	toYaml(o?: any): string {
		const target = o || this;
		const doc = new Document();
		doc.set('startLine', target.startLine);
		doc.set('endLine', target.endLine);

		// 强制 data 字段使用多行文本块语法
		const dataScalar = new Scalar(target.data);
		dataScalar.type = 'BLOCK_LITERAL';
		doc.set('data', dataScalar);

		return String(doc);
	}
}

// 片段替换实现
export class SnippetReplace extends BaseYaml implements ISnippetReplace {
	match: string = (void 0)!;
	replacement: string = (void 0)!;

	constructor(match?: string, replacement?: string) {
		super();
		if (arguments.length === 0) { return; }
		if (match !== undefined) this.match = match;
		if (replacement !== undefined) this.replacement = replacement;
	}

	toYaml(o?: any): string {
		const target = o || this;
		const doc = new Document();

		// 强制 match 字段使用多行文本块语法
		const matchScalar = new Scalar(target.match);
		matchScalar.type = 'BLOCK_LITERAL';
		doc.set('match', matchScalar);

		// 强制 replacement 字段使用多行文本块语法
		const replacementScalar = new Scalar(target.replacement);
		replacementScalar.type = 'BLOCK_LITERAL';
		doc.set('replacement', replacementScalar);

		return String(doc);
	}
}

// 行号和符号实现
export class LineEtSymbol extends BaseYaml implements ILineEtSymbol {
	line: number = (void 0)!;
	symbol: string = (void 0)!;

	constructor(line?: number, symbol?: string) {
		super();
		if (arguments.length === 0) { return; }
		if (line !== undefined) this.line = line;
		if (symbol !== undefined) this.symbol = symbol;
	}
}

// 基础操作实现
export class Operation extends BaseYaml implements IOperation {
	type: EOperateType = (void 0)!;
	path: string = (void 0)!;

	constructor(type?: EOperateType, path?: string) {
		super();
		if (arguments.length === 0) { return; }
		if (type !== undefined) this.type = type;
		if (path !== undefined) this.path = path;
	}
}

// 按行替换操作实现
export class OpReplaceByLine extends Operation implements IOpReplaceByLine {
	replace: ILineRangeReplace[] = [];

	constructor(type?: EOperateType, path?: string, replace?: ILineRangeReplace[]) {
		super(type, path);
		if (arguments.length === 0) { return; }
		if (replace !== undefined) this.replace = replace;
	}
}

// 按片段替换操作实现
export class OpReplaceBySnippet extends Operation implements IOpReplaceBySnippet {
	replace: ISnippetReplace[] = [];

	constructor(type?: EOperateType, path?: string, replace?: ISnippetReplace[]) {
		super(type, path);
		if (arguments.length === 0) { return; }
		if (replace !== undefined) this.replace = replace;
	}
}

// 查找符号操作实现
export class OpSeekDef extends Operation implements IOpSeekDef {
	symbols: ILineEtSymbol[] = [];

	constructor(type?: EOperateType, path?: string, symbols?: ILineEtSymbol[]) {
		super(type, path);
		if (arguments.length === 0) { return; }
		if (symbols !== undefined) this.symbols = symbols;
	}
}

// 读取文件操作实现
export class OpReadFiles extends Operation implements IOpReadFiles {
	paths: string[] = [];

	constructor(type?: EOperateType, paths?: string[]) {
		super(type);
		if (arguments.length === 0) { return; }
		if (paths !== undefined) this.paths = paths;
	}
}

// 解释操作实现
export class OpExplain extends Operation implements IOpExplain {
	constructor(type?: EOperateType, path?: string) {
		super(type, path);
		if (arguments.length === 0) { return; }
	}
}

// AI响应实现
export class AiResp extends BaseYaml implements IAiResp {
	reqUnixMs?: number;
	operations: IOperation[] = [];
	text: string = (void 0)!;

	constructor(reqUnixMs?: number, operations?: IOperation[], text?: string) {
		super();
		if (arguments.length === 0) { return; }
		if (reqUnixMs !== undefined) this.reqUnixMs = reqUnixMs;
		if (operations !== undefined) this.operations = operations;
		if (text !== undefined) this.text = text;
	}

	toYaml(o?: any): string {
		const target = o || this;
		const doc = new Document();
		if (target.reqUnixMs !== undefined) {
			doc.set('reqUnixMs', target.reqUnixMs);
		}
		doc.set('operations', target.operations);

		// 强制 text 字段使用多行文本块语法
		const textScalar = new Scalar(target.text);
		textScalar.type = 'BLOCK_LITERAL';
		doc.set('text', textScalar);

		return String(doc);
	}
}
