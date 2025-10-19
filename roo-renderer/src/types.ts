/**
 * Common types for Roo-Code renderer components
 */

export interface MarkdownBlockProps {
	markdown?: string
	className?: string
}

export interface CodeBlockProps {
	source?: string
	rawSource?: string
	language: string
	preStyle?: React.CSSProperties
	initialWordWrap?: boolean
	collapsedHeight?: number
	initialWindowShade?: boolean
	onLanguageChange?: (language: string) => void
}

export interface MermaidBlockProps {
	diagram: string
	onRenderError?: (error: Error) => void
}

export interface ReasoningBlockProps {
	content: string
	elapsed?: number
	isCollapsed?: boolean
	onToggleCollapse?: () => void
}

export interface ToolUseBlockProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode
}

export interface SubtaskBlockProps {
	content: string
	mode?: string
}
