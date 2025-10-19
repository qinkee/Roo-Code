import styled from "styled-components"
import MarkdownBlock from "./MarkdownBlock"

export interface FinishTaskBlockProps {
	content: string
}

export const FinishTaskBlock = ({ content }: FinishTaskBlockProps) => {
	return (
		<Container>
			<Header>
				<Icon>✅</Icon>
				<Title>想要完成任务</Title>
			</Header>
			<ContentCard>
				<CardHeader>
					<CheckIcon>✓</CheckIcon>
					完成内容
				</CardHeader>
				<CardContent>
					<MarkdownBlock markdown={content || "任务已完成"} />
				</CardContent>
			</ContentCard>
		</Container>
	)
}

const Container = styled.div``

const Header = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 4px;
`

const Icon = styled.span`
	font-size: 16px;
`

const Title = styled.span`
	font-weight: bold;
	color: var(--vscode-foreground, #abb2bf);
`

const ContentCard = styled.div`
	background: var(--vscode-editor-background, #282c34);
	border: 1px solid var(--vscode-badge-background, #3c3c3c);
	border-radius: 4px;
	overflow: hidden;
	margin-bottom: 8px;
`

const CardHeader = styled.div`
	padding: 9px 10px 9px 14px;
	background: var(--vscode-badge-background, #3c3c3c);
	border-bottom: 1px solid var(--vscode-editorGroup-border, #444);
	font-weight: bold;
	font-size: var(--vscode-font-size, 13px);
	color: var(--vscode-badge-foreground, #fff);
	display: flex;
	align-items: center;
	gap: 6px;
`

const CheckIcon = styled.span`
	font-size: 14px;
`

const CardContent = styled.div`
	padding: 12px 16px;
	background: var(--vscode-editor-background, #282c34);
`
