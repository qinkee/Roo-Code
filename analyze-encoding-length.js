/**
 * 分析零宽字符编码长度问题
 */

// 简化的零宽编码器
class ZeroWidthEncoder {
	static CHARS = {
		ZERO: "\u200B",
		ONE: "\u200C",
		SEPARATOR: "\u200D",
		START: "\uFEFF",
		END: "\u2060",
	}

	static encode(params) {
		const jsonStr = JSON.stringify(params)
		console.log(`  原始JSON: ${jsonStr}`)
		console.log(`  JSON长度: ${jsonStr.length} 字符`)

		// Base64编码
		const base64 = Buffer.from(jsonStr).toString("base64")
		console.log(`  Base64编码: ${base64}`)
		console.log(`  Base64长度: ${base64.length} 字符`)

		// 转换为二进制
		let binary = ""
		for (const char of base64) {
			binary += char.charCodeAt(0).toString(2).padStart(8, "0")
		}
		console.log(`  二进制长度: ${binary.length} 位`)

		// 转换为零宽字符（每个二进制位变成一个零宽字符）
		let encoded = ""
		for (const bit of binary) {
			encoded += bit === "0" ? this.CHARS.ZERO : this.CHARS.ONE
		}

		// 添加边界标记
		const result = this.CHARS.START + encoded + this.CHARS.END
		console.log(`  零宽编码长度: ${result.length} 字符`)

		return result
	}
}

console.log("=====================================")
console.log("零宽字符编码长度分析")
console.log("=====================================\n")

// 测试案例1：智能体提及
console.log("📊 案例1: 智能体提及")
console.log("-------------------------------------")
const agentParams = {
	type: "agent",
	name: "软件架构师",
	modeId: "architect",
}

const agentMention = "@智能体[软件架构师]"
const agentEncoded = ZeroWidthEncoder.encode(agentParams)
const agentTotal = agentMention + agentEncoded

console.log(`\n结果:`)
console.log(`  显示文本: "${agentMention}" (${agentMention.length} 字符)`)
console.log(`  完整文本: ${agentTotal.length} 字符`)
console.log(`  膨胀率: ${(agentTotal.length / agentMention.length).toFixed(1)}倍`)

// 测试案例2：任务提及（有ID）
console.log("\n📊 案例2: 任务提及（有ID）")
console.log("-------------------------------------")
const taskParams = {
	type: "task",
	name: "优化性能",
	id: "task-12345",
}

const taskMention = "@任务[优化性能]"
const taskEncoded = ZeroWidthEncoder.encode(taskParams)
const taskTotal = taskMention + taskEncoded

console.log(`\n结果:`)
console.log(`  显示文本: "${taskMention}" (${taskMention.length} 字符)`)
console.log(`  完整文本: ${taskTotal.length} 字符`)
console.log(`  膨胀率: ${(taskTotal.length / taskMention.length).toFixed(1)}倍`)

// 测试案例3：最小参数
console.log("\n📊 案例3: 最小参数")
console.log("-------------------------------------")
const minParams = {
	type: "task",
	name: "测试",
}

const minMention = "@任务[测试]"
const minEncoded = ZeroWidthEncoder.encode(minParams)
const minTotal = minMention + minEncoded

console.log(`\n结果:`)
console.log(`  显示文本: "${minMention}" (${minMention.length} 字符)`)
console.log(`  完整文本: ${minTotal.length} 字符`)
console.log(`  膨胀率: ${(minTotal.length / minMention.length).toFixed(1)}倍`)

// 问题分析
console.log("\n🔍 问题分析")
console.log("=====================================")
console.log("当前编码流程的膨胀原因:")
console.log("1. JSON序列化增加了引号和括号")
console.log("2. Base64编码增加约33%长度")
console.log("3. 每个Base64字符转为8位二进制")
console.log("4. 每个二进制位变成一个零宽字符")
console.log("\n膨胀计算:")
console.log("  原始参数 → JSON (×1.5~2)")
console.log("  JSON → Base64 (×1.33)")
console.log("  Base64 → 二进制零宽 (×8)")
console.log("  总膨胀: 约 ×16~20 倍！")

console.log("\n⚠️ 问题严重性:")
console.log(`  "@智能体[软件架构师] 123" 加上编码后可能达到 ${agentTotal.length + 4} 字符`)
console.log(`  已超过1024字符限制！`)

console.log("\n💡 优化建议:")
console.log("=====================================")
console.log("1. 使用更紧凑的编码:")
console.log("   - 使用URL参数格式代替JSON")
console.log("   - 使用短键名(t=task, n=name, i=id)")
console.log("   - 跳过Base64，直接编码")
console.log("\n2. 使用更多零宽字符:")
console.log("   - 使用4个零宽字符表示16进制")
console.log("   - 使用8个零宽字符表示字节")
console.log("\n3. 使用其他方案:")
console.log("   - 存储到服务器，只传ID")
console.log("   - 使用更短的自定义协议")
console.log("   - 压缩算法(如LZ-string)")
console.log("=====================================\n")
