import { IFromEtToYaml } from "../IFromEtToYaml";
import { IRawReq, IFiles, IRegexsObslt, IRegexMatch } from "../RawReq";
import { parse, Document } from 'yaml';
import { yamlDocToStr } from "./yamlMultiLine";
// 基础实现类，提供通用的 toYaml 和 fromYaml 方法
abstract class BaseYaml implements IFromEtToYaml {
	toYaml(o?: any): string {
		const target = o || this;
		const doc = new Document(target);
return yamlDocToStr(doc);
	}

	fromYaml(yaml: string, o?: any): void {
		const parsed = parse(yaml);
		const target = o || this;
		Object.assign(target, parsed);
	}
}


// 文件配置实现
export class Files extends BaseYaml implements IFiles {
	paths: string[] = [];
	regex: IRegexMatch[] = [];

	constructor(paths?: string[], regex?: IRegexMatch[]) {
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
	static mkTemplate(){
		const r = new this();
	r.files.paths = [""];
	r.files.regex = [{
		rootDir: "",
		includes: [""],
		excludes: [""]
	}];
		r.text = "\n"
		return r
	}
	static mkTemplateStr(){
		return this.mkTemplate().toYaml()
	}
}


