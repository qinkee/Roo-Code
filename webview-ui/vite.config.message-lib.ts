import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { resolve } from "path"

export default defineConfig({
	plugins: [react(), tailwindcss()],

	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			"@src": resolve(__dirname, "./src"),
			"@roo": resolve(__dirname, "../src/shared"),
		},
	},

	build: {
		lib: {
			entry: resolve(__dirname, "src/message-renderer-lib.tsx"),
			name: "RooMessageRenderer",
			formats: ["umd"],
			fileName: "roo-message-renderer",
		},

		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
				assetFileNames: (assetInfo) => {
					// 字体文件单独处理
					if (assetInfo.name?.endsWith(".ttf") || assetInfo.name?.endsWith(".woff2")) {
						return "fonts/[name][extname]"
					}
					return "assets/[name][extname]"
				},
			},
		},

		// 输出目录
		outDir: "dist-lib",

		// 不分割 CSS
		cssCodeSplit: false,

		// 生成 sourcemap
		sourcemap: true,

		// 压缩
		minify: "esbuild",
	},

	// 复制 katex CSS
	assetsInclude: ["**/*.wasm", "**/*.wav"],
})
