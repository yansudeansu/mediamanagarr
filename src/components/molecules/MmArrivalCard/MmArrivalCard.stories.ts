import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import MmArrivalCard from './MmArrivalCard.vue'
import type { JellyfinArrival } from '../../../types/jellyfin'

const baseArrival: JellyfinArrival = {
  id: 'movie-1',
  type: 'Movie',
  title: 'Movie 1',
  subtitle: '2026',
  dateAdded: '2026-10-20T12:00:00.000Z',
  imageId: 'movie-1',
  imageTag: null,
  unread: false,
}

const meta = {
  title: 'Molecules/ArrivalCard',
  component: MmArrivalCard,
  tags: ['autodocs'],
  args: {
    arrival: baseArrival,
    image: null,
    busy: false,
    onToggleUnread: fn(),
  },
} satisfies Meta<typeof MmArrivalCard>

export default meta

type Story = StoryObj<typeof meta>

export const Movie: Story = {}

export const NewMovie: Story = {
  args: {
    arrival: {
      ...baseArrival,
      unread: true,
    },
  },
}

export const Episode: Story = {
  args: {
    arrival: {
      ...baseArrival,
      id: 'episode-1',
      type: 'Episode',
      title: 'Episode 1',
      subtitle: 'TV Show 1 · S01E01',
      imageId: 'tv-show-1',
      unread: false,
    },
  },
}

export const NewEpisode: Story = {
  args: {
    arrival: {
      ...baseArrival,
      id: 'episode-2',
      type: 'Episode',
      title: 'Episode 2',
      subtitle: 'TV Show 1 · S01E02',
      imageId: 'tv-show-1',
      unread: true,
    },
  },
}

export const LongTitle: Story = {
  args: {
    arrival: {
      ...baseArrival,
      title:
        'Movie 1 — Extended Edition With Additional Bonus Content and an Extremely Long Title for Layout Testing',
      subtitle: '2026 · Extended Edition With an Extremely Long Subtitle for Layout Testing',
    },
  },
}

export const MissingArtwork: Story = {
  args: {
    image: null,
  },
}

export const WithArtwork: Story = {
  args: {
    arrival: {
      ...baseArrival,
      title: 'Movie 2',
    },
    image:
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="180" viewBox="0 0 120 180"><rect width="120" height="180" fill="#153326"/><circle cx="60" cy="64" r="28" fill="#22c55e"/><text x="60" y="123" text-anchor="middle" font-size="13" fill="white">MOVIE</text></svg>',
      ),
  },
}

export const Busy: Story = {
  args: {
    arrival: {
      ...baseArrival,
      unread: true,
    },
    busy: true,
  },
}

export const InvalidDate: Story = {
  args: {
    arrival: {
      ...baseArrival,
      dateAdded: 'invalid-date',
    },
  },
}
