import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmCard from './MmCard.vue'

const meta = {
  title: 'Atoms/Card',
  component: MmCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md'],
    },
  },
  args: {
    variant: 'default',
    padding: 'md',
  },
} satisfies Meta<typeof MmCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { MmCard },
    setup: () => ({ args }),
    template: `
      <MmCard v-bind="args">
        <h3 style="margin: 0 0 8px; font-size: 14px;">Example Movie</h3>
        <p style="margin: 0; color: var(--muted); font-size: 12px;">
          Requested by Alice
        </p>
      </MmCard>
    `,
  }),
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
  render: (args) => ({
    components: { MmCard },
    setup: () => ({ args }),
    template: `
      <MmCard v-bind="args">
        <p style="margin: 0;">Outlined card content</p>
      </MmCard>
    `,
  }),
}

export const WithHeaderAndFooter: Story = {
  render: (args) => ({
    components: { MmCard },
    setup: () => ({ args }),
    template: `
      <MmCard v-bind="args">
        <template #header>
          <h3 style="margin: 0; font-size: 14px;">Download activity</h3>
        </template>

        <p style="margin: 0; font-size: 12px;">
          3 downloads in progress
        </p>

        <template #footer>
          <span style="font-size: 12px; color: var(--muted);">
            Updated just now
          </span>
        </template>
      </MmCard>
    `,
  }),
}

export const NoPadding: Story = {
  args: {
    padding: 'none',
  },
  render: (args) => ({
    components: { MmCard },
    setup: () => ({ args }),
    template: `
      <MmCard v-bind="args">
        <div style="padding: 14px;">
          Custom layout with manually controlled spacing.
        </div>
      </MmCard>
    `,
  }),
}
