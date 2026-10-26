import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmProgressBar from './MmProgressBar.vue'

const meta = {
  title: 'Atoms/MmProgressBar',
  component: MmProgressBar,
  tags: ['autodocs'],
  args: {
    value: 50,
    label: 'Download progress',
    showPercentage: false,
  },
  argTypes: {
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 0.1,
      },
    },
    label: {
      control: 'text',
    },
    showPercentage: {
      control: 'boolean',
    },
  },
  decorators: [
    () => ({
      template: '<div style="width: 280px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmProgressBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    value: 0,
  },
}

export const Downloading: Story = {
  args: {
    value: 42.5,
    label: 'Downloading',
    showPercentage: true,
  },
}

export const NearlyComplete: Story = {
  args: {
    value: 96.8,
    label: 'Almost finished',
    showPercentage: true,
  },
}

export const Complete: Story = {
  args: {
    value: 100,
    label: 'Download complete',
    showPercentage: true,
  },
}

export const InvalidValue: Story = {
  args: {
    value: -25,
    label: 'Invalid progress',
    showPercentage: true,
  },
}

export const OverMaximum: Story = {
  args: {
    value: 150,
    label: 'Clamped progress',
    showPercentage: true,
  },
}
