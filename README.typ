#import "TypstTools/AutoHeading.typ": H

#let I(..args) = [
  #args.at(0)
  #if args.pos().len() > 1 {
    args.at(1)
  }
]

#link("README-zh-Hant.md")[漢]
#link("README-zh-Hans.md")[汉]


Manual-AI is a VSCode extension. Through structured YAML data interaction, users can utilize AI LLMs on web pages, integrating the LLMs with the editor to perform operations such as code modification, achieving a programming experience similar to an AI Agent.
#H[Extension Overview][
  Most existing VSCode-integrated AI programming solutions (using plug-in-built models or self-configured third-party API keys) require payment; while web-based AI often offers free interaction but lacks structured interaction capabilities with the VSCode editor. This plug-in fills this gap, allowing users to achieve an AI Agent-like programming experience for free with web-based AI.
]

#H[Install the Extension][
  #H[Install from VSIX][
    Press `Ctrl+Shift+P`:
    #image("assets\2026-02-08-14-54-27.png")
    Then select the VSIX path
    
    You can check the GitHub release section for packaged VSIX files
  ]
]

#H[Quick Start][
  #enum(
    I[Install the Extension],
    I[Generate User Input Template][
      #enum(
        I[Press `Ctrl+N` to create a temporary file],
        I[
          Press `Ctrl+Shift+P`, enter `ManualAi-MkReqTemplate`, press Enter to execute the command. This will generate a YAML template for user input, copy it to the clipboard, then press `Ctrl+V` to paste it into the current temporary file.
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
    I[Edit the Template][
      Example
      ```yaml
      files:
        paths: # All paths must be absolute paths. You can use the VSCode shortcut Shift+Alt+C to copy the absolute path.
          - C:/MyProj/src/xxx.ts # Single file
          - c:\MyProj\src\xxx.ts # Supports lowercase drive letters and backslash path separators
          - C:/MyProj/src/services/* # Supports wildcards
        regex: # Regular expression to match file context
          - rootDir: - C:/MyProj/src/ # Specify the root directory for regular expression search
            includes: # Include
              - .*\.ts$
            excludes: # Exclude
              - .*\.js$
      text: |+ # Prompt described in natural language, using YAML multi-line block scalar syntax with no need for escaping
        Fix compilation errors in the above files
      ```
    ],
    I[Generate Request Text][
    Execute the `ManualAi-MkInitReq` command, which will generate request text for the LLM and copy it to the clipboard. The generated text will include the system prompt.
    The default system prompt requires the LLM to respond in the agreed YAML format for subsequent program parsing.
      
    If you don't need to include the system prompt, use the `ManualAi-MkReq` command. This is suitable for follow-up questions in the same conversation (i.e., the LLM has already seen the system prompt).
      
      The generated request text will include the file content of all file contexts, along with line numbers and error diagnostics obtained from the VSCode API.
    ],
    I[Send Request Text to the Large Model][
      Open the LLM in a web page, paste the text, send it, and wait for a response.
    ],
    I[Execute Large Model Operations][
      Copy the LLM's response text to the clipboard and execute the `ManualAi-ExeOp` command. The extension will parse the response text and execute the corresponding write operations.
      The response format of web-based LLMs may be invalid YAML syntax (e.g., the LLM may wrap the YAML in code blocks or add extra descriptive text, even though we have emphasized these rules in the default prompt, the LLM may still ignore them). In this case, you may need to manually fix some errors to avoid parsing failures.

      *Before executing operations, it is strongly recommended that you use version control and make backups.*
    ],
  )
]

#H[Prompt Configuration][
  `<User Home Directory>/.ManualAi/Io/SysPrompt` is the system prompt, which you can modify yourself.
  - Executing `ManualAi-MkInitReq` will include the system prompt.
  - Executing `ManualAi-MkReq` will not include the system prompt.
]



#H[To-be-Implemented Features][
  #H[Support File Reading-related Operation Types in LLM Responses][
    #enum(
      I[readFiles],
      I[seekDef],
    )
  ]

]

#H[Build from Source Code][
  ```bash
  npm i
  vsce package
  ```
  The output artifact is in the project root directory.
]