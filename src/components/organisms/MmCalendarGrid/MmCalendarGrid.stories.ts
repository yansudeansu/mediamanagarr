import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmCalendarGrid from './MmCalendarGrid.vue'
import type { CalendarItem } from '../../../types/calendar'

const tvItem: CalendarItem = {
  id: 'sonarr-101',
  source: 'sonarr',
  type: 'tv',
  title: 'TV Show 1',
  subtitle: 'S02E03 · Episode 3',
  date: '2026-11-05',
  releaseType: 'air',
  posterUrl: null,
}

const movieItem: CalendarItem = {
  id: 'radarr-201',
  source: 'radarr',
  type: 'movie',
  title: 'Movie 1',
  subtitle: '2026',
  date: '2026-11-05',
  releaseType: 'digital',
  posterUrl: null,
}

const items: CalendarItem[] = [
  tvItem,
  movieItem,
  {
    ...tvItem,
    id: 'sonarr-102',
    title: 'TV Show 2',
    subtitle: 'S01E01 · Episode 1',
    date: '2026-11-12',
  },
  {
    ...movieItem,
    id: 'radarr-202',
    title: 'Movie 2',
    date: '2026-11-20',
    releaseType: 'physical',
  },
  {
    ...tvItem,
    id: 'sonarr-103',
    title: 'TV Show 3',
    subtitle: 'S01E02 · Episode 2',
    date: '2026-10-29',
  },
]

const meta = {
  title: 'Organisms/CalendarGrid',
  component: MmCalendarGrid,
  tags: ['autodocs'],

  args: {
    month: '2026-11-01',
    selectedDate: '2026-11-05',
    today: '2026-11-12',
    items,
  },

  parameters: {
    layout: 'centered',
  },

  decorators: [
    () => ({
      template: '<div style="width: 340px"><story /></div>',
    }),
  ],

  argTypes: {
    month: {
      control: 'text',
      description: 'The month to display, represented by a YYYY-MM-DD date.',
    },
    selectedDate: {
      control: 'text',
      description: 'The selected calendar date.',
    },
    today: {
      control: 'text',
      description: 'The date to highlight as today.',
    },
    items: {
      control: 'object',
      description: 'Calendar releases to display as day indicators.',
    },
  },
} satisfies Meta<typeof MmCalendarGrid>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Hover over November 5, 12, or 20 to see the custom tooltip.
 */
export const Default: Story = {}

export const Empty: Story = {
  args: {
    items: [],
    selectedDate: null,
  },
}

export const SixWeeks: Story = {
  args: {
    month: '2026-11-01',
  },
}

export const FourWeeks: Story = {
  args: {
    month: '2027-02-01',
    selectedDate: '2027-02-14',
    today: '2027-02-05',
    items: [],
  },
}

export const MixedReleases: Story = {
  args: {
    items: [tvItem, movieItem],
  },
}

export const NoSelection: Story = {
  args: {
    selectedDate: null,
  },
}

export const InvalidMonth: Story = {
  args: {
    month: 'invalid',
    selectedDate: null,
    items: [],
  },
}
