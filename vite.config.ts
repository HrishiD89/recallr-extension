import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  // Relative base so built popup.html resolves `assets/...` paths against
  // the extension's chrome-extension:// origin instead of expecting a
  // dev server. Required for the popup to actually load when you click
  // the toolbar icon on the built extension.
  base: './',
  plugins: [react(), tailwindcss(), crx({ manifest })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Stable CSS filenames so the content script's shadow-root <link>
        // can resolve them via chrome.runtime.getURL. Vite emits CSS chunks
        // in entry order: the popup entry's CSS becomes `index.css`, the
        // content entry's CSS becomes `shadow.css`. We track order with a
        // closure-scoped counter. JS keeps hashed names.
        assetFileNames: (() => {
          const seen = new Set<string>()
          let cssCount = 0
          return (assetInfo) => {
            if (!assetInfo.name?.endsWith('.css')) {
              return 'assets/[name]-[hash][extname]'
            }
            if (seen.has(assetInfo.name)) {
              // Second call for the same asset — return the path we
              // already chose (matched by name + first call's index).
              const idx = [...seen].indexOf(assetInfo.name)
              const name = idx === 0 ? 'index' : 'shadow'
              return `assets/${name}.css`
            }
            seen.add(assetInfo.name)
            const name = cssCount === 0 ? 'index' : 'shadow'
            cssCount += 1
            return `assets/${name}.css`
          }
        })(),
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
