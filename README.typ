#import "TypstTools/AutoHeading.typ": H
// 定義用戶指定的 I 函數
#let I(..args) = [
	#args.at(0)
	#if args.pos().len() > 1 {
		args.at(1)
	}
]

#H[Manual-AI VSCode 擴展][
	#H[擴展概述][
		Manual-AI 是一款 VSCode 擴展，核心用於處理 AI 交互相關的請求與操作執行，包括：
		#enum(
			I[生成 AI 請求模板][快速生成 RawReq 格式的請求模板並複製到剪貼板],
			I[轉換原始請求][將剪貼板中的 RawReq 轉換爲 FinalReq/CommonLlmReq 並寫入文件/剪貼板],
			I[執行 AI 操作][從指定文件或剪貼板讀取 AI 操作指令，應用到本地文件],
		)
	]

	#H[核心命令][
		擴展註冊了以下核心命令，所有命令前綴均爲 `ManualAi-`：
		#enum(
			I[ExeOpByPath][按路徑讀取 AI 操作文件（ExeOp.yaml），執行文件中的寫操作（替換行/替換文本片段）；若未指定路徑則使用默認路徑],
			I[ExeOp][從剪貼板讀取 AI 操作的 YAML 內容，執行其中的寫操作],
			I[MkInitReq][從剪貼板讀取 RawReq 內容，轉換爲 FinalReq 和 CommonLlmReq，寫入對應文件並將 CommonLlmReq 複製到剪貼板],
			I[MkReq][從剪貼板讀取 RawReq 內容，轉換爲 FinalReq，寫入對應文件並將 FinalReq 複製到剪貼板],
			I[MkReqTemplate][生成 RawReq 模板字符串，複製到剪貼板],
		)
	]

	#H[使用方法][
		#enum(
			I[生成 RawReq 模板][
				#enum(
					I[執行命令][在 VSCode 中執行 `manual-ai.MkReqTemplate` 命令],
					I[結果][RawReq 模板會自動複製到剪貼板，可直接粘貼編輯],
				)
			],
			I[轉換 RawReq 爲最終請求][
				#enum(
					I[準備 RawReq][將編輯好的 RawReq YAML 內容複製到剪貼板],
					I[執行轉換命令][
						#enum(
							I[僅生成 FinalReq][執行 `manual-ai.MkReq` 命令],
							I[生成 FinalReq + CommonLlmReq][執行 `manual-ai.MkInitReq` 命令],
						)
					],
					I[結果][轉換後的內容會寫入對應文件，且指定內容（FinalReq/CommonLlmReq）會複製到剪貼板],
				)
			],
			I[執行 AI 操作][
				#enum(
					I[從文件執行][
						#enum(
							I[執行命令][執行 `manual-ai.ExeOpByPath` 命令],
							I[輸入路徑][可輸入 ExeOp.yaml 路徑，或直接回車使用默認路徑],
							I[執行結果][擴展會讀取文件中的 AI 操作，應用到本地文件並提示操作數量],
						)
					],
					I[從剪貼板執行][
						#enum(
							I[準備內容][將 AI 操作的 YAML 內容複製到剪貼板],
							I[執行命令][執行 `manual-ai.ExeOp` 命令],
							I[執行結果][擴展會解析剪貼板內容，執行寫操作並提示操作數量],
						)
					],
				)
			],
		)
	]

	#H[核心數據模型][
		#enum(
			I[RawReq][用戶手動編寫的原始請求，包含文件匹配規則和提問文本，是所有請求的起點],
			I[FinalReq][最終發送給 AI 的請求，包含帶行號的文件內容、提問文本和時間戳],
			I[CommonLlmReq][標準化的 LLM 請求格式，包含模型名稱、角色（system/user/assistant）和消息內容],
			I[AiResp][AI 返回的響應格式，包含時間戳、操作列表（替換行/替換文本片段等）和說明文本],
			I[YamlBlock][帶基礎縮進的 YAML 多行文本塊，用於處理帶縮進的文本內容（如文件代碼、提問文本）],
		)
	]

	#H[錯誤處理][
		擴展對關鍵操作添加了完整的錯誤處理：
		#enum(
			I[空剪貼板檢測][讀取剪貼板內容前會檢查是否爲空，爲空則提示錯誤並終止操作],
			I[文件操作異常][讀取/寫入文件失敗時，會捕獲異常並顯示具體錯誤信息],
			I[YAML 解析異常][解析 YAML 內容失敗時，提示具體的錯誤原因],
		)
	]
]
