import { useCallback, useState, useEffect } from "react"
import { useAppTranslation } from "@/i18n/TranslationContext"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
} from "@/components/ui"
import { vscode } from "@/utils/vscode"
import { AlertDialogProps } from "@radix-ui/react-alert-dialog"
import { useExtensionState } from "@/context/ExtensionStateContext"

interface BatchDeleteTaskDialogProps extends AlertDialogProps {
	taskIds: string[]
}

export const BatchDeleteTaskDialog = ({ taskIds, ...props }: BatchDeleteTaskDialogProps) => {
	const { t } = useAppTranslation()
	const { onOpenChange } = props
	const [isDeleting, setIsDeleting] = useState(false)
	const { taskHistory } = useExtensionState()
	const initialTaskCount = useState(() => taskHistory.length)[0]

	// Monitor task history changes to detect deletion completion
	useEffect(() => {
		if (isDeleting && taskHistory.length < initialTaskCount) {
			// Wait for UI to fully update before closing
			setTimeout(() => {
				setIsDeleting(false)
				onOpenChange?.(false)
			}, 300)
		}
	}, [taskHistory.length, isDeleting, initialTaskCount, onOpenChange])

	const onDelete = useCallback(
		(e: React.MouseEvent) => {
			// Prevent AlertDialogAction from closing the dialog
			e.preventDefault()

			if (taskIds.length > 0 && !isDeleting) {
				setIsDeleting(true)
				vscode.postMessage({ type: "deleteMultipleTasksWithIds", ids: taskIds })
				// Keep the dialog open while deleting to show loading state
			}
		},
		[taskIds, isDeleting]
	)

	return (
		<AlertDialog {...props}>
			<AlertDialogContent className="max-w-md">
				{isDeleting ? (
					<div className="flex items-center justify-center py-16">
						<div className="flex flex-col items-center gap-2">
							<span className="codicon codicon-loading codicon-modifier-spin text-2xl text-vscode-foreground"></span>
							<span className="text-vscode-foreground text-sm">
								{t("history:deletingTasks", { count: taskIds.length })}
							</span>
						</div>
					</div>
				) : (
					<>
						<AlertDialogHeader>
							<AlertDialogTitle>{t("history:deleteTasks")}</AlertDialogTitle>
							<AlertDialogDescription className="text-vscode-foreground">
								<div className="mb-2">{t("history:confirmDeleteTasks", { count: taskIds.length })}</div>
								<div className="text-vscode-editor-foreground bg-vscode-editor-background p-2 rounded text-sm">
									{t("history:deleteTasksWarning")}
								</div>
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel asChild>
								<Button variant="secondary">
									{t("history:cancel")}
								</Button>
							</AlertDialogCancel>
							<AlertDialogAction asChild>
								<Button variant="destructive" onClick={onDelete}>
									<span className="codicon codicon-trash mr-1"></span>
									{t("history:deleteItems", { count: taskIds.length })}
								</Button>
							</AlertDialogAction>
						</AlertDialogFooter>
					</>
				)}
			</AlertDialogContent>
		</AlertDialog>
	)
}
