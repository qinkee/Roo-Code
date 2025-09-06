# @提及系统参数传递方案分析

## 1. 现有系统分析

### 1.1 IM 系统中的 @提及实现

#### 当前实现

```javascript
// RooCodeAtPanel.vue - 选择项目后的回调
selectItem(item) {
  const result = {
    type: this.selectedCategory,  // 'members' | 'tasks' | 'agents'
    item: item,                   // 完整的项目对象
    displayText: displayText       // 显示文本，如 "@任务[任务名]"
  };
  this.callback(result);
}

// chatStore.js - 消息处理
handleRooCodeMentions(text) {
  // 只能从文本中解析：
  // @任务[任务名] 或 @任务[任务名:任务ID]
  // @智能体[智能体名称]
  const taskPattern = /@任务\[([^\]]+)\]/g;
  const [taskName, taskId] = taskInfo.split(':');
}
```

**问题**：

1. UI选择时有完整的 `item` 对象（包含id、name、description等）
2. 但插入到编辑器时只保留了 `displayText`
3. 发送消息时只能从文本解析，丢失了元数据

### 1.2 Roo-Code 中的 @提及实现

#### 当前实现

```typescript
// mentions/index.ts - 解析提及
parseMentions(text: string) {
  // 支持多种格式：
  // @/path/to/file - 文件路径
  // @problems - 工作区问题
  // @git-changes - Git 更改
  // @terminal - 终端输出
  // @联系人:id:name - IM联系人
  // @知识库:id:name - 知识库

  // 只能从文本中解析参数
  if (mention.startsWith("联系人:")) {
    const parts = contactInfo.split(":");
    const contactId = parts[0];
    const contactName = parts.slice(1).join(":");
  }
}
```

**问题**：

1. 参数通过文本格式传递（使用冒号分隔）
2. 复杂参数难以表达
3. 解析容易出错（如名称中包含冒号）

## 2. 核心问题分析

### 2.1 参数传递链路断裂

```
用户选择 → UI组件(有完整数据) → 编辑器(只有文本) → 发送处理(需要重新解析)
           ↓                      ↓                    ↓
       item对象              displayText           丢失元数据
```

### 2.2 需要传递的参数类型

#### 任务相关

- `taskId`: 任务唯一标识
- `taskName`: 任务名称
- `taskStatus`: 任务状态
- `taskContext`: 任务上下文（历史记录等）
- `taskMetadata`: 额外元数据

#### 智能体相关

- `agentId/modeId`: 智能体/模式标识
- `agentName`: 智能体名称
- `agentConfig`: 智能体配置
- `agentPrompt`: 预设提示词
- `agentCapabilities`: 能力列表

#### IM联系人相关

- `contactId`: 联系人ID
- `contactName`: 联系人名称
- `contactType`: 联系人类型（用户/群组）
- `contactStatus`: 在线状态
- `contactPermissions`: 权限信息

## 3. 解决方案设计

### 方案A: 富文本数据属性方案

在编辑器中保留元数据，通过 data 属性传递：

```html
<!-- 编辑器中的渲染 -->
<span class="mention" data-type="task" data-id="task-123" data-metadata='{"status":"active","context":"..."}'>
	@任务[优化代码]
</span>
```

```javascript
// 发送时提取
function extractMentions(editorContent) {
	const mentions = []
	const mentionElements = editorContent.querySelectorAll(".mention")

	mentionElements.forEach((el) => {
		mentions.push({
			type: el.dataset.type,
			id: el.dataset.id,
			text: el.innerText,
			metadata: JSON.parse(el.dataset.metadata || "{}"),
		})
	})

	return mentions
}
```

**优点**：

- 保留完整元数据
- 不影响显示文本
- 支持复杂数据结构

**缺点**：

- 需要修改编辑器实现
- 复制粘贴可能丢失属性
- 需要处理XSS风险

### 方案B: 隐藏标记方案

在文本中嵌入不可见的标记来传递参数：

```javascript
// 使用零宽字符编码参数
const ZERO_WIDTH_SPACE = "\u200B"
const ZERO_WIDTH_NON_JOINER = "\u200C"
const ZERO_WIDTH_JOINER = "\u200D"

function encodeMention(display, params) {
	const encoded = encodeParams(params)
	return `${display}${ZERO_WIDTH_SPACE}${encoded}${ZERO_WIDTH_SPACE}`
}

function decodeMention(text) {
	const pattern = new RegExp(`${ZERO_WIDTH_SPACE}([^${ZERO_WIDTH_SPACE}]+)${ZERO_WIDTH_SPACE}`, "g")
	const matches = text.matchAll(pattern)
	// 解码参数...
}
```

**优点**：

- 纯文本兼容
- 复制粘贴保留
- 不需要修改编辑器

**缺点**：

- 编码解码复杂
- 可能被某些处理流程过滤
- 调试困难

### 方案C: 外部映射存储方案

使用唯一ID映射，参数存储在外部：

```javascript
// 全局存储
const mentionStore = new Map()

// 插入提及时
function insertMention(item) {
	const mentionId = generateUniqueId()
	mentionStore.set(mentionId, {
		type: item.type,
		data: item,
		timestamp: Date.now(),
	})

	return `@${item.type}[${item.name}:${mentionId}]`
}

// 处理消息时
function processMention(text) {
	const pattern = /@(\w+)\[([^:\]]+):([^\]]+)\]/g
	const matches = text.matchAll(pattern)

	for (const [full, type, name, mentionId] of matches) {
		const mentionData = mentionStore.get(mentionId)
		if (mentionData) {
			// 使用完整数据
			handleMention(mentionData)
		}
	}
}
```

