import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { X, Terminal, Monitor, Smartphone, Laptop } from "lucide-react"

interface Terminal {
	id: string
	name: string
	type: "desktop" | "mobile" | "web" | "server"
	status: "online" | "offline"
	lastSeen?: string
	platform?: string
}

interface TerminalSelectionModalProps {
	isOpen: boolean
	onClose: () => void
	onSelect: (terminal: Terminal) => void
	agentName: string
}

const TerminalSelectionModal: React.FC<TerminalSelectionModalProps> = ({ isOpen, onClose, onSelect, agentName }) => {
	const _t = useTranslation().t
	const [terminals, setTerminals] = useState<Terminal[]>([])
	const [loading, setLoading] = useState(false)
	const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null)

	// 发布终端选项 - 仅支持本地和云电脑
	const mockTerminals: Terminal[] = [
		{
			id: "local-computer",
			name: "我的电脑",
			type: "desktop",
			status: "online",
			platform: "本地环境",
			lastSeen: "当前",
		},
		{
			id: "cloud-computer",
			name: "我的云电脑",
			type: "server",
			status: "offline",
			platform: "云环境",
			lastSeen: "暂未配置",
		},
	]

	useEffect(() => {
		if (isOpen) {
			setLoading(true)
			// 模拟加载延迟
			setTimeout(() => {
				setTerminals(mockTerminals)
				setLoading(false)
			}, 500)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen])

	const getTerminalIcon = (type: string) => {
		switch (type) {
			case "desktop":
				return <Laptop size={20} />
			case "mobile":
				return <Smartphone size={20} />
			case "web":
				return <Monitor size={20} />
			case "server":
				return <Terminal size={20} />
			default:
				return <Terminal size={20} />
		}
	}

	const getTerminalTypeText = (type: string) => {
		switch (type) {
			case "desktop":
				return "桌面端"
			case "mobile":
				return "移动端"
			case "web":
				return "网页端"
			case "server":
				return "服务器"
			default:
				return "未知"
		}
	}

	const handleSelect = () => {
		if (selectedTerminal) {
			onSelect(selectedTerminal)
			onClose()
		}
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			{/* 半透明遮罩层 */}
			<div className="absolute inset-0 bg-black/30" onClick={onClose}></div>

			{/* 弹出窗口 */}
			<div className="relative bg-vscode-editor-background border border-vscode-panel-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-vscode-panel-border">
					<div>
						<h2 className="text-lg font-bold text-vscode-foreground">选择发布终端</h2>
						<p className="text-sm text-vscode-foreground/70 mt-1">
							为智能体 &quot;{agentName}&quot; 选择运行终端
						</p>
					</div>
					<button onClick={onClose} className="p-1 hover:bg-vscode-toolbar-hoverBackground rounded">
						<X size={16} className="text-vscode-foreground/70" />
					</button>
				</div>

				{/* Content */}
				<div className="p-4 max-h-96 overflow-y-auto">
					{loading ? (
						<div className="text-center py-8">
							<div className="text-sm text-vscode-foreground/70">正在加载终端列表...</div>
						</div>
					) : terminals.length === 0 ? (
						<div className="text-center py-8">
							<Terminal size={48} className="mx-auto text-vscode-foreground/30 mb-4" />
							<div className="text-sm text-vscode-foreground/70">暂无可用终端</div>
							<div className="text-xs text-vscode-foreground/50 mt-1">请确保至少有一个终端在线</div>
						</div>
					) : (
						<div className="space-y-2">
							{terminals.map((terminal) => (
								<div
									key={terminal.id}
									onClick={() => setSelectedTerminal(terminal)}
									className={`p-3 rounded-md border cursor-pointer transition-colors ${
										selectedTerminal?.id === terminal.id
											? "border-vscode-focusBorder bg-vscode-list-activeSelectionBackground"
											: "border-vscode-input-border bg-vscode-input-background hover:bg-vscode-list-hoverBackground"
									} ${terminal.status === "offline" ? "opacity-50" : ""}`}>
									<div className="flex items-center gap-3">
										<div
											className={`p-2 rounded ${
												terminal.status === "online"
													? "bg-green-500/20 text-green-400"
													: "bg-gray-500/20 text-gray-400"
											}`}>
											{getTerminalIcon(terminal.type)}
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<span className="font-medium text-vscode-foreground">
													{terminal.name}
												</span>
												<span
													className={`px-2 py-0.5 rounded text-xs ${
														terminal.status === "online"
															? "bg-green-500/20 text-green-400"
															: "bg-gray-500/20 text-gray-400"
													}`}>
													{terminal.status === "online" ? "在线" : "离线"}
												</span>
											</div>
											<div className="text-xs text-vscode-foreground/70 mt-1">
												{getTerminalTypeText(terminal.type)} • {terminal.platform} • 最后活跃:{" "}
												{terminal.lastSeen}
											</div>
										</div>
										{terminal.status === "offline" && (
											<div className="text-xs text-vscode-foreground/50">离线终端无法发布</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-2 p-4 border-t border-vscode-panel-border">
					<button
						onClick={onClose}
						className="px-4 py-2 text-sm bg-vscode-button-secondaryBackground hover:bg-vscode-button-secondaryHoverBackground text-vscode-button-secondaryForeground rounded">
						取消
					</button>
					<button
						onClick={handleSelect}
						disabled={!selectedTerminal || selectedTerminal.status === "offline"}
						className="px-4 py-2 text-sm bg-vscode-button-background hover:bg-vscode-button-hoverBackground text-vscode-button-foreground rounded disabled:opacity-50 disabled:cursor-not-allowed">
						发布到此终端
					</button>
				</div>
			</div>
		</div>
	)
}

export default TerminalSelectionModal
