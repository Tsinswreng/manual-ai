import { IFromEtToYaml } from "../IFromEtToYaml";
import { ICommonLlmReq, ERole, IRoleEtContent } from "../CommonLlmReq";
import { BaseYaml } from "./AiResp";
import { yamlMultiLine, yamlDocToStr } from "./yamlMultiLine";
import { Document } from 'yaml';

// RoleEtContent 实现
export class RoleEtContentImpl extends BaseYaml implements IRoleEtContent {
	role: ERole = (void 0)!;
	content: string = (void 0)!;

	constructor(role?: ERole, content?: string) {
		super();
		if (arguments.length === 0) { return; }
		if (role !== undefined) this.role = role;
		if (content !== undefined) this.content = content;
	}

	toYaml(o?: any): string {
		const target = o || this;
		const doc = new Document();
		doc.set('role', target.role);
		
		// 强制 content 字段使用多行文本块语法
		if (target.content) {
			doc.set('content', yamlMultiLine(target.content));
		}

		return yamlDocToStr(doc);
	}

}

// CommonLlmReq 实现
export class CommonLlmReq extends BaseYaml implements ICommonLlmReq {
	model?: string;
	messages: IRoleEtContent[] = [];

	constructor(model?: string, messages?: IRoleEtContent[]) {
		super();
		if (arguments.length === 0) { return; }
		if (model !== undefined) this.model = model;
		if (messages !== undefined) this.messages = messages;
	}

	toYaml(o=this): string {
		const doc = new Document();
		doc.set('model', o.model)
		doc.set('messages', o.messages.map(x=>{
			const doc = new Document();
			doc.set('role', x.role)
			doc.set('content', yamlMultiLine(x.content))
			return doc
		}))
		return yamlDocToStr(doc);
	}

}
