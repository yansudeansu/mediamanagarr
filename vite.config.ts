import { defineConfig, type Plugin } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import packageJson from './package.json' with { type: 'json' }

function manifestVersionPlugin(): Plugin {
  return {
    name: 'manifest-version',

    apply: 'build',

    closeBundle() {
      const manifestPath = join(process.cwd(), 'dist/manifest.json')

      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as Record<string, unknown>

      manifest.version = packageJson.version

      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
    },
  }
}

export default defineConfig({
  plugins: [vue(), manifestVersionPlugin()],

  base: './',

  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
  },

  build: {
    outDir: 'dist',
  },

  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
})
