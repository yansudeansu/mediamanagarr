import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmFooter from './MmFooter.vue'

const meta = {
  title: 'Atoms/Footer',
  component: MmFooter,
  tags: ['autodocs'],

  argTypes: {
    brand: {
      control: 'text',
      description: 'Brand or application name displayed in the footer.',
    },
    version: {
      control: 'text',
      description: 'Optional version displayed in the footer.',
    },
  },

  args: {
    brand: 'Example App',
    version: '0.1.0',
  },

  decorators: [
    () => ({
      template: '<div style="width: 380px; max-width: 100%"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmFooter>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive playground.
 * Change the brand and version using Storybook controls.
 */
export const Playground: Story = {}

/**
 * Standard footer with a brand and version.
 */
export const Default: Story = {
  args: {
    brand: 'Example App',
    version: '0.1.0',
  },
}

/**
 * Footer without a version number.
 */
export const WithoutVersion: Story = {
  args: {
    brand: 'Example App',
    version: '',
  },
}

/**
 * Footer with a prerelease version.
 */
export const Prerelease: Story = {
  args: {
    brand: 'Example App',
    version: '1.0.0-beta.2',
  },
}

/**
 * Demonstrates that the footer can display different brands.
 */
export const CustomBrand: Story = {
  args: {
    brand: 'My Dashboard',
    version: '2.3.0',
  },
}
