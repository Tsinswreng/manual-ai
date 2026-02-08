//CsOpencc t2s README-zh-Hant.typ README-zh-Hans.typ
#import "TypstTools/AutoHeading.typ": H

#let I(..args) = [
  #args.at(0)
  #if args.pos().len() > 1 {
    args.at(1)
  }
]

Manual-AI 是一款 VSCode 扩展。通过结构化yaml数据交互, 用户能利用网页上的AI大模型, 使大模型与编辑器结合㕥执行修改代码等操作, 达到近似AI Agent的编程体验。
#H[扩展概述][
  现有 VSCode 集成 AI 编程方案（使用插件自带模型、自行配置第三方 API 金钥）多需付费；而网页版 AI 多提供免费交互，但缺乏与 VSCode 编辑器的结构化交互能力。该插件弥补这一缺口，让用户无需付费即可借助免费网页 AI 实现近似 AI Agent 的编程体验。
]

#H[安装扩展][
  #H[从vsix安装][
    按`Ctrl+Shift+P`:
    #image("assets\2026-02-08-14-54-27.png")
    然后选择vsix路径
    
    可从github release区寻找有无打包好的vsix
  ]
]

#H[快速上手][
  #enum(
    I[安装扩展],
    I[生成用户输入模板][
      #enum(
        I[按`Ctrl+N`、创建一个临时文件],
        I[
          按`Ctrl+Shift+P`, 输入`ManualAi-MkReqTemplate`, 回车执行命令, 这会生成用户输入yaml的模板并写入剪贴板, 然后`Ctrl+V`粘贴到当前临时文件中
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
        ],
      )
    ],
    I[编辑模板][
      例
      ```yaml
      files:
        paths: #所有路径都须为绝对路径。您可使用Vscode快捷键 Shift+Alt+C 复制绝对路径。
          - C:/MyProj/src/xxx.ts # 单个文件
          - c:\MyProj\src\xxx.ts # 支持小写盘符与反斜杠路径分隔符
          - C:/MyProj/src/services/* #支持通配符
        regex: # 正则表达式匹配文件上下文
          - rootDir: - C:/MyProj/src/ #指定正则表达式搜索的根目录
            includes: # 包含
              - .*\.ts$
            excludes: # 排除
              - .*\.js$
      text: |+ # 用自然语言描述的提示词, 使用yaml多行文本块语法 不需转义
        修改上面文件的编译错误
      ```
    ],
    I[生成请求文本][
      执行`ManualAi-MkInitReq`命令、这将生成面向大模型的请求文本并写入剪贴板。生成的文本中会带上系统提示词。
      默认的系统提示词会要求大模型以约定的yaml格式影响, 㕥便后续程序解析
      
      如果您不需要带上系统提示词，则使用`ManualAi-MkReq`命令, 这种情况适用于在同一会话中追问, 即大模型已看过系统提示词
      
      生成的请求文本 会带上 所有文件上下文的文件内容, 并附上 行号 与 从vscode api中获取到的错误诊断
    ],
    I[将请求文本发给大模型][
      在网页中打开大模型, 粘贴, 发送, 等待回复
    ],
    I[执行大模型操作][
      复制下大模型的响应文本到剪贴板，并执行`ManualAi-ExeOp`命令，扩展会解析响应文本，执行对应的写操作。
      网页版大模型响应格式可能是不合法的yaml语法(比如大模型可能会把yaml包在代码块中 或添加额外的描述文本, 尽管我们已经在默认提示词中强调过这些规则, 但大模型仍可能不听),此时可能需要您手动修改一些错误, 避免解析失败

      *在执行操作之前, 强烈建议您做好版本控制和备份*
    ],
  )
]

#H[提示词配置][
  `<用户家目录>/.ManualAi/Io/SysPrompt`为系统提示词, 您可以自行修改。
  - 执行`ManualAi-MkInitReq`时 会带上系统提示词
  - 执行`ManualAi-MkReq`则不带上系统提示词
]



#H[待实现功能][
  #H[在 大模型响应中 支持 与读取文件相关的操作类型][
    #enum(
      I[readFiles],
      I[seekDef],
    )
  ]

]

#H[从源码构建][
  ```bash
  npm i
  vsce package
  ```
  输出产物在项目根目录
]