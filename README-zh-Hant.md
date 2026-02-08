Manual-AI 是一款 VSCode 擴展。通過結構化yaml數據交互, 用戶能利用網頁上的AI大模型, 使大模型與編輯器結合㕥執行修改代碼等操作, 達到近似AI Agent的編程體驗。

## 擴展概述

現有 VSCode 集成 AI 編程方案（使用插件自帶模型、自行配置第三方 API 金鑰）多需付費；而網頁版 AI 多提供免費交互，但缺乏與 VSCode 編輯器的結構化交互能力。該插件彌補這一缺口，讓用戶無需付費即可借助免費網頁 AI 實現近似 AI Agent 的編程體驗。

## 安裝擴展

### 從vsix安裝

按`Ctrl+Shift+P`:![](assets\2026-02-08-14-54-27.png)然後選擇vsix路徑

可從github release區尋找有無打包好的vsix

## 快速上手

1. 安裝擴展
2. 生成用戶輸入模板
   1. 按`Ctrl+N`、創建一個臨時文件
   2. 按`Ctrl+Shift+P`, 輸入`ManualAi-MkReqTemplate`, 回車執行命令, 這會生成用戶輸入yaml的模板並寫入剪貼板, 然後`Ctrl+V`粘貼到當前臨時文件中
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
      text: |+ #
      ```
3. 編輯模板 例
   ```yaml
   files:
     paths: #所有路徑都須爲絕對路徑。您可使用Vscode快捷鍵 Shift+Alt+C 複製絕對路徑。
       - C:/MyProj/src/xxx.ts # 單個文件
       - c:\MyProj\src\xxx.ts # 支持小寫盤符與反斜槓路徑分隔符
       - C:/MyProj/src/services/* #支持通配符
     regex: # 正則表達式匹配文件上下文
       - rootDir: - C:/MyProj/src/ #指定正則表達式搜索的根目錄
         includes: # 包含
           - .*\.ts$
         excludes: # 排除
           - .*\.js$
   text: |+ # 用自然語言描述的提示詞, 使用yaml多行文本塊語法 不需轉義
     修改上面文件的編譯錯誤
   ```
4. 生成請求文本 執行`ManualAi-MkInitReq`命令、這將生成面向大模型的請求文本並寫入剪貼板。生成的文本中會帶上系統提示詞。 默認的系統提示詞會要求大模型以約定的yaml格式影響, 㕥便後續程序解析
   如果您不需要帶上系統提示詞，則使用`ManualAi-MkReq`命令, 這種情況適用于在同一會話中追問, 即大模型已看過系統提示詞
   生成的請求文本 會帶上 所有文件上下文的文件內容, 並附上 行號 與 從vscode api中獲取到的錯誤診斷
5. 將請求文本發給大模型 在網頁中打開大模型, 粘貼, 發送, 等待回覆
6. 執行大模型操作 複製下大模型的響應文本到剪貼板，並執行`ManualAi-ExeOp`命令，擴展會解析響應文本，執行對應的寫操作。 網頁版大模型響應格式可能是不合法的yaml語法(比如大模型可能會把yaml包在代碼塊中 或添加額外的描述文本, 儘管我們已經在默認提示詞中強調過這些規則, 但大模型仍可能不聽),此時可能需要您手動修改一些錯誤, 避免解析失敗
   **在執行操作之前, 強烈建議您做好版本控制和備份**

## 提示詞配置

`<用戶家目錄>/.ManualAi/Io/SysPrompt`爲系統提示詞, 您可以自行修改。

- 執行`ManualAi-MkInitReq`時 會帶上系統提示詞
- 執行`ManualAi-MkReq`則不帶上系統提示詞

## 待實現功能

### 在 大模型響應中 支持 與讀取文件相關的操作類型

1. readFiles
2. seekDef

### 從選中區域便捷生成請求文本

當前您可以配合使用 `Copy With Line Numbers` 插件 達到近似效果

## 從源碼構建

```bash
npm i
vsce package
```

輸出產物在項目根目錄
