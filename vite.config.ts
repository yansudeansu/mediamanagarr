import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [vue()],

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
