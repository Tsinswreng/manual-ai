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

