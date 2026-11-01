import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmStatusBadge from './MmStatusBadge.vue'

const meta = {
  title: 'Atoms/Status Badge',
  component: MmStatusBadge,
  tags: ['autodocs'],

  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'danger'],
      description: 'Visual appearance of the badge.',
    },
    label: {
      control: 'text',
      description: 'Text displayed inside the badge.',
    },
  },

  args: {
    variant: 'neutral',
    label: 'Pending',
  },
} satisfies Meta<typeof MmStatusBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    label: 'Not started',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    label: 'In progress',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    label: 'Completed',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    label: 'Failed',
  },
}

export const CustomLabel: Story = {
  args: {
    variant: 'success',
    label: 'All checks passed',
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { MmStatusBadge },

    template: `
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="neutral" label="Not started" />
          <span style="font-size: 12px; color: var(--muted);">
            Neutral state for items awaiting action
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="info" label="In progress" />
          <span style="font-size: 12px; color: var(--muted);">
            Informational state for ongoing work
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="success" label="Completed" />
          <span style="font-size: 12px; color: var(--muted);">
            Successful completion or positive status
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <mm-status-badge variant="danger" label="Failed" />
          <span style="font-size: 12px; color: var(--muted);">
            Error or failure requiring attention
          </span>
        </div>
      </div>
    `,
  }),
}
