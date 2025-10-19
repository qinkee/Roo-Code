import { useEffect, useRef } from "react"
import MarkdownBlock from "./MarkdownBlock"

interface ReasoningBlockProps {
	content: string
	elapsed?: number
	isCollapsed?: boolean
	onToggleCollapse?: () => void
}

export const ReasoningBlock = ({ content, elapsed, isCollapsed = false, onToggleCollapse }: ReasoningBlockProps) => {
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (contentRef.current && !isCollapsed) {
			contentRef.current.scrollTop = contentRef.current.scrollHeight
		}
	}, [content, isCollapsed])

	return (
		<div style={containerStyle}>
			<div style={headerStyle} onClick={onToggleCollapse}>
				<div style={titleStyle}>深度推理</div>
				<div style={rightSectionStyle}>
					{elapsed && elapsed > 1000 && (
						<>
							<span style={clockIconStyle}>⏱</span>
							<div style={timeStyle}>{Math.round(elapsed / 1000)}s</div>
						</>
					)}
					<span style={chevronIconStyle}>{isCollapsed ? "▼" : "▲"}</span>
				</div>
			</div>
			{!isCollapsed && (
				<div style={contentStyle} ref={contentRef}>
					<MarkdownBlock markdown={content} />
				</div>
			)}
		</div>
	)
}

const containerStyle: React.CSSProperties = {
	background: "var(--vscode-editor-background, #282c34)",
	border: "1px solid var(--vscode-border, #444)",
	borderRadius: "4px",
	overflow: "hidden",
}

const headerStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "8px",
	padding: "12px",
	cursor: "pointer",
	color: "var(--vscode-descriptionForeground, #6c7a89)",
}

const titleStyle: React.CSSProperties = {
	flex: 1,
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
}

const rightSectionStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	gap: "8px",
}

const clockIconStyle: React.CSSProperties = {
	fontSize: "14px",
}

const timeStyle: React.CSSProperties = {
	fontSize: "13px",
}

const chevronIconStyle: React.CSSProperties = {
	fontSize: "12px",
}

const contentStyle: React.CSSProperties = {
	padding: "12px",
	maxHeight: "160px",
	overflowY: "auto",
}
