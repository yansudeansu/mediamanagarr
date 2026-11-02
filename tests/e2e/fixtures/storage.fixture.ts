import type { BrowserContext } from '@playwright/test'
import type { ServiceConfigs } from '../../../src/types/service'
import type { WorkspaceNavigationState } from '../../../src/utils/workspace-state'

export type ExtensionStorageSeed = {
  services?: ServiceConfigs
  workspace?: WorkspaceNavigationState
}

export async function seedExtensionStorage(
  context: BrowserContext,
  seed: ExtensionStorageSeed = {},
): Promise<void> {
  const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'))

  await worker.evaluate(async ({ services, workspace }) => {
    await chrome.storage.local.clear()
    await chrome.storage.session.clear()

    if (services !== undefined) {
      await chrome.storage.local.set({
        mediaManagarrServices: services,
      })
    }

    if (workspace !== undefined) {
      await chrome.storage.session.set({
        workspaceNavigationState: workspace,
      })
    }
  }, seed)
}
