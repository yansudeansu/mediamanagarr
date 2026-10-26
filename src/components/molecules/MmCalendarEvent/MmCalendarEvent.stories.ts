import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmCalendarEvent from './MmCalendarEvent.vue'
import type { CalendarItem } from '../../../types/calendar'

const tvItem: CalendarItem = {
  id: 'sonarr-101',
  source: 'sonarr',
  type: 'tv',
  title: 'TV Show 1',
  subtitle: 'S02E03 · Episode 3',
  date: '2026-11-05T20:00:00Z',
  releaseType: 'air',
  posterUrl: null,
}

const digitalMovie: CalendarItem = {
  id: 'radarr-201',
  source: 'radarr',
  type: 'movie',
  title: 'Movie 1',
  subtitle: '2026',
  date: '2026-11-05',
  releaseType: 'digital',
  posterUrl: null,
}

const createPoster = (label: string): string =>
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="192" viewBox="0 0 128 192">
      <rect width="128" height="192" fill="#272c35"/>
      <text x="64" y="96" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" fill="#e5e7eb">${label}</text>
    </svg>`,
  )

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
      title: 'Movie 2',
      releaseType: 'physical',
    },
  },
}

export const TvWithPoster: Story = {
  args: {
    image: createPoster('TV Show 1'),
  },
}

export const MovieWithPoster: Story = {
  args: {
    item: digitalMovie,
    image: createPoster('Movie 1'),
  },
}

export const LongTitle: Story = {
  args: {
    item: {
      ...tvItem,
      title: 'TV Show 1 — Extended Edition With an Extremely Long Title for Layout Testing',
      subtitle: 'S12E24 · Episode 24 With an Extremely Long Subtitle for Layout Testing',
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
