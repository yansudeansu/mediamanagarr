import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmCalendarEvent from './MmCalendarEvent.vue'
import type { CalendarItem } from '../../../types/calendar'

const tvItem: CalendarItem = {
  id: 'sonarr-101',
  source: 'sonarr',
  type: 'tv',
  title: 'The Example Show',
  subtitle: 'S02E03 · The Adventure',
  date: '2026-11-05T20:00:00Z',
  releaseType: 'air',
  posterUrl: null,
}

const digitalMovie: CalendarItem = {
  id: 'radarr-201',
  source: 'radarr',
  type: 'movie',
  title: 'The Example Movie',
  subtitle: '2026',
  date: '2026-11-05',
  releaseType: 'digital',
  posterUrl: null,
}

const meta = {
  title: 'Molecules/CalendarEvent',
  component: MmCalendarEvent,
  tags: ['autodocs'],
  args: {
    item: tvItem,
    image: null,
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    () => ({
      template: '<div style="width: 360px; max-width: 100%"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmCalendarEvent>

export default meta

type Story = StoryObj<typeof meta>

export const TvEpisode: Story = {}

export const DigitalMovie: Story = {
  args: {
    item: digitalMovie,
  },
}

export const PhysicalMovie: Story = {
  args: {
    item: {
      ...digitalMovie,
      id: 'radarr-202',
      title: 'Another Example Movie',
      releaseType: 'physical',
    },
  },
}

export const TvWithPoster: Story = {
  args: {
    image: 'https://placehold.co/128x192/272c35/e5e7eb?text=TV',
  },
}

export const MovieWithPoster: Story = {
  args: {
    item: digitalMovie,
    image: 'https://placehold.co/128x192/272c35/e5e7eb?text=Movie',
  },
}

export const LongTitle: Story = {
  args: {
    item: {
      ...tvItem,
      title: 'An Exceptionally Long Series Title That Should Be Truncated Gracefully',
      subtitle: 'S12E24 · An Equally Long Episode Title That Should Not Break the Layout',
    },
  },
}

export const MissingDate: Story = {
  args: {
    item: {
      ...digitalMovie,
      date: 'invalid-date',
    },
  },
}
