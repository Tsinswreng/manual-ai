import { stringify, Scalar, Document, parse } from 'yaml'


function trySerial(){
	const doc = new Document()

	

	// 強制文本塊
	const s = new Scalar(
`const o = {
	text: 'Hello, world!',
}`)
	const s2 = new Scalar("")
	const s3 = new Scalar(`\n\n\n`)
	s.type = 'BLOCK_LITERAL'
	s2.type = 'BLOCK_LITERAL'
	s3.type = 'BLOCK_LITERAL'
	doc.set('text', s)
	doc.set('text2', s2)
	doc.set('text3', s3)
	doc.set('hello', 'Hello, world!')

	console.log(String(doc))
}


function tryParse(){
	const yaml = 
`a: 
b: ~
c: null
d: |
e: |-
g: ''
h: ""
`
	const doc = parse(yaml)
	console.log(doc)//{ a: null, b: null, c: null, d: '', e: '', g: '', h: '' }
}

function tryParse2(){
	const yaml = 
`a: 
b: ~
c: null
d: |

e: |-

g: ''
h: ""
`
	const doc = parse(yaml)
	console.log(doc)//{ a: null, b: null, c: null, d: '', e: '', g: '', h: '' }
}


function tryParse3(){
	const yaml = 
`a: 
b: ~
c: null
d: |
  
e: |-
  
g: ''
h: ""
`
	const doc = parse(yaml)
	console.log(doc)//{ a: null, b: null, c: null, d: '', e: '', g: '', h: '' }
}

function tryParse4(){
	const yaml = 
`a: 
b: ~
c: null
d: |
  1
e: |-
  2
g: ''
h: ""
`
	const doc = parse(yaml)
	console.log(doc)//{ a: null, b: null, c: null, d: '1\n', e: '2', g: '', h: '' }
}

function tryParse5(){
	const yaml = 
`
a: |

b: |
  
c: |
  1
  
a2: |+

b2: |+
  
c2: |+
  1
  
d: |+
  1
e: |+
f: aaa
`
	const doc = parse(yaml)
	console.log(doc)
}


//tryParse5()