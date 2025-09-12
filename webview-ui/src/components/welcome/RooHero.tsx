import { useState } from "react"

const RooHero = () => {
	const [imagesBaseUri] = useState(() => {
		const w = window as any
		return w.IMAGES_BASE_URI || ""
	})

	return (
		<div className="flex flex-col items-center justify-center pb-4 forced-color-adjust-none">
			{/* 直接显示SVG，保留原始颜色 */}
			<img 
				src={imagesBaseUri + "/roo-logo.svg"} 
				alt="Roo logo" 
				className="h-10 mx-auto"
				style={{ width: "auto", height: "40px" }}
			/>
		</div>
	)
}

export default RooHero
