import { IFromEtToYaml } from "../IFromEtToYaml";
import { IFinalReq, IFileCtx } from "../FinalReq";
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

// 文件上下文实现
export class FileCtx extends BaseYaml implements IFileCtx {
	path: string = (void 0)!;
	issues: string[] = [];
	contentWithLineNum: string = (void 0)!;

	constructor(path?: string, issues?: string[], contentWithLineNum?: string) {
		super();
		if (arguments.length === 0) { return; }
		if (path !== undefined) this.path = path;
		if (issues !== undefined) this.issues = issues;
		if (contentWithLineNum !== undefined) this.contentWithLineNum = contentWithLineNum;
	}

	toYaml(o?: any): string {
		const target = o || this;
		const doc = new Document();
		doc.set('path', target.path);

		// 强制 issues 字段使用多行文本块语法
		const issues = target.issues.map((issue: string) => {
			const scalar = new Scalar(issue);
			scalar.type = 'BLOCK_LITERAL';
			return scalar;
		});
		doc.set('issues', issues);

		// 强制 contentWithLineNum 字段使用多行文本块语法
		const contentScalar = new Scalar(target.contentWithLineNum);
		contentScalar.type = 'BLOCK_LITERAL';
		doc.set('contentWithLineNum', contentScalar);

		return String(doc);
	}
}

// 最终请求实现
export class FinalReq extends BaseYaml implements IFinalReq {
	unixMs: number = (void 0)!;
	files: IFileCtx[] = [];
	text: string = (void 0)!;

	constructor(unixMs?: number, files?: IFileCtx[], text?: string) {
		super();
		if (arguments.length === 0) { return; }
		if (unixMs !== undefined) this.unixMs = unixMs;
		if (files !== undefined) this.files = files;
		if (text !== undefined) this.text = text;
	}

	toYaml(o?: any): string {
		const target = o || this;
		const doc = new Document();
		doc.set('unixMs', target.unixMs);
		doc.set('files', target.files);

		// 强制 text 字段使用多行文本块语法
		const textScalar = new Scalar(target.text);
		textScalar.type = 'BLOCK_LITERAL';
		doc.set('text', textScalar);

		return String(doc);
	}
}
