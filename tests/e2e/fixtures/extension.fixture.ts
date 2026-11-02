import { test as base, chromium, expect, type BrowserContext, type Page } from '@playwright/test'
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { seedExtensionStorage, type ExtensionStorageSeed } from './storage.fixture'
import { startMockSonarrServer, type MockSonarrServer } from './mock-services.fixture'

type ExtensionFixtures = {
  extensionId: string
  extensionPage: Page
  storageSeed: ExtensionStorageSeed
  mockSonarr: MockSonarrServer
}

export const test = base.extend<ExtensionFixtures>({
  storageSeed: [{}, { option: true }],

  context: async ({ browserName }, use) => {
    if (browserName !== 'chromium') {
      throw new Error('The Chromium extension fixture requires the Chromium Playwright project.')
    }

    const sourcePath = resolve(process.cwd(), 'dist/chrome')
    const temporaryPath = await mkdtemp(join(tmpdir(), 'mediamanagarr-e2e-'))
    const extensionPath = join(temporaryPath, 'extension')

    let context: BrowserContext | undefined

    try {
      await cp(sourcePath, extensionPath, { recursive: true })

      const manifestPath = join(extensionPath, 'manifest.json')
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as {
        host_permissions?: string[]
        [key: string]: unknown
      }

      manifest.host_permissions = [
        ...new Set([...(manifest.host_permissions ?? []), 'http://127.0.0.1/*']),
      ]

      await writeFile(manifestPath, JSON.stringify(manifest, null, 2))

      context = await chromium.launchPersistentContext('', {
        channel: 'chromium',
        headless: true,
        args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
      })

      await use(context)
    } finally {
      await context?.close()
      await rm(temporaryPath, { recursive: true, force: true })
    }
  },

  extensionId: async ({ context }, use) => {
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'))
    await use(new URL(worker.url()).host)
  },

  extensionPage: async ({ context, extensionId, storageSeed }, use) => {
    await seedExtensionStorage(context, storageSeed)

    const page = await context.newPage()
    await page.goto(`chrome-extension://${extensionId}/index.html`)

    await use(page)
    await page.close()
  },

  mockSonarr: async ({ context }, use) => {
    void context

    const server = await startMockSonarrServer()

    try {
      await use(server)
    } finally {
      await server.close()
    }
  },
})

export { expect }
