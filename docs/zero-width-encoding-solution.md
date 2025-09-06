# 零宽字符编码多参数传递方案

## 1. 零宽字符基础

### 1.1 可用的零宽字符

```javascript
const ZERO_WIDTH_CHARS = {
	SPACE: "\u200B", // 零宽空格 (ZWSP)
	NON_JOINER: "\u200C", // 零宽非连接符 (ZWNJ)
	JOINER: "\u200D", // 零宽连接符 (ZWJ)

	// 扩展字符（可选使用）
	LEFT_TO_RIGHT: "\u200E", // 从左到右标记
	RIGHT_TO_LEFT: "\u200F", // 从右到左标记
	WORD_JOINER: "\u2060", // 单词连接符

	// 特殊用途
	BOM: "\uFEFF", // 零宽非断空格 (BOM)
}
```

### 1.2 编码原理

使用零宽字符的组合来表示二进制位：

- `\u200B` (ZWSP) = 0
- `\u200C` (ZWNJ) = 1
- `\u200D` (ZWJ) = 分隔符

## 2. 多参数编码方案设计

### 2.1 编码格式结构

```
[开始标记][版本号][参数数量][参数1][分隔符][参数2][分隔符]...[校验和][结束标记]
```

### 2.2 完整实现

```typescript
/**
 * 零宽字符编码器 - 支持多参数传递
 */
class ZeroWidthEncoder {
	// 零宽字符定义
	private static readonly CHARS = {
		ZERO: "\u200B", // 表示 0
		ONE: "\u200C", // 表示 1
		SEPARATOR: "\u200D", // 分隔符
		START: "\uFEFF", // 开始标记
		END: "\u2060", // 结束标记
	}

	// 版本号，用于后续扩展
	private static readonly VERSION = 1

	/**
	 * 编码多个参数
	 */
	static encode(params: Record<string, any>): string {
		try {
			// 1. 序列化参数为JSON
			const jsonStr = JSON.stringify(params)

			// 2. 压缩（可选）
			const compressed = this.compress(jsonStr)

			// 3. 转换为二进制
			const binary = this.stringToBinary(compressed)

			// 4. 转换为零宽字符
			const encoded = this.binaryToZeroWidth(binary)

			// 5. 添加版本和校验
			const versioned = this.addVersionAndChecksum(encoded)

			// 6. 添加边界标记
			return this.CHARS.START + versioned + this.CHARS.END
		} catch (error) {
			console.error("Encoding error:", error)
			throw new Error("Failed to encode parameters")
		}
	}

	/**
	 * 解码参数
	 */
	static decode(text: string): Record<string, any> | null {
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
			console.error("Decoding error:", error)
			return null
		}
	}

	/**
	 * 字符串转二进制
	 */
	private static stringToBinary(str: string): string {
		return str
			.split("")
			.map((char) => char.charCodeAt(0).toString(2).padStart(16, "0"))
			.join("")
	}

	/**
	 * 二进制转字符串
	 */
	private static binaryToString(binary: string): string {
		const chunks = binary.match(/.{1,16}/g) || []
		return chunks.map((chunk) => String.fromCharCode(parseInt(chunk, 2))).join("")
	}

	/**
	 * 二进制转零宽字符
	 */
	private static binaryToZeroWidth(binary: string): string {
		return binary
			.split("")
			.map((bit) => (bit === "0" ? this.CHARS.ZERO : this.CHARS.ONE))
			.join("")
	}

	/**
	 * 零宽字符转二进制
	 */
	private static zeroWidthToBinary(zeroWidth: string): string {
		return zeroWidth
			.split("")
			.map((char) => {
				if (char === this.CHARS.ZERO) return "0"
				if (char === this.CHARS.ONE) return "1"
				return ""
			})
			.join("")
	}

	/**
	 * 简单压缩（使用Base64减少数据量）
	 */
	private static compress(str: string): string {
		// 转换为Base64以减少二进制长度
		return btoa(encodeURIComponent(str))
	}

	/**
	 * 解压缩
	 */
	private static decompress(str: string): string {
		return decodeURIComponent(atob(str))
	}

	/**
	 * 添加版本号和校验和
	 */
	private static addVersionAndChecksum(encoded: string): string {
		// 版本号（4位）
		const versionBinary = this.VERSION.toString(2).padStart(4, "0")
		const versionZW = this.binaryToZeroWidth(versionBinary)

		// 计算简单校验和（使用字符串长度，8位）
		const checksum = encoded.length % 256
		const checksumBinary = checksum.toString(2).padStart(8, "0")
		const checksumZW = this.binaryToZeroWidth(checksumBinary)

		return versionZW + this.CHARS.SEPARATOR + encoded + this.CHARS.SEPARATOR + checksumZW
	}

	/**
	 * 验证版本和校验和
	 */
	private static validateAndExtract(content: string): string | null {
		const parts = content.split(this.CHARS.SEPARATOR)
		if (parts.length !== 3) return null

		const [versionZW, data, checksumZW] = parts

		// 验证版本
		const version = parseInt(this.zeroWidthToBinary(versionZW), 2)
		if (version !== this.VERSION) {
			console.warn("Version mismatch:", version)
			return null
		}

		// 验证校验和
		const checksum = parseInt(this.zeroWidthToBinary(checksumZW), 2)
		const expectedChecksum = data.length % 256
		if (checksum !== expectedChecksum) {
			console.warn("Checksum mismatch")
			return null
		}

		return data
	}

	/**
	 * 从文本中提取零宽字符内容
	 */
	private static extractZeroWidthContent(text: string): string | null {
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
	static cleanText(text: string): string {
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
}

/**
 * 高级编码器 - 支持更复杂的数据结构
 */
class AdvancedZeroWidthEncoder extends ZeroWidthEncoder {
	/**
	 * 编码提及参数
	 */
	static encodeMention(type: string, params: any): string {
		const data = {
			_type: "mention",
			_version: 1,
			type,
			params,
			_timestamp: Date.now(),
		}

		return this.encode(data)
	}

	/**
	 * 解码提及参数
	 */
	static decodeMention(text: string): { type: string; params: any } | null {
		const decoded = this.decode(text)
		if (!decoded || decoded._type !== "mention") {
			return null
		}

		return {
			type: decoded.type,
			params: decoded.params,
		}
	}

	/**
	 * 在文本中嵌入参数
	 */
	static embedInText(displayText: string, params: Record<string, any>): string {
		const encoded = this.encode(params)
		// 将编码插入到显示文本后面（不可见）
		return displayText + encoded
	}

	/**
	 * 从文本中提取所有参数
	 */
	static extractAllFromText(text: string): Array<{
		position: number
		params: Record<string, any>
	}> {
		const results: Array<{ position: number; params: Record<string, any> }> = []
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

/**
 * 实用工具类
 */
class MentionHelper {
	/**
	 * 创建带参数的任务提及
	 */
	static createTaskMention(taskName: string, taskId: string, metadata: any = {}): string {
		const displayText = `@任务[${taskName}]`
		const params = {
			type: "task",
			id: taskId,
			name: taskName,
			metadata,
		}

		return AdvancedZeroWidthEncoder.embedInText(displayText, params)
	}

	/**
	 * 创建带参数的智能体提及
	 */
	static createAgentMention(agentName: string, modeId: string, config: any = {}): string {
		const displayText = `@智能体[${agentName}]`
		const params = {
			type: "agent",
			modeId,
			name: agentName,
			config,
		}

		return AdvancedZeroWidthEncoder.embedInText(displayText, params)
	}

	/**
	 * 解析提及文本
	 */
	static parseMention(text: string): {
		displayText: string
		params: Record<string, any> | null
	} {
		const cleanText = AdvancedZeroWidthEncoder.cleanText(text)
		const allParams = AdvancedZeroWidthEncoder.extractAllFromText(text)

		return {
			displayText: cleanText,
			params: allParams.length > 0 ? allParams[0].params : null,
		}
	}
}
```

