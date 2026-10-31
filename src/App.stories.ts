import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { userEvent, within } from 'storybook/test'
import App from './App.vue'
import { createMockBackground, type MockBackgroundOptions } from './test/mock-background'
import type { BackgroundMessage } from './types/messages'
import type { ServiceConfigs } from './types/service'
import { SERVICES } from './services/registry'

type WorkspaceMode = 'popup' | 'detached' | 'sidebar'

type StorageChangeListener = (
  changes: Record<string, chrome.storage.StorageChange>,
  areaName: string,
) => void

const WORKSPACE_EVENT = 'mediamanagarr:storybook-workspace'
const SERVICE_STORAGE_KEY = 'mediaManagarrServices'

const meta = {
  title: 'App/MediaManagarr',
  component: App,
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',

    docs: {
      source: {
        type: 'code',
        code: '<App />',
      },
    },
  },
} satisfies Meta<typeof App>

export default meta

type Story = StoryObj<typeof meta>

function createStorySetup(options: MockBackgroundOptions = {}) {
  return () => {
    const mock = createMockBackground(options)

    const originalChrome = globalThis.chrome
    const originalClose = window.close
    const originalUrl = window.location.href

    const sessionStorage = new Map<string, unknown>()
    const localStorage = new Map<string, unknown>()
    const storageChangeListeners = new Set<StorageChangeListener>()

    let pendingWorkspaceMode: WorkspaceMode | null = null

    const initialUrl = new URL(originalUrl)
    initialUrl.searchParams.delete('workspace')

    window.history.replaceState(null, '', initialUrl.toString())

    function createMockServiceConfigs(): ServiceConfigs {
      const safeConfigs = mock.getServiceConfigs()
      const configs: ServiceConfigs = {}

      for (const serviceId of SERVICES) {
        const safeConfig = safeConfigs[serviceId]

        if (!safeConfig?.configured) {
          continue
        }

        const baseConfig = {
          url: safeConfig.url,
          apiKey: 'storybook-mock-api-key',
          username: 'storybook',
          password: 'storybook-mock-password',
        }

        configs[serviceId] = baseConfig
      }

      return configs
    }

    // Seed local storage with the same services that the mock
    // background reports to Settings.
    localStorage.set(SERVICE_STORAGE_KEY, createMockServiceConfigs())

    function dispatchWorkspaceMode(mode: WorkspaceMode): void {
      pendingWorkspaceMode = mode

      window.dispatchEvent(
        new CustomEvent<WorkspaceMode>(WORKSPACE_EVENT, {
          detail: mode,
        }),
      )
    }

    function getStoredValues(
      storage: Map<string, unknown>,
      keys: string | string[] | Record<string, unknown> | null,
    ): Record<string, unknown> {
      if (keys === null) {
        return Object.fromEntries(storage)
      }

      if (typeof keys === 'string') {
        return storage.has(keys) ? { [keys]: storage.get(keys) } : {}
      }

      if (Array.isArray(keys)) {
        return Object.fromEntries(
          keys.filter((key) => storage.has(key)).map((key) => [key, storage.get(key)]),
        )
      }

      return Object.fromEntries(
        Object.entries(keys).map(([key, defaultValue]) => [
          key,
          storage.has(key) ? storage.get(key) : defaultValue,
        ]),
      )
    }

    function notifyStorageChanged(
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ): void {
      if (Object.keys(changes).length === 0) {
        return
      }

      for (const listener of storageChangeListeners) {
        listener(changes, areaName)
      }
    }

    function createStorageArea(storage: Map<string, unknown>, areaName: 'local' | 'session') {
      return {
        get: async (
          keys: string | string[] | Record<string, unknown> | null = null,
        ): Promise<Record<string, unknown>> => getStoredValues(storage, keys),

        set: async (items: Record<string, unknown>): Promise<void> => {
          const changes: Record<string, chrome.storage.StorageChange> = {}

          for (const [key, newValue] of Object.entries(items)) {
            const oldValue = storage.get(key)

            storage.set(key, newValue)

            changes[key] = {
              oldValue,
              newValue,
            }
          }

          notifyStorageChanged(changes, areaName)
        },

        remove: async (keys: string | string[]): Promise<void> => {
          const requestedKeys = typeof keys === 'string' ? [keys] : keys
          const changes: Record<string, chrome.storage.StorageChange> = {}

          for (const key of requestedKeys) {
            if (!storage.has(key)) {
              continue
            }

            changes[key] = {
              oldValue: storage.get(key),
              newValue: undefined,
            }

            storage.delete(key)
          }

          notifyStorageChanged(changes, areaName)
        },

        clear: async (): Promise<void> => {
          const changes: Record<string, chrome.storage.StorageChange> = {}

          for (const [key, oldValue] of storage) {
            changes[key] = {
              oldValue,
              newValue: undefined,
            }
          }

          storage.clear()

          notifyStorageChanged(changes, areaName)
        },
      }
    }

    function synchronizeServiceStorage(): void {
      const previousConfigs = localStorage.get(SERVICE_STORAGE_KEY)
      const nextConfigs = createMockServiceConfigs()

      localStorage.set(SERVICE_STORAGE_KEY, nextConfigs)

      notifyStorageChanged(
        {
          [SERVICE_STORAGE_KEY]: {
            oldValue: previousConfigs,
            newValue: nextConfigs,
          },
        },
        'local',
      )
    }

    Object.defineProperty(globalThis, 'chrome', {
      configurable: true,
      value: {
        ...originalChrome,

        permissions: {
          ...originalChrome?.permissions,

          request: async () => true,

          contains: async () => true,
        },

        storage: {
          ...originalChrome?.storage,

          local: createStorageArea(localStorage, 'local'),

          session: createStorageArea(sessionStorage, 'session'),

          onChanged: {
            addListener: (listener: StorageChangeListener) => {
              storageChangeListeners.add(listener)
            },

            removeListener: (listener: StorageChangeListener) => {
              storageChangeListeners.delete(listener)
            },

            hasListener: (listener: StorageChangeListener) => storageChangeListeners.has(listener),
          },
        },

        windows: {
          ...originalChrome?.windows,

          getCurrent: async () => ({ id: 1 }),
        },

        sidePanel: {
          ...originalChrome?.sidePanel,

          open: async () => {
            dispatchWorkspaceMode('sidebar')
          },

          close: async () => {
            dispatchWorkspaceMode('popup')
          },
        },

        runtime: {
          ...originalChrome?.runtime,

          getManifest: () => ({
            manifest_version: 3,
            name: 'MediaManagarr',
            version: '0.1.0',
          }),

          sendMessage: async (message: BackgroundMessage) => {
            const response = mock.handle(message)

            if (message.type === 'OPEN_DETACHED_WORKSPACE' && response.success) {
              dispatchWorkspaceMode('detached')
            }

            if (
              (message.type === 'CONNECT_SERVICE' || message.type === 'REMOVE_SERVICE') &&
              response.success
            ) {
              synchronizeServiceStorage()
            }

            return response
          },
        },
      },
    })

    Object.defineProperty(window, 'close', {
      configurable: true,
      value: () => {
        if (pendingWorkspaceMode !== null) {
          pendingWorkspaceMode = null
          return
        }

        dispatchWorkspaceMode('popup')
      },
    })

    return () => {
      storageChangeListeners.clear()

      window.history.replaceState(null, '', originalUrl)

      Object.defineProperty(globalThis, 'chrome', {
        configurable: true,
        value: originalChrome,
      })

      Object.defineProperty(window, 'close', {
        configurable: true,
        value: originalClose,
      })
    }
  }
}