**优点**：

- 文本保持简洁
- 支持任意复杂数据
- 易于实现和调试

**缺点**：

- 需要管理存储生命周期
- 跨会话可能丢失数据
- 需要清理机制

### 方案D: 结构化消息方案（推荐）

将消息分为文本部分和元数据部分：

```typescript
interface Message {
  // 显示文本
  text: string;

  // 提及元数据
  mentions: Array<{
    type: 'task' | 'agent' | 'contact' | 'knowledge';
    range: [number, number];  // 在text中的位置
    data: {
      id: string;
      name: string;
      [key: string]: any;  // 扩展字段
    };
  }>;

  // 其他附件
  attachments?: Array<any>;
}

// 发送消息示例
const message: Message = {
  text: "@任务[优化代码] 请重构这个函数",
  mentions: [{
    type: 'task',
    range: [0, 10],
    data: {
      id: 'task-123',
      name: '优化代码',
      status: 'active',
      context: {...}
    }
  }]
};
```

**优点**：

- 清晰的数据结构
- 完整的元数据保留
- 易于扩展
- 向后兼容（可降级为纯文本）

**缺点**：

- 需要修改消息发送接口
- 需要更新存储格式

## 4. 实施建议

### 4.1 短期方案（快速实现）

采用**方案C（外部映射存储）**：

1. 最小改动现有代码
2. 快速验证功能
3. 为长期方案积累经验

### 4.2 长期方案（推荐）

采用**方案D（结构化消息）**：

1. 设计统一的消息格式规范
2. 逐步迁移各个组件
3. 保持向后兼容

### 4.3 实施步骤

#### 第一阶段：建立基础设施

1. 定义统一的 Mention 接口
2. 实现 MentionStore 服务
3. 创建编解码工具函数

#### 第二阶段：改造 IM 系统

1. 修改 RooCodeAtPanel 保存完整数据
2. 更新 ChatInput 支持富数据
3. 改造 chatStore 处理逻辑

#### 第三阶段：改造 Roo-Code

1. 扩展 mention 解析器
2. 支持结构化参数传递
3. 增强任务/模式调用

#### 第四阶段：统一和优化

1. 统一两个系统的提及格式
2. 实现跨系统数据交换
3. 添加数据验证和错误处理

## 5. 数据结构设计

### 5.1 统一的 Mention 接口

```typescript
interface IMention {
	// 基础字段
	type: MentionType
	id: string
	displayName: string

	// 元数据
	metadata?: {
		// 任务相关
		taskId?: string
		taskStatus?: "active" | "completed" | "paused"
		taskContext?: any

		// 智能体相关
		modeId?: string
		modeConfig?: any
		modePrompt?: string

		// 联系人相关
		contactId?: string
		contactType?: "user" | "group"
		contactStatus?: "online" | "offline"

		// 扩展字段
		[key: string]: any
	}

	// 行为配置
	actions?: {
		onClick?: () => void
		onHover?: () => void
		onExecute?: (params: any) => Promise<any>
	}
}

enum MentionType {
	Task = "task",
	Agent = "agent",
	Contact = "contact",
	Knowledge = "knowledge",
	File = "file",
	Command = "command",
}
```

### 5.2 消息格式扩展

```typescript
interface EnhancedMessage {
	// 原始文本（用于显示）
	text: string

	// HTML富文本（可选）
	html?: string

	// 提及列表
	mentions: IMention[]

	// 提及位置映射
	mentionRanges: Array<{
		start: number
		end: number
		mentionId: string
	}>

	// 消息元数据
	metadata: {
		senderId: string
		timestamp: number
		edited?: boolean
		[key: string]: any
	}
}
```

## 6. 兼容性考虑

### 6.1 向后兼容策略

- 保留纯文本格式作为降级方案
- 新旧格式并存过渡期
- 自动检测和转换旧格式

### 6.2 跨平台兼容

- 定义标准的序列化格式（JSON）
- 提供各平台的解析库
- 支持部分功能降级

## 7. 安全性考虑

### 7.1 数据验证

- 验证提及ID的有效性
- 检查权限和访问控制
- 防止注入攻击

### 7.2 隐私保护

- 敏感数据不在文本中暴露
- 支持数据脱敏
- 审计日志记录

## 8. 性能优化

### 8.1 缓存策略

- 缓存常用提及数据
- 懒加载详细信息
- 定期清理过期数据

### 8.2 批量处理

- 批量解析提及
- 批量查询元数据
- 异步加载非关键数据

## 9. 测试计划

### 9.1 单元测试

- 提及解析测试
- 参数编解码测试
- 数据验证测试

### 9.2 集成测试

- IM系统集成测试
- Roo-Code集成测试
- 跨系统交互测试

### 9.3 性能测试

- 大量提及处理
- 内存占用测试
- 响应时间测试

## 10. 时间计划

- **第1-2周**：方案评审和技术验证
- **第3-4周**：基础设施开发
- **第5-6周**：IM系统改造
- **第7-8周**：Roo-Code改造
- **第9-10周**：集成测试和优化
- **第11-12周**：文档和部署
