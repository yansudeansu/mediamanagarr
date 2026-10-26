import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { userEvent, within } from 'storybook/test'
import App from './App.vue'
import { createMockBackground, type MockBackgroundOptions } from './test/mock-background'

const meta = {
  title: 'App/MediaManagarr',
  component: App,
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
  },

  decorators: [
    () => ({
      template: `
        <div style="
          width: 368px;
          max-width: 100%;
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          background: var(--background);
        ">
          <story />
        </div>
      `,
    }),
  ],
} satisfies Meta<typeof App>

export default meta

type Story = StoryObj<typeof meta>

function createStory(options: MockBackgroundOptions = {}): Story {
  return {
    beforeEach: () => {
      const mock = createMockBackground(options)
      const originalChrome = globalThis.chrome

      Object.defineProperty(globalThis, 'chrome', {
        configurable: true,
        value: {
          ...originalChrome,

          runtime: {
            ...originalChrome?.runtime,

            getManifest: () => ({
              manifest_version: 3,
              name: 'MediaManagarr',
              version: '0.1.0',
            }),

            sendMessage: async (message: Parameters<typeof mock.handle>[0]) => mock.handle(message),
          },
        },
      })

      return () => {
        Object.defineProperty(globalThis, 'chrome', {
          configurable: true,
          value: originalChrome,
        })
      }
    },
  }
}

async function navigateTo(
  canvasElement: HTMLElement,
  view: 'Requests' | 'Up Next' | 'Calendar' | 'Downloads',
): Promise<void> {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole('button', { name: view }))
}

export const Default: Story = createStory()

export const Requests: Story = {
  ...createStory(),
}

export const UpNext: Story = {
  ...createStory(),

  play: async ({ canvasElement }) => {
    await navigateTo(canvasElement, 'Up Next')
  },
}

export const Calendar: Story = {
  ...createStory(),

  play: async ({ canvasElement }) => {
    await navigateTo(canvasElement, 'Calendar')
  },
}

export const Downloads: Story = {
  ...createStory(),

  play: async ({ canvasElement }) => {
    await navigateTo(canvasElement, 'Downloads')
  },
}

export const DownloadsActions: Story = {
  ...createStory(),

  play: async ({ canvasElement }) => {
    await navigateTo(canvasElement, 'Downloads')

    const canvas = within(canvasElement)

    await canvas.findByText('Movie 1 (2026) 1080p')
  },
}

export const DownloadsEmpty: Story = {
  ...createStory({ downloads: 'empty' }),

  play: async ({ canvasElement }) => {
    await navigateTo(canvasElement, 'Downloads')
  },
}

export const DownloadsError: Story = {
  ...createStory({ downloads: 'error' }),

  play: async ({ canvasElement }) => {
    await navigateTo(canvasElement, 'Downloads')
  },
}

export const Settings: Story = {
  ...createStory(),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Open settings' }))
  },
}
