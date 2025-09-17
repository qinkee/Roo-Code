import React, { useCallback, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import ApiOptions from "./ApiOptions"
import type { ProviderSettings } from "@roo-code/types"

interface ApiConfigViewProps {
	onBack: () => void
}

const ApiConfigView: React.FC<ApiConfigViewProps> = ({ onBack }) => {
	const { t } = useTranslation()
	const { apiConfiguration, setApiConfiguration } = useExtensionState()
	const [errorMessage, setErrorMessage] = useState<string | undefined>()

	const handleApiConfigFieldChange = useCallback(<K extends keyof ProviderSettings>(
		field: K,
		value: ProviderSettings[K]
	) => {
		if (apiConfiguration) {
			setApiConfiguration({
				...apiConfiguration,
				[field]: value
			})
		}
	}, [apiConfiguration, setApiConfiguration])

	return (
		<div className="flex flex-col h-full bg-vscode-editor-background text-vscode-foreground">
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 border-b border-vscode-panel-border">
				<div className="flex items-center gap-3">
					<button
						onClick={onBack}
						className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors"
					>
						<ArrowLeft size={16} />
					</button>
					<h1 className="text-lg font-bold">{t("settings:apiConfiguration", "API配置")}</h1>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-auto px-6 py-4">
				{apiConfiguration && (
					<ApiOptions
						uriScheme={undefined}
						apiConfiguration={apiConfiguration}
						setApiConfigurationField={handleApiConfigFieldChange}
						fromWelcomeView={false}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
					/>
				)}
			</div>
		</div>
	)
}

export default ApiConfigView