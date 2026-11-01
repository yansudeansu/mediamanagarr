import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import MmCalendarDay from './MmCalendarDay.vue'
import type { CalendarItem } from '../../../types/calendar'

const tvItem: CalendarItem = {
  id: 'episode-101',
  source: 'sonarr',
  type: 'tv',
  title: 'Example Series',
  subtitle: 'S01E01 · Pilot',
  date: '2026-11-05',
  releaseType: 'air',
  posterUrl: null,
}

const movieItem: CalendarItem = {
  id: 'movie-201',
  source: 'radarr',
  type: 'movie',
  title: 'Example Movie',
  subtitle: '2026',
  date: '2026-11-05',
  releaseType: 'digital',
  posterUrl: null,
}

const meta = {
  title: 'Molecules/CalendarDay',
  component: MmCalendarDay,
  tags: ['autodocs'],
  args: {
    date: '2026-11-05',
    day: 5,
    items: [],
    isToday: false,
    isSelected: false,
    isOutsideMonth: false,
    tooltipId: undefined,
    onSelect: fn(),
    onPreview: fn(),
  },
  argTypes: {
    date: {
      control: 'text',
      description: 'Calendar date in YYYY-MM-DD format.',
    },
    day: {
      control: { type: 'number', min: 1, max: 31 },
    },
    items: {
      control: 'object',
      description: 'Releases scheduled for this date.',
    },
    isToday: {
      control: 'boolean',
    },
    isSelected: {
      control: 'boolean',
    },
    isOutsideMonth: {
      control: 'boolean',
    },
    tooltipId: {
      control: 'text',
      description: 'ID of an associated tooltip, when present.',
    },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    () => ({
      template: '<div style="width: 60px"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmCalendarDay>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Today: Story = {
  args: {
    isToday: true,
  },
}

export const Selected: Story = {
  args: {
    isSelected: true,
  },
}

export const TvRelease: Story = {
  args: {
    items: [tvItem],
  },
}

export const MovieRelease: Story = {
  args: {
    items: [movieItem],
  },
}

export const MixedReleases: Story = {
  args: {
    items: [tvItem, movieItem],
  },
}

export const SelectedWithReleases: Story = {
  args: {
    isSelected: true,
    items: [tvItem, movieItem],
  },
}

export const OutsideMonth: Story = {
  args: {
    day: 30,
    date: '2026-10-30',
    isOutsideMonth: true,
  },
}

export const TodayWithReleases: Story = {
  args: {
    isToday: true,
    items: [tvItem],
  },
}