## 3. 使用示例

### 3.1 在IM系统中使用

```javascript
// ChatInput.vue - 插入提及时
insertMention(item) {
  let mentionText;

  if (item.type === 'task') {
    // 创建带完整参数的任务提及
    mentionText = MentionHelper.createTaskMention(
      item.name,
      item.id,
      {
        status: item.status,
        context: item.context,
        createdAt: item.createdAt,
        // 可以传递任意复杂数据
        history: item.history,
        permissions: item.permissions
      }
    );
  } else if (item.type === 'agent') {
    // 创建带配置的智能体提及
    mentionText = MentionHelper.createAgentMention(
      item.name,
      item.modeId,
      {
        prompt: item.prompt,
        temperature: item.temperature,
        maxTokens: item.maxTokens,
        capabilities: item.capabilities
      }
    );
  }

  // 插入到编辑器
  this.insertAtCursor(mentionText);
}

// chatStore.js - 处理消息时
handleRooCodeMentions(text) {
  // 提取所有嵌入的参数
  const mentions = AdvancedZeroWidthEncoder.extractAllFromText(text);

  for (const mention of mentions) {
    const { params } = mention;

    if (params.type === 'task') {
      // 使用完整的任务参数
      commandService.executeCommand('roo-cline.executeTask', {
        taskId: params.id,
        content: text,
        metadata: params.metadata
      });
    } else if (params.type === 'agent') {
      // 使用完整的智能体配置
      commandService.executeCommand('roo-cline.executeTaskWithMode', {
        modeId: params.modeId,
        content: text,
        config: params.config
      });
    }
  }
}
```

