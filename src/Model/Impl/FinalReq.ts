import { IFromEtToYaml } from "../IFromEtToYaml";
import { IYamlBlock } from "../IYamlBlock";
import { IFinalReq, IFileCtx } from "../FinalReq";
import { parse, Document } from 'yaml';
import { yamlDocToStr, yamlMultiLine } from "./yamlMultiLine";


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

// 文件上下文实现
export class FileCtx extends BaseYaml implements IFileCtx {
	path: string = (void 0)!;
	issues: string[] = [];
	contentWithLineNum?: IYamlBlock;

	constructor(path?: string, issues?: string[], contentWithLineNum?: IYamlBlock) {
		super();
		if (arguments.length === 0) { return; }
		if (path !== undefined) this.path = path;
		if (issues !== undefined) this.issues = issues;
		if (contentWithLineNum !== undefined) this.contentWithLineNum = contentWithLineNum;
	}
	toYaml(o?: any): string {
		const target = (o ?? this) as IFileCtx;
		const doc = new Document();
		doc.set('path', target.path);

		// 强制 issues 字段使用多行文本块语法
		const issues = target.issues?.map((issue) => yamlMultiLine(issue));
		doc.set('issues', issues);

		// 仅对 content 字段用多行文本块语法，保留原对象结构
		if (target.contentWithLineNum?.content) {
			doc.set('contentWithLineNum', {
				...target.contentWithLineNum,
				content: yamlMultiLine(target.contentWithLineNum.content)
			});
		}

		return yamlDocToStr(doc);
	}
}

// 最终请求实现
export class FinalReq extends BaseYaml implements IFinalReq {
	unixMs: number = (void 0)!;
	files: IFileCtx[] = [];
	text?: IYamlBlock;

	constructor(unixMs?: number, files?: IFileCtx[], text?: IYamlBlock) {
		super();
		if (arguments.length === 0) { return; }
		if (unixMs !== undefined) this.unixMs = unixMs;
		if (files !== undefined) this.files = files;
		if (text !== undefined) this.text = text;
	}

	toYaml(o?: any): string {
		const target = o ?? this;
		const doc = new Document();
		doc.set('unixMs', target.unixMs);
		doc.set('files', target.files);

		// 仅对 text.content 字段用多行文本块语法，保留原对象结构
		if (target.text?.content) {
			doc.set('text', {
				...target.text,
				content: yamlMultiLine(target.text.content)
			});
		}
		return yamlDocToStr(doc);
	}
}
