import MarkdownBlock from "./MarkdownBlock"

export interface SubtaskResultBlockProps {
	content: string
}

export const SubtaskResultBlock = ({ content }: SubtaskResultBlockProps) => {
	return (
		<div style={containerStyle}>
			<div style={contentCardStyle}>
				<div style={cardHeaderStyle}>
					<span style={arrowStyle}>←</span>
					子任务结果
				</div>
				<div style={cardContentStyle}>
					<MarkdownBlock markdown={content} />
				</div>
			</div>
		</div>
	)
}

const containerStyle: React.CSSProperties = {}

const contentCardStyle: React.CSSProperties = {
	marginTop: "0px",
	background: "var(--vscode-badge-background, #3c3c3c)",
	border: "1px solid var(--vscode-badge-background, #3c3c3c)",
	borderRadius: "0 0 4px 4px",
	overflow: "hidden",
	marginBottom: "8px",
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
