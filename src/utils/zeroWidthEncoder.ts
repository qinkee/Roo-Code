/**
 * 最终优化版零宽字符编码器 - TypeScript版本
 * 使用UTF-8字节编码，确保中文支持
 */

export class ZeroWidthEncoder {
	// 使用16个零宽字符表示16个值（0-F）
	private static readonly CHARS = [
		"\u200B",
		"\u200C",
		"\u200D",
		"\u2060", // 0-3
		"\u180E",
		"\uFEFF",
		"\u200E",
		"\u200F", // 4-7
		"\u202A",
		"\u202B",
		"\u202C",
		"\u202D", // 8-B
		"\u202E",
		"\u2061",
		"\u2062",
		"\u2063", // C-F
	]

	// 边界标记
	private static readonly BOUNDARY = {
		START: "\u2066", // 开始
		END: "\u2067", // 结束
	}

	/**
	 * 编码参数为零宽字符
	 */
	static encode(params: Record<string, any>): string {
		try {
			// 简化协议
			let data = ""

			if (params.type === "task") {
				data = "T"
			} else if (params.type === "agent") {
				data = "A"
			}

			if (params.name) {
				data += ":" + params.name
			}

			if (params.id) {
				data += "|" + params.id
			} else if (params.modeId) {
				data += "|" + params.modeId
			}

			// 转为UTF-8字节
			const bytes = this.stringToBytes(data)

			// 每个字节用2个零宽字符表示（16进制）
			let encoded = ""
			for (const byte of bytes) {
				const high = Math.floor(byte / 16)
				const low = byte % 16
				encoded += this.CHARS[high] + this.CHARS[low]
			}

			return this.BOUNDARY.START + encoded + this.BOUNDARY.END
		} catch (error) {
			console.error("编码错误:", error)
			return ""
		}
	}

	/**
	 * 解码零宽字符为参数
	 */
	static decode(text: string): Record<string, any> | null {
		try {
			const startIdx = text.indexOf(this.BOUNDARY.START)
			const endIdx = text.indexOf(this.BOUNDARY.END)

			if (startIdx === -1 || endIdx === -1) return null

			const encoded = text.substring(startIdx + 1, endIdx)

			// 每2个零宽字符解码为一个字节
			const bytes: number[] = []
			for (let i = 0; i < encoded.length; i += 2) {
				if (i + 1 >= encoded.length) break

				const highIdx = this.CHARS.indexOf(encoded[i])
				const lowIdx = this.CHARS.indexOf(encoded[i + 1])

				if (highIdx === -1 || lowIdx === -1) continue

				bytes.push(highIdx * 16 + lowIdx)
			}

			// 字节转字符串
			const data = this.bytesToString(bytes)

			// 解析协议
			const parts = data.split(/[:|]/)
			const result: Record<string, any> = {}

			if (parts[0] === "T") {
				result.type = "task"
			} else if (parts[0] === "A") {
				result.type = "agent"
			}

			if (parts[1]) {
				result.name = parts[1]
			}

			if (parts[2]) {
				if (result.type === "task") {
					result.id = parts[2]
				} else if (result.type === "agent") {
					result.modeId = parts[2]
				}
			}

			return result
		} catch (error) {
			console.error("解码错误:", error)
			return null
		}
	}

	/**
	 * 字符串转UTF-8字节数组
	 */
	private static stringToBytes(str: string): number[] {
		const bytes: number[] = []
		for (let i = 0; i < str.length; i++) {
			const code = str.charCodeAt(i)

			if (code < 0x80) {
				// 1字节
				bytes.push(code)
			} else if (code < 0x800) {
				// 2字节
				bytes.push(0xc0 | (code >> 6))
				bytes.push(0x80 | (code & 0x3f))
			} else if (code < 0x10000) {
				// 3字节
				bytes.push(0xe0 | (code >> 12))
				bytes.push(0x80 | ((code >> 6) & 0x3f))
				bytes.push(0x80 | (code & 0x3f))
			} else {
				// 4字节
				bytes.push(0xf0 | (code >> 18))
				bytes.push(0x80 | ((code >> 12) & 0x3f))
				bytes.push(0x80 | ((code >> 6) & 0x3f))
				bytes.push(0x80 | (code & 0x3f))
			}
		}
		return bytes
	}

