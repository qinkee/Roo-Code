import React, { useState, useCallback, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Plus, ChevronDown, Sparkles } from "lucide-react"
import { cn } from "@src/lib/utils"

interface ActionBarProps {
	onCreateNew: () => void
	onCreateFromTask: () => void
}

const ActionBar: React.FC<ActionBarProps> = ({ onCreateNew, onCreateFromTask }) => {
	const { t } = useTranslation()
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const handleToggle = useCallback(() => {
		setIsOpen((prev) => !prev)
	}, [])

	const handleCreateNew = useCallback(() => {
		setIsOpen(false)
		onCreateNew()
	}, [onCreateNew])

	const handleCreateFromTask = useCallback(() => {
		setIsOpen(false)
		onCreateFromTask()
	}, [onCreateFromTask])

	// 点击外部关闭下拉菜单
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside)
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isOpen])

	return (
		<div className="relative" ref={dropdownRef}>
			{/* ActionBar Button */}
			<button
				onClick={handleToggle}
				className={cn(
					"flex items-center gap-1.5 px-3 py-1.5 bg-vscode-button-background hover:bg-vscode-button-hoverBackground text-vscode-button-foreground rounded-md text-sm font-bold transition-colors",
					isOpen && "bg-vscode-button-hoverBackground",
				)}>
				<Plus size={14} />
				{t("agents:create", "创建")}
				<ChevronDown size={12} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute top-full right-0 mt-1 w-48 bg-vscode-dropdown-background border border-vscode-dropdown-border rounded-md shadow-lg z-50">
					<div className="py-1">
						<button
							onClick={handleCreateNew}
							className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-vscode-dropdown-foreground hover:bg-vscode-list-hoverBackground transition-colors">
							<Plus size={14} />
							<span>{t("agents:createNew", "新建")}</span>
						</button>
						<button
							onClick={handleCreateFromTask}
							className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-vscode-dropdown-foreground hover:bg-vscode-list-hoverBackground transition-colors">
							<Sparkles size={14} />
							<span>{t("agents:createFromTask", "通过任务创建")}</span>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default ActionBar
