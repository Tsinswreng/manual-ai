import { IFromEtToYaml } from "../IFromEtToYaml";
import { IChanges, IChangedFileMap } from "../Diff";
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

// 变更文件映射实现
export class ChangedFileMap extends BaseYaml implements IChangedFileMap {
	unixMs: number = (void 0)!;
	newFile: string = (void 0)!;
	oldFile: string = (void 0)!;

	constructor(unixMs?: number, newFile?: string, oldFile?: string) {
		super();
		if (arguments.length === 0) { return; }
		if (unixMs !== undefined) this.unixMs = unixMs;
		if (newFile !== undefined) this.newFile = newFile;
		if (oldFile !== undefined) this.oldFile = oldFile;
	}
}

// 变更集合实现
export class Changes extends BaseYaml implements IChanges {
	changes: IChangedFileMap[] = [];

	constructor(changes?: IChangedFileMap[]) {
		super();
		if (arguments.length === 0) { return; }
		if (changes !== undefined) this.changes = changes;
	}
}