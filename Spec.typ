#let H(t,d)=[]



#H[範式][
	使用interface+class的OOP範式

	其中class的構造器的實現 第一行必須有
	```ts
	if(arguments.length===0){return} 
	```

	對于類中未初始化的字段、用這種寫法
	
	例
	```ts
	class A{
		s:string = (void 0)!
	}
	```
	
	如果你不寫`= (void 0)!`他就會報錯
	
	要麼你就初始化
	

]

#H[異步函數][
	命名規範:
	- 不受 CT 作末個參數的: 名稱帶Asy後綴
	- 受 CT 作末個參數的: 名稱不帶後綴
	CT在 `src/CT.ts`。使用CT時必須寫`CT`、禁止寫`CancellationToken`

	例:
	```ts
	function readFile(path: string, ct?:CT): Promise<string>;//推薦。即使你不用ct也建議這樣寫
	function readFileAsy(path: string): Promise<string>;
	```
	
	建議儘量都帶CT作末個參數
]


#H[空值相關][
	一般空值 都用 `undefined`類型 而不是 `null`類型
	- 用`void 0` 代替 `undefined` 字面量
	- 判空旹應用 `==` 而非 `===`
	
	如
	```ts
	if(a == void 0){
		//...
	}

	if(b != void 0){
		//...
	}
	if(c?.d?.e != void 0){
		//...
	}
	```
]