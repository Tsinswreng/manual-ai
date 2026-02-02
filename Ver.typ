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


