import { IFromEtToYaml } from "../IFromEtToYaml";
import { IRawReq, IFiles, IRegexsObslt, IRegexMatch } from "../RawReq";
import { parse, Document } from 'yaml';
import { yamlDocToStr } from "./yamlMultiLine";
import { yamlMdToYaml } from "../../YamlMd/yamlMdToYaml";
import { CT } from "../../CT";
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


// 正则匹配配置实现
export class RegexMatch extends BaseYaml implements IRegexMatch {
	rootDir: string = "";
	includes: string[] = [];
	excludes: string[] = [];

	constructor(rootDir?: string, includes?: string[], excludes?: string[]) {
		super();
		if (arguments.length === 0) { return; }
		if (rootDir !== undefined) this.rootDir = rootDir;
		if (includes !== undefined) this.includes = includes;
		if (excludes !== undefined) this.excludes = excludes;
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
	static mkTemplateYaml() {
		const r = new this();
		r.files.paths = [""];
		r.files.regex = [new RegexMatch("", [""], [""])];

		r.text = "\n"
		return r
	}
	static mkTemplateYamlStr() {
		return this.mkTemplateYaml().toYaml()
	}
	
	static mkTemplateYamlMd():string{
		const z = this
		const yamlStrTemplate = z.mkTemplateYamlStr()
		//text: |+ 替换成 text: *__text
		const replacedByAnchor:string = yamlStrTemplate.replace(/text:\s*\|\s*\+/, 'text: *__text'); // 将 text: |+ 替换成 text: *__text
		const graves3 = "```"
		return graves3
		+"yaml\n"
		+ replacedByAnchor
		+ graves3+"\n"
		+ 
`# __text
${graves3}

${graves3}
`
	}
	
	async fromYamlMd(yamlMd:string, ct?:CT){
		const z = this
		const yaml = await yamlMdToYaml(yamlMd, ct)
		return z.fromYaml(yaml)
	}
}


