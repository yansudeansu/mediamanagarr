import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmServiceHealth from './MmServiceHealth.vue'

const meta = {
  title: 'Molecules/Service Health',
  component: MmServiceHealth,
  tags: ['autodocs'],

  argTypes: {
    status: {
      control: 'select',
      options: ['not-checked', 'connected', 'failed'],
      description: 'Connection health status to display.',
    },
    lastCheckedLabel: {
      control: 'text',
      description: 'Preformatted label for the last connection check.',
    },
    error: {
      control: 'text',
      description: 'Error message displayed when the connection has failed.',
    },
  },

  args: {
    status: 'not-checked',
    lastCheckedLabel: '',
    error: '',
  },

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Displays a connection health status, an optional preformatted last-checked label, and an optional error message. The parent is responsible for formatting timestamps and supplying presentation data.',
      },
    },
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
    status: 'not-checked',
    lastCheckedLabel: '',
    error: '',
  },
}

export const Connected: Story = {
  args: {
    status: 'connected',
    lastCheckedLabel: '31 Oct 2026, 13:00',
    error: '',
  },
}

export const ConnectionFailed: Story = {
  args: {
    status: 'failed',
    lastCheckedLabel: '31 Oct 2026, 13:00',
    error: 'Unable to reach the server. Check the URL and try again.',
  },
}

export const ConnectionFailedWithoutDetails: Story = {
  args: {
    status: 'failed',
    lastCheckedLabel: '31 Oct 2026, 13:00',
    error: '',
  },
}

export const ConnectedWithoutTimestamp: Story = {
  args: {
    status: 'connected',
    lastCheckedLabel: '',
    error: '',
  },
}

export const AllStates: Story = {
  render: () => ({
    components: { MmServiceHealth },

    template: `
      <div
        style="
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: min(420px, 90vw);
        "
      >
        <mm-service-health
          status="not-checked"
        />

        <mm-service-health
          status="connected"
          last-checked-label="31 Oct 2026, 13:00"
        />

        <mm-service-health
          status="failed"
          last-checked-label="31 Oct 2026, 13:00"
          error="Unable to reach the server. Check the URL and try again."
        />
      </div>
    `,
  }),
}