function renderWorkspace() {
  return defineComponent({
    name: 'InteractiveWorkspaceStory',

    components: {
      App,
    },

    setup() {
      const workspaceMode = ref<WorkspaceMode>('popup')
      const workspaceKey = ref(0)

      function changeWorkspaceMode(event: Event): void {
        const mode = (event as CustomEvent<WorkspaceMode>).detail

        if (workspaceMode.value === mode) {
          return
        }

        workspaceMode.value = mode

        const url = new URL(window.location.href)

        if (mode === 'popup') {
          url.searchParams.delete('workspace')
        } else {
          url.searchParams.set('workspace', mode)
        }

        window.history.replaceState(null, '', url.toString())

        workspaceKey.value += 1
      }

      onMounted(() => {
        window.addEventListener(WORKSPACE_EVENT, changeWorkspaceMode)
      })

      onUnmounted(() => {
        window.removeEventListener(WORKSPACE_EVENT, changeWorkspaceMode)
      })

      return {
        workspaceMode,
        workspaceKey,
      }
    },

    template: `
      <div
        :style="{
          width: workspaceMode === 'detached'
            ? '780px'
            : workspaceMode === 'sidebar'
              ? '340px'
              : '380px',
          height: workspaceMode === 'popup' ? '480px' : '700px',
          maxWidth: '100%',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'var(--background)'
        }"
      >
        <App :key="workspaceKey" />
      </div>
    `,
  })
}

async function openSettings(canvasElement: HTMLElement): Promise<void> {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole('button', { name: 'Open workspace menu' }))
  await userEvent.click(canvas.getByRole('button', { name: 'Open settings' }))
}

export const Default: Story = {
  beforeEach: createStorySetup(),
  render: renderWorkspace,
}

export const UpNext: Story = {
  ...Default,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Up Next' }))
  },
}

export const Calendar: Story = {
  ...Default,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Calendar' }))
  },
}

export const Downloads: Story = {
  ...Default,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Downloads' }))
  },
}

export const Settings: Story = {
  ...Default,

  play: async ({ canvasElement }) => {
    await openSettings(canvasElement)
  },
}

export const SettingsConnected: Story = {
  ...Default,

  name: 'Settings — Connected',

  beforeEach: createStorySetup({
    connections: {
      jellyfin: 'connected',
      seerr: 'connected',
      sonarr: 'connected',
      radarr: 'connected',
      qbittorrent: 'connected',
    },
  }),

  play: async ({ canvasElement }) => {
    await openSettings(canvasElement)
  },
}

export const SettingsConnectionFailed: Story = {
  ...Default,

  name: 'Settings — Connection Failed',

  beforeEach: createStorySetup({
    connections: {
      jellyfin: 'error',
    },
  }),

  play: async ({ canvasElement }) => {
    await openSettings(canvasElement)
  },
}
