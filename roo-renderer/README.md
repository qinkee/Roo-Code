# Roo-Code Renderer - 纯渲染组件库

Roo-Code 的纯渲染组件 UMD 库，用于在 im-web 中实现与 Roo-Code 100% 一致的 UI 渲染。

## 功能特性

- ✅ **纯渲染组件** - 移除了所有 VSCode 依赖和 Context，只保留纯 UI 渲染逻辑
- ✅ **UMD 格式** - IIFE 格式，可直接在浏览器中通过 `<script>` 标签引入
- ✅ **React 外部化** - React 和 ReactDOM 使用全局 CDN 版本，不打包进库
- ✅ **完整组件集** - 包含 Markdown、Mermaid、代码块、推理、工具使用等所有核心组件
- ✅ **Vue 桥接** - 提供 Vue 包装组件，无缝在 Vue 项目中使用 React 组件

## 已导出组件

```typescript
export {
	MarkdownBlock, // Markdown 渲染（支持 KaTeX、Mermaid、代码高亮）
	CodeBlock, // 代码块渲染
	MermaidBlock, // Mermaid 图表渲染
	ReasoningBlock, // 深度推理块
	ToolUseBlock, // 工具使用块
	ToolUseBlockHeader, // 工具使用块头部
	NewTaskBlock, // 新建任务块
	FinishTaskBlock, // 完成任务块
	SubtaskResultBlock, // 子任务结果块
}
```

## 构建和同步

### 本地开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 同步到 im-web
npm run sync

# 清理
npm run clean
```

## im-web 集成完成！

✅ 所有重构已完成，现在 im-web 使用 Roo-Code 的纯渲染组件实现 100% UI 一致性。
