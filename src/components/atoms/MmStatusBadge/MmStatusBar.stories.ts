import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmStatusBadge from './MmStatusBadge.vue'

const meta = {
  title: 'Atoms/Status Badge',
  component: MmStatusBadge,
  tags: ['autodocs'],

  argTypes: {
    status: {
      control: 'select',
      options: ['not-configured', 'configured', 'connected', 'failed'],
      description: 'Current service connection status.',
    },
  },

  args: {
    status: 'not-configured',
  },
} satisfies Meta<typeof MmStatusBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const NotConfigured: Story = {
  args: {
    status: 'not-configured',
  },
}

export const Configured: Story = {
  args: {
    status: 'configured',
  },
}

export const Connected: Story = {
  args: {
    status: 'connected',
  },
}

export const Failed: Story = {
  args: {
    status: 'failed',
  },
}

export const AllStatuses: Story = {
  render: () => ({
    components: { MmStatusBadge },

    template: `
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="not-configured" />
          <span style="font-size: 12px; color: var(--muted);">
            Service has not been configured
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="configured" />
          <span style="font-size: 12px; color: var(--muted);">
            Credentials are saved, connection not tested this session
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="connected" />
          <span style="font-size: 12px; color: var(--muted);">
            Service connection was successful
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge status="failed" />
          <span style="font-size: 12px; color: var(--muted);">
            Service connection failed
          </span>
        </div>
      </div>
    `,
  }),
}
