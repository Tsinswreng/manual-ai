```yaml
operations:
  - type: replaceByLine
    path: E:/Program.cs
    replace:
      - startLine: 2
        endLine: 4
        data:
          baseIndent: ""
          content: *__content1
```

# __content1
```cs
__content1: &__content1 |+
					foreach(var item in list){
						handle(item);
					}
```
