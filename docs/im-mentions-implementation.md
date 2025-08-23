# IM系统@引用功能实现方案

## 概述

本方案描述如何在Roo-Code中实现两种新的@引用类型：
- `@联系人:name` - 用于指定将结果发送给特定IM联系人
- `@知识库:name` - 用于查询特定联系人/群组的知识库内容

## 背景

### 现有@引用类型
- `@/path/to/file` - 文件引用
- `@/path/to/folder/` - 文件夹引用
- `@problems` - 工作区诊断信息
- `@terminal` - 终端输出
- `@git-changes` - Git工作区变更
- `@[commit-hash]` - Git提交信息
- `@http://url` - URL内容
- `/command-name` - 自定义命令

### 现有处理流程
1. 用户在前端输入@引用
2. 前端通过上下文菜单帮助用户选择
3. 消息发送时，后端解析@引用
4. 将引用替换为描述性文本，实际内容放在XML标签中
5. LLM接收处理后的消息，根据内容和系统提示词执行任务

## 实现方案

### 1. 前端改动（已完成）

在 `ChatTextArea.tsx` 中已实现：
```typescript
// 联系人选择
if (type === ContextMenuOptionType.Contacts) {
    insertValue = `联系人:${value}`
}
// 知识库选择
else if (type === ContextMenuOptionType.KnowledgeBase) {
    insertValue = `知识库:${value}`
}
```

### 2. 正则表达式更新

文件：`/src/shared/context-mentions.ts`

```typescript
// 更新 mentionRegex，添加对联系人和知识库的支持
export const mentionRegex =
  /(?<!\\)@((?:\/|\w+:\/\/)(?:[^\s\\]|\\ )+?|[a-f0-9]{7,40}\b|problems\b|git-changes\b|terminal\b|联系人:[^\s,;:!?]+|知识库:[^\s,;:!?]+)(?=[.,;:!?]?(?=[\s\r\n]|$))/
```

### 3. 解析逻辑实现

文件：`/src/core/mentions/index.ts`

在 `parseMentions` 函数中添加：

#### 3.1 文本替换部分
```typescript
parsedText = parsedText.replace(mentionRegexGlobal, (match, mention) => {
    mentions.add(mention)
    // ... 现有代码 ...
    
    } else if (mention.startsWith("联系人:")) {
        const contactName = mention.substring(4)
        return `'${contactName}' (将通过IM系统发送消息)`
    } else if (mention.startsWith("知识库:")) {
        const kbName = mention.substring(4)
        return `'${kbName}' (将查询知识库内容)`
    }
    return match
})
```

#### 3.2 内容处理部分
```typescript
for (const mention of mentions) {
    // ... 现有代码 ...
    
    } else if (mention.startsWith("联系人:")) {
        const contactName = mention.substring(4)
        parsedText += `\n\n<im_contact type="send" name="${contactName}">\n将最终结果通过im-platform MCP工具发送给联系人 ${contactName}\n</im_contact>`
    } else if (mention.startsWith("知识库:")) {
        const kbName = mention.substring(4)
        parsedText += `\n\n<knowledge_base name="${kbName}">\n通过im-platform MCP工具查询 ${kbName} 的知识库内容用于增强上下文\n</knowledge_base>`
    }
}
```

### 4. 系统提示词增强

在适当的位置（如工具使用指南部分）添加IM相关说明：

```typescript
## IM系统集成

当用户消息中包含以下引用时：

1. **@联系人:name** - 你应该：
   - 在完成用户请求的主要任务后
   - 使用 im-platform MCP 工具的 send_message 方法将结果发送给指定联系人
   - 根据任务性质选择发送文本消息或文件：
     - 文本结果：直接发送消息内容
     - 文件结果：先保存文件，然后发送文件
   - 确保消息内容清晰、完整，包含必要的上下文

2. **@知识库:name** - 你应该：
   - 使用 im-platform MCP 工具的 search_knowledge_base 方法查询指定联系人或群组的知识库
   - 将查询结果用于增强当前任务的上下文理解
   - 在回答中适当引用知识库内容
   - 如果知识库中有相关信息，优先使用这些信息
```

## 实现步骤

### 第一阶段：基础功能
1. ✅ 前端支持（已完成）
2. 更新正则表达式
3. 实现解析逻辑
4. 添加系统提示词
5. 测试基本功能

### 第二阶段：增强功能（可选）
1. 实时验证联系人是否存在
2. 在解析时预先查询知识库内容
3. 添加发送确认机制
4. 错误处理和重试逻辑

## 技术细节

### 数据流
```
用户输入 "@联系人:张三 帮我分析这个文件"
    ↓
前端显示为高亮的 @mention
    ↓
发送消息到后端
    ↓
parseMentions 解析：
  - 原文："@联系人:张三 帮我分析这个文件"
  - 替换："'张三' (将通过IM系统发送消息) 帮我分析这个文件"
  - 附加："<im_contact type="send" name="张三">...</im_contact>"
    ↓
LLM 接收处理后的消息
    ↓
LLM 执行任务并调用 im-platform MCP 工具
```

### 错误处理
- 联系人不存在：MCP工具返回错误，LLM应告知用户
- 知识库为空：正常处理，告知用户该联系人/群组暂无知识库内容
- MCP服务不可用：在解析阶段添加错误提示

## 测试用例

### 基本功能测试
1. 输入 `@联系人:张三 请帮我总结这个文件 @/README.md`
   - 期望：分析README.md内容，并通过IM发送总结给张三

2. 输入 `@知识库:技术小组 如何配置Docker?`
   - 期望：查询技术小组的知识库，基于知识库内容回答Docker配置问题

### 组合测试
1. 输入 `@知识库:张三 @联系人:李四 张三之前是如何解决这个问题的？`
   - 期望：查询张三的知识库，将答案发送给李四

2. 多个联系人：`@联系人:张三 @联系人:李四 会议纪要`
   - 期望：将会议纪要同时发送给张三和李四

## 注意事项

1. **隐私安全**：发送消息前应考虑内容敏感性
2. **性能考虑**：知识库查询可能耗时，需要适当的加载提示
3. **兼容性**：确保im-platform MCP服务器已正确配置
4. **用户体验**：清晰的错误提示和操作反馈

## 未来扩展

1. 支持群组：`@群组:技术部`
2. 支持多种消息类型：图片、文件、语音等
3. 支持消息模板和格式化
4. 历史消息引用：`@历史:张三:昨天`
5. 支持消息撤回和编辑