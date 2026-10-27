import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmFooter from './MmFooter.vue'

const meta = {
  title: 'Atoms/Footer',
  component: MmFooter,
  tags: ['autodocs'],

  argTypes: {
    version: {
      control: 'text',
      description: 'Extension version displayed in the footer.',
    },
  },

  args: {
    version: '0.1.0',
  },

  decorators: [
    () => ({
      template: '<div style="width: 380px"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmFooter>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive playground.
 */
export const Playground: Story = {}

/**
 * Standard footer with the extension version.
 */
export const Default: Story = {
  args: {
    version: '0.1.0',
  },
}

/**
 * Footer without a version number.
 */
export const WithoutVersion: Story = {
  args: {
    version: '',
  },
}

/**
 * Footer with a longer version number.
 */
export const Prerelease: Story = {
  args: {
    version: '1.0.0-beta.2',
  },
}
