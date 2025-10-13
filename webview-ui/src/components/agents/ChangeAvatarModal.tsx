import React, { useState, useCallback, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { X, Upload, RotateCcw } from "lucide-react"
import { cn } from "@src/lib/utils"
import { StandardTooltip } from "@src/components/ui"
import { uploadImage } from "@src/api/upload"

interface ChangeAvatarModalProps {
	isOpen: boolean
	onClose: () => void
	currentAvatar?: string
	onAvatarChange: (avatar: string) => void
	agentName?: string
	onNameChange?: (name: string) => void
}

const ChangeAvatarModal: React.FC<ChangeAvatarModalProps> = ({
	isOpen,
	onClose,
	currentAvatar,
	onAvatarChange,
	agentName,
	onNameChange,
}) => {
	const { t } = useTranslation()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || "")
	const [showNameInput, setShowNameInput] = useState(false)
	const [tempName, setTempName] = useState("")
	const [uploading, setUploading] = useState(false)
	const [uploadError, setUploadError] = useState<string>("")

	// Reset state when modal opens/closes
	useEffect(() => {
		if (isOpen) {
			setSelectedAvatar(currentAvatar || "")
			setShowNameInput(false)
			setTempName("")
			setUploading(false)
			setUploadError("")
		}
	}, [isOpen, currentAvatar])

	const handleFileSelect = useCallback(() => {
		fileInputRef.current?.click()
	}, [])

	const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file && file.type.startsWith("image/")) {
			setUploadError("")
			setUploading(true)

			try {
				// 上传图片到后端服务器
				const result = await uploadImage(file)
				// 使用原图URL作为头像
				setSelectedAvatar(result.originUrl)
			} catch (error) {
				console.error("Upload failed:", error)
				setUploadError(error instanceof Error ? error.message : "上传失败")

				// 上传失败时，仍然显示本地预览
				const reader = new FileReader()
				reader.onload = (e) => {
					const result = e.target?.result as string
					setSelectedAvatar(result)
				}
				reader.readAsDataURL(file)
			} finally {
				setUploading(false)
			}
		}
	}, [])

	// Helper function to generate avatar from name
	const generateAvatarFromName = useCallback((name: string) => {
		const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"]
		const nameHash = name.split("").reduce((hash, char) => hash + char.charCodeAt(0), 0)
		const colorIndex = nameHash % colors.length
		const selectedColor = colors[colorIndex]

		const initial = name.charAt(0).toUpperCase()

		const svgContent = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
				<rect width="100" height="100" fill="${selectedColor}"/>
				<text x="50" y="60" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">${initial}</text>
			</svg>`
		const avatar = `data:image/svg+xml,${encodeURIComponent(svgContent)}`
		setSelectedAvatar(avatar)
	}, [])

	const handleRandomAvatar = useCallback(() => {
		// 如果智能体名称为空，显示名称输入框
		if (!agentName || agentName.trim() === "") {
			setShowNameInput(true)
			return
		}

		// 有名称时直接生成头像
		generateAvatarFromName(agentName)
	}, [agentName, generateAvatarFromName])

	const handleGenerateWithName = useCallback(() => {
		if (tempName.trim()) {
			const trimmedName = tempName.trim()
			generateAvatarFromName(trimmedName)

			// 同时更新主页面的智能体名称
			if (onNameChange) {
				onNameChange(trimmedName)
			}

			setShowNameInput(false)
			setTempName("")
		}
	}, [tempName, generateAvatarFromName, onNameChange])

	const handleUse = useCallback(() => {
		if (selectedAvatar) {
			onAvatarChange(selectedAvatar)
		}
		onClose()
	}, [selectedAvatar, onAvatarChange, onClose])

	const handleBackdropClick = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === e.currentTarget) {
				onClose()
			}
		},
		[onClose],
	)

	if (!isOpen) return null

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center"
			style={{ zIndex: 9999 }}
			onClick={handleBackdropClick}>
			<div className="bg-vscode-editor-background border border-vscode-panel-border rounded-lg max-w-xs w-full mx-4">
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3 border-b border-vscode-panel-border">
					<h2 className="text-lg font-bold text-vscode-foreground">{t("agents:changeAvatar", "更改头像")}</h2>
					<button
						onClick={onClose}
						className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors">
						<X size={16} />
					</button>
				</div>

				{/* Content */}
				<div className="p-4">
					{/* Avatar Preview */}
					<div className="flex justify-center mb-4">
						<div className="w-24 h-24 rounded-lg overflow-hidden bg-vscode-input-background border-2 border-vscode-input-border flex items-center justify-center relative">
							{uploading ? (
								<div className="flex flex-col items-center justify-center">
									<div className="w-8 h-8 border-2 border-vscode-button-background border-t-transparent rounded-full animate-spin"></div>
									<span className="text-xs text-vscode-foreground/70 mt-2">上传中...</span>
								</div>
							) : selectedAvatar ? (
								<img src={selectedAvatar} alt="Avatar preview" className="w-full h-full object-cover" />
							) : (
								<div className="w-16 h-16 bg-vscode-button-background rounded-lg flex items-center justify-center">
									<span className="text-2xl">👤</span>
								</div>
							)}
						</div>
					</div>

					{/* Upload Error Message */}
					{uploadError && (
						<div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-md">
							<p className="text-xs text-red-400">{uploadError}</p>
						</div>
					)}

					{/* Name Input Section - Show when needed (above buttons) */}
					{showNameInput && (
						<div className="mb-3 p-3 bg-vscode-input-background border border-vscode-input-border rounded-md">
							<div className="text-sm font-medium text-vscode-foreground mb-2">
								{t("agents:agentName", "智能体名称")}
							</div>
							<div className="flex gap-2">
								<input
									type="text"
									value={tempName}
									onChange={(e) => setTempName(e.target.value)}
									placeholder={t("agents:agentNamePlaceholder", "请输入智能体名称")}
									className="flex-1 px-3 py-2 bg-vscode-editor-background border border-vscode-input-border rounded-md text-sm text-vscode-foreground placeholder-vscode-foreground/50 focus:outline-none focus:ring-1 focus:ring-vscode-focusBorder"
									onKeyPress={(e) => {
										if (e.key === "Enter" && tempName.trim()) {
											handleGenerateWithName()
										}
									}}
								/>
								<button
									onClick={handleGenerateWithName}
									disabled={!tempName.trim()}
									className={cn(
										"px-3 py-2 text-sm rounded-md transition-colors",
										tempName.trim()
											? "bg-vscode-button-background hover:bg-vscode-button-hoverBackground text-vscode-button-foreground"
											: "bg-vscode-button-background/50 text-vscode-button-foreground/50 cursor-not-allowed",
									)}>
									{t("agents:generate", "生成")}
								</button>
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="space-y-3">
						<StandardTooltip content={t("agents:randomAvatar", "换一个")}>
							<button
								onClick={handleRandomAvatar}
								className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-vscode-input-background hover:bg-vscode-list-hoverBackground border border-vscode-input-border rounded-md text-vscode-foreground transition-colors">
								<RotateCcw size={16} />
								{t("agents:randomAvatar", "换一个")}
							</button>
						</StandardTooltip>

						<StandardTooltip content={t("agents:uploadFromDevice", "从本地上传")}>
							<button
								onClick={handleFileSelect}
								disabled={uploading}
								className={cn(
									"w-full flex items-center justify-center gap-2 px-4 py-3 border border-vscode-input-border rounded-md transition-colors",
									uploading
										? "bg-vscode-input-background/50 text-vscode-foreground/50 cursor-not-allowed"
										: "bg-vscode-input-background hover:bg-vscode-list-hoverBackground text-vscode-foreground",
								)}>
								<Upload size={16} />
								{uploading
									? t("agents:uploading", "上传中...")
									: t("agents:uploadFromDevice", "从本地上传")}
							</button>
						</StandardTooltip>
					</div>

					{/* Hidden file input */}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-vscode-panel-border">
					<button
						onClick={onClose}
						className="px-4 py-2 text-sm text-vscode-foreground hover:bg-vscode-toolbar-hoverBackground rounded-md transition-colors">
						{t("agents:cancel", "取消")}
					</button>
					<button
						onClick={handleUse}
						className={cn(
							"px-4 py-2 text-sm rounded-md transition-colors",
							selectedAvatar
								? "bg-vscode-button-background hover:bg-vscode-button-hoverBackground text-vscode-button-foreground"
								: "bg-vscode-button-background/50 text-vscode-button-foreground/50 cursor-not-allowed",
						)}
						disabled={!selectedAvatar}>
						{t("agents:use", "使用")}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ChangeAvatarModal
