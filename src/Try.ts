import { stringify, Scalar, Document } from 'yaml'

{
	const doc = new Document()

	

	// 強制文本塊
	const s = new Scalar(
`const o = {
	text: 'Hello, world!',
}`)
	s.type = 'BLOCK_LITERAL'
	doc.set('text2', s)
	doc.set('text', 'Hello, world!')

	console.log(String(doc))
}
