# Roo Renderer 依赖版本说明

本文档记录了 roo-renderer 库的依赖版本兼容性，避免将来升级时遇到问题。

## 核心依赖版本（已验证）

### React 生态

```json
{
	"react": "^18.0.0",
	"react-dom": "^18.0.0"
}
```

### Markdown 渲染

```json
{
	"react-markdown": "^8.0.7",
	"remark-gfm": "^3.0.1",
	"remark-math": "^5.1.1",
	"rehype-katex": "^6.0.3",
	"unist-util-visit": "^5.0.0"
}
```

**重要提示**：

- ❌ **不要升级到 react-markdown v9**：在 IIFE 格式打包时会导致渲染错误（显示 "p-0"、"p-1" 等占位符）
- ❌ **不要升级到 remark-gfm v4**：与 react-markdown v8 不兼容，会导致 `Cannot read properties of undefined (reading 'inTable')` 错误
- ✅ **react-markdown v8** 需要：
    - remark-gfm v3.x
    - remark-math v5.x
    - rehype-katex v6.x

### 其他依赖

```json
{
	"katex": "^0.16.9",
	"mermaid": "^11.4.1",
	"shiki": "^1.22.0",
	"hast-util-to-jsx-runtime": "^2.3.0",
	"react-use": "^17.5.0"
}
```

## 打包配置

### esbuild 设置

- **格式**: IIFE
- **平台**: browser
- **目标**: es2020
- **外部依赖**: React、ReactDOM（使用全局变量）

### React 外部化

通过自定义 esbuild 插件将 React 映射到全局变量：

```javascript
{
  'react': 'window.React',
  'react-dom': 'window.ReactDOM',
  'react/jsx-runtime': '{ jsx: React.createElement, jsxs: React.createElement, Fragment: React.Fragment }'
}
```

### CSS 处理

- Markdown CSS 通过脚本注入到 JS 文件中
- 运行时动态创建 `<style>` 标签插入到 `<head>`

## 已知问题和解决方案

### 问题 1: styled-components 不工作

**症状**: 组件样式丢失
**原因**: styled-components 在 IIFE 格式中无法正确注入样式
**解决**: 移除 styled-components，改用 React inline styles 和纯 CSS

### 问题 2: react-markdown v9 渲染异常

**症状**: 显示 "p-0"、"p-1"、"ul-0" 等文本而不是实际内容
**原因**: react-markdown v9 在 IIFE 打包时存在兼容性问题
**解决**: 降级到 v8.0.7

### 问题 3: remark-gfm v4 报错

**症状**: `Cannot read properties of undefined (reading 'inTable')`
**原因**: remark-gfm v4 与 react-markdown v8 不兼容
**解决**: 降级到 v3.0.1

## 使用说明

### im-web 集成

1. 在 HTML 中引入 React 18 UMD：

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

2. 引入 roo-renderer：

```html
<script src="/lib/roo-renderer/roo-renderer.js"></script>
```

3. 在 Vue 组件中使用：

```vue
<react-component-wrapper :component="window.RooRenderer.MarkdownBlock" :props="{ markdown: content }" />
```

## 更新历史

- **2025-01-15**: 初始版本
    - react-markdown: v8.0.7
    - remark-gfm: v3.0.1
    - remark-math: v5.1.1
    - rehype-katex: v6.0.3

## 注意事项

1. **不要轻易升级 react-markdown 相关依赖**，除非经过充分测试
2. 如需升级，必须在测试环境中验证 IIFE 打包后的渲染效果
3. 保持 React 版本为 v18（im-web 使用 CDN 版本）
4. 构建前检查依赖版本，确保与本文档一致
