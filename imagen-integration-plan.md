# Google Imagen 图片生成与编辑集成方案

## 一、概述

本文档描述了将 Google Imagen 2 图片生成和编辑功能集成到 Roo-Code 扩展的技术方案。方案遵循 KISS 原则，通过智能意图识别自动区分生成、参考和编辑三种模式，提供流畅的用户体验。

## 二、核心功能

### 2.1 支持的功能模式

1. **纯文本生成（Text-to-Image）**
   - 用户提供文本描述，生成全新图片
   - 示例："画一只在月光下的猫"

2. **参考图生成（Reference-based Generation）**
   - 用户上传参考图片，生成风格相似的新图片
   - 示例：[上传图片] + "生成类似风格的狗"

3. **图片编辑（Image Editing）**
   - 用户上传图片并指定修改内容
   - 示例：[上传图片] + "把天空改成夕阳"

### 2.2 技术架构

- 使用 Google Imagen 2 REST API（不依赖 SDK）
- 复用现有 GeminiHandler 类
- 自动意图识别，无需用户手动选择模式

## 三、实现方案

### 3.1 意图识别算法

```typescript
private detectImageIntent(messages: Anthropic.Messages.MessageParam[]): 'generate' | 'edit' | 'reference' {
  const lastMessage = this.getLastUserMessage(messages)
  const hasImage = this.hasImageAttachment(lastMessage)
  const prompt = this.extractTextPrompt(lastMessage)
  
  // 编辑模式关键词
  const EDIT_PATTERNS = [
    /把(.+)改成/,
    /将(.+)替换/,
    /去掉|删除|移除/,
    /修改|编辑/,
    /change|replace|remove|edit|modify/i
  ]
  
  // 参考生成关键词
  const REFERENCE_PATTERNS = [
    /参考|参照|类似|风格/,
    /像这样|这种风格/,
    /基于.*生成/,
    /reference|style|similar|like this/i
  ]
  
  if (hasImage) {
    // 有图片时，检查是编辑还是参考
    if (EDIT_PATTERNS.some(p => p.test(prompt))) {
      return 'edit'
    }
    if (REFERENCE_PATTERNS.some(p => p.test(prompt))) {
      return 'reference'
    }
    // 默认：有图片但无明确指令，视为参考图
    return 'reference'
  }
  
  // 无图片，纯生成
  return 'generate'
}
```

### 3.2 API 调用封装

```typescript
class GeminiImageHandler {
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
  
  private async callImagenAPI(endpoint: string, payload: any) {
    return fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.apiKey
      },
      body: JSON.stringify(payload)
    })
  }
  
  // 纯文本生成
  async generateFromText(prompt: string) {
    return this.callImagenAPI('models/imagen-2:generateImage', {
      prompt,
      numberOfImages: 1,
      aspectRatio: "1:1"
    })
  }
  
  // 参考图生成
  async generateWithReference(prompt: string, referenceImage: string) {
    return this.callImagenAPI('models/imagen-2:generateImage', {
      prompt,
      referenceImage: {
        bytesBase64Encoded: referenceImage
      },
      numberOfImages: 1
    })
  }
  
  // 图片编辑
  async editWithMask(prompt: string, image: string, mask?: string) {
    const finalMask = mask || await this.generateSmartMask(image, prompt)
    
    return this.callImagenAPI('models/imagen-2:editImage', {
      image: { bytesBase64Encoded: image },
      mask: { bytesBase64Encoded: finalMask },
      prompt,
      editMode: "inpainting-insert"
    })
  }
}
```

### 3.3 主处理流程

```typescript
async *handleImageRequest(messages: Anthropic.Messages.MessageParam[]): ApiStream {
  const intent = this.detectImageIntent(messages)
  const prompt = this.extractTextPrompt(messages)
  const image = this.extractImageAttachment(messages)
  
  // 提供用户反馈
  switch(intent) {
    case 'generate':
      yield { type: "text", text: "🎨 正在生成全新图片..." }
      yield* this.generateFromText(prompt)
      break
      
    case 'reference':
      yield { type: "text", text: "🎨 正在基于参考图生成新图片..." }
      yield* this.generateWithReference(prompt, image)
      break
      
    case 'edit':
      yield { type: "text", text: "✏️ 正在编辑图片..." }
      yield* this.editWithMask(prompt, image)
      break
  }
}
```

## 四、用户体验设计

### 4.1 自动模式识别

用户无需手动选择模式，系统根据以下规则自动判断：

| 场景 | 用户输入 | 识别结果 |
|------|---------|----------|
| 纯生成 | "画一只猫" | generate |
| 参考生成 | [图片] + "生成类似风格的狗" | reference |
| 图片编辑 | [图片] + "把背景改成海滩" | edit |
| 默认情况 | [图片] + "一只狗" | reference |

### 4.2 智能遮罩处理

编辑模式下，如果用户未提供遮罩：

1. **全图编辑**：生成全白遮罩
2. **智能识别**：根据提示词自动识别编辑区域
3. **交互选择**：提供简单的区域选择工具（可选）

