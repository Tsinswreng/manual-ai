import { Document, Scalar } from "yaml";

/**
 * 對非空字符串設textScalar.type = 'BLOCK_LITERAL'
 */
export function yamlMultiLine(s: string | undefined) {
	const textScalar = new Scalar(s);
	if (typeof (s) === 'string' && s.length > 0) {
		textScalar.type = 'BLOCK_LITERAL';
		textScalar.comment = null
	}
	return textScalar
}


export function yamlDocToStr(doc: Document) {
	return doc.toString({
		lineWidth: Infinity,
		minContentWidth: 0,
	})
}