// 资源验证脚本
console.log("🔍 开始验证IM组件资源...")

// 验证字体加载
document.fonts.ready
	.then(() => {
		console.log("✅ 字体加载完成")

		// 检查iconfont字体
		const iconfontLoaded = document.fonts.check("16px iconfont")
		if (iconfontLoaded) {
			console.log("✅ iconfont字体加载成功")
		} else {
			console.warn("⚠️ iconfont字体加载失败")
		}

		// 检查Element UI字体
		const elementIconLoaded = document.fonts.check("16px element-icons")
		if (elementIconLoaded) {
			console.log("✅ element-icons字体加载成功")
		} else {
			console.warn("⚠️ element-icons字体可能未加载")
		}
	})
	.catch((err) => {
		console.error("❌ 字体加载检查失败:", err)
	})

// 验证CSS加载
const cssLink = document.querySelector('link[href*="boxim-components.css"]')
if (cssLink) {
	console.log("✅ BoxIM组件CSS已链接")
} else {
	console.warn("⚠️ BoxIM组件CSS未找到")
}

console.log("🔍 资源验证完成")

//# sourceURL=file:///Users/david/ThinkgsProjects/shadan/void/src/vs/code/electron-sandbox/workbench/im-components/verify-resources.js
//# sourceURL=file:///Users/david/ThinkgsProjects/shadan/void/src/vs/code/electron-sandbox/workbench/im-components/verify-resources.js