```typescript
function createFullMask(width: number, height: number): string {
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
  return canvas.toDataURL().split(',')[1]
}
```

### 4.3 流式输出与渐进式渲染

#### 4.3.1 技术挑战

Base64 编码的图像数据量很大：
- 1024x1024 PNG：约 1-3MB → Base64：约 1.3-4MB
- 单个 JSON 响应可能达到几 MB
- 会导致明显的等待时间和卡顿

#### 4.3.2 流式传输实现

```typescript
async *streamImageResponse(imageBase64: string): ApiStream {
  const CHUNK_SIZE = 64 * 1024 // 64KB chunks
  
  // 1. 先发送占位符
  yield {
    type: "text",
    text: "![Generating...](@image-placeholder)"
  }
  
  // 2. 分块发送 base64 数据
  let offset = 0
  const chunks: string[] = []
  
  while (offset < imageBase64.length) {
    const chunk = imageBase64.slice(offset, offset + CHUNK_SIZE)
    chunks.push(chunk)
    
    // 发送进度更新
    const progress = Math.round((offset / imageBase64.length) * 100)
    yield {
      type: "image-chunk",
      data: chunk,
      progress,
      isComplete: offset + CHUNK_SIZE >= imageBase64.length
    }
    
    offset += CHUNK_SIZE
  }
  
  // 3. 最后替换为完整图片
  const fullDataUrl = `data:image/png;base64,${imageBase64}`
  yield {
    type: "replace-placeholder",
    placeholder: "![Generating...](@image-placeholder)",
    content: `![Generated Image](${fullDataUrl})`
  }
}
```

#### 4.3.3 渐进式用户体验

```typescript
async *generateImageWithProgress(prompt: string): ApiStream {
  // 阶段 1：立即反馈（0-1秒）
  yield {
    type: "text",
    text: "🎨 正在准备生成图片...\n\n" +
          "![](data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E" +
          "%3Crect width='512' height='512' fill='%23f0f0f0'/%3E" +
          "%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3E生成中...%3C/text%3E" +
          "%3C/svg%3E)"
  }
  
  // 阶段 2：进度显示（1-5秒）
  const response = await fetch(apiUrl, { 
    method: 'POST',
    body: JSON.stringify({ prompt })
  })
  
  if (response.body) {
    const reader = response.body.getReader()
    let receivedLength = 0
    const chunks = []
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      chunks.push(value)
      receivedLength += value.length
      
      // 显示接收进度
      const progress = Math.min(95, Math.round((receivedLength / 1000000) * 100))
      yield {
        type: "progress",
        text: `⏳ 接收图片数据... ${progress}%`
      }
    }
    
    // 阶段 3：完成显示（5-10秒）
    const fullResponse = new Uint8Array(receivedLength)
    let position = 0
    for (const chunk of chunks) {
      fullResponse.set(chunk, position)
      position += chunk.length
    }
    
    const jsonResponse = JSON.parse(new TextDecoder().decode(fullResponse))
    const imageBase64 = jsonResponse.images[0].base64
    
    yield {
      type: "clear-previous"
    }
    
    yield {
      type: "text", 
      text: `![Generated Image](data:image/png;base64,${imageBase64})\n\n` +
            `✨ 图片生成完成！`
    }
  }
}
```

#### 4.3.4 前端处理器

```typescript
class ImageStreamHandler {
  private imageChunks: Map<string, string[]> = new Map()
  
  handleStreamMessage(message: any) {
    switch (message.type) {
      case 'image-chunk':
        this.handleImageChunk(message)
        break
      case 'progress':
        this.updateProgressDisplay(message.text)
        break
      case 'replace-placeholder':
        this.replacePlaceholder(message)
        break
    }
  }
  
  private handleImageChunk(message: {
    data: string,
    progress: number,
    isComplete: boolean
  }) {
    const chunks = this.imageChunks.get('current') || []
    chunks.push(message.data)
    this.imageChunks.set('current', chunks)
    
    this.updateProgressBar(message.progress)
    
    if (message.isComplete) {
      const fullBase64 = chunks.join('')
      this.displayImage(fullBase64)
      this.imageChunks.delete('current')
    }
  }
  
  private updateProgressBar(progress: number) {
    const element = document.getElementById('image-progress')
    if (element) {
      element.style.width = `${progress}%`
      element.textContent = `${progress}%`
    }
  }
}
```

### 4.4 错误处理与引导

```typescript
// 意图不明确时的处理
if (hasImage && !clearIntent) {
  yield {
    type: "text",
    text: "检测到您上传了图片。请问您想要：\n" +
          "1. 📝 编辑这张图片（修改部分内容）\n" +
          "2. 🎨 参考这张图片生成新图（保持风格）\n" +
          "请在提示词中加入'编辑'或'参考'等关键词"
  }
  return
}

// 流式传输错误处理
async *handleStreamError(error: Error): ApiStream {
  yield {
    type: "text",
    text: "❌ 图片生成失败\n\n" +
          "![](data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='200'%3E" +
          "%3Crect width='512' height='200' fill='%23ffe0e0'/%3E" +
          "%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23cc0000'%3E" +
          "生成失败：" + error.message +
          "%3C/text%3E%3C/svg%3E)"
  }
}
```

