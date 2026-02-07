import { stringify, Scalar, Document, parse } from 'yaml'
import * as fs from 'fs'
import { LineNumAttacher } from './Tools/ILineNumAttacher'
import { inspect } from 'util'

tryParse6()

/* 
arr:
  - |-
    a
  - |- 
    b
  - |- 
    c
*/
function trySerial3(){
	const doc = new Document()
	const arr = ["a", "b", "c"]

}

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
	console.log(JSON.stringify(s))
	console.log(String(doc))
}

function trySerial2(){
	const doc = new Document()
	// 強制文本塊
	const s = new Scalar(
`const o = {
	text: 'Hello, world!',
}`)
	s.type = 'BLOCK_LITERAL'	
	doc.set('text', s)
	
	const s2 = new Scalar("111\r\n222\r\n")
	s2.type = 'BLOCK_LITERAL'
	doc.set('text2', s2)
	
	const s3 = new Scalar("111\n222\n")
	s3.type = 'BLOCK_LITERAL'
	doc.set('text3', s3)

	let fileS = fs.readFileSync("E:/_code/ManualAi/manual-ai/Spec.typ", {encoding: "utf-8"})
	fileS = fileS.replaceAll("\r\n", "\n")
	const lines = fileS.split('\n')
	fileS = lines.map((line, i)=>{
		return LineNumAttacher.inst.attachLineNum(line, i, lines.length)
	}).join('\n')
	let file = new Scalar(fileS)
	file.type = "BLOCK_LITERAL"
	doc.set("file", file)
	
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


function tryParse6(){
	const yaml = 
`
content1: &content1 |+
  const handleClick = () => {
      console.log("clicked");
      setState(prev => !prev);
  };

content2: &content2 |+
  import { useState } from 'react';

  # Array of operation objects (can be empty). Include only the operations you need.
operations:
  # Line-based replacement (for initial edits)
  - type: replaceByLine
    # if path does not exist, it will be created. if you want to create new file, just set path to the new file name and set both startLine and endLine to 1.
    path: e:/code/src/components/Button.tsx
    replace:
      - startLine: 15       # starts from 1, included, can be larger than file length
        endLine: 23         # included, can be larger than file length
        data:
          baseIndent: "    " # base indent for the content, which means each line will have another "    " at the beginning
          # content can be null, which means to delete from startLine to endLine
          content: *content1
          #~content
        #~data
      #~-
      - startLine: 45
        endLine: 45
        data: 
          baseIndent: "" # this means no baseIndent
          content: *content2
          #~content
        #~data
      #~-
    #~replace

`
	const doc = parse(yaml)
	console.log(inspect(doc, true, 20, true))
}


