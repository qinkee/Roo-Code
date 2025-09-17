/* eslint-disable */
"use strict"
/**
 * 零宽字符编码器 - TypeScript版本
 * 支持在文本中隐形传递复杂参数
 */
Object.defineProperty(exports, "__esModule", { value: true })
exports.MentionHelper = exports.ZeroWidthEncoder = void 0
class ZeroWidthEncoder {
	/**
	 * 编码参数为零宽字符
	 */
	static encode(params) {
		try {
			// 1. 序列化参数为JSON
			const jsonStr = JSON.stringify(params)
			// 2. 压缩（使用Base64减少数据量）
			const compressed = this.compress(jsonStr)
			// 3. 转换为二进制
			const binary = this.stringToBinary(compressed)
			// 4. 转换为零宽字符
			const encoded = this.binaryToZeroWidth(binary)
			// 5. 添加版本和校验和
			const versioned = this.addVersionAndChecksum(encoded)
			// 6. 添加边界标记
			return this.CHARS.START + versioned + this.CHARS.END
		} catch (error) {
			console.error("零宽编码错误:", error)
			throw new Error("参数编码失败")
		}
	}
	/**
	 * 解码零宽字符为参数
	 */
	static decode(text) {
		try {
			// 1. 提取零宽字符内容
			const extracted = this.extractZeroWidthContent(text)
			if (!extracted) return null
			// 2. 验证版本和校验和
			const validated = this.validateAndExtract(extracted)
			if (!validated) return null
			// 3. 转换回二进制
			const binary = this.zeroWidthToBinary(validated)
			// 4. 转换回字符串
			const compressed = this.binaryToString(binary)
			// 5. 解压缩
			const jsonStr = this.decompress(compressed)
			// 6. 解析JSON
			return JSON.parse(jsonStr)
		} catch (error) {
			console.error("零宽解码错误:", error)
			return null
		}
	}
	static stringToBinary(str) {
		return str
			.split("")
			.map((char) => char.charCodeAt(0).toString(2).padStart(16, "0"))
			.join("")
	}
	static binaryToString(binary) {
		const chunks = binary.match(/.{1,16}/g) || []
		return chunks.map((chunk) => String.fromCharCode(parseInt(chunk, 2))).join("")
	}
	static binaryToZeroWidth(binary) {
		return binary
			.split("")
			.map((bit) => (bit === "0" ? this.CHARS.ZERO : this.CHARS.ONE))
			.join("")
	}
	static zeroWidthToBinary(zeroWidth) {
		return zeroWidth
			.split("")
			.map((char) => {
				if (char === this.CHARS.ZERO) return "0"
				if (char === this.CHARS.ONE) return "1"
				return ""
			})
			.join("")
	}
	static compress(str) {
		// Node.js环境下的Base64编码
		return Buffer.from(str, "utf-8").toString("base64")
	}
	static decompress(str) {
		// Node.js环境下的Base64解码
		return Buffer.from(str, "base64").toString("utf-8")
	}
	static addVersionAndChecksum(encoded) {
		// 版本号（4位二进制）
		const versionBinary = this.VERSION.toString(2).padStart(4, "0")
		const versionZW = this.binaryToZeroWidth(versionBinary)
		// 计算简单校验和（使用字符串长度，8位）
		const checksum = encoded.length % 256
		const checksumBinary = checksum.toString(2).padStart(8, "0")
		const checksumZW = this.binaryToZeroWidth(checksumBinary)
		return versionZW + this.CHARS.SEPARATOR + encoded + this.CHARS.SEPARATOR + checksumZW
	}
	static validateAndExtract(content) {
		const parts = content.split(this.CHARS.SEPARATOR)
		if (parts.length !== 3) return null
		const [versionZW, data, checksumZW] = parts
		// 验证版本
		const version = parseInt(this.zeroWidthToBinary(versionZW), 2)
		if (version !== this.VERSION) {
			console.warn("版本不匹配:", version)
			return null
		}
		// 验证校验和
		const checksum = parseInt(this.zeroWidthToBinary(checksumZW), 2)
		const expectedChecksum = data.length % 256
		if (checksum !== expectedChecksum) {
			console.warn("校验和不匹配")
			return null
		}
		return data
	}
	static extractZeroWidthContent(text) {
		const startIdx = text.indexOf(this.CHARS.START)
		const endIdx = text.indexOf(this.CHARS.END)
		if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
			return null
		}
		return text.substring(startIdx + 1, endIdx)
	}
	/**
	 * 清理文本中的零宽字符（用于显示）
	 */
	static cleanText(text) {
		const allZeroWidth = [
			this.CHARS.ZERO,
			this.CHARS.ONE,
			this.CHARS.SEPARATOR,
			this.CHARS.START,
			this.CHARS.END,
			"\u200E",
			"\u200F",
			"\uFEFF",
			"\u2060",
		]
		let cleaned = text
		allZeroWidth.forEach((char) => {
			cleaned = cleaned.replace(new RegExp(char, "g"), "")
		})
		return cleaned
	}
	/**
	 * 在文本中嵌入参数（不可见）
	 */
	static embedInText(displayText, params) {
		const encoded = this.encode(params)
		return displayText + encoded
	}
	/**
	 * 从文本中提取所有编码的参数
	 */
	static extractAllFromText(text) {
		const results = []
		const regex = new RegExp(`${this.CHARS.START}[^${this.CHARS.END}]+${this.CHARS.END}`, "g")
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
exports.ZeroWidthEncoder = ZeroWidthEncoder
// 零宽字符定义
ZeroWidthEncoder.CHARS = {
	ZERO: "\u200B", // 零宽空格 - 表示0
	ONE: "\u200C", // 零宽非连接符 - 表示1
	SEPARATOR: "\u200D", // 零宽连接符 - 分隔符
	START: "\uFEFF", // 零宽非断空格 - 开始标记
	END: "\u2060", // 单词连接符 - 结束标记
}
// 版本号
ZeroWidthEncoder.VERSION = 1
/**
 * 提及辅助工具类
 */
class MentionHelper {
	/**
	 * 创建带参数的任务提及
	 * @param taskName - 任务名称
	 * @param taskId - 任务ID（可选）
	 * @param metadata - 额外元数据（可选，后续扩展用）
	 */
	static createTaskMention(taskName, taskId, metadata = {}) {
		const displayText = `@任务[${taskName}]`
		// 只传递必要参数
		const params = {
			type: "task",
			name: taskName,
		}
		// 只有存在taskId时才添加
		if (taskId) {
			params.id = taskId
		}
		// 只有存在额外元数据时才添加
		if (metadata && Object.keys(metadata).length > 0) {
			params.metadata = metadata
		}
		return ZeroWidthEncoder.embedInText(displayText, params)
	}
	/**
	 * 创建带参数的智能体提及
	 * @param agentName - 智能体名称
	 * @param modeId - 模式ID
	 * @param config - 额外配置（可选，后续扩展用）
	 */
	static createAgentMention(agentName, modeId, config = {}) {
		const displayText = `@智能体[${agentName}]`
		// 只传递必要参数
		const params = {
			type: "agent",
			name: agentName,
			modeId,
		}
		// 只有存在额外配置时才添加
		if (config && Object.keys(config).length > 0) {
			params.config = config
		}
		return ZeroWidthEncoder.embedInText(displayText, params)
	}
	/**
	 * 解析提及文本
	 */
	static parseMention(text) {
		const cleanText = ZeroWidthEncoder.cleanText(text)
		const allParams = ZeroWidthEncoder.extractAllFromText(text)
		return {
			displayText: cleanText,
			params: allParams.length > 0 ? allParams[0].params : null,
		}
	}
	/**
	 * 检测是否包含零宽编码
	 */
	static hasZeroWidthParams(text) {
		return ZeroWidthEncoder.extractAllFromText(text).length > 0
	}
}
exports.MentionHelper = MentionHelper
