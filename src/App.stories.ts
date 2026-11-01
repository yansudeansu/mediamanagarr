import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { userEvent, within } from 'storybook/test'
import App from './App.vue'
import { createMockBackground, type MockBackgroundOptions } from './test/mock-background'
import type { BackgroundMessage } from './types/messages'
import type { ServiceConfigs } from './types/service'
import type { WorkspaceMode } from './types/workspace'
import { SERVICES } from './services/registry'

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
      description: {
        component:
          'Interactive application-shell integration stories. These render the real App.vue ' +
          'with mocked browser-extension APIs, background messages, service configurations, ' +
          'and workspace storage. Use them to explore service-aware navigation, Settings, ' +
          'and popup, sidebar, or detached workspace behavior.',
      },
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

        configs[serviceId] = {
          url: safeConfig.url,
          apiKey: 'storybook-mock-api-key',
        }
      }

      return configs
    }

    // App.vue reads safe service configurations from local storage.
    // Keep that storage synchronized with the mock background.
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

    // Storybook invokes this cleanup when leaving the story.
    // Restore browser globals and URL so scenarios remain isolated.
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

        // App.vue reads the workspace query parameter during setup.
        // Remount it to exercise the real workspace-mode behavior.
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
          height: workspaceMode === 'popup'
            ? '480px'
            : '700px',
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

  await userEvent.click(
    await canvas.findByRole('button', {
      name: 'Open workspace menu',
    }),
  )

  await userEvent.click(
    await canvas.findByRole('button', {
      name: 'Open settings',
    }),
  )
}

// Application scenarios

export const Default: Story = {
  beforeEach: createStorySetup(),
  render: renderWorkspace,
  parameters: {
    docs: {
      description: {
        story:
          'Default application shell with mocked services. Explore navigation, quick access, ' +
          'Settings, and the workspace controls.',
      },
    },
  },
}

export const UpNext: Story = {
  ...Default,
  parameters: {
    docs: {
      description: {
        story: 'Opens the Jellyfin Up Next view through the application navigation.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Up Next',
      }),
    )
  },
}

export const Calendar: Story = {
  ...Default,
  parameters: {
    docs: {
      description: {
        story: 'Opens the calendar view with its configured Sonarr and Radarr integrations.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Calendar',
      }),
    )
  },
}

export const Downloads: Story = {
  ...Default,
  parameters: {
    docs: {
      description: {
        story: 'Opens the qBittorrent Downloads view through the application navigation.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Downloads',
      }),
    )
  },
}

export const Settings: Story = {
  ...Default,
  parameters: {
    docs: {
      description: {
        story: 'Opens Settings on the Connections section to demonstrate service configuration.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await openSettings(canvasElement)
  },
}

export const WorkspaceSettings: Story = {
  ...Default,
  name: 'Settings — Workspace',
  parameters: {
    docs: {
      description: {
        story:
          'Opens the Workspace settings section, including default workspace selection ' +
          'and controls for opening a sidebar or detached window.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await openSettings(canvasElement)

    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Workspace',
      }),
    )
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
  parameters: {
    docs: {
      description: {
        story: 'Shows Settings with all five services connected successfully.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Shows how Settings presents a failed Jellyfin connection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await openSettings(canvasElement)
  },
}

// Dynamic navigation scenarios

export const NoServices: Story = {
  ...Default,
  name: 'Navigation — No Services',
  beforeEach: createStorySetup({
    configuredServices: [],
  }),
  parameters: {
    docs: {
      description: {
        story:
          'No services are configured. The app displays its onboarding empty state ' +
          'and provides a path to Settings.',
      },
    },
  },
}

export const JellyfinOnly: Story = {
  ...Default,
  name: 'Navigation — Jellyfin Only',
  beforeEach: createStorySetup({
    configuredServices: ['jellyfin'],
  }),
  parameters: {
    docs: {
      description: {
        story: 'Only Jellyfin is configured. Navigation exposes Jellyfin-dependent features.',
      },
    },
  },
}

export const SeerrOnly: Story = {
  ...Default,
  name: 'Navigation — Seerr Only',
  beforeEach: createStorySetup({
    configuredServices: ['seerr'],
  }),
  parameters: {
    docs: {
      description: {
        story: 'Only Seerr is configured. The Requests view remains available.',
      },
    },
  },
}

export const SonarrOnly: Story = {
  ...Default,
  name: 'Navigation — Sonarr Only',
  beforeEach: createStorySetup({
    configuredServices: ['sonarr'],
  }),
  parameters: {
    docs: {
      description: {
        story: 'Only Sonarr is configured. Calendar availability follows the feature registry.',
      },
    },
  },
}

export const RadarrOnly: Story = {
  ...Default,
  name: 'Navigation — Radarr Only',
  beforeEach: createStorySetup({
    configuredServices: ['radarr'],
  }),
  parameters: {
    docs: {
      description: {
        story: 'Only Radarr is configured. Calendar availability follows the feature registry.',
      },
    },
  },
}

export const QBittorrentOnly: Story = {
  ...Default,
  name: 'Navigation — qBittorrent Only',
  beforeEach: createStorySetup({
    configuredServices: ['qbittorrent'],
  }),
  parameters: {
    docs: {
      description: {
        story: 'Only qBittorrent is configured. The Downloads view remains available.',
      },
    },
  },
}

export const SharedCalendar: Story = {
  ...Default,
  name: 'Navigation — Sonarr + Radarr',
  beforeEach: createStorySetup({
    configuredServices: ['sonarr', 'radarr'],
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Sonarr and Radarr share the Calendar navigation destination rather than ' +
          'creating duplicate entries.',
      },
    },
  },
}

export const PartialConfiguration: Story = {
  ...Default,
  name: 'Navigation — Partial Configuration',
  beforeEach: createStorySetup({
    configuredServices: ['jellyfin', 'sonarr', 'qbittorrent'],
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A mixed service configuration demonstrates which navigation destinations ' +
          'remain available when only some integrations are enabled.',
      },
    },
  },
}

export const ConfiguredButDisconnected: Story = {
  ...Default,
  name: 'Navigation — Configured but Disconnected',
  beforeEach: createStorySetup({
    configuredServices: ['jellyfin', 'sonarr'],
    connections: {
      jellyfin: 'error',
      sonarr: 'error',
    },
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Services are configured but their connections are failing. Navigation is ' +
          'based on configuration availability, not the latest health-check result.',
      },
    },
  },
}
