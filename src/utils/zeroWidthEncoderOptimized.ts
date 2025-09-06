/**
 * 优化的零宽字符编码器 - 大幅减少编码长度
 * 使用更紧凑的编码方案
 */

export class ZeroWidthEncoderOptimized {
	// 使用8个零宽字符表示256个值
	private static readonly CHARS = [
		"\u200B", // 0
		"\u200C", // 1
		"\u200D", // 2
		"\u2060", // 3
		"\u180E", // 4
		"\uFEFF", // 5
		"\u200E", // 6
		"\u200F", // 7
	]

	// 边界标记
	private static readonly BOUNDARY = {
		START: "\u202A", // 开始标记
		END: "\u202C", // 结束标记
	}

	/**
	 * 编码参数为零宽字符（优化版）
	 * 使用简化协议和3进制编码
	 */
	static encode(params: Record<string, any>): string {
		try {
			// 1. 使用简化协议
			const simplified = this.simplifyParams(params)

			// 2. 直接编码字符串（不使用Base64）
			const encoded = this.encodeString(simplified)

			// 3. 添加边界
			return this.BOUNDARY.START + encoded + this.BOUNDARY.END
		} catch (error) {
			console.error("优化编码错误:", error)
			throw new Error("参数编码失败")
		}
	}

	/**
	 * 解码零宽字符为参数（优化版）
	 */
	static decode(text: string): Record<string, any> | null {
		try {
			// 1. 提取编码内容
			const startIdx = text.indexOf(this.BOUNDARY.START)
			const endIdx = text.indexOf(this.BOUNDARY.END)

			if (startIdx === -1 || endIdx === -1) return null

			const encoded = text.substring(startIdx + 1, endIdx)

			// 2. 解码字符串
			const simplified = this.decodeString(encoded)

			// 3. 还原参数
			return this.expandParams(simplified)
		} catch (error) {
			console.error("优化解码错误:", error)
			return null
		}
	}

	/**
	 * 简化参数格式
	 * 使用极短的键名和值
	 */
	private static simplifyParams(params: Record<string, any>): string {
		const parts: string[] = []

		// type简化为单字符
		if (params.type === "task") {
			parts.push("T")
		} else if (params.type === "agent") {
			parts.push("A")
		}

		// name直接附加
		if (params.name) {
			parts.push(params.name)
		}

		// 使用分隔符
		if (params.id) {
			parts.push("|" + params.id)
		}

		if (params.modeId) {
			parts.push("|" + params.modeId)
		}

		return parts.join("")
	}

	/**
	 * 还原参数格式
	 */
	private static expandParams(simplified: string): Record<string, any> {
		const result: Record<string, any> = {}

		// 解析类型
		const firstChar = simplified[0]
		if (firstChar === "T") {
			result.type = "task"
		} else if (firstChar === "A") {
			result.type = "agent"
		}

		// 解析剩余部分
		const remaining = simplified.substring(1)
		const parts = remaining.split("|")

		// 第一部分总是name
		if (parts[0]) {
			result.name = parts[0]
		}

		// 第二部分根据类型判断
		if (parts[1]) {
			if (result.type === "task") {
				result.id = parts[1]
			} else if (result.type === "agent") {
				result.modeId = parts[1]
			}
		}

		return result
	}

	/**
	 * 编码字符串为零宽字符
	 * 使用3个零宽字符编码一个普通字符
	 */
	private static encodeString(str: string): string {
		let result = ""

		for (const char of str) {
			const code = char.charCodeAt(0)

			// 将字符码分解为3个8进制数字
			const oct1 = Math.floor(code / 64) % 8
			const oct2 = Math.floor(code / 8) % 8
			const oct3 = code % 8

			// 使用3个零宽字符编码
			result += this.CHARS[oct1] + this.CHARS[oct2] + this.CHARS[oct3]
		}

		return result
	}

	/**
	 * 解码零宽字符为字符串
	 */
	private static decodeString(encoded: string): string {
		let result = ""

		// 每3个零宽字符解码为一个普通字符
		for (let i = 0; i < encoded.length; i += 3) {
			const oct1 = this.CHARS.indexOf(encoded[i])
			const oct2 = this.CHARS.indexOf(encoded[i + 1])
			const oct3 = this.CHARS.indexOf(encoded[i + 2])

			if (oct1 === -1 || oct2 === -1 || oct3 === -1) continue

			const code = oct1 * 64 + oct2 * 8 + oct3
			result += String.fromCharCode(code)
		}

		return result
	}

	/**
	 * 清理文本中的零宽字符
	 */
	static cleanText(text: string): string {
		const allZeroWidth = [...this.CHARS, this.BOUNDARY.START, this.BOUNDARY.END]

		let cleaned = text
		allZeroWidth.forEach((char) => {
			cleaned = cleaned.replace(new RegExp(char, "g"), "")
		})

		return cleaned
	}

	/**
	 * 在文本中嵌入参数
	 */
	static embedInText(displayText: string, params: Record<string, any>): string {
		const encoded = this.encode(params)
		return displayText + encoded
	}

	/**
	 * 检测是否包含零宽编码
	 */
	static hasZeroWidthParams(text: string): boolean {
		return text.includes(this.BOUNDARY.START) && text.includes(this.BOUNDARY.END)
	}
}

/**
 * 优化的提及辅助工具类
 */
export class MentionHelperOptimized {
	/**
	 * 创建任务提及（优化版）
	 */
	static createTaskMention(taskName: string, taskId?: string): string {
		const displayText = `@任务[${taskName}]`

		const params: Record<string, any> = {
			type: "task",
			name: taskName,
		}

		if (taskId) {
			params.id = taskId
		}

		return ZeroWidthEncoderOptimized.embedInText(displayText, params)
	}

	/**
	 * 创建智能体提及（优化版）
	 */
	static createAgentMention(agentName: string, modeId: string): string {
		const displayText = `@智能体[${agentName}]`

		const params = {
			type: "agent",
			name: agentName,
			modeId,
		}

		return ZeroWidthEncoderOptimized.embedInText(displayText, params)
	}

	/**
	 * 解析提及文本（优化版）
	 */
	static parseMention(text: string): {
		displayText: string
		params: Record<string, any> | null
	} {
		const cleanText = ZeroWidthEncoderOptimized.cleanText(text)
		const params = ZeroWidthEncoderOptimized.decode(text)

		return {
			displayText: cleanText,
			params,
		}
	}

	/**
	 * 检测是否包含零宽编码
	 */
	static hasZeroWidthParams(text: string): boolean {
		return ZeroWidthEncoderOptimized.hasZeroWidthParams(text)
	}
}
