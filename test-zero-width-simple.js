/**
 * 简单的零宽字符编码测试脚本
 */

// 模拟简化版的零宽编码器
class SimpleZeroWidthEncoder {
	static CHARS = {
		ZERO: "\u200B",
		ONE: "\u200C",
		SEPARATOR: "\u200D",
		START: "\uFEFF",
		END: "\u2060",
	}

	static encode(params) {
		try {
			const jsonStr = JSON.stringify(params)
			const base64 = Buffer.from(jsonStr).toString("base64")

			// 转换为二进制
			let binary = ""
			for (const char of base64) {
				binary += char.charCodeAt(0).toString(2).padStart(8, "0")
			}

			// 转换为零宽字符
			let encoded = ""
			for (const bit of binary) {
				encoded += bit === "0" ? this.CHARS.ZERO : this.CHARS.ONE
			}

			return this.CHARS.START + encoded + this.CHARS.END
		} catch (error) {
			console.error("编码错误:", error)
			return null
		}
	}

	static decode(text) {
		try {
			const startIdx = text.indexOf(this.CHARS.START)
			const endIdx = text.indexOf(this.CHARS.END)

			if (startIdx === -1 || endIdx === -1) return null

			const encoded = text.substring(startIdx + 1, endIdx)

			// 转换回二进制
			let binary = ""
			for (const char of encoded) {
				if (char === this.CHARS.ZERO) binary += "0"
				else if (char === this.CHARS.ONE) binary += "1"
			}

			// 转换回Base64
			let base64 = ""
			for (let i = 0; i < binary.length; i += 8) {
				const byte = binary.substr(i, 8)
				base64 += String.fromCharCode(parseInt(byte, 2))
			}

			// 解码Base64
			const jsonStr = Buffer.from(base64, "base64").toString()
			return JSON.parse(jsonStr)
		} catch (error) {
			console.error("解码错误:", error)
			return null
		}
	}

	static cleanText(text) {
		const allZeroWidth = [this.CHARS.ZERO, this.CHARS.ONE, this.CHARS.SEPARATOR, this.CHARS.START, this.CHARS.END]

		let cleaned = text
		allZeroWidth.forEach((char) => {
			cleaned = cleaned.replace(new RegExp(char, "g"), "")
		})

		return cleaned
	}
}

// 测试辅助类
class MentionHelper {
	static createTaskMention(taskName, taskId) {
		const displayText = `@任务[${taskName}]`
		const params = {
			type: "task",
			name: taskName,
		}

		if (taskId) {
			params.id = taskId
		}

		const encoded = SimpleZeroWidthEncoder.encode(params)
		return displayText + encoded
	}

	static createAgentMention(agentName, modeId) {
		const displayText = `@智能体[${agentName}]`
		const params = {
			type: "agent",
			name: agentName,
			modeId: modeId,
		}

		const encoded = SimpleZeroWidthEncoder.encode(params)
		return displayText + encoded
	}

	static parseMention(text) {
		const cleanText = SimpleZeroWidthEncoder.cleanText(text)
		const params = SimpleZeroWidthEncoder.decode(text)

		return {
			displayText: cleanText,
			params: params,
		}
	}
}

// 颜色输出
const colors = {
	green: (text) => `\x1b[32m${text}\x1b[0m`,
	red: (text) => `\x1b[31m${text}\x1b[0m`,
	yellow: (text) => `\x1b[33m${text}\x1b[0m`,
	blue: (text) => `\x1b[34m${text}\x1b[0m`,
	cyan: (text) => `\x1b[36m${text}\x1b[0m`,
}

