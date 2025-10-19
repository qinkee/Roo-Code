import MarkdownBlock from "./MarkdownBlock"

export interface NewTaskBlockProps {
	content: string
	mode?: string
}

export const NewTaskBlock = ({ content, mode }: NewTaskBlockProps) => {
	return (
		<div style={containerStyle}>
			<div style={headerStyle}>
				<span style={iconStyle}>📋</span>
				<span style={titleStyle}>想要创建新子任务{mode && <code style={modeTagStyle}>{mode}</code>}</span>
			</div>
			<div style={contentCardStyle}>
				<div style={cardHeaderStyle}>
					<span style={arrowStyle}>→</span>
					新任务内容
				</div>
				<div style={cardContentStyle}>
					<MarkdownBlock markdown={content} />
				</div>
			</div>
		</div>
	)
}

const containerStyle: React.CSSProperties = {}

const headerStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	gap: "8px",
	marginBottom: "4px",
}

const iconStyle: React.CSSProperties = {
	fontSize: "16px",
}

const titleStyle: React.CSSProperties = {
	fontWeight: "bold",
	color: "var(--vscode-foreground, #abb2bf)",
}

const modeTagStyle: React.CSSProperties = {
	marginLeft: "6px",
	padding: "2px 6px",
	background: "rgba(255, 255, 255, 0.1)",
	borderRadius: "3px",
	fontSize: "0.9em",
}

const contentCardStyle: React.CSSProperties = {
	background: "var(--vscode-badge-background, #3c3c3c)",
	border: "1px solid var(--vscode-badge-background, #3c3c3c)",
	borderRadius: "4px 4px 0 0",
	overflow: "hidden",
	marginBottom: "2px",
}

const cardHeaderStyle: React.CSSProperties = {
	padding: "9px 10px 9px 14px",
	background: "var(--vscode-badge-background, #3c3c3c)",
	borderBottom: "1px solid var(--vscode-editorGroup-border, #444)",
	fontWeight: "bold",
	fontSize: "var(--vscode-font-size, 13px)",
	color: "var(--vscode-badge-foreground, #fff)",
	display: "flex",
	alignItems: "center",
	gap: "6px",
}

const arrowStyle: React.CSSProperties = {
	fontSize: "14px",
}

const cardContentStyle: React.CSSProperties = {
	padding: "12px 16px",
	background: "var(--vscode-editor-background, #282c34)",
}
