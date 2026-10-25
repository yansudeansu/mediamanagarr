import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import MmNavigation from './MmNavigation.vue'

const meta = {
  title: 'Molecules/Navigation',
  component: MmNavigation,
  tags: ['autodocs'],

  argTypes: {
    activeView: {
      control: 'select',
      options: ['requests', 'up-next', 'calendar', 'downloads'],
      description: 'Currently active application view.',
    },

    onNavigate: {
      description: 'Emitted when a navigation item is selected.',
      table: {
        category: 'events',
      },
    },
  },

  args: {
    activeView: 'requests',
    onNavigate: fn(),
  },

  decorators: [
    () => ({
      template: '<div style="width: 380px"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmNavigation>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Requests: Story = {
  args: {
    activeView: 'requests',
  },
}

export const UpNext: Story = {
  args: {
    activeView: 'up-next',
  },
}

export const Calendar: Story = {
  args: {
    activeView: 'calendar',
  },
}

export const Downloads: Story = {
  args: {
    activeView: 'downloads',
  },
}
