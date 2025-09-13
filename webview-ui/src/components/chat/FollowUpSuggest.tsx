import { useCallback, useEffect, useState, useMemo } from "react"
import { Edit } from "lucide-react"

import { Button, StandardTooltip } from "@/components/ui"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import { SuggestionItem } from "@roo-code/types"

const DEFAULT_FOLLOWUP_TIMEOUT_MS = 60000
const COUNTDOWN_INTERVAL_MS = 1000

interface FollowUpSuggestProps {
	suggestions?: SuggestionItem[]
	onSuggestionClick?: (suggestion: SuggestionItem, event?: React.MouseEvent) => void
	ts: number
	onCancelAutoApproval?: () => void
	isAnswered?: boolean
}

export const FollowUpSuggest = ({
	suggestions = [],
	onSuggestionClick,
	ts = 1,
	onCancelAutoApproval,
	isAnswered = false,
}: FollowUpSuggestProps) => {
	const { autoApprovalEnabled, alwaysAllowFollowupQuestions, followupAutoApproveTimeoutMs } = useExtensionState()
	const [countdown, setCountdown] = useState<number | null>(null)
	const [suggestionSelected, setSuggestionSelected] = useState(false)
	const { t } = useAppTranslation()

	// Determine if countdown should be shown - memoized to prevent flashing
	const shouldShowCountdown = useMemo(() => {
		return (
			autoApprovalEnabled &&
			alwaysAllowFollowupQuestions &&
			suggestions.length > 0 &&
			!suggestionSelected &&
			!isAnswered
		)
	}, [autoApprovalEnabled, alwaysAllowFollowupQuestions, suggestions.length, suggestionSelected, isAnswered])

	// Start countdown timer when auto-approval is enabled for follow-up questions
	useEffect(() => {
		// Only start countdown if conditions are met
		if (shouldShowCountdown) {
			// Start with the configured timeout in seconds
			const timeoutMs =
				typeof followupAutoApproveTimeoutMs === "number" && !isNaN(followupAutoApproveTimeoutMs)
					? followupAutoApproveTimeoutMs
					: DEFAULT_FOLLOWUP_TIMEOUT_MS

			// Convert milliseconds to seconds for the countdown
			setCountdown(Math.floor(timeoutMs / 1000))

			// Update countdown every second
			const intervalId = setInterval(() => {
				setCountdown((prevCountdown) => {
					if (prevCountdown === null || prevCountdown <= 1) {
						clearInterval(intervalId)
						return null
					}
					return prevCountdown - 1
				})
			}, COUNTDOWN_INTERVAL_MS)

			// Clean up interval on unmount and notify parent component
			return () => {
				clearInterval(intervalId)
				// Notify parent component that this component is unmounting
				// so it can clear any related timeouts
				onCancelAutoApproval?.()
			}
		} else {
			setCountdown(null)
		}
	}, [shouldShowCountdown, followupAutoApproveTimeoutMs, onCancelAutoApproval])
	const handleSuggestionClick = useCallback(
		(suggestion: SuggestionItem, event: React.MouseEvent) => {
			// Mark a suggestion as selected if it's not a shift-click (which just copies to input)
			if (!event.shiftKey) {
				setSuggestionSelected(true)
				// Also notify parent component to cancel auto-approval timeout
				// This prevents race conditions between visual countdown and actual timeout
				onCancelAutoApproval?.()
			}

			// Pass the suggestion object to the parent component
			// The parent component will handle mode switching if needed
			onSuggestionClick?.(suggestion, event)
		},
		[onSuggestionClick, onCancelAutoApproval],
	)

	// Don't render if there are no suggestions or no click handler.
	if (!suggestions?.length || !onSuggestionClick) {
		return null
	}

	return (
		<div className="flex flex-col gap-2 mb-2">
			{suggestions.map((suggestion, index) => {
				const isFirstSuggestion = index === 0

				return (
					<div key={`${suggestion.answer}-${ts}`} className="w-full relative group">
						<button
							className="text-left w-full border border-vscode-input-border rounded-md hover:border-transparent hover:bg-vscode-list-hoverBackground cursor-pointer py-3 px-4 flex items-center justify-between transition-all"
							onClick={(event) => handleSuggestionClick(suggestion, event)}
							aria-label={suggestion.answer}>
							<span className="flex-1 pr-3 text-vscode-textPreformat-foreground font-semibold flex items-center">
								<span className="flex-1">{suggestion.answer}</span>
								{isFirstSuggestion && shouldShowCountdown && countdown !== null && countdown > 0 && (
									<span
										className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-vscode-badge-background text-vscode-badge-foreground whitespace-nowrap flex-shrink-0"
										title={t("chat:followUpSuggest.autoSelectCountdown", { count: countdown })}>
										{t("chat:followUpSuggest.countdownDisplay", { count: countdown })}
									</span>
								)}
							</span>
							<span className="text-vscode-textPreformat-foreground font-bold">→</span>
						</button>
						{suggestion.mode && (
							<div className="absolute bottom-0 right-10 text-[10px] bg-vscode-badge-background text-vscode-badge-foreground px-1 py-0.5 border border-vscode-badge-background flex items-center gap-0.5">
								<span className="codicon codicon-arrow-right" style={{ fontSize: "8px" }} />
								{suggestion.mode}
							</div>
						)}
						<StandardTooltip content={t("chat:followUpSuggest.copyToInput")}>
							<div
								className="absolute top-3 right-10 opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={(e) => {
									e.stopPropagation()
									// Cancel the auto-approve timer when edit button is clicked
									setSuggestionSelected(true)
									onCancelAutoApproval?.()
									// Simulate shift-click by directly calling the handler with shiftKey=true.
									onSuggestionClick?.(suggestion, { ...e, shiftKey: true })
								}}>
								<Button variant="ghost" size="icon" className="h-6 w-6">
									<Edit className="h-3 w-3" />
								</Button>
							</div>
						</StandardTooltip>
					</div>
				)
			})}
		</div>
	)
}
