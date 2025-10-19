import styled from "styled-components"
import { CODE_BLOCK_BG_COLOR } from "./CodeBlock"

export interface ToolUseBlockProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode
}

export const ToolUseBlock = ({ className, children, ...props }: ToolUseBlockProps) => (
	<Container className={className} {...props}>
		{children}
	</Container>
)

export const ToolUseBlockHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<Header className={className} {...props}>
		{children}
	</Header>
)

const Container = styled.div`
	overflow: hidden;
	border: 1px solid var(--vscode-border, #444);
	border-radius: 4px;
	padding: 8px;
	cursor: pointer;
	background-color: ${CODE_BLOCK_BG_COLOR};

	&:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}
`

const Header = styled.div`
	display: flex;
	align-items: center;
	user-select: none;
	color: var(--vscode-descriptionForeground, #6c7a89);
`
