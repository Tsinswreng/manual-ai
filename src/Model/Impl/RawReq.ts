import { IFromEtToYaml } from "../IFromEtToYaml";
import { IRawReq, IFiles, IRegexs } from "../RawReq";
import { parse, Document } from 'yaml';

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

// 正则表达式配置实现
export class Regexs extends BaseYaml implements IRegexs {
	includes: string[] = [];
	excludes: string[] = [];

	constructor(includes?: string[], excludes?: string[]) {
		super();
		if (arguments.length === 0) { return; }
		if (includes !== undefined) this.includes = includes;
		if (excludes !== undefined) this.excludes = excludes;
	}
}

// 文件配置实现
export class Files extends BaseYaml implements IFiles {
	paths: string[] = [];
	regex: IRegexs = new Regexs();

	constructor(paths?: string[], regex?: IRegexs) {
		super();
		if (arguments.length === 0) { return; }
		if (paths !== undefined) this.paths = paths;
		if (regex !== undefined) this.regex = regex;
	}
}

// 原始请求实现
export class RawReq extends BaseYaml implements IRawReq {
	files: IFiles = new Files();
	text: string = (void 0)!;

	constructor(files?: IFiles, text?: string) {
		super();
		if (arguments.length === 0) { return; }
		if (files !== undefined) this.files = files;
		if (text !== undefined) this.text = text;
	}
}


