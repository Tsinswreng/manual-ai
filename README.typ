#import "TypstTools/AutoHeading.typ": H
In User home Dir:
```
.ManualAi/
	Io/
		UserInput.yaml
		FinalReq.yaml
		LlmResp.yaml
		CommonLlmReq.yaml
		SysPrompt
```

UserInput.yaml:
```yaml
files:
  paths:
    - E:\_code\ManualAi\manual-ai\TestWorkSpace\sss.cs
  regex:
    includes:
      - Svc.*cs$
    excludes:
      - bin/.*
      - obj/.*
text: |
  Help me correct the compilation errors in the given code
```


vscode commands:
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