import React from "react"
import { cn } from "@src/lib/utils"

interface VolumeSliderProps {
	value: number
	onChange: (value: number) => void
	min?: number
	max?: number
	step?: number
	disabled?: boolean
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	disabled = false
}) => {
	const percentage = ((value - min) / (max - min)) * 100

	return (
		<div className="relative">
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				disabled={disabled}
				className={cn(
					"w-full h-2 bg-vscode-input-border rounded-lg appearance-none cursor-pointer slider-thumb",
					"focus:outline-none focus:ring-2 focus:ring-vscode-focusBorder focus:ring-opacity-50",
					disabled && "opacity-50 cursor-not-allowed"
				)}
				style={{
					background: `linear-gradient(to right, var(--vscode-button-background) 0%, var(--vscode-button-background) ${percentage}%, var(--vscode-input-border) ${percentage}%, var(--vscode-input-border) 100%)`
				}}
			/>
			<style dangerouslySetInnerHTML={{
				__html: `
					.slider-thumb::-webkit-slider-thumb {
						appearance: none;
						height: 16px;
						width: 16px;
						border-radius: 50%;
						background: var(--vscode-button-foreground);
						border: 2px solid var(--vscode-button-background);
						cursor: pointer;
						box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
						transition: all 0.15s ease-in-out;
					}
					
					.slider-thumb::-webkit-slider-thumb:hover {
						transform: scale(1.1);
						box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
					}
					
					.slider-thumb::-moz-range-thumb {
						appearance: none;
						height: 16px;
						width: 16px;
						border-radius: 50%;
						background: var(--vscode-button-foreground);
						border: 2px solid var(--vscode-button-background);
						cursor: pointer;
						box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
					}
				`
			}} />
		</div>
	)
}

export default VolumeSlider