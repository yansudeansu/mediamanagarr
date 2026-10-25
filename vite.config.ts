import { defineConfig, type Plugin } from 'vitest/config'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import packageJson from './package.json' with { type: 'json' }

type BrowserTarget = 'chrome' | 'firefox'

function extensionPlugin(browser: BrowserTarget): Plugin {
  return {
    name: 'mediamanagarr-extension',

    apply: 'build',

    async closeBundle() {
      const outDir = join(process.cwd(), 'dist', browser)

      // Build the background separately so it cannot share chunks
      // with the popup.
      await build({
        configFile: false,

        build: {
          outDir,
          emptyOutDir: false,
          lib: {
            entry: join(process.cwd(), 'src/background/index.ts'),
            name: 'MediaManagarrBackground',
            formats: ['iife'],
            fileName: () => 'background.js',
          },
        },
      })

      const manifestPath = join(outDir, 'manifest.json')
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, unknown>

      manifest.version = packageJson.version

      if (browser === 'firefox') {
        manifest.background = {
          scripts: ['background.js'],
        }
      } else {
        manifest.background = {
          service_worker: 'background.js',
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
    plugins: [vue(), extensionPlugin(browser)],

    base: './',

    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
    },

    build: {
      outDir: `dist/${browser}`,
      emptyOutDir: true,

      rollupOptions: {
        input: join(process.cwd(), 'index.html'),
      },
    },

    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.test.ts'],
    },
  }
})
