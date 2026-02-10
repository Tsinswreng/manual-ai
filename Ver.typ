//git log -p origin/master..master > log

#H[2026_0210_103145][
- 0.0.7
- 原ʹ MkInitReq 命令 更名作 MkCommonLlmReq命令(不建議用)
- 製˪新ʹ MkInitReq 命令、 其實現爲 直ᵈ把系統提示詞拼到 MkReq 前、㕥減縮進數
- 同步最新默認系統提示詞、減行數與縮進、強調yaml多行文本塊與縮進
]

#H[2026_0208_154823][
- 0.0.6
- 跳過rootDir爲空字串者
]

#H[2026_0208_132344][
- v0.0.5
改RawReq結構、除蠹芝regex理則ʹ謬
```yaml
files:
  paths:
    - ""
  regex:
    - rootDir: ""
      includes:
        - ""
      excludes:
        - ""
text: |+
  

```
]

#H[2026_0208_090123][
- v0.0.4
````md
- 英文日誌輸出
## 一、程式架構優化
1. 拆分命令實現邏輯：將原本集中在`extension.ts`中的所有命令（ExeOp、ExeOpByPath、GenInitReq/GenReq）邏輯，拆分至`src/CmdImpl/`目錄下的獨立檔案，每個命令對應單一實現檔案


## 二、命令體系規範化
1. 命名規則調整：統一命令命名風格，將原「Gen」前綴替換為「Mk」（如`GenReq`→`MkReq`、`GenInitReq`→`MkInitReq`），對應函式名、命令註冊名同步調整。
2. 新增命令功能：新增`MkReqTemplate`命令，透過`RawReq.mkTemplateStr()`生成請求模板並複製至剪貼簿，輔助使用者快速建立請求配置。
3. 檔案與配置同步更新：
   - 調整`CmdImpl/`目錄下檔案名稱（`GenInitReq.ts`→`MkInitReq.ts`、`GenReq.ts`→`MkReq.ts`）；

## 三、RawReq 與路徑處理優化
1. 模板生成功能：為`RawReq`類新增靜態方法`mkTemplate()`與`mkTemplateStr()`，支援生成帶預設結構的請求模板，並調整模板預設值（如paths預設為`[""]`、text預設為換行符）。
2. 路徑匹配優化：在`RawReqToFinalReq`轉換流程中，先將路徑正規化（UnixPathNormalizer）再執行glob通配符匹配，避免跨系統路徑格式問題。(原先反斜槓接通配符則不起效)
3. Regex 過濾增強：
   - 優化`filterByRegex`方法，過濾`includes`/`excludes`中的`null`、空字串元素，避免無效正則匹配；
   - 補充`IFiles.regex`介面註釋，明確`regex`、`includes`、`excludes`為`null`或空值時的處理規則。

## 四、YAML 處理邏輯修復與擴充
1. 多餘空行修復：修正`ChangeApplyer.ts`與`IYamlBlock.ts`中因字串分割後末尾換行符導致的多餘空行問題，調整陣列長度判斷條件（從`>1`改為`>0`），並主動移除分割後的最後一個空元素。
2. YAML 錨點測試：新增`Try.ts`中的YAML錨點（anchor）使用範例，並優化`test.yaml`配置，將重複的替換內容抽離為頂層錨點（如`&buttonClickLogic`），實現配置內容的全域引用。

````
]

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