// 运行测试
function runTests() {
	console.log(colors.cyan("\n========================================"))
	console.log(colors.cyan("     零宽字符编码测试 - Roo-Code端"))
	console.log(colors.cyan("========================================\n"))

	let passed = 0
	let failed = 0

	// 测试1: 任务提及（无ID）
	console.log(colors.blue("📋 测试任务提及"))
	console.log("─".repeat(40))

	try {
		const mention1 = MentionHelper.createTaskMention("创建登录功能")
		const parsed1 = MentionHelper.parseMention(mention1)

		if (
			parsed1.displayText === "@任务[创建登录功能]" &&
			parsed1.params?.type === "task" &&
			parsed1.params?.name === "创建登录功能" &&
			!parsed1.params?.id
		) {
			console.log(colors.green("  ✅ 新任务提及（无ID）"))
			console.log(`     显示: ${parsed1.displayText}`)
			console.log(`     参数: ${JSON.stringify(parsed1.params)}`)
			passed++
		} else {
			console.log(colors.red("  ❌ 新任务提及（无ID）"))
			failed++
		}
	} catch (error) {
		console.log(colors.red(`  ❌ 新任务提及异常: ${error.message}`))
		failed++
	}

	// 测试2: 任务提及（有ID）
	try {
		const mention2 = MentionHelper.createTaskMention("修复Bug", "task-12345")
		const parsed2 = MentionHelper.parseMention(mention2)

		if (
			parsed2.displayText === "@任务[修复Bug]" &&
			parsed2.params?.type === "task" &&
			parsed2.params?.name === "修复Bug" &&
			parsed2.params?.id === "task-12345"
		) {
			console.log(colors.green("  ✅ 继续任务提及（有ID）"))
			console.log(`     任务ID: ${parsed2.params.id}`)
			passed++
		} else {
			console.log(colors.red("  ❌ 继续任务提及（有ID）"))
			failed++
		}
	} catch (error) {
		console.log(colors.red(`  ❌ 继续任务提及异常: ${error.message}`))
		failed++
	}

	// 测试3: 智能体提及
	console.log(colors.blue("\n🤖 测试智能体提及"))
	console.log("─".repeat(40))

	try {
		const mention3 = MentionHelper.createAgentMention("代码审查助手", "code-review")
		const parsed3 = MentionHelper.parseMention(mention3)

		if (
			parsed3.displayText === "@智能体[代码审查助手]" &&
			parsed3.params?.type === "agent" &&
			parsed3.params?.name === "代码审查助手" &&
			parsed3.params?.modeId === "code-review"
		) {
			console.log(colors.green("  ✅ 智能体提及"))
			console.log(`     模式ID: ${parsed3.params.modeId}`)
			passed++
		} else {
			console.log(colors.red("  ❌ 智能体提及"))
			failed++
		}
	} catch (error) {
		console.log(colors.red(`  ❌ 智能体提及异常: ${error.message}`))
		failed++
	}

	// 测试4: 命令参数构建
	console.log(colors.blue("\n⚙️ 测试命令参数构建"))
	console.log("─".repeat(40))

	try {
		// 模拟从IM收到的任务提及
		const taskMention = MentionHelper.createTaskMention("优化性能", "task-999")
		const taskParsed = MentionHelper.parseMention(taskMention)

		// 构建VSCode命令参数
		const commandParams = {
			content: `请帮我${taskParsed.params.name}`,
		}
		if (taskParsed.params.id) {
			commandParams.taskId = taskParsed.params.id
		}

		if (commandParams.content === "请帮我优化性能" && commandParams.taskId === "task-999") {
			console.log(colors.green("  ✅ 任务命令参数"))
			console.log(`     命令: roo-code.executeTask`)
			console.log(`     参数: ${JSON.stringify(commandParams)}`)
			passed++
		} else {
			console.log(colors.red("  ❌ 任务命令参数"))
			failed++
		}
	} catch (error) {
		console.log(colors.red(`  ❌ 命令参数异常: ${error.message}`))
		failed++
	}

	// 测试5: 零宽字符不可见性
	console.log(colors.blue("\n🔍 测试零宽字符特性"))
	console.log("─".repeat(40))

	try {
		const mention = MentionHelper.createTaskMention("测试任务", "test-id")
		const cleaned = SimpleZeroWidthEncoder.cleanText(mention)

		if (cleaned === "@任务[测试任务]") {
			console.log(colors.green("  ✅ 零宽字符清理"))
			console.log(`     原始长度: ${mention.length}`)
			console.log(`     清理后: ${cleaned} (${cleaned.length}字符)`)
			passed++
		} else {
			console.log(colors.red("  ❌ 零宽字符清理"))
			failed++
		}

		// 验证零宽字符确实存在
		if (mention.length > cleaned.length) {
			console.log(colors.green("  ✅ 零宽字符隐藏验证"))
			console.log(`     隐藏数据: ${mention.length - cleaned.length} 个零宽字符`)
			passed++
		} else {
			console.log(colors.red("  ❌ 零宽字符隐藏验证"))
			failed++
		}
	} catch (error) {
		console.log(colors.red(`  ❌ 零宽字符特性异常: ${error.message}`))
		failed++
	}

	// 输出测试结果
	console.log(colors.cyan("\n========================================"))
	console.log(colors.cyan("              测试结果"))
	console.log(colors.cyan("========================================"))

	const total = passed + failed
	const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0"

	console.log(`  总测试: ${total}`)
	console.log(colors.green(`  通过: ${passed}`))
	console.log(colors.red(`  失败: ${failed}`))
	console.log(`  通过率: ${passRate}%`)

	if (failed === 0) {
		console.log(colors.green("\n🎉 所有测试通过！零宽字符编码正常工作。"))
	} else {
		console.log(colors.yellow("\n⚠️ 部分测试失败，请检查实现。"))
	}

	console.log(colors.cyan("========================================\n"))
}

// 运行测试
runTests()
