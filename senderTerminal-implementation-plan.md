# 零宽编码 senderTerminal 参数实施方案

## 一、需求背景

### 1.1 业务场景

在 IM 系统的 @任务/@智能体 功能中，需要区分两个终端概念：

- **接收终端**（从 targetId 解析）：执行任务的目标终端，表示在哪个终端的会话中执行
- **发送终端**（senderTerminal）：发起任务的终端，LLM 流式响应需要返回给它

### 1.2 核心问题

当前系统无法正确识别发送方终端，导致 LLM 流式响应无法正确路由回发起方。

### 1.3 参数流转示例

```
用户在"我的电脑"(terminal=2) → 向"傻蛋网页端"会话(targetId="1_0") → 发送@智能体
↓
零宽编码参数：
- targetId: "1_0" (接收方：用户1的终端0)
- chatType: "PRIVATE"
- senderTerminal: 2 (发送方：我的电脑)
↓
VS Code 处理后的 WebSocket 消息：
- recvId: 1 (接收用户)
- targetTerminal: 2 (返回给发送方终端)
- chatType: "PRIVATE"
```

## 二、技术架构

### 2.1 终端定义

```javascript
const TERMINAL_MAP = {
	0: "傻蛋网页端",
	1: "傻蛋精灵App",
	2: "我的电脑",
	3: "我的云电脑",
	4: "傻蛋浏览器",
	5: "MCP",
}
```

### 2.2 数据流

1. **登录阶段**：用户登录时传递 terminal 参数，保存到 userStore
2. **创建提及**：RooCodeAtPanel 从 userStore 获取 terminal，编码到零宽字符
3. **发送消息**：IM 发送包含零宽编码的消息到 VS Code
4. **解析处理**：Task 构造函数解析 senderTerminal，设置为 targetTerminal
5. **流式响应**：WebSocket 消息使用 senderTerminal 作为 targetTerminal

## 三、实施步骤

### 步骤 1：修改 userStore 保存终端信息

#### 1.1 文件位置

- `/Users/david/ThinkgsProjects/box-im/im-web/src/store/modules/userStore.js`
- 或 `/Users/david/ThinkgsProjects/box-im/im-web/src/store/userStore.js`

#### 1.2 代码修改

```javascript
// userStore.js
const userStore = {
	state: {
		userInfo: {
			id: null,
			name: "",
			avatar: "",
			terminal: null, // 新增：当前登录终端
		},
	},

	getters: {
		currentTerminal: (state) => state.userInfo.terminal,
		terminalName: (state) => {
			const terminalMap = { 0: "傻蛋网页端", 2: "我的电脑" /* ... */ }
			return terminalMap[state.userInfo.terminal] || "未知终端"
		},
	},

	mutations: {
		SET_USER_INFO(state, userInfo) {
			state.userInfo = { ...state.userInfo, ...userInfo }
		},
		SET_TERMINAL(state, terminal) {
			state.userInfo.terminal = terminal
		},
	},

	actions: {
		async login({ commit }, { username, password, terminal }) {
			const response = await loginAPI(username, password, terminal)
			commit("SET_USER_INFO", { ...response.data, terminal })
			localStorage.setItem("userTerminal", terminal)
			return response
		},
	},
}
```

### 步骤 2：扩展零宽编码协议

#### 2.1 IM 端编码器

**文件**：`/Users/david/ThinkgsProjects/box-im/im-web/src/utils/zeroWidthEncoder.js`

```javascript
// 编码时添加 senderTerminal
static encode(params) {
  let data = ""
  // ... 现有逻辑 ...
  if (params.senderTerminal !== undefined) {
    data += "!" + params.senderTerminal
  }
  // ... 转换为零宽字符 ...
}

// 解码时识别 senderTerminal
static decode(text) {
  // ... 现有逻辑 ...
  const senderTerminalMatch = remaining.match(/!(\d+)/)
  if (senderTerminalMatch) {
    result.senderTerminal = parseInt(senderTerminalMatch[1])
  }
  return result
}
```

#### 2.2 MentionHelper 更新

