[漢](README-zh-Hant.md) [汉](README-zh-Hans.md)

Manual-AI is a VSCode extension. Through structured YAML data interaction, users can utilize AI LLMs on web pages, integrating the LLMs with the editor to perform operations such as code modification, achieving a programming experience similar to an AI Agent.

## Extension Overview

Most existing VSCode-integrated AI programming solutions (using plug-in-built models or self-configured third-party API keys) require payment; while web-based AI often offers free interaction but lacks structured interaction capabilities with the VSCode editor. This plug-in fills this gap, allowing users to achieve an AI Agent-like programming experience for free with web-based AI.

## Install the Extension

### Install from VSIX

Press `Ctrl+Shift+P`:![](assets/2026-02-08-14-54-27.png)Then select the VSIX path

You can check the GitHub release section for packaged VSIX files

## Quick Start

1. Install the Extension
2. Generate User Input Template
   1. Press `Ctrl+N` to create a temporary file
   2. Press `Ctrl+Shift+P`, enter `ManualAi-MkReqTemplate`, press Enter to execute the command. This will generate a YAML template for user input, copy it to the clipboard, then press `Ctrl+V` to paste it into the current temporary file.
      ![](assets/2026-02-11-18-26-04.png)```yaml
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
3. Edit the Template You need to add file contexts in files. Supports adding absolute paths, absolute paths with wildcards, regular expression matching file contexts, and automatically reads file content with line numbers. Note: **Relative paths are not supported!**
   You can use the VSCode shortcut Shift+Alt+C or the right-click menu to easily copy the absolute path of the current file to avoid manual input.
   ![](assets/2026-02-11-18-28-48.png)Example
   ```yaml
   files:
     paths: # All paths must be absolute paths.
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
4. Generate Request Text First copy the full text of the yaml request edited in the previous step to the clipboard, then execute the `ManualAi-MkInitReq` command, which will generate request text for the LLM and copy the final request text to the clipboard. The generated text will include the system prompt.
   The default system prompt requires the LLM to respond in the agreed YAML format for subsequent program parsing.
   If you don’t need to include the system prompt, use the `ManualAi-MkReq` command. This is suitable for follow-up questions in the same conversation (i.e., the LLM has already seen the system prompt).
   The generated request text will include the file content of all file contexts, along with line numbers and error diagnostics obtained from the VSCode API.
5. Send Request Text to the Large Model Open the LLM in a web page, paste the text, send it, and wait for a response.
6. Execute Large Model Operations Copy the LLM’s response text to the clipboard and execute the `ManualAi-ExeOp` command. The extension will parse the response text and execute the corresponding write operations. **Before executing operations, it is strongly recommended that you use version control and make backups (e.g., git commit first).**

## Prompt Configuration

`<User Home Directory>/.ManualAi/Io/SysPrompt` is the system prompt, which you can modify yourself.

- Executing `ManualAi-MkInitReq` will include the system prompt.
- Executing `ManualAi-MkReq` will not include the system prompt.

## To-be-Implemented Features

### Support File Reading-related Operation Types in LLM Responses

1. readFiles
2. seekDef

### Quickly Generate Request Text from Selected Area

Currently you can use the `Copy With Line Numbers` extension to achieve a similar effect.

## Build from Source Code

```bash
npm i
vsce package
```

The output artifact is in the project root directory.

## YamlMd Format

YamlMd is a combination of markdown and yaml, which facilitates combining multi-line text blocks without extra indentation and escaping in yaml, and can be easily parsed into yaml format.

Example:

````md
```yaml
name: Tsinswreng
descr: *__content1
```

# __content1
```
aaa
111
```
````

The above YamlMd parsed into yaml is:

```yaml
__content1: &__content1 |+
  aaa
  111

name: Tsinswreng
descr: *__content1
```

This extension requires the LLM to output responses in this format. For specific format specifications, please refer to:

- [Default System Prompt (typst version)](Prompt/Prompt.typ)
- [Default System Prompt (markdown version, converted from typst version)](Prompt/Prompt.md)
