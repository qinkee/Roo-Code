import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import styled from "styled-components"
import { useDebounceEffect } from "./utils/useDebounceEffect"

const MERMAID_THEME = {
	background: "#1e1e1e",
	textColor: "#ffffff",
	mainBkg: "#2d2d2d",
	nodeBorder: "#888888",
	lineColor: "#cccccc",
	primaryColor: "#3c3c3c",
	primaryTextColor: "#ffffff",
	primaryBorderColor: "#888888",
	secondaryColor: "#2d2d2d",
	tertiaryColor: "#454545",
	classText: "#ffffff",
	labelColor: "#ffffff",
	actorLineColor: "#cccccc",
	actorBkg: "#2d2d2d",
	actorBorder: "#888888",
	actorTextColor: "#ffffff",
	fillType0: "#2d2d2d",
	fillType1: "#3c3c3c",
	fillType2: "#454545",
}

// 初始化 Mermaid（只初始化一次）
let mermaidInitialized = false
if (!mermaidInitialized) {
	mermaid.initialize({
		startOnLoad: false,
		securityLevel: "loose",
		theme: "dark",
		suppressErrorRendering: true,
		themeVariables: {
			...MERMAID_THEME,
			fontSize: "16px",
			fontFamily: "var(--vscode-font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif)",
			noteTextColor: "#ffffff",
			noteBkgColor: "#454545",
			noteBorderColor: "#888888",
			critBorderColor: "#ff9580",
			critBkgColor: "#803d36",
			taskTextColor: "#ffffff",
			taskTextOutsideColor: "#ffffff",
			taskTextLightColor: "#ffffff",
			sectionBkgColor: "#2d2d2d",
			sectionBkgColor2: "#3c3c3c",
			altBackground: "#2d2d2d",
			linkColor: "#6cb6ff",
			compositeBackground: "#2d2d2d",
			compositeBorder: "#888888",
			titleColor: "#ffffff",
		},
	})
	mermaidInitialized = true
}

interface MermaidBlockProps {
	diagram: string
	onRenderError?: (error: Error) => void
	onClick?: () => void
}

export default function MermaidBlock({ diagram, onRenderError, onClick }: MermaidBlockProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Whenever `diagram` changes, mark that we need to re-render
	useEffect(() => {
		setIsLoading(true)
		setError(null)
	}, [diagram])

	// Debounce the actual parse/render
	useDebounceEffect(
		() => {
			if (containerRef.current) {
				containerRef.current.innerHTML = ""
			}

			mermaid
				.parse(diagram)
				.then(() => {
					const id = `mermaid-${Math.random().toString(36).substring(2)}`
					return mermaid.render(id, diagram)
				})
				.then(({ svg }) => {
					if (containerRef.current) {
						containerRef.current.innerHTML = svg
					}
				})
				.catch((err) => {
					console.warn("Mermaid parse/render failed:", err)
					const errorMsg = err.message || "Failed to render Mermaid diagram"
					setError(errorMsg)
					if (onRenderError) {
						onRenderError(new Error(errorMsg))
					}
				})
				.finally(() => {
					setIsLoading(false)
				})
		},
		500,
		[diagram],
	)

	return (
		<MermaidBlockContainer>
			{isLoading && <LoadingMessage>加载中...</LoadingMessage>}

			{error ? (
				<ErrorContainer>
					<ErrorHeader>
						<WarningIcon>⚠️</WarningIcon>
						<span>Mermaid 渲染错误</span>
					</ErrorHeader>
					<ErrorMessage>{error}</ErrorMessage>
				</ErrorContainer>
			) : (
				<SvgContainer onClick={onClick} ref={containerRef} $isLoading={isLoading}></SvgContainer>
			)}
		</MermaidBlockContainer>
	)
}

const MermaidBlockContainer = styled.div`
	position: relative;
	margin: 8px 0;
`

const LoadingMessage = styled.div`
	padding: 8px 0;
	color: var(--vscode-descriptionForeground, #6c7a89);
	font-style: italic;
	font-size: 0.9em;
`

const ErrorContainer = styled.div`
	margin-top: 0px;
	overflow: hidden;
	margin-bottom: 8px;
	border: 1px solid var(--vscode-editorError-border, #f44747);
	border-radius: 4px;
	background: var(--vscode-inputValidation-errorBackground, rgba(244, 71, 71, 0.1));
`

const ErrorHeader = styled.div`
	padding: 8px 12px;
	border-bottom: 1px solid var(--vscode-editorGroup-border, #444);
	font-weight: bold;
	font-size: var(--vscode-font-size, 13px);
	color: var(--vscode-editorError-foreground, #f44747);
	display: flex;
	align-items: center;
	gap: 8px;
`

const WarningIcon = styled.span`
	font-size: 16px;
`

const ErrorMessage = styled.div`
	padding: 8px 12px;
	color: var(--vscode-descriptionForeground, #6c7a89);
	font-size: 0.9em;
`

interface SvgContainerProps {
	$isLoading: boolean
}

const SvgContainer = styled.div<SvgContainerProps>`
	opacity: ${(props) => (props.$isLoading ? 0.3 : 1)};
	min-height: 20px;
	transition: opacity 0.2s ease;
	cursor: ${(props) => (props.onClick ? "pointer" : "default")};
	display: flex;
	justify-content: center;
	max-height: 400px;

	/* Ensure the SVG scales within the container */
	& > svg {
		display: block;
		width: 100%;
		max-height: 100%;
	}
`
