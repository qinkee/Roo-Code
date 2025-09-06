"use strict"
/**
 * 零宽字符编码集成测试 - Roo-Code端
 * 测试从IM端接收的@提及参数
 */
Object.defineProperty(exports, "__esModule", { value: true })
exports.IntegrationTester = void 0
const zeroWidthEncoder_1 = require("./src/utils/zeroWidthEncoder")
// 颜色输出辅助
const colors = {
	green: (text) => `\x1b[32m${text}\x1b[0m`,
	red: (text) => `\x1b[31m${text}\x1b[0m`,
	yellow: (text) => `\x1b[33m${text}\x1b[0m`,
	blue: (text) => `\x1b[34m${text}\x1b[0m`,
	cyan: (text) => `\x1b[36m${text}\x1b[0m`,
}
class IntegrationTester {
	constructor() {
		this.passedTests = 0
		this.failedTests = 0
	}
	/**
	 * 运行所有测试
	 */
	async runAllTests() {
		console.log(colors.cyan("\n========================================"))
		console.log(colors.cyan("  零宽字符编码集成测试 - Roo-Code端"))
		console.log(colors.cyan("========================================\n"))
		// 1. 测试基础编解码
		await this.testBasicEncoding()
		// 2. 测试任务提及
		await this.testTaskMentions()
		// 3. 测试智能体提及
		await this.testAgentMentions()
		// 4. 测试命令参数构建
		await this.testCommandParameters()
		// 5. 测试边界情况
		await this.testEdgeCases()
		// 输出测试结果
		this.printSummary()
	}
	/**
	 * 测试基础编解码功能
	 */
	async testBasicEncoding() {
		console.log(colors.blue("\n📝 测试基础编解码功能"))
		console.log("─".repeat(40))
		const testCases = [
			{
				name: "简单对象编码",
				data: { type: "task", name: "测试任务" },
			},
			{
				name: "复杂对象编码",
				data: {
					type: "agent",
					name: "智能助手",
					modeId: "assistant-mode",
					nested: { key: "value" },
				},
			},
			{
				name: "最小参数集",
				data: { type: "task", name: "最简任务" },
			},
		]
		for (const testCase of testCases) {
			try {
				const encoded = zeroWidthEncoder_1.ZeroWidthEncoder.encode(testCase.data)
				const decoded = zeroWidthEncoder_1.ZeroWidthEncoder.decode(encoded)
				const passed = JSON.stringify(decoded) === JSON.stringify(testCase.data)
				if (passed) {
					console.log(colors.green(`  ✅ ${testCase.name}`))
					console.log(`     原始数据: ${JSON.stringify(testCase.data)}`)
					console.log(`     编码长度: ${encoded.length} 字符`)
					console.log(`     解码结果: ${JSON.stringify(decoded)}`)
					this.passedTests++
				} else {
					console.log(colors.red(`  ❌ ${testCase.name}`))
					console.log(`     期望: ${JSON.stringify(testCase.data)}`)
					console.log(`     实际: ${JSON.stringify(decoded)}`)
					this.failedTests++
				}
			} catch (error) {
				console.log(colors.red(`  ❌ ${testCase.name} - 异常: ${error}`))
				this.failedTests++
			}
		}
	}
	/**
	 * 测试任务提及
	 */
	async testTaskMentions() {
		console.log(colors.blue("\n📋 测试任务提及"))
		console.log("─".repeat(40))
		const testCases = [
			{
				name: "新任务（无ID）",
				input: zeroWidthEncoder_1.MentionHelper.createTaskMention("创建用户系统"),
				expectedParams: {
					type: "task",
					name: "创建用户系统",
				},
				shouldPass: true,
			},
			{
				name: "继续任务（有ID）",
				input: zeroWidthEncoder_1.MentionHelper.createTaskMention("修复登录问题", "task-abc123"),
				expectedParams: {
					type: "task",
					name: "修复登录问题",
					id: "task-abc123",
				},
				shouldPass: true,
			},
			{
				name: "任务名称包含特殊字符",
				input: zeroWidthEncoder_1.MentionHelper.createTaskMention("实现@功能&优化#性能", "task-special"),
				expectedParams: {
					type: "task",
					name: "实现@功能&优化#性能",
					id: "task-special",
				},
				shouldPass: true,
			},
		]
		for (const testCase of testCases) {
			const result = zeroWidthEncoder_1.MentionHelper.parseMention(testCase.input)
			const passed = this.validateParams(result.params, testCase.expectedParams)
			if (passed === testCase.shouldPass) {
				console.log(colors.green(`  ✅ ${testCase.name}`))
				console.log(`     显示文本: ${result.displayText}`)
				console.log(`     解析参数: ${JSON.stringify(result.params)}`)
				this.passedTests++
			} else {
				console.log(colors.red(`  ❌ ${testCase.name}`))
				console.log(`     期望参数: ${JSON.stringify(testCase.expectedParams)}`)
				console.log(`     实际参数: ${JSON.stringify(result.params)}`)
				this.failedTests++
			}
		}
	}
	/**
	 * 测试智能体提及
	 */
	async testAgentMentions() {
		console.log(colors.blue("\n🤖 测试智能体提及"))
		console.log("─".repeat(40))
		const testCases = [
			{
				name: "基础智能体",
				input: zeroWidthEncoder_1.MentionHelper.createAgentMention("代码审查", "code-review"),
				expectedParams: {
					type: "agent",
					name: "代码审查",
					modeId: "code-review",
				},
				shouldPass: true,
			},
			{
				name: "架构师智能体",
				input: zeroWidthEncoder_1.MentionHelper.createAgentMention("系统架构师", "architect-mode"),
				expectedParams: {
					type: "agent",
					name: "系统架构师",
					modeId: "architect-mode",
				},
				shouldPass: true,
			},
		]
		for (const testCase of testCases) {
			const result = zeroWidthEncoder_1.MentionHelper.parseMention(testCase.input)
			const passed = this.validateParams(result.params, testCase.expectedParams)
			if (passed === testCase.shouldPass) {
				console.log(colors.green(`  ✅ ${testCase.name}`))
				console.log(`     模式ID: ${result.params?.modeId}`)
				this.passedTests++
			} else {
				console.log(colors.red(`  ❌ ${testCase.name}`))
				this.failedTests++
			}
		}
	}
	/**
	 * 测试命令参数构建
	 */
	async testCommandParameters() {
		console.log(colors.blue("\n⚙️ 测试VSCode命令参数构建"))
		console.log("─".repeat(40))
		// 模拟从IM收到的消息
		const scenarios = [
			{
				name: "新任务命令",
				mention: zeroWidthEncoder_1.MentionHelper.createTaskMention("实现搜索功能"),
				expectedCommand: "roo-code.executeTask",
				expectedParams: {
					content: "实现搜索功能",
				},
			},
			{
				name: "继续任务命令",
				mention: zeroWidthEncoder_1.MentionHelper.createTaskMention("继续优化", "task-12345"),
				expectedCommand: "roo-code.executeTask",
				expectedParams: {
					content: "继续优化",
					taskId: "task-12345",
				},
			},
			{
				name: "智能体命令",
				mention: zeroWidthEncoder_1.MentionHelper.createAgentMention("测试专家", "test-mode"),
				expectedCommand: "roo-code.executeTaskWithMode",
				expectedParams: {
					modeId: "test-mode",
					content: "使用测试专家模式",
				},
			},
		]
		for (const scenario of scenarios) {
			const parsed = zeroWidthEncoder_1.MentionHelper.parseMention(scenario.mention)
			let commandParams = {}
			let command = ""
			// 模拟chatStore.js中的逻辑
			if (parsed.params?.type === "task") {
				command = "roo-code.executeTask"
				commandParams.content = parsed.params.name
				if (parsed.params.id) {
					commandParams.taskId = parsed.params.id
				}
			} else if (parsed.params?.type === "agent") {
				command = "roo-code.executeTaskWithMode"
				commandParams.modeId = parsed.params.modeId
				commandParams.content = `使用${parsed.params.name}模式`
			}
			const paramsMatch = JSON.stringify(commandParams) === JSON.stringify(scenario.expectedParams)
			const commandMatch = command === scenario.expectedCommand
			if (paramsMatch && commandMatch) {
				console.log(colors.green(`  ✅ ${scenario.name}`))
				console.log(`     命令: ${command}`)
				console.log(`     参数: ${JSON.stringify(commandParams)}`)
				this.passedTests++
			} else {
				console.log(colors.red(`  ❌ ${scenario.name}`))
				console.log(`     期望命令: ${scenario.expectedCommand}`)
				console.log(`     实际命令: ${command}`)
				console.log(`     期望参数: ${JSON.stringify(scenario.expectedParams)}`)
				console.log(`     实际参数: ${JSON.stringify(commandParams)}`)
				this.failedTests++
			}
		}
	}
	/**
	 * 测试边界情况
	 */
	async testEdgeCases() {
		console.log(colors.blue("\n🔍 测试边界情况"))
		console.log("─".repeat(40))
		const edgeCases = [
			{
				name: "空文本解析",
				test: () => {
					const result = zeroWidthEncoder_1.MentionHelper.parseMention("")
					return result.params === null
				},
			},
			{
				name: "纯文本无编码",
				test: () => {
					const text = "这是普通文本@任务[测试]"
					const result = zeroWidthEncoder_1.MentionHelper.parseMention(text)
					return result.params === null && result.displayText === text
				},
			},
			{
				name: "清理零宽字符",
				test: () => {
					const mention = zeroWidthEncoder_1.MentionHelper.createTaskMention("清理测试", "clean-id")
					const cleaned = zeroWidthEncoder_1.ZeroWidthEncoder.cleanText(mention)
					return cleaned === "@任务[清理测试]"
				},
			},
			{
				name: "检测零宽参数",
				test: () => {
					const withParams = zeroWidthEncoder_1.MentionHelper.createTaskMention("测试")
					const withoutParams = "普通文本"
					return (
						zeroWidthEncoder_1.MentionHelper.hasZeroWidthParams(withParams) === true &&
						zeroWidthEncoder_1.MentionHelper.hasZeroWidthParams(withoutParams) === false
					)
				},
			},
			{
				name: "多个编码提取",
				test: () => {
					const text1 = zeroWidthEncoder_1.MentionHelper.createTaskMention("任务1", "id1")
					const text2 = zeroWidthEncoder_1.MentionHelper.createAgentMention("智能体1", "mode1")
					const combined = `开始 ${text1} 中间文本 ${text2} 结束`
					const all = zeroWidthEncoder_1.ZeroWidthEncoder.extractAllFromText(combined)
					return all.length === 2 && all[0].params.type === "task" && all[1].params.type === "agent"
				},
			},
		]
		for (const edgeCase of edgeCases) {
			try {
				const passed = edgeCase.test()
				if (passed) {
					console.log(colors.green(`  ✅ ${edgeCase.name}`))
					this.passedTests++
				} else {
					console.log(colors.red(`  ❌ ${edgeCase.name}`))
					this.failedTests++
				}
			} catch (error) {
				console.log(colors.red(`  ❌ ${edgeCase.name} - 异常: ${error}`))
				this.failedTests++
			}
		}
	}
	/**
	 * 验证参数匹配
	 */
	validateParams(actual, expected) {
		if (!actual || !expected) return actual === expected
		// 只比较expected中存在的字段
		for (const key in expected) {
			if (actual[key] !== expected[key]) {
				return false
			}
		}
		return true
	}
	/**
	 * 打印测试摘要
	 */
	printSummary() {
		console.log(colors.cyan("\n========================================"))
		console.log(colors.cyan("              测试结果摘要"))
		console.log(colors.cyan("========================================"))
		const total = this.passedTests + this.failedTests
		const passRate = total > 0 ? ((this.passedTests / total) * 100).toFixed(1) : "0"
		console.log(`  总测试数: ${total}`)
		console.log(colors.green(`  通过: ${this.passedTests}`))
		console.log(colors.red(`  失败: ${this.failedTests}`))
		console.log(`  通过率: ${passRate}%`)
		if (this.failedTests === 0) {
			console.log(colors.green("\n🎉 所有测试通过！零宽字符编码功能正常工作。"))
		} else {
			console.log(colors.yellow("\n⚠️ 部分测试失败，请检查实现。"))
		}
		console.log(colors.cyan("========================================\n"))
	}
}
exports.IntegrationTester = IntegrationTester
// 运行测试
async function main() {
	const tester = new IntegrationTester()
	await tester.runAllTests()
}
// 如果直接运行此文件
if (require.main === module) {
	main().catch(console.error)
}
