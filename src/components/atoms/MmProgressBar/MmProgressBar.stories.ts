import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmProgressBar from './MmProgressBar.vue'

const meta = {
  title: 'Atoms/ProgressBar',
  component: MmProgressBar,
  tags: ['autodocs'],

  argTypes: {
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 0.1,
      },
      description: 'Progress value, normalized to the range 0–100.',
    },
    label: {
      control: 'text',
      description: 'Accessible label for the progress bar.',
    },
    showPercentage: {
      control: 'boolean',
      description: 'Displays the label and formatted percentage above the bar.',
    },
  },

  args: {
    value: 50,
    label: 'Progress',
    showPercentage: false,
  },

  decorators: [
    () => ({
      template: '<div style="width: 280px; max-width: 100%"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmProgressBar>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive playground for all progress bar properties.
 */
export const Playground: Story = {}

/**
 * Standard progress bar at 50%.
 */
export const Default: Story = {}

/**
 * Empty progress bar.
 */
export const Empty: Story = {
  args: {
    value: 0,
  },
}

/**
 * Partially completed progress with a visible percentage.
 */
export const Downloading: Story = {
  args: {
    value: 42.5,
    label: 'Downloading',
    showPercentage: true,
  },
}

/**
 * Progress approaching completion.
 */
export const NearlyComplete: Story = {
  args: {
    value: 96.8,
    label: 'Almost finished',
    showPercentage: true,
  },
}

/**
 * Fully completed progress bar.
 */
export const Complete: Story = {
  args: {
    value: 100,
    label: 'Complete',
    showPercentage: true,
  },
}

/**
 * Negative values are clamped to zero.
 */
export const InvalidValue: Story = {
  args: {
    value: -25,
    label: 'Negative progress',
    showPercentage: true,
  },
}

/**
 * Values above 100 are clamped to 100.
 */
export const OverMaximum: Story = {
  args: {
    value: 150,
    label: 'Over maximum',
    showPercentage: true,
  },
}