### 3.2 复制粘贴支持

```javascript
// 处理粘贴事件
handlePaste(event) {
  const pastedText = event.clipboardData.getData('text/plain');

  // 检查是否包含零宽编码
  const mentions = AdvancedZeroWidthEncoder.extractAllFromText(pastedText);

  if (mentions.length > 0) {
    // 保留参数
    console.log('粘贴的文本包含提及参数:', mentions);
    // 参数会自动随文本一起粘贴
  }
}

// 处理复制事件
handleCopy(event) {
  const selection = window.getSelection().toString();
  // 零宽字符会自动包含在选择的文本中
  event.clipboardData.setData('text/plain', selection);
}
```

## 4. 优化和性能

### 4.1 数据压缩

```javascript
class CompressedEncoder extends AdvancedZeroWidthEncoder {
  /**
   * 使用更高效的压缩算法
   */
  static compress(str: string): string {
    // 使用 LZ-string 或其他压缩库
    return LZString.compressToBase64(str);
  }

  static decompress(str: string): string {
    return LZString.decompressFromBase64(str);
  }

  /**
   * 智能压缩 - 根据数据大小决定是否压缩
   */
  static smartEncode(params: Record<string, any>): string {
    const jsonStr = JSON.stringify(params);

    // 小于100字符不压缩
    if (jsonStr.length < 100) {
      return this.encode(params);
    }

    // 大数据使用压缩
    return this.encode({
      _compressed: true,
      data: this.compress(jsonStr)
    });
  }
}
```

### 4.2 缓存机制

```javascript
class CachedEncoder extends AdvancedZeroWidthEncoder {
  private static cache = new Map<string, any>();
  private static reverseCache = new Map<string, string>();

  static encode(params: Record<string, any>): string {
    const key = JSON.stringify(params);

    // 检查缓存
    if (this.reverseCache.has(key)) {
      return this.reverseCache.get(key)!;
    }

    const encoded = super.encode(params);

    // 缓存结果
    this.cache.set(encoded, params);
    this.reverseCache.set(key, encoded);

    // 限制缓存大小
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    return encoded;
  }

  static decode(text: string): Record<string, any> | null {
    // 先检查缓存
    const cached = this.cache.get(text);
    if (cached) {
      return cached;
    }

    return super.decode(text);
  }
}
```

## 5. 安全性考虑

### 5.1 防止注入攻击

```javascript
class SecureEncoder extends AdvancedZeroWidthEncoder {
  /**
   * 验证参数安全性
   */
  static validateParams(params: any): boolean {
    // 检查参数大小
    const jsonStr = JSON.stringify(params);
    if (jsonStr.length > 10000) {
      console.warn('Parameters too large');
      return false;
    }

    // 检查嵌套深度
    if (this.getDepth(params) > 10) {
      console.warn('Parameters too deeply nested');
      return false;
    }

    return true;
  }

  static encode(params: Record<string, any>): string {
    if (!this.validateParams(params)) {
      throw new Error('Invalid parameters');
    }

    // 添加签名防篡改
    const signature = this.generateSignature(params);
    const signed = { ...params, _signature: signature };

    return super.encode(signed);
  }

  static decode(text: string): Record<string, any> | null {
    const decoded = super.decode(text);
    if (!decoded) return null;

    // 验证签名
    const { _signature, ...params } = decoded;
    const expectedSignature = this.generateSignature(params);

    if (_signature !== expectedSignature) {
      console.warn('Signature mismatch - data may be tampered');
      return null;
    }

    return params;
  }

  private static generateSignature(params: any): string {
    // 简单的签名实现（实际应用中使用更安全的方法）
    const str = JSON.stringify(params);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private static getDepth(obj: any, depth = 0): number {
    if (typeof obj !== 'object' || obj === null) return depth;

    let maxDepth = depth;
    for (const key in obj) {
      const d = this.getDepth(obj[key], depth + 1);
      if (d > maxDepth) maxDepth = d;
    }

    return maxDepth;
  }
}
```

