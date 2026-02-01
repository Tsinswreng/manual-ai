
/* 
帶基礎縮進的yaml多行文本塊
```yaml
block:
  baseIndent: "\t\t\t"
  content: |-
	aaa
	bbb
```

相當於

```yaml
block:
  baseIndent: ""
  content: |-
				aaa
				bbb
```

*/
export interface IYamlBlock {
	/**
	 * 基礎縮進
	 */
	baseIndent?: string;
	/**
	 * 內容
	 */
	content?: string;
}

export interface IYamlBlockParser {
	/**
	 * 參數爲空時 默認用this
	 */
	getParsedContent(yamlBlock?: IYamlBlock): string|undefined;
}

export class YamlBlock implements IYamlBlock, IYamlBlockParser {
	/**
	 * 基礎縮進
	 */
	baseIndent?: string;
	/**
	 * 內容
	 */
	content?: string = "";
	constructor(content: string, baseIndent?: string){
		if(arguments.length === 0){return}
		const z = this
		z.baseIndent = baseIndent
		z.content = content
	}

	//頻繁調用旹可加緩存
	getParsedContent(yamlBlock?: IYamlBlock): string|undefined {
		const targetBlock = yamlBlock ?? this;
		return YamlBlock.getParsedContent(targetBlock);
	}
	
	//頻繁調用旹可加緩存
	static getParsedContent(yamlBlock: IYamlBlock): string|undefined {
		const targetBlock = yamlBlock
		// 解构属性，baseIndent默认空字符串（避免undefined拼接）
		const { baseIndent = '', content } = targetBlock;
		if(content == void 0){
			return void 0
		}

		// 兼容所有换行符（\n/\r\n），分割为行数组
		const contentLines = content.split(/\r?\n/);
		// 逐行添加基础缩进，保留原始行结构（包括空行）
		const indentedLines = contentLines.map(line => baseIndent + line);
		// 重组为字符串，使用通用换行符\n
		return indentedLines.join('\n');
	}
}