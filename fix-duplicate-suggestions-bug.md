# 修复推荐问题重复显示的Bug

## 问题描述
当AI使用`ask_followup_question`工具询问用户问题并提供推荐答案时，推荐问题列表会重复显示多次，导致界面上出现大量相同的推荐按钮。

## 问题原因
在`askFollowupQuestionTool.ts`中，处理partial消息时存在逻辑问题：

1. 当`block.partial`为true时（第19行），发送的是纯文本的question
2. 当`block.partial`为false时（第79行），发送的是包含suggestions的完整JSON

这导致了数据格式不一致。当partial消息转为完整消息时，webview会接收到两种不同格式的数据，造成suggestions的重复显示。

## 解决方案
修改`src/core/tools/askFollowupQuestionTool.ts`第18-23行：

```typescript
// 修改前：
if (block.partial) {
    await cline.ask("followup", removeClosingTag("question", question), block.partial).catch(() => {})
    return
}

// 修改后：
if (block.partial) {
    // 只发送问题文本，不包含suggestions，避免重复
    // 构建仅包含question的JSON，不包含suggest数组
    const partialJson = JSON.stringify({ question: removeClosingTag("question", question) })
    await cline.ask("followup", partialJson, block.partial).catch(() => {})
    return
}
```

## 修复效果
- partial消息只包含question字段，不包含suggest数组
- 完整消息包含完整的JSON结构（question + suggest）
- 避免了suggestions在UI中重复显示的问题

## 测试方法
1. 触发AI使用ask_followup_question工具
2. 观察推荐问题按钮是否只显示一次
3. 确认点击推荐按钮功能正常

## 相关文件
- `src/core/tools/askFollowupQuestionTool.ts` - 修复的核心文件
- `webview-ui/src/components/chat/FollowUpSuggest.tsx` - 显示推荐问题的UI组件
- `webview-ui/src/components/chat/ChatRow.tsx` - 使用FollowUpSuggest组件