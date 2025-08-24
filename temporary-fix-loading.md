# 临时修复：API请求Loading状态问题

## 问题描述

某些provider（可能是deepseek-reasoner等）在API请求完成后不返回usage信息，导致前端一直显示"API请求..."的loading状态。

## 临时解决方案

### 前端修改 (webview-ui/src/components/chat/ChatRow.tsx)

1. **注释掉ProgressIndicator** (第292-294行)

    - 原代码：`<ProgressIndicator />`
    - 修改为：`getIconSpan("check", successColor)`
    - 默认显示成功图标，而不是loading动画

2. **修改文本显示** (第311-313行)
    - 原代码：显示 "API请求..." (`t("chat:apiRequest.streaming")`)
    - 修改为：显示 "API请求" (`t("chat:apiRequest.title")`)
    - 避免给用户"正在进行中"的错觉

## 为什么是临时方案

这只是一个临时的UI层面的修复，真正的问题在于：

1. **Provider兼容性问题**：某些provider可能不按标准返回usage信息
2. **后端处理逻辑**：需要更好地处理没有usage信息的情况
3. **通信协议**：可能需要调整provider和扩展之间的通信协议

## 后续改进建议

### 短期改进

1. 在后端添加超时机制，超时后自动标记请求完成
2. 为不同的provider添加特殊处理逻辑
3. 添加配置选项，让用户选择是否显示usage信息

### 长期改进

1. 与provider开发者沟通，确保返回标准的usage信息
2. 重构消息状态管理，不依赖usage信息来判断完成状态
3. 添加更多的状态标识，如"完成但无费用信息"

## 如何恢复原始代码

如果需要恢复原始代码，只需：

1. 将第294行改回：`<ProgressIndicator />`
2. 将第313行改回：`<span style={{ color: normalColor, fontWeight: "bold" }}>{t("chat:apiRequest.streaming")}</span>`
3. 删除相关的TODO注释

## 测试建议

1. 测试各种provider的API请求是否正常显示
2. 确认有usage信息时仍能正确显示费用
3. 确认错误状态仍能正确显示
