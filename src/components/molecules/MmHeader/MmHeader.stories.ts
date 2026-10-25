import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmHeader from './MmHeader.vue'

const meta = {
  title: 'Molecules/Header',
  component: MmHeader,
  tags: ['autodocs'],

  argTypes: {
    mode: {
      control: 'radio',
      options: ['main', 'settings'],
      description: 'Determines the header title and navigation action.',
    },
    onSettings: {
      description: 'Emitted when the settings button is clicked.',
      table: {
        category: 'events',
      },
    },
    onBack: {
      description: 'Emitted when the back button is clicked.',
      table: {
        category: 'events',
      },
    },
  },

  args: {
    mode: 'main',
  },

  decorators: [
    () => ({
      template: '<div style="width: 380px"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmHeader>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive playground.
 * Switch between main and settings using Storybook Controls.
 */
export const Playground: Story = {}

/**
 * Default header with the application title and settings button.
 */
export const Main: Story = {
  args: {
    mode: 'main',
  },
}

/**
 * Settings header with a back button and settings title.
 */
export const Settings: Story = {
  args: {
    mode: 'settings',
  },
}