## 五、实施步骤

### 5.1 第一阶段：基础集成

1. **修改 gemini.ts**
   - 添加意图识别逻辑
   - 实现 REST API 调用
   - 处理三种模式

2. **更新模型配置**
   - 添加 imagen-2 模型定义
   - 设置正确的 modelType

3. **测试基本功能**
   - 纯文本生成
   - 错误处理

### 5.2 第二阶段：高级功能

1. **参考图生成**
   - 实现图片上传处理
   - 优化提示词

2. **图片编辑**
   - 实现智能遮罩
   - 处理编辑模式

3. **用户体验优化**
   - 添加进度提示
   - 优化错误信息

### 5.3 第三阶段：完善功能

1. **性能优化**
   - 图片压缩
   - 缓存机制
   - 流式传输优化

2. **功能扩展**
   - 批量生成
   - 历史记录

### 5.4 流式传输性能优化

#### 5.4.1 图片压缩

```typescript
async compressImage(base64: string, quality = 0.8): Promise<string> {
  const img = new Image()
  img.src = `data:image/png;base64,${base64}`
  
  await new Promise(resolve => img.onload = resolve)
  
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  
  // 转换为 JPEG 并压缩
  const compressed = canvas.toDataURL('image/jpeg', quality)
  return compressed.split(',')[1]
}
```

#### 5.4.2 缓存策略

```typescript
class ImageCache {
  private cache = new Map<string, string>()
  private maxSize = 10 // 最多缓存 10 张图片
  
  async getOrGenerate(prompt: string, generator: () => Promise<string>): Promise<string> {
    const cacheKey = this.hashPrompt(prompt)
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }
    
    const image = await generator()
    this.addToCache(cacheKey, image)
    return image
  }
  
  private addToCache(key: string, image: string) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, image)
  }
}
```

#### 5.4.3 不同场景的 UI 表现

| 场景 | 时长 | UI 表现 |
|------|------|---------|
| 快速生成 | < 3秒 | 直接显示最终图片，无进度条 |
| 正常生成 | 3-10秒 | 模糊预览 → 清晰图片，百分比进度 |
| 慢速生成 | > 10秒 | 分阶段预览，详细进度，可取消 |

## 六、配置要求

### 6.1 API 配置

```json
{
  "geminiApiKey": "your-api-key",
  "enableImageGeneration": true,
  "imageGenerationModel": "imagen-2"
}
```

### 6.2 模型定义

```typescript
"imagen-2": {
  maxTokens: 0,
  contextWindow: 0,
  supportsImages: true,
  supportsPromptCache: false,
  inputPrice: 0.02,  // per image
  outputPrice: 0,
  modelType: "image-generation",
  description: "Google's Imagen 2 text-to-image model"
}
```

## 七、使用示例

### 7.1 用户使用指南

```markdown
## 图片功能使用指南

### 生成新图片
- "画一只猫" → 生成全新图片
- "生成一幅山水画" → 创建艺术作品

### 参考图生成（垫图）
- [上传图片] + "生成类似风格的狗" → 基于参考图生成
- [上传图片] + "参考这个创建夜景版本" → 风格迁移

### 编辑现有图片
- [上传图片] + "把天空改成夕阳" → 编辑特定部分
- [上传图片] + "去掉背景的人" → 删除元素
```

### 7.2 开发者测试用例

```typescript
// 测试用例1：纯文本生成
testCase1 = {
  input: "画一只橙色的猫",
  expectedMode: "generate",
  expectedAPI: "generateImage"
}

// 测试用例2：参考图生成
testCase2 = {
  input: "[image] + 生成类似风格的狗",
  expectedMode: "reference",
  expectedAPI: "generateImage with referenceImage"
}

// 测试用例3：图片编辑
testCase3 = {
  input: "[image] + 把背景改成海滩",
  expectedMode: "edit",
  expectedAPI: "editImage"
}
```

## 八、注意事项

### 8.1 技术限制

1. Imagen 2 API 仅支持特定区域
2. 图片大小限制：最大 10MB
3. 生成时间：通常 5-15 秒

### 8.2 安全考虑

1. 内容过滤：API 自带安全过滤
2. 用户隐私：不存储用户图片
3. API 密钥：安全存储和传输

### 8.3 成本控制

- 生成图片：约 $0.02/张
- 编辑图片：约 $0.02/次
- 建议添加用量限制和提醒

## 九、未来优化

1. **批量处理**：支持一次生成多张图片
2. **高级编辑**：支持多区域编辑
3. **风格库**：预设风格模板
4. **历史管理**：保存和管理生成历史
5. **交互式编辑**：可视化遮罩绘制工具

## 十、参考资料

- [Google Imagen API 文档](https://ai.google.dev/gemini-api/docs/image-generation)
- [Roo-Code Provider 架构文档](./architecture.md)
- [Google AI Studio](https://aistudio.google.com/)

---

*文档版本：1.1.0*  
*更新日期：2025-01-16*  
*作者：Roo-Code Team*  
*更新内容：新增流式输出与渐进式渲染方案*