	/**
	 * UTF-8字节数组转字符串
	 */
	private static bytesToString(bytes: number[]): string {
		let str = ""
		let i = 0

		while (i < bytes.length) {
			const byte1 = bytes[i]

			if ((byte1 & 0x80) === 0) {
				// 1字节字符
				str += String.fromCharCode(byte1)
				i++
			} else if ((byte1 & 0xe0) === 0xc0) {
				// 2字节字符
				if (i + 1 < bytes.length) {
					const byte2 = bytes[i + 1]
					const code = ((byte1 & 0x1f) << 6) | (byte2 & 0x3f)
					str += String.fromCharCode(code)
				}
				i += 2
			} else if ((byte1 & 0xf0) === 0xe0) {
				// 3字节字符
				if (i + 2 < bytes.length) {
					const byte2 = bytes[i + 1]
					const byte3 = bytes[i + 2]
					const code = ((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f)
					str += String.fromCharCode(code)
				}
				i += 3
			} else if ((byte1 & 0xf8) === 0xf0) {
				// 4字节字符
				if (i + 3 < bytes.length) {
					const byte2 = bytes[i + 1]
					const byte3 = bytes[i + 2]
					const byte4 = bytes[i + 3]
					const code =
						((byte1 & 0x07) << 18) | ((byte2 & 0x3f) << 12) | ((byte3 & 0x3f) << 6) | (byte4 & 0x3f)
					str += String.fromCharCode(code)
				}
				i += 4
			} else {
				i++
			}
		}

		return str
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
	 * 从文本中提取所有编码的参数
	 */
	static extractAllFromText(text: string): Array<{
		position: number
		params: Record<string, any>
	}> {
		const results: Array<{ position: number; params: Record<string, any> }> = []
		const regex = new RegExp(`${this.BOUNDARY.START}[^${this.BOUNDARY.END}]+${this.BOUNDARY.END}`, "g")

		let match
		while ((match = regex.exec(text)) !== null) {
			const params = this.decode(match[0])
			if (params) {
				results.push({
					position: match.index,
					params,
				})
			}
		}

		return results
	}
}

/**
 * 提及参数接口
 */
export interface MentionParams {
	type: "task" | "agent"
	id?: string
	name: string
	metadata?: Record<string, any>
	modeId?: string
	config?: Record<string, any>
}

/**
 * 提及辅助工具类
 */
export class MentionHelper {
	/**
	 * 创建带参数的任务提及
	 */
	static createTaskMention(taskName: string, taskId?: string, metadata: Record<string, any> = {}): string {
		const displayText = `@任务[${taskName}]`

		const params: MentionParams = {
			type: "task",
			name: taskName,
		}

		if (taskId) {
			params.id = taskId
		}

		if (metadata && Object.keys(metadata).length > 0) {
			params.metadata = metadata
		}

		return ZeroWidthEncoder.embedInText(displayText, params)
	}

	/**
	 * 创建带参数的智能体提及
	 */
	static createAgentMention(agentName: string, modeId: string, config: Record<string, any> = {}): string {
		const displayText = `@智能体[${agentName}]`

		const params: MentionParams = {
			type: "agent",
			name: agentName,
			modeId,
		}

		if (config && Object.keys(config).length > 0) {
			params.config = config
		}

		return ZeroWidthEncoder.embedInText(displayText, params)
	}

	/**
	 * 解析提及文本
	 */
	static parseMention(text: string): {
		displayText: string
		params: MentionParams | null
	} {
		const cleanText = ZeroWidthEncoder.cleanText(text)
		const allParams = ZeroWidthEncoder.extractAllFromText(text)

		return {
			displayText: cleanText,
			params: allParams.length > 0 ? (allParams[0].params as MentionParams) : null,
		}
	}

	/**
	 * 检测是否包含零宽编码
	 */
	static hasZeroWidthParams(text: string): boolean {
		return ZeroWidthEncoder.extractAllFromText(text).length > 0
	}
}
