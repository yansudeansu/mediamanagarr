import { defineConfig, type Plugin } from 'vitest/config'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import packageJson from './package.json' with { type: 'json' }

type BrowserTarget = 'chrome' | 'firefox'

function buildDefinitions(browser: BrowserTarget): Record<string, string> {
  return {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
    'import.meta.env.VITE_BROWSER_TARGET': JSON.stringify(browser),
  }
}

function extensionPlugin(browser: BrowserTarget): Plugin {
  return {
    name: 'mediamanagarr-extension',
    apply: 'build',

    async closeBundle() {
      const outDir = join(process.cwd(), 'dist', browser)

      // Keep background code separate from the popup and use the same target.
      await build({
        configFile: false,
        define: buildDefinitions(browser),
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
        manifest.background = { scripts: ['background.js'] }
        manifest.sidebar_action = {
          default_panel: 'index.html?workspace=sidebar',
          default_title: 'MediaManagarr',
          default_icon: {
            '16': 'icons/icon-16.png',
            '32': 'icons/icon-32.png',
            '48': 'icons/icon-48.png',
            '128': 'icons/icon-128.png',
          },
        }
      } else {
        manifest.background = { service_worker: 'background.js' }
        manifest.side_panel = { default_path: 'index.html?workspace=sidebar' }
        manifest.permissions = [...new Set([...(manifest.permissions as string[]), 'sidePanel'])]
        delete manifest.browser_specific_settings
      }

      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const browser: BrowserTarget = mode === 'firefox' ? 'firefox' : 'chrome'
  const definitions = buildDefinitions(browser)

  // Tests select the target with vi.stubEnv instead of a compile-time constant.
  if (process.env.VITEST) {
    delete definitions['import.meta.env.VITE_BROWSER_TARGET']
  }

  return {
    plugins: [vue(), extensionPlugin(browser)],
    base: './',
    define: definitions,
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
