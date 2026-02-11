```yaml
operations:
  - type: replaceByLine
    path: E:/Program.cs
    replace:
      - startLine: 2
        endLine: 4
        data:
          baseIndent: "\t\t\t\t\t" # 5 tabs for indent
          content: *__content1
```

# __content1
```cs
foreach(var item in list){
	handle(item);
}
```