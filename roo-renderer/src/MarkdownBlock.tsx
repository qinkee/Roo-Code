import React, { memo, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import { visit } from "unist-util-visit"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import "./markdown.css"

import CodeBlock from "./CodeBlock"
import MermaidBlock from "./MermaidBlock"

interface MarkdownBlockProps {
	markdown?: string
	className?: string
	onFileClick?: (filePath: string, line?: number) => void
}

const MarkdownBlock = memo(({ markdown, className, onFileClick }: MarkdownBlockProps) => {
	const components = useMemo(
		() => ({
			table: ({ children, ...props }: any) => {
				return (
					<div className="table-wrapper">
						<table {...props}>{children}</table>
					</div>
				)
			},
			a: ({ href, children, ...props }: any) => {
				const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
					// Only process file:// protocol or local file paths
					const isLocalPath = href?.startsWith("file://") || href?.startsWith("/") || !href?.includes("://")

					if (!isLocalPath || !onFileClick) {
						return
					}

					e.preventDefault()

					// Handle absolute vs project-relative paths
					let filePath = href.replace("file://", "")

					// Extract line number if present
					const match = filePath.match(/(.*):(\d+)(-\d+)?$/)
					let line: number | undefined
					if (match) {
						filePath = match[1]
						line = parseInt(match[2])
					}

					// Add ./ prefix if needed
					if (!filePath.startsWith("/") && !filePath.startsWith("./")) {
						filePath = "./" + filePath
					}

					onFileClick(filePath, line)
				}

				return (
					<a {...props} href={href} onClick={handleClick}>
						{children}
					</a>
				)
			},
			pre: ({ children, ..._props }: any) => {
				// The structure from react-markdown v9 is: pre > code > text
				const codeEl = children as React.ReactElement

				if (!codeEl || !codeEl.props) {
					return <pre>{children}</pre>
				}

				const { className = "", children: codeChildren } = codeEl.props

				// Get the actual code text
				let codeString = ""
				if (typeof codeChildren === "string") {
					codeString = codeChildren
				} else if (Array.isArray(codeChildren)) {
					codeString = codeChildren.filter((child) => typeof child === "string").join("")
				}

				// Handle mermaid diagrams
				if (className.includes("language-mermaid")) {
					return (
						<div style={{ margin: "1em 0" }}>
							<MermaidBlock diagram={codeString} />
						</div>
					)
				}

				// Extract language from className
				const match = /language-(\w+)/.exec(className)
				const language = match ? match[1] : "text"

				// Wrap CodeBlock in a div to ensure proper separation
				return (
					<div style={{ margin: "1em 0" }}>
						<CodeBlock source={codeString} language={language} />
					</div>
				)
			},
			code: ({ children, className, ...props }: any) => {
				// This handles inline code
				return (
					<code className={className} {...props}>
						{children}
					</code>
				)
			},
		}),
		[onFileClick],
	)

	return (
		<div className={`roo-markdown ${className || ""}`}>
			<ReactMarkdown
				remarkPlugins={[
					remarkGfm,
					remarkMath,
					() => {
						return (tree: any) => {
							visit(tree, "code", (node: any) => {
								if (!node.lang) {
									node.lang = "text"
								} else if (node.lang.includes(".")) {
									node.lang = node.lang.split(".").slice(-1)[0]
								}
							})
						}
					},
				]}
				rehypePlugins={[rehypeKatex as any]}
				components={components}>
				{markdown || ""}
			</ReactMarkdown>
		</div>
	)
})

MarkdownBlock.displayName = "MarkdownBlock"

export default MarkdownBlock
