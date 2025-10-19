/**
 * Simplified CodeBlock component
 * TODO: Full implementation with syntax highlighting
 */
import { memo } from "react"
import styled from "styled-components"

export const CODE_BLOCK_BG_COLOR = "var(--vscode-editor-background, rgb(30 30 30))"

interface CodeBlockProps {
	source?: string
	rawSource?: string
	language: string
	preStyle?: React.CSSProperties
	initialWordWrap?: boolean
	collapsedHeight?: number
	initialWindowShade?: boolean
	onLanguageChange?: (language: string) => void
}

const CodeBlock = memo(({ source, language }: CodeBlockProps) => {
	return (
		<CodeBlockContainer>
			<CodeBlockHeader>
				<LanguageLabel>{language}</LanguageLabel>
			</CodeBlockHeader>
			<CodeBlockContent>
				<pre>
					<code>{source}</code>
				</pre>
			</CodeBlockContent>
		</CodeBlockContainer>
	)
})

CodeBlock.displayName = "CodeBlock"

const CodeBlockContainer = styled.div`
	background: ${CODE_BLOCK_BG_COLOR};
	border-radius: 4px;
	overflow: hidden;
	margin: 8px 0;
`

const CodeBlockHeader = styled.div`
	padding: 4px 8px;
	background: rgba(255, 255, 255, 0.05);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	font-size: 12px;
	color: var(--vscode-descriptionForeground, #6c7a89);
`

const LanguageLabel = styled.span`
	font-family: var(--vscode-editor-font-family, monospace);
`

const CodeBlockContent = styled.div`
	pre {
		margin: 0;
		padding: 12px;
		overflow-x: auto;

		code {
			font-family: var(--vscode-editor-font-family, "Courier New", monospace);
			font-size: var(--vscode-editor-font-size, 13px);
			color: var(--vscode-editor-foreground, #abb2bf);
			line-height: 1.5;
		}
	}
`

export default CodeBlock
