import React from "react"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@src/components/ui"

// 直接导入 ModesView 的核心内容组件
import ModesView from "./ModesView"

interface ModeConfigViewProps {
	onBack: () => void
}

const ModeConfigView: React.FC<ModeConfigViewProps> = ({ onBack }) => {
	const { t } = useTranslation()

	return (
		<div className="flex flex-col h-full bg-vscode-editor-background text-vscode-foreground">
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 border-b border-vscode-panel-border">
				<div className="flex items-center gap-3">
					<button
						onClick={onBack}
						className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors">
						<ArrowLeft size={16} />
					</button>
					<h1 className="text-lg font-bold">{t("prompts:modes.title", "模式")}</h1>
				</div>
				<Button onClick={onBack}>{t("prompts:done", "完成")}</Button>
			</div>

			{/* Content - 隐藏ModesView的头部 */}
			<div className="flex-1 overflow-auto">
				<div className="modes-view-wrapper">
					<ModesView onDone={onBack} />
				</div>
			</div>

			{/* 隐藏ModesView内部的Tab头部 */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
					.modes-view-wrapper > div > div:first-child {
						display: none !important;
					}
					.modes-view-wrapper > div > div:last-child {
						padding: 0 !important;
						height: 100% !important;
					}
					.modes-view-wrapper > div {
						position: static !important;
						height: 100% !important;
					}
				`,
				}}
			/>
		</div>
	)
}

export default ModeConfigView
