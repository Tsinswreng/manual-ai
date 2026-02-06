#H[2026_0206_142405][
- GenReq等皆從剪貼板
- 命令更名 `ExeOpByClipBoard` -> `ExeOp`
- 改默認提示詞
	```
	Remove all comments from your final output, except for `#~xxx` in the end of each block
	```
	->
	```
	Remove all comments from your final output
	```
]

#H[2026_0205_215438][
- 新增命令及命令更名
- 除蠹芝帶行號ʹ文件ˋ有多餘製表符
```json
"commands": [
      {
        "command": "manual-ai.ExeOpByClipBoard",
        "title": "ManualAi-ExeOpByClipBoard"
      },
      {
        "command": "manual-ai.ExeOpByPath",
        "title": "ManualAi-ExeOpByPath"
      },
      {
        "command": "manual-ai.GenReq",
        "title": "ManualAi-GenReq"
      },
      {
        "command": "manual-ai.GenInitReq",
        "title": "ManualAi-GenInitReq"
      }
    ]
```
]

#H[2026_0202_220237][
	- 命令更名
	```json
		 "commands": [
			 {
				 "command": "manual-ai.ExeOp",
				 "title": "ManualAi-ExeOp"
			 },
			 {
				 "command": "manual-ai.GenReq",
				 "title": "ManualAi-GenReq"
			 }
		 ]
	```
	- 支持從 `ManualAi/Io/SysPrompt` 自定義系統提示詞
]


#H[2026_0201_213019][
	- UserInput->FinalReq->CommonLlmReq
	- ExeOp.yaml
	命令:
	```json
	"commands": [
				{
					"command": "manual-ai.ApplyChangesFromYaml",
					"title": "Apply changes from YAML file"
				},
				{
					"command": "manual-ai.ConvertRawReqToFinalReq",
					"title": "Convert RawReq to FinalReq"
				}
			]
	```
]


