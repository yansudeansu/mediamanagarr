import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { userEvent, within } from 'storybook/test'
import App from './App.vue'
import { createMockBackground } from './test/mock-background'
import type { BackgroundMessage } from './types/messages'

type WorkspaceMode = 'popup' | 'detached' | 'sidebar'

const WORKSPACE_EVENT = 'mediamanagarr:storybook-workspace'

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

export const Default: Story = {
  beforeEach: () => {
    const mock = createMockBackground()

    const originalChrome = globalThis.chrome
    const originalClose = window.close
    const originalUrl = window.location.href

    // Storybook-only replacement for chrome.storage.session.
    // Values survive App remounts when switching workspaces.
    const sessionStorage = new Map<string, unknown>()

    // Tracks which workspace is being opened so window.close()
    // does not immediately return the preview to popup mode.
    let pendingWorkspaceMode: WorkspaceMode | null = null

    const initialUrl = new URL(originalUrl)
    initialUrl.searchParams.delete('workspace')

    window.history.replaceState(null, '', initialUrl.toString())

    function dispatchWorkspaceMode(mode: WorkspaceMode): void {
      pendingWorkspaceMode = mode

      window.dispatchEvent(
        new CustomEvent<WorkspaceMode>(WORKSPACE_EVENT, {
          detail: mode,
        }),
      )
    }

    Object.defineProperty(globalThis, 'chrome', {
      configurable: true,
      value: {
        ...originalChrome,

        storage: {
          ...originalChrome?.storage,

          session: {
            get: async (keys: string | string[] | null) => {
              const requestedKeys =
                keys === null
                  ? Array.from(sessionStorage.keys())
                  : typeof keys === 'string'
                    ? [keys]
                    : keys

              return Object.fromEntries(
                requestedKeys
                  .filter((key) => sessionStorage.has(key))
                  .map((key) => [key, sessionStorage.get(key)]),
              )
            },

            set: async (items: Record<string, unknown>) => {
              for (const [key, value] of Object.entries(items)) {
                sessionStorage.set(key, value)
              }
            },

            remove: async (keys: string | string[]) => {
              const requestedKeys = typeof keys === 'string' ? [keys] : keys

              for (const key of requestedKeys) {
                sessionStorage.delete(key)
              }
            },
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
  },

  render: () =>
    defineComponent({
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

          // Remount App to simulate opening the selected workspace.
          // Mocked session storage survives this remount.
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
            borderRadius: '10px',
            overflow: 'hidden',
            background: 'var(--background)'
          }"
        >
          <App :key="workspaceKey" />
        </div>
      `,
    }),
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
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Open settings' }))
  },
}
