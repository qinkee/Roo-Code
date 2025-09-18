import React, { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Clock, Info } from "lucide-react"
import { cn } from "@src/lib/utils"
import { StandardTooltip } from "@src/components/ui"

interface CronRulePanelProps {
	cronRule: string
	onChange: (rule: string) => void
}

const CronRulePanel: React.FC<CronRulePanelProps> = ({ cronRule, onChange }) => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState<"simple" | "advanced">("simple")

	// 预设的常用时间规则
	const presetRules = [
		{ label: t("agents:cronPresets.everyMinute", "每分钟"), value: "* * * * *" },
		{ label: t("agents:cronPresets.hourly", "每小时"), value: "0 * * * *" },
		{ label: t("agents:cronPresets.daily9am", "每天9点"), value: "0 9 * * *" },
		{ label: t("agents:cronPresets.daily6pm", "每天18点"), value: "0 18 * * *" },
		{ label: t("agents:cronPresets.weekdays9am", "工作日9点"), value: "0 9 * * 1-5" },
		{ label: t("agents:cronPresets.weekly", "每周一9点"), value: "0 9 * * 1" },
		{ label: t("agents:cronPresets.monthly", "每月1日9点"), value: "0 9 1 * *" },
	]

	const handlePresetSelect = useCallback((value: string) => {
		onChange(value)
	}, [onChange])

	const handleAdvancedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
	}, [onChange])

	// 解析cron表达式显示描述
	const getCronDescription = useCallback((cron: string) => {
		const parts = cron.split(" ")
		if (parts.length < 5) return t("agents:cronInvalid", "无效的表达式")
		
		// 简单的cron描述逻辑
		const [minute, hour, day, month, weekday] = parts
		
		if (cron === "* * * * *") return t("agents:cronDesc.everyMinute", "每分钟执行")
		if (cron === "0 * * * *") return t("agents:cronDesc.hourly", "每小时执行")
		if (cron === "0 9 * * *") return t("agents:cronDesc.daily9am", "每天上午9点执行")
		if (cron === "0 18 * * *") return t("agents:cronDesc.daily6pm", "每天下午6点执行")
		if (cron === "0 9 * * 1-5") return t("agents:cronDesc.weekdays9am", "工作日上午9点执行")
		if (cron === "0 9 * * 1") return t("agents:cronDesc.weekly", "每周一上午9点执行")
		if (cron === "0 9 1 * *") return t("agents:cronDesc.monthly", "每月1日上午9点执行")
		
		return t("agents:cronDesc.custom", "自定义时间规则")
	}, [t])

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Clock size={14} className="text-vscode-foreground/60" />
				<h3 className="text-sm font-medium text-vscode-foreground">
					{t("agents:cronRuleConfig", "定时规则配置")}
				</h3>
				<StandardTooltip content={t("agents:cronTooltip", "使用 Cron 表达式设置定时任务执行时间")}>
					<Info size={12} className="text-vscode-foreground/50" />
				</StandardTooltip>
			</div>

			{/* 标签页切换 */}
			<div className="flex border-b border-vscode-panel-border">
				<button
					onClick={() => setActiveTab("simple")}
					className={cn(
						"px-3 py-1.5 text-sm font-medium border-b-2 transition-colors",
						activeTab === "simple"
							? "border-vscode-button-background text-vscode-foreground"
							: "border-transparent text-vscode-foreground/70 hover:text-vscode-foreground"
					)}
				>
					{t("agents:simpleMode", "简单模式")}
				</button>
				<button
					onClick={() => setActiveTab("advanced")}
					className={cn(
						"px-3 py-1.5 text-sm font-medium border-b-2 transition-colors",
						activeTab === "advanced"
							? "border-vscode-button-background text-vscode-foreground"
							: "border-transparent text-vscode-foreground/70 hover:text-vscode-foreground"
					)}
				>
					{t("agents:advancedMode", "高级模式")}
				</button>
			</div>

			{/* 内容区域 */}
			<div className="min-h-[120px]">
				{activeTab === "simple" ? (
					<div className="space-y-3">
						<p className="text-xs text-vscode-foreground/70">
							{t("agents:selectPreset", "选择常用的时间规则：")}
						</p>
						<div className="grid grid-cols-2 gap-2">
							{presetRules.map((preset) => (
								<button
									key={preset.value}
									onClick={() => handlePresetSelect(preset.value)}
									className={cn(
										"text-left p-2 rounded-md border text-xs transition-colors",
										cronRule === preset.value
											? "bg-vscode-button-background border-vscode-button-background text-vscode-button-foreground"
											: "bg-vscode-input-background border-vscode-input-border text-vscode-foreground hover:bg-vscode-list-hoverBackground"
									)}
								>
									<div className="font-medium">{preset.label}</div>
									<div className="text-xs text-vscode-foreground/60 font-mono mt-0.5">
										{preset.value}
									</div>
								</button>
							))}
						</div>
					</div>
				) : (
					<div className="space-y-3">
						<p className="text-xs text-vscode-foreground/70">
							{t("agents:cronAdvancedDesc", "自定义 Cron 表达式 (分 时 日 月 周)：")}
						</p>
						<div className="space-y-2">
							<input
								type="text"
								value={cronRule}
								onChange={handleAdvancedChange}
								placeholder="0 9 * * *"
								className="w-full px-3 py-2 bg-vscode-input-background border border-vscode-input-border rounded-md text-sm font-mono text-vscode-foreground placeholder-vscode-foreground/50 focus:outline-none focus:ring-1 focus:ring-vscode-focusBorder"
							/>
							<div className="text-xs text-vscode-foreground/60">
								{t("agents:cronFormat", "格式：分(0-59) 时(0-23) 日(1-31) 月(1-12) 周(0-7)")}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* 当前规则预览 */}
			<div className="p-3 bg-vscode-editor-background rounded-md border border-vscode-panel-border">
				<div className="flex items-center justify-between">
					<span className="text-xs text-vscode-foreground/70">
						{t("agents:currentRule", "当前规则")}:
					</span>
					<span className="text-xs font-mono text-vscode-foreground bg-vscode-badge-background px-2 py-0.5 rounded">
						{cronRule}
					</span>
				</div>
				<div className="text-xs text-vscode-foreground/80 mt-1">
					{getCronDescription(cronRule)}
				</div>
			</div>
		</div>
	)
}

export default CronRulePanel