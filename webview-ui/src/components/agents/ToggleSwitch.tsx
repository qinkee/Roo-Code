import React from "react"
import { cn } from "@src/lib/utils"

interface ToggleSwitchProps {
	checked: boolean
	onChange: (checked: boolean) => void
	disabled?: boolean
	size?: "sm" | "md"
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
	checked, 
	onChange, 
	disabled = false,
	size = "sm"
}) => {
	const sizeClasses = {
		sm: {
			track: "w-9 h-5",
			thumb: "h-4 w-4 after:h-3.5 after:w-3.5"
		},
		md: {
			track: "w-11 h-6", 
			thumb: "h-5 w-5 after:h-4 after:w-4"
		}
	}

	return (
		<label className={cn("relative inline-flex items-center", disabled ? "cursor-not-allowed" : "cursor-pointer")}>
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				disabled={disabled}
				className="sr-only peer"
			/>
			<div className={cn(
				"relative rounded-full transition-colors duration-200 ease-in-out peer-focus:outline-none",
				sizeClasses[size].track,
				checked 
					? "bg-vscode-button-background" 
					: "bg-vscode-input-border",
				disabled && "opacity-50"
			)}>
				<div className={cn(
					"absolute top-0.5 left-0.5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out",
					sizeClasses[size].thumb,
					checked && "translate-x-4"
				)} />
			</div>
		</label>
	)
}

export default ToggleSwitch