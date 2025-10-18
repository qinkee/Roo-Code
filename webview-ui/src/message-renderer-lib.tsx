import React from "react"
import MarkdownBlock from "./components/common/MarkdownBlock"
import CodeBlock from "./components/common/CodeBlock"
import MermaidBlock from "./components/common/MermaidBlock"

// 导入必要的 CSS
import "katex/dist/katex.min.css"

// 导出独立组件
export { MarkdownBlock, CodeBlock, MermaidBlock }

// 导出统一渲染器
export const RooMessageRenderer: React.FC<{
	markdown: string
	className?: string
}> = ({ markdown, className }) => {
	return (
		<div className={className}>
			<MarkdownBlock markdown={markdown} />
		</div>
	)
}

// 默认导出
export default RooMessageRenderer
