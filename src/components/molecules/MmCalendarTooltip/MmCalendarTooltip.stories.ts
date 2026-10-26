import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmCalendarTooltip from './MmCalendarTooltip.vue'
import type { CalendarItem } from '../../../types/calendar'

const tvItem: CalendarItem = {
  id: 'sonarr-101',
  source: 'sonarr',
  type: 'tv',
  title: 'Example Series',
  subtitle: 'S02E03 · The Adventure',
  date: '2026-11-05',
  releaseType: 'air',
  posterUrl: null,
}

const movieItem: CalendarItem = {
  id: 'radarr-201',
  source: 'radarr',
  type: 'movie',
  title: 'Example Movie',
  subtitle: '2026',
  date: '2026-11-05',
  releaseType: 'digital',
  posterUrl: null,
}

const meta = {
  title: 'Molecules/CalendarTooltip',
  component: MmCalendarTooltip,
  tags: ['autodocs'],
  args: {
    date: '2026-11-05',
    items: [tvItem, movieItem],
  },
} satisfies Meta<typeof MmCalendarTooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TvOnly: Story = {
  args: {
    items: [tvItem],
  },
}

export const MovieOnly: Story = {
  args: {
    items: [movieItem],
  },
}

export const ManyReleases: Story = {
  args: {
    items: Array.from({ length: 7 }, (_, index) => ({
      ...tvItem,
      id: `sonarr-${index}`,
      title: `Example Series ${index + 1}`,
    })),
  },
}

export const InvalidDate: Story = {
  args: {
    date: 'invalid',
  },
}
