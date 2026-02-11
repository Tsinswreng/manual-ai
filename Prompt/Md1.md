```yaml
# Array of operation objects (can be empty). Include only the operations you need.
operations:
  # Line-based replacement (for initial edits)
  - type: replaceByLine
    # if path does not exist, it will be created. if you want to create new file, just set path to the new file name and set both startLine and endLine to 1.
    path: E:/code/src/components/Button.tsx
    replace:
      - startLine: 15       # starts from 1, included, can be larger than file length
        endLine: 23         # included, can be larger than file length
        data:
          baseIndent: "    " # base indent for the content, which means each line will have another "    " at the beginning
          # content can be null, which means to delete from startLine to endLine
          content: *__content1 # reference to the content anchor defined in md behind
          # we advise you to put multiline content in a separate anchor and reference it in the main YAML structure.
          # you can also directly put content in the main YAML structure, but it's not recommended, since it's hard to maintain and read.
          #~content
        #~data
      #~-
      - startLine: 45
        endLine: 45
        data:
          baseIndent: "" # this means no baseIndent
          content: *__content2
          #~content
        #~data
      #~-
    #~replace
  #~-
  # Snippet-based replacement (for follow-ups after line numbers changed)
  - type: replaceBySnippet
    path: e:/code/src/components/Button.tsx
    replace:
      - match:
          baseIndent: "\t\t"
          # Must match exactly, including indentation, whitespace, etc.
          content: *__content3
          #~content
        #~match
        replacement:
          baseIndent: "\t\t"
          content: *__content4
          #~content
        #~replacement
      #~-
    #~replace
  # Type 3: Request more files
  - type: readFiles
    paths:
      - e:/code/MyProj/Views/ViewLogin.cs
      - e:/code/MyProj/Views/VmLogin.cs
    #~paths
  #~-
  # Type 4: Lookup symbol definitions
  - type: seekDef
    path: e:/code/src/components/Button.tsx
    symbols:
      - line: 10
        symbol: UserInterface
      #~-
      - line: 25
        symbol: fetchUserData
      #~-
    #~symbols
  #~-
#~operations
# Human-readable explanation for the user
text:
  baseIndent: ""
  content: |+
    I've made the requested changes to Button.tsx. The first replacement updates the click handler to use proper state management, and the second fixes the return value. I also need to examine the type definitions to ensure compatibility.
  #~content
#~text
```

# __content1
`````ts
const handleClick = () => {
    console.log("clicked");
    setState(prev => !prev);
};
`````
# __content2
`````ts
import { useState } from 'react';
`````

# __content3
`````ts
function oldHandler() {
	return false;
}
`````

# __content4
`````ts
function oldHandler() {
	return true;
}
`````




