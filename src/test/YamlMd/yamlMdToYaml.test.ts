import { yamlMdToYaml } from "../../YamlMd/yamlMdToYaml";


/**
 * 简单的断言工具（无第三方库）
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`断言失败: ${message}`);
  }
}

/**
 * 测试运行器（无第三方库）
 */
interface TestCase {
  name: string;
  inputMd: string;
  expectedYaml: string;
}

async function runTests(testCases: TestCase[]): Promise<void> {
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      // 调用被测函数，ct 参数传 void 0
      const actual = await yamlMdToYaml(testCase.inputMd, void 0);
      // 去除首尾空白后比较（避免换行/空格的微小差异）
      const normalizedActual = actual.trim().replace(/\r\n/g, '\n');
      const normalizedExpected = testCase.expectedYaml.trim().replace(/\r\n/g, '\n');
      
      assert(
        normalizedActual === normalizedExpected,
        `测试用例 "${testCase.name}" 输出不匹配
预期:
${normalizedExpected}

实际:
${normalizedActual}
`
      );
      passed++;
      console.log(`✅ 测试通过: ${testCase.name}`);
    } catch (error) {
      failed++;
      console.error(`❌ 测试失败: ${testCase.name}`);
      console.error(error);
    }
  }

  console.log(`
==================== 测试结果 ====================
✅ 通过: ${passed}
❌ 失败: ${failed}
📊 总计: ${passed + failed}
==================================================
`);
}

/**
 * 核心测试用例（覆盖示例场景 + 边界场景）
 */
const testCases: TestCase[] = [
  // 测试用例1: 示例完整场景（核心场景）
  {
    name: "示例完整场景-包含有内容/空代码块/无代码块的一级标题",
    inputMd: `
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
`,
    expectedYaml: `__content1: &__content1 |+
  console.log(
\t"Hello, world!"
  );
__content2: &__content2 |+
  foreach(var i in list){
      Console.WriteLine(i);
  }
__content3: &__content3 null
__content4: &__content4 ""

name: Tsins
foo: *__content1
bar: *__content2
c3: *__content3
c4: *__content4`
  },

  // 测试用例2: 一级标题后多个代码块（只取第一个）
  {
    name: "一级标题后多个代码块-仅保留第一个代码块内容",
    inputMd: `
\`\`\`yaml
test: *__content5
\`\`\`

# __content5
\`\`\`js
console.log("first block");
\`\`\`
\`\`\`python
print("second block")
\`\`\`
`,
    expectedYaml: `__content5: &__content5 |+
  console.log("first block");

test: *__content5`
  },

  // 测试用例3: 代码块为空（赋值为空字符串）
  {
    name: "一级标题后代码块为空-赋值为空字符串",
    inputMd: `
\`\`\`yaml
test: *__content6
\`\`\`

# __content6
\`\`\`
\`\`\`
`,
    expectedYaml: `__content6: &__content6 ""

test: *__content6`
  },

  // 测试用例4: 一级标题后无代码块（赋值为null）
  {
    name: "一级标题后无代码块-赋值为null",
    inputMd: `
\`\`\`yaml
test: *__content7
\`\`\`

# __content7
这是普通文本，不是代码块
`,
    expectedYaml: `__content7: &__content7 null

test: *__content7`
  },

  // 测试用例5: 代码块包含特殊字符/换行（原样保留）
  {
    name: "代码块含特殊字符和换行-原样保留内容",
    inputMd: `
\`\`\`yaml
test: *__content8
\`\`\`

# __content8
\`\`\`sh
echo "特殊字符: ~!@#$%^&*()_+-=[]{}|;':\",./<>?"
if [ 1 -eq 1 ]; then
  echo "换行保留"
fi
\`\`\`
`,
    expectedYaml: `__content8: &__content8 |+
  echo "特殊字符: ~!@#$%^&*()_+-=[]{}|;':\",./<>?"
  if [ 1 -eq 1 ]; then
    echo "换行保留"
  fi

test: *__content8`
  }
];

// 执行所有测试
runTests(testCases).catch(err => {
  console.error("测试执行失败:", err);
  process.exit(1);
});