import React, { useEffect, useMemo, useRef, useState } from "react"
import { getIconForFilePath, getIconUrlByName, getIconForDirectoryPath } from "vscode-material-icons"

import type { ModeConfig } from "@roo-code/types"
import type { Command } from "@roo/ExtensionMessage"

import {
	ContextMenuOptionType,
	ContextMenuQueryItem,
	getContextMenuOptions,
	SearchResult,
} from "@src/utils/context-mentions"
import { removeLeadingNonAlphanumeric } from "@src/utils/removeLeadingNonAlphanumeric"
import { useAppTranslation } from "@/i18n/TranslationContext"

interface ContextMenuProps {
	onSelect: (type: ContextMenuOptionType, value?: string) => void
	searchQuery: string
	inputValue: string
	onMouseDown: () => void
	selectedIndex: number
	setSelectedIndex: (index: number) => void
	selectedType: ContextMenuOptionType | null
	queryItems: ContextMenuQueryItem[]
	modes?: ModeConfig[]
	loading?: boolean
	dynamicSearchResults?: SearchResult[]
	commands?: Command[]
}

const ContextMenu: React.FC<ContextMenuProps> = ({
	onSelect,
	searchQuery,
	onMouseDown,
	selectedIndex,
	setSelectedIndex,
	selectedType,
	queryItems,
	modes,
	dynamicSearchResults = [],
	commands = [],
}) => {
	const [materialIconsBaseUri, setMaterialIconsBaseUri] = useState("")
	const menuRef = useRef<HTMLDivElement>(null)
	const { t } = useAppTranslation()

	const filteredOptions = useMemo(() => {
		return getContextMenuOptions(searchQuery, selectedType, queryItems, dynamicSearchResults, modes, commands)
	}, [searchQuery, selectedType, queryItems, dynamicSearchResults, modes, commands])

	useEffect(() => {
		if (menuRef.current) {
			const selectedElement = menuRef.current.children[selectedIndex] as HTMLElement
			if (selectedElement) {
				const menuRect = menuRef.current.getBoundingClientRect()
				const selectedRect = selectedElement.getBoundingClientRect()

				if (selectedRect.bottom > menuRect.bottom) {
					menuRef.current.scrollTop += selectedRect.bottom - menuRect.bottom
				} else if (selectedRect.top < menuRect.top) {
					menuRef.current.scrollTop -= menuRect.top - selectedRect.top
				}
			}
		}
	}, [selectedIndex])

	// get the icons base uri on mount
	useEffect(() => {
		const w = window as any
		setMaterialIconsBaseUri(w.MATERIAL_ICONS_BASE_URI)
	}, [])

	const renderOptionContent = (option: ContextMenuQueryItem) => {
		switch (option.type) {
			case ContextMenuOptionType.SectionHeader:
				return (
					<span
						style={{
							fontWeight: "bold",
							fontSize: "0.85em",
							opacity: 0.8,
							textTransform: "uppercase",
							letterSpacing: "0.5px",
						}}>
						{option.label === "Custom Commands"
							? t("chat:contextMenu.customCommands")
							: option.label === "Modes"
								? t("chat:contextMenu.modes")
								: option.label === "Friends"
									? t("chat:contextMenu.friends")
									: option.label === "Groups"
										? t("chat:contextMenu.groups")
										: option.label === "Friend Knowledge Base"
											? t("chat:contextMenu.friendKnowledgeBase")
											: option.label === "Group Knowledge Base"
												? t("chat:contextMenu.groupKnowledgeBase")
												: option.label}
					</span>
				)
			case ContextMenuOptionType.Mode:
				return (
					<div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
						<div style={{ lineHeight: "1.2" }}>
							<span>{option.slashCommand}</span>
						</div>
						{option.description && (
							<span
								style={{
									opacity: 0.5,
									fontSize: "0.9em",
									lineHeight: "1.2",
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}>
								{option.description}
							</span>
						)}
					</div>
				)
			case ContextMenuOptionType.Command:
				return (
					<div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
						<div style={{ lineHeight: "1.2", display: "flex", alignItems: "center", gap: "6px" }}>
							<span>{option.slashCommand}</span>
							{option.argumentHint && (
								<span
									style={{
										opacity: 0.5,
										fontSize: "0.9em",
										lineHeight: "1.2",
									}}>
									{option.argumentHint}
								</span>
							)}
						</div>
						{option.description && (
							<span
								style={{
									opacity: 0.5,
									fontSize: "0.9em",
									lineHeight: "1.2",
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}>
								{option.description}
							</span>
						)}
					</div>
				)
			case ContextMenuOptionType.Problems:
				return <span>{t("chat:contextMenu.problems")}</span>
			case ContextMenuOptionType.Terminal:
				return <span>{t("chat:contextMenu.terminal")}</span>
			case ContextMenuOptionType.URL:
				return <span>{t("chat:contextMenu.pasteUrl")}</span>
			case ContextMenuOptionType.NoResults:
				return <span>{option.label || t("chat:contextMenu.noResults")}</span>
			case ContextMenuOptionType.AiChat:
				if (option.value) {
					return (
						<div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
							<span style={{ lineHeight: "1.2" }}>{option.label}</span>
							{option.description && (
								<span
									style={{
										fontSize: "0.85em",
										opacity: 0.7,
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										lineHeight: "1.2",
									}}>
									{option.description}
								</span>
							)}
						</div>
					)
				} else {
					return <span>{t("chat:contextMenu.aiChat")}</span>
				}
			case ContextMenuOptionType.Git:
				if (option.value) {
					return (
						<div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
							<span style={{ lineHeight: "1.2" }}>
								{option.label === "Working changes"
									? t("chat:contextMenu.workingChanges")
									: option.label?.startsWith("Commit ")
										? t("chat:contextMenu.commit") + " " + option.label.substring(7)
										: option.label}
							</span>
							<span
								style={{
									fontSize: "0.85em",
									opacity: 0.7,
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
									lineHeight: "1.2",
								}}>
								{option.description === "Current uncommitted changes"
									? t("chat:contextMenu.currentUncommittedChanges")
									: option.description === "Git commit hash"
										? t("chat:contextMenu.gitCommitHash")
										: option.description}
							</span>
						</div>
					)
				} else {
					return <span>{t("chat:contextMenu.gitCommits")}</span>
				}
			case ContextMenuOptionType.Contacts:
				if (option.value) {
					return (
						<div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
							<span style={{ lineHeight: "1.2" }}>{option.label}</span>
							{option.description && (
								<span
									style={{
										fontSize: "0.85em",
										opacity: 0.7,
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										lineHeight: "1.2",
									}}>
									{option.description}
								</span>
							)}
						</div>
					)
				} else {
					return <span>{t("chat:contextMenu.contacts")}</span>
				}
			case ContextMenuOptionType.KnowledgeBase:
				if (option.value) {
					return (
						<div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
							<span style={{ lineHeight: "1.2" }}>{option.label}</span>
							{option.description && (
								<span
									style={{
										fontSize: "0.85em",
										opacity: 0.7,
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										lineHeight: "1.2",
									}}>
									{option.description}
								</span>
							)}
						</div>
					)
				} else {
					return <span>{t("chat:contextMenu.knowledgeBase")}</span>
				}
			case ContextMenuOptionType.File:
			case ContextMenuOptionType.OpenedFile:
			case ContextMenuOptionType.Folder:
				if (option.value) {
					// remove trailing slash
					const path = removeLeadingNonAlphanumeric(option.value || "").replace(/\/$/, "")
					const pathList = path.split("/")
					const filename = pathList.at(-1)
					const folderPath = pathList.slice(0, -1).join("/")
					return (
						<div
							style={{
								flex: 1,
								overflow: "hidden",
								display: "flex",
								gap: "0.5em",
								whiteSpace: "nowrap",
								alignItems: "center",
								justifyContent: "space-between",
								textAlign: "left",
							}}>
							<span>{filename}</span>
							<span
								style={{
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
									direction: "rtl",
									textAlign: "right",
									flex: 1,
									opacity: 0.75,
									fontSize: "0.75em",
								}}>
								{folderPath}
							</span>
						</div>
					)
				} else {
					return (
						<span>
							{t(
								option.type === ContextMenuOptionType.File
									? "chat:contextMenu.addFile"
									: "chat:contextMenu.addFolder",
							)}
						</span>
					)
				}
		}
	}

	const getIconForOption = (option: ContextMenuQueryItem): string => {
		switch (option.type) {
			case ContextMenuOptionType.Mode:
				return "symbol-misc"
			case ContextMenuOptionType.Command:
				return "play"
			case ContextMenuOptionType.OpenedFile:
				return "window"
			case ContextMenuOptionType.File:
				return "file"
			case ContextMenuOptionType.Folder:
				return "folder"
			case ContextMenuOptionType.Problems:
				return "warning"
			case ContextMenuOptionType.Terminal:
				return "terminal"
			case ContextMenuOptionType.URL:
				return "link"
			case ContextMenuOptionType.Git:
				return "git-commit"
			case ContextMenuOptionType.AiChat:
				return "comment-discussion"
			case ContextMenuOptionType.Contacts:
				return "organization"
			case ContextMenuOptionType.KnowledgeBase:
				return "library"
			case ContextMenuOptionType.NoResults:
				return "info"
			default:
				return "file"
		}
	}

	const getMaterialIconForOption = (option: ContextMenuQueryItem): string => {
		// only take the last part of the path to handle both file and folder icons
		// since material-icons have specific folder icons, we use them if available
		const name = option.value?.split("/").filter(Boolean).at(-1) ?? ""
		const iconName =
			option.type === ContextMenuOptionType.Folder ? getIconForDirectoryPath(name) : getIconForFilePath(name)
		return getIconUrlByName(iconName, materialIconsBaseUri)
	}

	const isOptionSelectable = (option: ContextMenuQueryItem): boolean => {
		return (
			option.type !== ContextMenuOptionType.NoResults &&
			option.type !== ContextMenuOptionType.URL &&
			option.type !== ContextMenuOptionType.SectionHeader
		)
	}

	return (
		<div
			style={{
				position: "absolute",
				bottom: "calc(100% - 10px)",
				left: 15,
				right: 15,
				overflowX: "hidden",
			}}
			onMouseDown={onMouseDown}>
			<div
				ref={menuRef}
				style={{
					backgroundColor: "var(--vscode-dropdown-background)",
					border: "1px solid var(--vscode-editorGroup-border)",
					borderRadius: "3px",
					boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
					zIndex: 1000,
					display: "flex",
					flexDirection: "column",
					maxHeight: "300px",
					overflowY: "auto",
					overflowX: "hidden",
				}}>
				{filteredOptions && filteredOptions.length > 0 ? (
					filteredOptions.map((option, index) => (
						<div
							key={`${option.type}-${option.value || index}`}
							onClick={() => isOptionSelectable(option) && onSelect(option.type, option.value)}
							style={{
								padding:
									option.type === ContextMenuOptionType.SectionHeader ? "8px 6px 4px 6px" : "4px 6px",
								cursor: isOptionSelectable(option) ? "pointer" : "default",
								color: "var(--vscode-dropdown-foreground)",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								position: "relative",
								...(option.type === ContextMenuOptionType.SectionHeader
									? {
											borderBottom: "1px solid var(--vscode-editorGroup-border)",
											marginBottom: "2px",
										}
									: {}),
								...(index === selectedIndex && isOptionSelectable(option)
									? {
											backgroundColor: "var(--vscode-list-activeSelectionBackground)",
											color: "var(--vscode-list-activeSelectionForeground)",
										}
									: {}),
							}}
							onMouseEnter={() => isOptionSelectable(option) && setSelectedIndex(index)}>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									flex: 1,
									minWidth: 0,
									overflow: "hidden",
									paddingTop: 0,
									position: "relative",
								}}>
								{(option.type === ContextMenuOptionType.File ||
									option.type === ContextMenuOptionType.Folder ||
									option.type === ContextMenuOptionType.OpenedFile) && (
									<img
										src={getMaterialIconForOption(option)}
										alt="Mode"
										style={{
											marginRight: "6px",
											flexShrink: 0,
											width: "16px",
											height: "16px",
										}}
									/>
								)}
								{option.type !== ContextMenuOptionType.Mode &&
									option.type !== ContextMenuOptionType.Command &&
									option.type !== ContextMenuOptionType.File &&
									option.type !== ContextMenuOptionType.Folder &&
									option.type !== ContextMenuOptionType.OpenedFile &&
									option.type !== ContextMenuOptionType.SectionHeader &&
									getIconForOption(option) && (
										<i
											className={`codicon codicon-${getIconForOption(option)}`}
											style={{
												marginRight: "6px",
												flexShrink: 0,
												fontSize: "14px",
												marginTop: 0,
											}}
										/>
									)}
								{renderOptionContent(option)}
							</div>
							{(option.type === ContextMenuOptionType.File ||
								option.type === ContextMenuOptionType.Folder ||
								option.type === ContextMenuOptionType.Git ||
								option.type === ContextMenuOptionType.AiChat ||
								option.type === ContextMenuOptionType.Contacts ||
								option.type === ContextMenuOptionType.KnowledgeBase) &&
								!option.value && (
									<i
										className="codicon codicon-chevron-right"
										style={{ fontSize: "10px", flexShrink: 0, marginLeft: 8 }}
									/>
								)}
						</div>
					))
				) : (
					<div
						style={{
							padding: "4px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "var(--vscode-foreground)",
							opacity: 0.7,
						}}>
						<span>{t("chat:contextMenu.noResults")}</span>
					</div>
				)}
			</div>
		</div>
	)
}

export default ContextMenu
