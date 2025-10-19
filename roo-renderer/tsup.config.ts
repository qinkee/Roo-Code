import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.tsx"],
	format: ["iife"],
	dts: false,
	sourcemap: true,
	clean: true,
	minify: false,
	external: ["react", "react-dom", "react/jsx-runtime"],
	globalName: "RooRenderer",
	platform: "browser",
	// IIFE format needs to specify globals for externals
	globals: {
		react: "React",
		"react-dom": "ReactDOM",
		"react/jsx-runtime": "React",
	},
	esbuildOptions(options) {
		// Force externals at esbuild level
		options.external = ["react", "react-dom", "react/jsx-runtime"]
		options.banner = {
			js: "/* Roo-Code Renderer Library - Pure rendering components for im-web integration */",
		}
		options.footer = {
			js: '// Export to global window object\nif (typeof window !== "undefined") { window.RooRenderer = RooRenderer; }',
		}
	},
	// Extract CSS
	injectStyle: false,
	// Include CSS as separate file
	onSuccess: 'echo "✅ Build completed successfully!"',
})
