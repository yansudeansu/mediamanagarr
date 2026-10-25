import { defineConfig, type Plugin } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import packageJson from './package.json' with { type: 'json' }

type BrowserTarget = 'chrome' | 'firefox'

function manifestPlugin(browser: BrowserTarget): Plugin {
  return {
    name: 'mediamanagarr-manifest',

    apply: 'build',

    closeBundle() {
      const manifestPath = join(process.cwd(), 'dist', browser, 'manifest.json')

      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as Record<string, unknown>

      manifest.version = packageJson.version

      if (browser === 'firefox') {
        manifest.background = {
          scripts: ['background.js'],
        }
      } else {
        manifest.background = {
          service_worker: 'background.js',
          type: 'module',
        }

        delete manifest.browser_specific_settings
      }

      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const browser: BrowserTarget = mode === 'firefox' ? 'firefox' : 'chrome'

  return {
    plugins: [vue(), manifestPlugin(browser)],

    base: './',

    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
    },

    build: {
      outDir: `dist/${browser}`,

      // Vite must not remove the other browser's build.
      emptyOutDir: true,

      rollupOptions: {
        input: {
          popup: join(process.cwd(), 'index.html'),
          background: join(process.cwd(), 'src/background/index.ts'),
        },

        output: {
          entryFileNames: (chunk) =>
            chunk.name === 'background' ? 'background.js' : 'assets/[name]-[hash].js',

          chunkFileNames: 'assets/[name]-[hash].js',

          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },

    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.test.ts'],
    },
  }
})
