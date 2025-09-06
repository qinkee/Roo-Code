/**
 * 测试紧凑版零宽字符编码效率
 */

const {
	ZeroWidthEncoderCompact,
	MentionHelperCompact,
} = require("/Users/david/ThinkgsProjects/box-im/im-web/src/utils/zeroWidthEncoderCompact.js")

// 颜色输出
const colors = {
	green: (text) => `\x1b[32m${text}\x1b[0m`,
	red: (text) => `\x1b[31m${text}\x1b[0m`,
	yellow: (text) => `\x1b[33m${text}\x1b[0m`,
	blue: (text) => `\x1b[34m${text}\x1b[0m`,
	cyan: (text) => `\x1b[36m${text}\x1b[0m`,
}

console.log(colors.cyan("\n========================================"))
console.log(colors.cyan("     紧凑版零宽字符编码效率测试"))
console.log(colors.cyan("========================================\n"))

// 测试案例
const testCases = [
	{
		name: "@智能体[软件架构师]",
		create: () => MentionHelperCompact.createAgentMention("软件架构师", "architect"),
		expectedType: "agent",
		expectedName: "软件架构师",
		expectedModeId: "architect",
	},
	{
		name: "@任务[优化性能]（有ID）",
		create: () => MentionHelperCompact.createTaskMention("优化性能", "task-12345"),
		expectedType: "task",
		expectedName: "优化性能",
		expectedId: "task-12345",
	},
	{
		name: "@任务[测试]（无ID）",
		create: () => MentionHelperCompact.createTaskMention("测试"),
		expectedType: "task",
		expectedName: "测试",
		expectedId: undefined,
	},
]

console.log(colors.blue("📊 编码效率测试"))
console.log("─".repeat(50))

let allPassed = true

testCases.forEach((testCase) => {
	console.log(`\n📝 ${testCase.name}`)

	try {
		// 生成提及文本
		const mention = testCase.create()

		// 解析验证
		const parsed = MentionHelperCompact.parseMention(mention)

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
		if (parsed.params) {
			if (parsed.params.type !== testCase.expectedType) {
				console.log(colors.red(`  ❌ 类型错误: 期望 ${testCase.expectedType}, 实际 ${parsed.params.type}`))
				passed = false
			}
			if (parsed.params.name !== testCase.expectedName) {
				console.log(colors.red(`  ❌ 名称错误: 期望 ${testCase.expectedName}, 实际 ${parsed.params.name}`))
				passed = false
			}
			if (testCase.expectedId !== undefined && parsed.params.id !== testCase.expectedId) {
				console.log(colors.red(`  ❌ ID错误: 期望 ${testCase.expectedId}, 实际 ${parsed.params.id}`))
				passed = false
			}
			if (testCase.expectedModeId !== undefined && parsed.params.modeId !== testCase.expectedModeId) {
				console.log(
					colors.red(`  ❌ ModeId错误: 期望 ${testCase.expectedModeId}, 实际 ${parsed.params.modeId}`),
				)
				passed = false
			}

			if (passed) {
				console.log(colors.green(`  ✅ 解码验证通过`))
				console.log(`  参数: ${JSON.stringify(parsed.params)}`)
			} else {
				allPassed = false
			}
		} else {
			console.log(colors.red(`  ❌ 解码失败: 无参数`))
			allPassed = false
		}
	} catch (error) {
		console.log(colors.red(`  ❌ 测试失败: ${error.message}`))
		allPassed = false
	}
})

// 测试完整消息长度
console.log(colors.blue("\n\n📨 完整消息测试"))
console.log("─".repeat(50))

const fullMessages = [
	{
		name: "@智能体[软件架构师] 123",
		create: () => {
			const mention = MentionHelperCompact.createAgentMention("软件架构师", "architect")
			return `${mention} 123`
		},
	},
	{
		name: "@任务[实现新功能] 请帮我完成",
		create: () => {
			const mention = MentionHelperCompact.createTaskMention("实现新功能", "task-999")
			return `${mention} 请帮我完成这个任务`
		},
	},
	{
		name: "长文本消息测试",
		create: () => {
			const mention = MentionHelperCompact.createAgentMention("智能助手", "helper")
			const longText =
				"这是一段很长的测试文本，用来验证编码后的消息是否会超过1024字符限制。" +
				"我们需要确保即使加上零宽字符编码，整个消息也不会太长。".repeat(5)
			return `${mention} ${longText}`
		},
	},
]

fullMessages.forEach((test) => {
	console.log(`\n📝 ${test.name}`)
	const message = test.create()
	const cleanMessage = ZeroWidthEncoderCompact.cleanText(message)

	console.log(`  完整消息长度: ${message.length} 字符`)
	console.log(`  显示消息: "${cleanMessage.substring(0, 50)}${cleanMessage.length > 50 ? "..." : ""}"`)
	console.log(`  显示长度: ${cleanMessage.length} 字符`)
	console.log(`  编码增加: ${message.length - cleanMessage.length} 字符`)

	if (message.length <= 1024) {
		console.log(colors.green(`  ✅ 在1024字符限制内（剩余 ${1024 - message.length} 字符）`))
	} else {
		console.log(colors.red(`  ❌ 超过1024字符限制（超出 ${message.length - 1024} 字符）`))
		allPassed = false
	}
})

// 最终结果
console.log(colors.cyan("\n========================================"))
console.log(colors.cyan("              测试结果"))
console.log(colors.cyan("========================================"))

if (allPassed) {
	console.log(colors.green("\n🎉 所有测试通过！"))
	console.log(colors.green("紧凑版编码方案："))
	console.log("  • 使用4进制编码（4个零宽字符 = 1个普通字符）")
	console.log("  • 简化协议格式（type:name:id）")
	console.log("  • 膨胀率约 4-5 倍")
	console.log("  • 完全满足1024字符限制")
} else {
	console.log(colors.red("\n❌ 部分测试失败"))
	console.log("请检查编码实现")
}

console.log(colors.cyan("\n========================================\n"))
