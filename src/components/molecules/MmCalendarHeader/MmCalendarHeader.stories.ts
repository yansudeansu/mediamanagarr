import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import MmCalendarHeader from './MmCalendarHeader.vue'

const meta = {
  title: 'Molecules/CalendarHeader',
  component: MmCalendarHeader,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="width: 340px"><story /></div>',
    }),
  ],
  args: {
    month: '2026-11-01',
    onPrevious: fn(),
    onNext: fn(),
  },
} satisfies Meta<typeof MmCalendarHeader>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Month navigation with the title centered between the arrows.
 */
export const Default: Story = {}

/**
 * Month navigation showing a different year.
 */
export const DifferentMonth: Story = {
  args: {
    month: '2027-01-01',
  },
}

/**
 * Gracefully handles an invalid month value.
 */
export const InvalidMonth: Story = {
  args: {
    month: 'invalid',
  },
}
