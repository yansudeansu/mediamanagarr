import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import MmArrivalCard from './MmArrivalCard.vue'
import type { JellyfinArrival } from '../../../types/jellyfin'

const baseArrival: JellyfinArrival = {
  id: 'movie-42',
  type: 'Movie',
  title: 'Example Movie',
  subtitle: '2026',
  dateAdded: '2026-10-20T12:00:00.000Z',
  imageId: 'movie-42',
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
      id: 'episode-42',
      type: 'Episode',
      title: 'The Beginning',
      subtitle: 'Example Series · S01E02',
      imageId: 'series-42',
      unread: false,
    },
  },
}

export const NewEpisode: Story = {
  args: {
    arrival: {
      ...baseArrival,
      id: 'episode-43',
      type: 'Episode',
      title: 'The Next Chapter',
      subtitle: 'Example Series · S01E03',
      imageId: 'series-42',
      unread: true,
    },
  },
}

export const LongTitle: Story = {
  args: {
    arrival: {
      ...baseArrival,
      title:
        'An Extremely Long Movie Title That Should Be Truncated Gracefully Without Breaking the Card Layout',
      subtitle: '2026 · A Very Long Subtitle That Should Also Be Truncated Gracefully',
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
      title: 'Example Movie With Artwork',
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