```javascript
static createAgentMention(agentName, modeId, targetId, chatType, senderTerminal) {
  const params = {
    type: 'agent',
    name: agentName,
    modeId: modeId,
    targetId: targetId,
    chatType: chatType,
    senderTerminal: senderTerminal  // 新增
  }
  return ZeroWidthEncoder.embedInText(displayText, params)
}
```

#### 2.3 Roo-Code 端同步

**文件**：`/Users/david/ThinkgsProjects/Roo-Code/src/utils/zeroWidthEncoder.ts`

- 同步更新 TypeScript 版本，保持协议一致

### 步骤 3：修改 RooCodeAtPanel 组件

#### 3.1 文件位置

`/Users/david/ThinkgsProjects/box-im/im-web/src/components/chat/RooCodeAtPanel.vue`

#### 3.2 代码修改

```javascript
import { mapGetters } from "vuex"

export default {
	computed: {
		...mapGetters("userStore", ["currentTerminal", "terminalName"]),

		currentSenderTerminal() {
			const terminal = this.currentTerminal
			if (terminal !== undefined && terminal !== null) {
				console.log("[RooCodeAtPanel] 从 userStore 获取终端:", terminal)
				return terminal
			}
			// 降级逻辑
			return window.vscodeServices ? 2 : 0
		},
	},

	methods: {
		selectItem(item) {
			const senderTerminal = this.currentSenderTerminal

			displayText = MentionHelper.createAgentMention(
				item.name,
				item.slug || item.id,
				targetId,
				chatType,
				senderTerminal, // 传递发送终端
			)
		},
	},
}
```

### 步骤 4：修改 Task.ts 处理逻辑

#### 4.1 文件位置

`/Users/david/ThinkgsProjects/Roo-Code/src/core/task/Task.ts`

#### 4.2 代码修改

```typescript
constructor(options: TaskOptions) {
  // ... 现有逻辑 ...

  if (encodedParams.length > 0) {
    const params = encodedParams[0].params

    // 解析接收方
    if (params.targetId) {
      const parts = params.targetId.split('_')
      if (parts.length === 2) {
        this.llmTargetUserId = parseInt(parts[0])
      }
    }

    // 使用 senderTerminal 作为响应目标
    if (params.senderTerminal !== undefined) {
      this.llmTargetTerminal = params.senderTerminal
      provider.log(`[Task] 流式响应目标终端: ${params.senderTerminal}`)
    }

    this.llmChatType = params.chatType
  }
}
```

## 四、测试验证

### 4.1 测试场景

1. 用户从"我的电脑"(terminal=2)登录
2. 打开"傻蛋网页端"会话(targetId="1_0")
3. 发送 @智能体[GPT-4] 消息
4. 验证流式响应返回到"我的电脑"(targetTerminal=2)

### 4.2 关键日志检查点

#### IM 端日志

```javascript
[RooCodeAtPanel] 从 userStore 获取终端: 2 我的电脑
[RooCodeAtPanel] 创建智能体提及: {
  targetId: "1_0",
  chatType: "PRIVATE",
  senderTerminal: 2
}
[ChatInput] 使用包含零宽编码的displayText
[ChatStore] 处理智能体命令（零宽编码）... hasZeroWidth: true
```

#### VS Code 端日志

```
[Task Constructor] 零宽参数: {
  type: "agent",
  targetId: "1_0",
  chatType: "PRIVATE",
  senderTerminal: 2
}
[Task] 流式响应目标终端: 2
[Task] sendLLMChunkToIM: recvId=1, targetTerminal=2, chatType=PRIVATE
```

### 4.3 验证点

- [x] userStore 中保存了 terminal 值
- [x] 零宽编码包含 senderTerminal 参数
- [x] Task 正确解析 senderTerminal
- [x] WebSocket 消息 targetTerminal 等于 senderTerminal

## 五、回滚方案

如果实施过程中出现问题，可以按以下步骤回滚：

1. 移除 senderTerminal 相关代码
2. 恢复使用 targetId 中的 terminal
3. 清理 userStore 中的 terminal 字段

## 六、后续优化

1. **终端检测**：自动检测当前运行环境，智能判断终端类型
2. **终端切换**：支持用户手动切换终端身份
3. **多终端支持**：支持同一用户多终端同时在线的场景

---

_文档版本：1.0_  
_创建时间：2024-12-11_  
_作者：Claude & User_
