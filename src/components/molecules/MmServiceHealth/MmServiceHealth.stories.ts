import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmServiceHealth from './MmServiceHealth.vue'

const meta = {
  title: 'Molecules/Service Health',
  component: MmServiceHealth,
  tags: ['autodocs'],

  argTypes: {
    health: {
      control: 'object',
      description:
        'Latest connection health, including status, last check time, and optional error.',
    },
  },

  args: {
    health: {
      status: 'unknown',
      lastCheckedAt: null,
    },
  },

  parameters: {
    layout: 'centered',
  },

  decorators: [
    () => ({
      template: `
        <div style="width: min(420px, 90vw);">
          <story />
        </div>
      `,
    }),
  ],
} satisfies Meta<typeof MmServiceHealth>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const NotCheckedYet: Story = {
  args: {
    health: {
      status: 'unknown',
      lastCheckedAt: null,
    },
  },
}

export const Connected: Story = {
  args: {
    health: {
      status: 'connected',
      lastCheckedAt: '2026-10-31T12:00:00.000Z',
    },
  },
}

export const ConnectionFailed: Story = {
  args: {
    health: {
      status: 'failed',
      lastCheckedAt: '2026-10-31T12:00:00.000Z',
      error: 'Unable to reach the server. Check the URL and try again.',
    },
  },
}

export const ConnectionFailedWithoutDetails: Story = {
  args: {
    health: {
      status: 'failed',
      lastCheckedAt: '2026-10-31T12:00:00.000Z',
    },
  },
}

export const ConnectedWithoutTimestamp: Story = {
  args: {
    health: {
      status: 'connected',
      lastCheckedAt: null,
    },
  },
}

export const AllStates: Story = {
  render: () => ({
    components: { MmServiceHealth },

    setup() {
      const checkedAt = '2026-10-31T12:00:00.000Z'

      return { checkedAt }
    },

    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: min(420px, 90vw);">
        <mm-service-health
          :health="{ status: 'unknown', lastCheckedAt: null }"
        />

        <mm-service-health
          :health="{ status: 'connected', lastCheckedAt: checkedAt }"
        />

        <mm-service-health
          :health="{
            status: 'failed',
            lastCheckedAt: checkedAt,
            error: 'Unable to reach the server. Check the URL and try again.',
          }"
        />
      </div>
    `,
  }),
}
