/**
 * 测试最终版零宽字符编码
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
console.log(colors.cyan("     最终版零宽字符编码测试"))
console.log(colors.cyan("========================================\n"))

// 测试案例
const testCases = [
	{
		name: "@智能体[软件架构师]",
		create: () => MentionHelperFinal.createAgentMention("软件架构师", "architect"),
		expectedType: "agent",
		expectedName: "软件架构师",
		expectedModeId: "architect",
	},
	{
		name: "@任务[优化性能]（有ID）",
		create: () => MentionHelperFinal.createTaskMention("优化性能", "task-12345"),
		expectedType: "task",
		expectedName: "优化性能",
		expectedId: "task-12345",
	},
	{
		name: "@任务[测试]（无ID）",
		create: () => MentionHelperFinal.createTaskMention("测试"),
		expectedType: "task",
		expectedName: "测试",
		expectedId: undefined,
	},
	{
		name: "@任务[English Task]",
		create: () => MentionHelperFinal.createTaskMention("English Task", "en-123"),
		expectedType: "task",
		expectedName: "English Task",
		expectedId: "en-123",
	},
]

console.log(colors.blue("📊 编码效率和正确性测试"))
console.log("─".repeat(50))

let allPassed = true
let totalTests = 0
let passedTests = 0

testCases.forEach((testCase) => {
	console.log(`\n📝 ${testCase.name}`)
	totalTests++

	try {
		// 生成提及文本
		const mention = testCase.create()

		// 解析验证
		const parsed = MentionHelperFinal.parseMention(mention)

		// 计算长度
		const displayLength = parsed.displayText.length
		const totalLength = mention.length
		const encodedLength = totalLength - displayLength
		const ratio = (totalLength / displayLength).toFixed(1)

		console.log(`  显示文本: "${parsed.displayText}" (${displayLength} 字符)`)
		console.log(`  编码数据: ${encodedLength} 字符`)
		console.log(`  总长度: ${totalLength} 字符`)
		console.log(`  膨胀率: ${ratio}倍`)

		// 验证解码正确性
		let passed = true
		const errors = []

		if (!parsed.params) {
			errors.push("无参数")
			passed = false
		} else {
			if (parsed.params.type !== testCase.expectedType) {
				errors.push(`类型错误: 期望 ${testCase.expectedType}, 实际 ${parsed.params.type}`)
				passed = false
			}
			if (parsed.params.name !== testCase.expectedName) {
				errors.push(`名称错误: 期望 "${testCase.expectedName}", 实际 "${parsed.params.name}"`)
				passed = false
			}
			if (testCase.expectedId !== undefined && parsed.params.id !== testCase.expectedId) {
				errors.push(`ID错误: 期望 ${testCase.expectedId}, 实际 ${parsed.params.id}`)
				passed = false
			}
			if (testCase.expectedModeId !== undefined && parsed.params.modeId !== testCase.expectedModeId) {
				errors.push(`ModeId错误: 期望 ${testCase.expectedModeId}, 实际 ${parsed.params.modeId}`)
				passed = false
			}
		}

		if (passed) {
			console.log(colors.green(`  ✅ 解码验证通过`))
			console.log(`  参数: ${JSON.stringify(parsed.params)}`)
			passedTests++
		} else {
			errors.forEach((err) => console.log(colors.red(`  ❌ ${err}`)))
			allPassed = false
		}
	} catch (error) {
		console.log(colors.red(`  ❌ 测试失败: ${error.message}`))
		allPassed = false
	}
})

// 测试完整消息长度
console.log(colors.blue("\n\n📨 完整消息长度测试"))
console.log("─".repeat(50))

const fullMessages = [
	{
		name: "@智能体[软件架构师] 123",
		create: () => {
			const mention = MentionHelperFinal.createAgentMention("软件架构师", "architect")
			return `${mention} 123`
		},
	},
	{
		name: "@任务[实现新功能] 请帮我完成",
		create: () => {
			const mention = MentionHelperFinal.createTaskMention("实现新功能", "task-999")
			return `${mention} 请帮我完成这个任务`
		},
	},
	{
		name: "多个提及",
		create: () => {
			const task = MentionHelperFinal.createTaskMention("任务1", "id1")
			const agent = MentionHelperFinal.createAgentMention("助手", "helper")
			return `开始 ${task} 然后 ${agent} 结束`
		},
	},
	{
		name: "长消息测试",
		create: () => {
			const mention = MentionHelperFinal.createAgentMention("智能助手", "assistant")
			const longText = "这是一段测试文本。".repeat(50)
			return `${mention} ${longText}`
		},
	},
]

fullMessages.forEach((test) => {
	console.log(`\n📝 ${test.name}`)
	const message = test.create()
	const cleanMessage = ZeroWidthEncoderFinal.cleanText(message)

	console.log(`  完整消息长度: ${message.length} 字符`)
	console.log(`  显示长度: ${cleanMessage.length} 字符`)
	console.log(`  编码增加: ${message.length - cleanMessage.length} 字符`)

	if (message.length <= 1024) {
		console.log(colors.green(`  ✅ 在1024字符限制内（剩余 ${1024 - message.length} 字符）`))
	} else {
		console.log(colors.red(`  ❌ 超过1024字符限制（超出 ${message.length - 1024} 字符）`))
		allPassed = false
	}
})

// 编码长度分析
console.log(colors.blue("\n\n📐 编码长度分析"))
console.log("─".repeat(50))

const analyzeEncoding = (text) => {
	const params = { type: "task", name: text }
	const encoded = ZeroWidthEncoderFinal.encode(params)
	const protocol = `T:${text}`
	const bytes = ZeroWidthEncoderFinal.stringToBytes(protocol)

	console.log(`\n文本: "${text}"`)
	console.log(`  原始文本: ${text.length} 字符`)
	console.log(`  协议格式: ${protocol.length} 字符`)
	console.log(`  UTF-8字节: ${bytes.length} 字节`)
	console.log(`  零宽编码: ${encoded.length} 字符`)
	console.log(`  编码倍率: ${(encoded.length / text.length).toFixed(1)}倍`)
}

analyzeEncoding("test")
analyzeEncoding("测试")
analyzeEncoding("软件架构师")
analyzeEncoding("实现新功能")

// 最终结果
console.log(colors.cyan("\n\n========================================"))
console.log(colors.cyan("              测试结果"))
console.log(colors.cyan("========================================"))

const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0

console.log(`\n测试统计:`)
console.log(`  总测试数: ${totalTests}`)
console.log(`  通过: ${passedTests}`)
console.log(`  失败: ${totalTests - passedTests}`)
console.log(`  通过率: ${passRate}%`)

if (allPassed) {
	console.log(colors.green("\n🎉 所有测试通过！"))
	console.log("\n最终方案特点:")
	console.log("  ✅ 使用UTF-8编码，完美支持中文")
	console.log("  ✅ 每字节用2个零宽字符（16进制）")
	console.log("  ✅ 中文字符约6-8倍膨胀")
	console.log("  ✅ ASCII字符约2-3倍膨胀")
	console.log("  ✅ 完全满足1024字符限制")
	console.log("  ✅ 编解码准确无误")
} else {
	console.log(colors.red("\n❌ 部分测试失败"))
}

console.log(colors.cyan("\n========================================\n"))
