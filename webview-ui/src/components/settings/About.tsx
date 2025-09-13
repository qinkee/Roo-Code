import { HTMLAttributes, useEffect, useState } from "react"
import { useAppTranslation } from "@/i18n/TranslationContext"
import { Trans } from "react-i18next"
import { Info, Download, Upload, TriangleAlert, Bug } from "lucide-react"

import { VSCodeCheckbox, VSCodeLink } from "@vscode/webview-ui-toolkit/react"

import { Package } from "@roo/package"
import { TelemetrySetting } from "@roo/TelemetrySetting"

import { vscode } from "@/utils/vscode"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui"

import { SectionHeader } from "./SectionHeader"
import { Section } from "./Section"

type AboutProps = HTMLAttributes<HTMLDivElement> & {
	telemetrySetting: TelemetrySetting
	setTelemetrySetting: (setting: TelemetrySetting) => void
}

interface DebugInfo {
	userId?: string
	terminal?: number
	terminalNo?: number
	skToken?: string
}

export const About = ({ telemetrySetting, setTelemetrySetting, className, ...props }: AboutProps) => {
	const { t } = useAppTranslation()
	const [debugInfo, setDebugInfo] = useState<DebugInfo>({})
	const [showDebugInfo, setShowDebugInfo] = useState(false)

	useEffect(() => {
		// Request debug info from extension
		vscode.postMessage({ type: "getDebugInfo" })
		
		// Listen for debug info response
		const handleMessage = (event: MessageEvent) => {
			const message = event.data
			if (message.type === "debugInfo") {
				setDebugInfo(message.data || {})
			}
		}
		
		window.addEventListener("message", handleMessage)
		return () => window.removeEventListener("message", handleMessage)
	}, [])

	const getTerminalTypeName = (terminal?: number): string => {
		const terminalTypes: Record<number, string> = {
			0: "Web",
			1: "Spirit App",
			2: "VSCode",
			3: "Cloud PC",
			4: "Browser Plugin",
			5: "MCP"
		}
		return terminal !== undefined ? terminalTypes[terminal] || "Unknown" : "Not set"
	}

	return (
		<div className={cn("flex flex-col gap-2", className)} {...props}>
			<SectionHeader
				description={
					Package.sha
						? `Version: ${Package.version} (${Package.sha.slice(0, 8)})`
						: `Version: ${Package.version}`
				}>
				<div className="flex items-center gap-2">
					<Info className="w-4" />
					<div>{t("settings:sections.about")}</div>
				</div>
			</SectionHeader>

			<Section>
				{/* Debug Information Section */}
				<div className="border border-vscode-panel-border rounded p-3 mb-4">
					<div 
						className="flex items-center justify-between cursor-pointer"
						onClick={() => setShowDebugInfo(!showDebugInfo)}
					>
						<div className="flex items-center gap-2">
							<Bug className="w-4 h-4" />
							<span className="font-medium">调试信息 / Debug Information</span>
						</div>
						<span className="text-xs text-vscode-descriptionForeground">
							{showDebugInfo ? "▼" : "►"}
						</span>
					</div>
					
					{showDebugInfo && (
						<div className="mt-3 space-y-2 text-sm">
							<div className="grid grid-cols-2 gap-2">
								<div>
									<span className="text-vscode-descriptionForeground">用户ID / User ID:</span>
									<span className="ml-2 font-mono">
										{debugInfo.userId || "未设置 / Not set"}
									</span>
								</div>
								<div>
									<span className="text-vscode-descriptionForeground">终端编号 / Terminal No:</span>
									<span className="ml-2 font-mono">
										{debugInfo.terminalNo !== undefined ? debugInfo.terminalNo : "未设置 / Not set"}
									</span>
								</div>
								<div>
									<span className="text-vscode-descriptionForeground">终端类型 / Terminal Type:</span>
									<span className="ml-2 font-mono">
										{getTerminalTypeName(debugInfo.terminal)}
									</span>
								</div>
								<div>
									<span className="text-vscode-descriptionForeground">SK令牌 / SK Token:</span>
									<span className="ml-2 font-mono">
										{debugInfo.skToken 
											? `${debugInfo.skToken.substring(0, 10)}...` 
											: "未设置 / Not set"}
									</span>
								</div>
							</div>
							<div className="pt-2 border-t border-vscode-panel-border">
								<Button 
									onClick={() => {
										vscode.postMessage({ type: "refreshDebugInfo" })
										vscode.postMessage({ type: "getDebugInfo" })
									}}
									variant="secondary"
									size="sm"
								>
									刷新 / Refresh
								</Button>
							</div>
						</div>
					)}
				</div>

				<div>
					<VSCodeCheckbox
						checked={telemetrySetting === "enabled"}
						onChange={(e: any) => {
							const checked = e.target.checked === true
							setTelemetrySetting(checked ? "enabled" : "disabled")
						}}>
						{t("settings:footer.telemetry.label")}
					</VSCodeCheckbox>
					<p className="text-vscode-descriptionForeground text-sm mt-0">
						<Trans
							i18nKey="settings:footer.telemetry.description"
							components={{
								privacyLink: <VSCodeLink href="https://roocode.com/privacy" />,
							}}
						/>
					</p>
				</div>

				<div>
					<Trans
						i18nKey="settings:footer.feedback"
						components={{
							githubLink: <VSCodeLink href="https://github.com/RooCodeInc/Roo-Code" />,
							redditLink: <VSCodeLink href="https://reddit.com/r/RooCode" />,
							discordLink: <VSCodeLink href="https://discord.gg/roocode" />,
						}}
					/>
				</div>

				<div className="flex flex-wrap items-center gap-2 mt-2">
					<Button onClick={() => vscode.postMessage({ type: "exportSettings" })} className="w-28">
						<Upload className="p-0.5" />
						{t("settings:footer.settings.export")}
					</Button>
					<Button onClick={() => vscode.postMessage({ type: "importSettings" })} className="w-28">
						<Download className="p-0.5" />
						{t("settings:footer.settings.import")}
					</Button>
					<Button
						variant="destructive"
						onClick={() => vscode.postMessage({ type: "resetState" })}
						className="w-28">
						<TriangleAlert className="p-0.5" />
						{t("settings:footer.settings.reset")}
					</Button>
				</div>
			</Section>
		</div>
	)
}
