```yaml
name: Tsins
foo: *__content1
bar: *__content2
```

# __content1
```ts
console.log(
	"Hello, world!"
);
```

# __content2
```cs
foreach(var i in list){
    Console.WriteLine(i);
}
```


```yaml
__content1: |+
  console.log(
  	"Hello, world!"
  );
__content2: |+
  foreach(var i in list){
      Console.WriteLine(i);
  }

name: Tsins
foo: *__content1
bar: *__content2
```