## 6. 兼容性处理

### 6.1 降级方案

```javascript
class CompatibleMentionHelper {
  /**
   * 创建兼容的提及文本
   */
  static createMention(type: string, name: string, id: string, params: any = {}): string {
    // 尝试使用零宽编码
    try {
      if (this.supportsZeroWidth()) {
        return AdvancedZeroWidthEncoder.embedInText(
          `@${type}[${name}]`,
          { type, id, name, ...params }
        );
      }
    } catch (error) {
      console.warn('Zero-width encoding failed, falling back', error);
    }

    // 降级到文本格式
    return `@${type}[${name}:${id}]`;
  }

  /**
   * 解析提及（支持多种格式）
   */
  static parseMention(text: string): any {
    // 先尝试零宽解码
    const zeroWidthParams = AdvancedZeroWidthEncoder.extractAllFromText(text);
    if (zeroWidthParams.length > 0) {
      return zeroWidthParams[0].params;
    }

    // 降级到文本解析
    const textPattern = /@(\w+)\[([^:\]]+)(?::([^\]]+))?\]/;
    const match = text.match(textPattern);
    if (match) {
      return {
        type: match[1],
        name: match[2],
        id: match[3] || undefined
      };
    }

    return null;
  }

  /**
   * 检测零宽字符支持
   */
  private static supportsZeroWidth(): boolean {
    // 检测环境是否支持零宽字符
    try {
      const test = '\u200B\u200C\u200D';
      const encoded = btoa(test);
      const decoded = atob(encoded);
      return decoded === test;
    } catch {
      return false;
    }
  }
}
```

## 7. 测试用例

```javascript
// 测试基本编码解码
describe("ZeroWidthEncoder", () => {
	test("基本编码解码", () => {
		const params = {
			id: "task-123",
			name: "优化代码",
			status: "active",
		}

		const encoded = ZeroWidthEncoder.encode(params)
		const decoded = ZeroWidthEncoder.decode(encoded)

		expect(decoded).toEqual(params)
	})

	test("复杂数据结构", () => {
		const params = {
			task: {
				id: "task-456",
				context: {
					history: ["step1", "step2"],
					metadata: {
						created: Date.now(),
						tags: ["urgent", "backend"],
					},
				},
			},
		}

		const encoded = ZeroWidthEncoder.encode(params)
		const decoded = ZeroWidthEncoder.decode(encoded)

		expect(decoded).toEqual(params)
	})

	test("嵌入文本", () => {
		const displayText = "@任务[测试任务]"
		const params = { id: "789", priority: "high" }

		const embedded = AdvancedZeroWidthEncoder.embedInText(displayText, params)

		// 清理后应该只有显示文本
		const cleaned = AdvancedZeroWidthEncoder.cleanText(embedded)
		expect(cleaned).toBe(displayText)

		// 应该能提取参数
		const extracted = AdvancedZeroWidthEncoder.extractAllFromText(embedded)
		expect(extracted[0].params).toEqual(params)
	})

	test("中文支持", () => {
		const params = {
			name: "中文测试",
			description: "这是一个包含中文的测试",
		}

		const encoded = ZeroWidthEncoder.encode(params)
		const decoded = ZeroWidthEncoder.decode(encoded)

		expect(decoded).toEqual(params)
	})

	test("大数据量", () => {
		const params = {
			largeArray: new Array(100).fill(0).map((_, i) => ({
				id: i,
				data: `item-${i}`,
			})),
		}

		const encoded = CompressedEncoder.smartEncode(params)
		const decoded = CompressedEncoder.decode(encoded)

		expect(decoded).toEqual(params)
	})
})
```

## 8. 总结

### 优势

1. **完全隐形**：零宽字符不影响显示
2. **数据完整**：可传递任意复杂的JSON数据
3. **复制粘贴友好**：参数随文本自动传递
4. **向后兼容**：可降级到文本格式

### 注意事项

1. **数据大小**：大量参数会产生很长的零宽字符串
2. **性能影响**：编解码需要计算资源
3. **调试困难**：零宽字符不可见，需要专门工具
4. **兼容性**：某些环境可能过滤零宽字符

### 最佳实践

1. 使用压缩减少数据量
2. 添加缓存提升性能
3. 实现降级方案确保兼容性
4. 限制参数大小防止滥用
5. 添加签名防止篡改
