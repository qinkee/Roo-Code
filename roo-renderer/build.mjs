import * as esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Plugin to replace React imports with global variables
const externalGlobalsPlugin = {
  name: 'external-globals',
  setup(build) {
    // Map module imports to global variables
    const globals = {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react/jsx-runtime': 'React.jsxRuntime'
    }

    // Intercept imports and replace with global variable access
    for (const [module, globalVar] of Object.entries(globals)) {
      build.onResolve({ filter: new RegExp(`^${module}$`) }, args => {
        return { path: args.path, namespace: 'external-global' }
      })
    }

    build.onLoad({ filter: /.*/, namespace: 'external-global' }, args => {
      const globalVar = globals[args.path]
      // Return code that accesses the global variable
      let contents
      if (args.path === 'react') {
        contents = `module.exports = window.React`
      } else if (args.path === 'react-dom') {
        contents = `module.exports = window.ReactDOM`
      } else if (args.path === 'react/jsx-runtime') {
        // 🔥 修复：使用 React 18 的完整 JSX runtime API
        contents = `
          const React = window.React;
          module.exports = {
            jsx: React.createElement,
            jsxs: React.createElement,
            Fragment: React.Fragment,
            jsxDEV: React.createElement
          };
        `
      }
      return { contents, loader: 'js' }
    })
  }
}

// Build with proper externals
await esbuild.build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  format: 'iife',
  globalName: 'RooRenderer',
  outfile: 'dist/index.global.js',
  sourcemap: true,
  platform: 'browser',
  target: 'es2020',
  plugins: [externalGlobalsPlugin],
  banner: {
    js: `/* Roo-Code Renderer Library - Pure rendering components for im-web integration */`
  },
  footer: {
    js: `// Export to global window object\nif (typeof window !== "undefined") { window.RooRenderer = RooRenderer; }`
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.css': 'text'  // Load CSS as text so we can inject it
  },
  jsx: 'automatic',
  jsxImportSource: 'react'
})

console.log('✅ Build completed!')

// Inject CSS into the JS bundle
const cssPath = path.join(__dirname, 'src/markdown.css')
const css = fs.readFileSync(cssPath, 'utf-8')
const jsPath = 'dist/index.global.js'
let jsContent = fs.readFileSync(jsPath, 'utf-8')

// Add CSS injection code at the beginning
const cssInjection = `
// Inject CSS
(function() {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = ${JSON.stringify(css)};
    document.head.appendChild(style);
  }
})();
`

// Insert after the banner comment
jsContent = jsContent.replace(
  '/* Roo-Code Renderer Library - Pure rendering components for im-web integration */',
  '/* Roo-Code Renderer Library - Pure rendering components for im-web integration */' + cssInjection
)

fs.writeFileSync(jsPath, jsContent)
console.log('✅ CSS injected into bundle!')

// Check file size
const stats = fs.statSync('dist/index.global.js')
console.log(`📦 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
