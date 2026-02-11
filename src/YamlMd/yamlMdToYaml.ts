import type { Root, Code, Heading, Node } from 'mdast';
import { CT } from '../CT';

interface AnchorContent {
	name: string;
	value: string | null;
}


export async function yamlMdToYaml(md: string, ct?:CT): Promise<string> {
	// 新增：动态导入ES模块（替换原1-3行）
	//TODO 緩存導入
	const { unified } = await import('unified');
	const remarkParse = (await import('remark-parse')).default;
	const { visit } = await import('unist-util-visit');
	
	const tree = unified().use(remarkParse).parse(md);

	let topYaml = '';
	const anchors: AnchorContent[] = [];

	// 遍历 AST
	const children = (tree as Root).children;
	let i = 0;

	// 1. 提取顶层的 yaml 代码块
	while (i < children.length) {
		const node = children[i];

		if (node.type === 'code' && node.lang === 'yaml') {
			topYaml = node.value;
			i++;
			break;
		}

		i++;
	}

	// 2. 提取一级标题及其后的第一个代码块
	while (i < children.length) {
		const node = children[i];

		if (node.type === 'heading' && node.depth === 1) {
			// 获取标题文本
			const headingText = extractHeadingText(node);

			// 查找该标题后的第一个代码块
			let codeBlockValue: string | null = null;
			let foundCodeBlock = false;

			// 向后查找直到下一个一级标题或结束
			for (let j = i + 1; j < children.length; j++) {
				const nextNode = children[j];

				// 遇到下一个一级标题就停止
				if (nextNode.type === 'heading' && nextNode.depth === 1) {
					break;
				}

				// 找到第一个代码块
				if (nextNode.type === 'code' && !foundCodeBlock) {
					foundCodeBlock = true;
					codeBlockValue = nextNode.value === '' ? '' : nextNode.value;
					break;
				}
			}

			// 如果没找到代码块，设为 null
			if (!foundCodeBlock) {
				codeBlockValue = null;
			}

			anchors.push({
				name: headingText,
				value: codeBlockValue
			});
		}

		i++;
	}

	// 3. 构建最终的 yaml
	const anchorDefinitions: string[] = [];

	for (const anchor of anchors) {
		if (anchor.value === null) {
			anchorDefinitions.push(`${anchor.name}: &${anchor.name} null`);
		} else if (anchor.value === '') {
			anchorDefinitions.push(`${anchor.name}: &${anchor.name} ""`);
		} else {
			// 使用 |+ 保留尾部换行符
			const indentedValue = anchor.value
				.split('\n')
				.map(line => '  ' + line)
				.join('\n');
			anchorDefinitions.push(`${anchor.name}: &${anchor.name} |+\n${indentedValue}`);
		}
	}

	// 拼接结果
	const result = anchorDefinitions.join('\n') + '\n\n' + topYaml;

	return result;
}

function extractHeadingText(heading: Heading): string {
	let text = '';

	function extractText(node: Node): void {
		if (node.type === 'text') {
			text += (node as any).value;
		}

		if ('children' in node && Array.isArray((node as any).children)) {
			for (const child of (node as any).children) {
				extractText(child);
			}
		}
	}

	extractText(heading);

	return text;
}

// 测试
const testMd = `
\`\`\`yaml
name: Tsins
foo: *__content1
bar: *__content2
c3: *__content3
c4: *__content4
\`\`\`

# __content1
\`\`\`ts
console.log(
\t"Hello, world!"
);
\`\`\`

# __content2
\`\`\`cs
foreach(var i in list){
    Console.WriteLine(i);
}
\`\`\`

# __content3

# __content4
\`\`\`

\`\`\`
`;

console.log(yamlMdToYaml(testMd));

