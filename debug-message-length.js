/**
 * 调试消息长度问题
 */

const {
	ZeroWidthEncoderFinal,
	MentionHelperFinal,
} = require("/Users/david/ThinkgsProjects/box-im/im-web/src/utils/zeroWidthEncoderFinal.js")

// 颜色输出
const colors = {
	green: (text) => `\x1b[32m${text}\x1b[0m`,
	red: (text) => `\x1b[31m${text}\x1b[0m`,
	yellow: (text) => `\x1b[33m${text}\x1b[0m`,
	blue: (text) => `\x1b[34m${text}\x1b[0m`,
	cyan: (text) => `\x1b[36m${text}\x1b[0m`,
}

console.log(colors.cyan("\n========================================"))
console.log(colors.cyan("       调试1024字符限制问题"))
console.log(colors.cyan("========================================\n"))

// 模拟用户实际输入
const userInput = "@智能体[软件架构师]  123"

console.log(colors.blue("📝 分析用户输入"))
console.log("─".repeat(50))
console.log(`原始输入: "${userInput}"`)
console.log(`原始长度: ${userInput.length} 字符`)

// 创建带零宽编码的提及
const mention = MentionHelperFinal.createAgentMention("软件架构师", "architect")
const finalMessage = `${mention}  123`

console.log(colors.blue("\n📊 编码后的消息分析"))
console.log("─".repeat(50))
console.log(`编码后消息长度: ${finalMessage.length} 字符`)
console.log(`显示文本: "${ZeroWidthEncoderFinal.cleanText(finalMessage)}"`)

// 逐字符分析
console.log(colors.blue("\n🔍 逐字符分析"))
console.log("─".repeat(50))

let visibleCount = 0
let zeroWidthCount = 0
const zeroWidthChars = []

for (let i = 0; i < finalMessage.length; i++) {
	const char = finalMessage[i]
	const code = char.charCodeAt(0)

	// 检查是否是零宽字符
	if (
		code === 0x200b ||
		code === 0x200c ||
		code === 0x200d ||
		code === 0x2060 ||
		code === 0x180e ||
		code === 0xfeff ||
		code === 0x200e ||
		code === 0x200f ||
		code === 0x202a ||
		code === 0x202b ||
		code === 0x202c ||
		code === 0x202d ||
		code === 0x202e ||
		code === 0x2061 ||
		code === 0x2062 ||
		code === 0x2063 ||
		code === 0x2066 ||
		code === 0x2067
	) {
		zeroWidthCount++
		zeroWidthChars.push(`U+${code.toString(16).toUpperCase().padStart(4, "0")}`)
	} else {
		visibleCount++
	}
}

console.log(`可见字符数: ${visibleCount}`)
console.log(`零宽字符数: ${zeroWidthCount}`)
console.log(`总字符数: ${finalMessage.length}`)

// 测试不同消息长度
console.log(colors.blue("\n📏 不同消息长度测试"))
console.log("─".repeat(50))

const testMessages = [
	{ desc: "只有提及", text: mention },
	{ desc: "提及 + 空格", text: `${mention} ` },
	{ desc: '提及 + "123"', text: `${mention} 123` },
	{ desc: "提及 + 长文本", text: `${mention} ${"测".repeat(100)}` },
	{ desc: "提及 + 超长文本", text: `${mention} ${"测".repeat(300)}` },
]

testMessages.forEach((test) => {
	const length = test.text.length
	const status = length <= 1024 ? colors.green("✅") : colors.red("❌")
	console.log(`${status} ${test.desc}: ${length} 字符`)
})

// 计算最大允许的附加文本
console.log(colors.blue("\n💡 容量分析"))
console.log("─".repeat(50))

const mentionLength = mention.length
const maxAdditionalChars = 1024 - mentionLength

console.log(`提及编码长度: ${mentionLength} 字符`)
console.log(`剩余可用空间: ${maxAdditionalChars} 字符`)
console.log(`可添加中文字数: 约 ${Math.floor(maxAdditionalChars / 3)} 个`)
console.log(`可添加英文字数: 约 ${maxAdditionalChars} 个`)

// 测试字符串长度计算
console.log(colors.blue("\n🔬 JavaScript字符串长度测试"))
console.log("─".repeat(50))

const testStrings = [
	"@智能体[软件架构师]",
	"测试",
	"123",
	"\u200B\u200C\u200D", // 零宽字符
	"😀", // emoji
	"👨‍👩‍👧‍👦", // 复杂emoji
]

testStrings.forEach((str) => {
	console.log(`"${str}": ${str.length} (length) | ${[...str].length} (实际字符)`)
})

// 检查可能的问题
console.log(colors.yellow("\n⚠️ 可能的问题"))
console.log("─".repeat(50))

// 1. 检查是否多次编码
const doubleEncoded = MentionHelperFinal.createAgentMention("软件架构师", "architect")
const doubleEncodedAgain = ZeroWidthEncoderFinal.encode({
	type: "agent",
	name: "软件架构师",
	modeId: "architect",
})

console.log(`单次编码长度: ${mention.length}`)
console.log(`如果重复编码: ${mention + doubleEncodedAgain.length}`)

// 2. 检查是否有其他隐藏字符
const hiddenChars = finalMessage.match(/[\u0000-\u001F\u007F-\u009F\u2000-\u206F\uFEFF]/g)
if (hiddenChars) {
	console.log(colors.red(`发现隐藏字符: ${hiddenChars.length} 个`))
	console.log(
		`隐藏字符详情:`,
		hiddenChars.map((c) => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`),
	)
}

// 3. 模拟实际使用场景
console.log(colors.blue("\n🎯 模拟实际场景"))
console.log("─".repeat(50))

// 场景1: 用户输入 "@智能体[软件架构师]  123"
const scenario1 = () => {
	// 模拟IM处理流程
	const displayText = "@智能体[软件架构师]"
	const params = {
		type: "agent",
		name: "软件架构师",
		modeId: "architect", // 假设从选择列表获取
	}
	const encoded = ZeroWidthEncoderFinal.encode(params)
	const fullMessage = displayText + encoded + "  123"

	return {
		display: displayText + "  123",
		full: fullMessage,
		length: fullMessage.length,
	}
}

const result = scenario1()
console.log(`显示给用户: "${result.display}"`)
console.log(`实际发送内容长度: ${result.length} 字符`)

if (result.length > 1024) {
	console.log(colors.red(`\n❌ 超出限制: ${result.length - 1024} 字符`))
	console.log(colors.red('这就是触发 "ERR 内容长度不得大于1024" 的原因！'))
} else {
	console.log(colors.green(`\n✅ 在限制内: 剩余 ${1024 - result.length} 字符`))
}

console.log(colors.cyan("\n========================================\n"))
