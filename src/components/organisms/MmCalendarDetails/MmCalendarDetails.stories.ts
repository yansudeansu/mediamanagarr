import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmCalendarDetails from './MmCalendarDetails.vue'
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

const createPoster = (label: string): string =>
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="192" viewBox="0 0 128 192">
      <rect width="128" height="192" fill="#272c35"/>
      <text x="64" y="96" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" fill="#e5e7eb">${label}</text>
    </svg>`,
  )

const meta = {
  title: 'Organisms/CalendarDetails',
  component: MmCalendarDetails,
  tags: ['autodocs'],

  args: {
    date: '2026-11-05',
    items: [tvItem, movieItem],
    images: {},
    loading: false,
  },

  argTypes: {
    date: {
      control: 'text',
      description: 'Selected date in YYYY-MM-DD format.',
    },
    items: {
      control: 'object',
      description: 'Releases to display for the selected date.',
    },
    images: {
      control: 'object',
      description: 'Resolved artwork keyed by calendar item ID.',
    },
    loading: {
      control: 'boolean',
      description: 'Whether releases are currently loading.',
    },
  },
} satisfies Meta<typeof MmCalendarDetails>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A selected day containing TV and movie releases.
 */
export const Default: Story = {}

/**
 * A day with no scheduled releases.
 */
export const Empty: Story = {
  args: {
    items: [],
  },
}

/**
 * A day containing one TV episode.
 */
export const SingleEpisode: Story = {
  args: {
    items: [tvItem],
  },
}

/**
 * A day containing one movie.
 */
export const SingleMovie: Story = {
  args: {
    items: [movieItem],
  },
}

/**
 * A day containing several releases.
 */
export const MultipleReleases: Story = {
  args: {
    items: [
      tvItem,
      movieItem,
      {
        ...tvItem,
        id: 'sonarr-102',
        title: 'TV Show 2',
        subtitle: 'S01E01 · Episode 1',
      },
      {
        ...movieItem,
        id: 'radarr-202',
        title: 'Movie 2',
        subtitle: '2026',
        releaseType: 'physical',
      },
    ],
  },
}

/**
 * A day containing releases with resolved artwork.
 */
export const WithArtwork: Story = {
  args: {
    images: {
      'sonarr-101': createPoster('TV Show 1'),
      'radarr-201': createPoster('Movie 1'),
    },
  },
}

/**
 * A loading state.
 */
export const Loading: Story = {
  args: {
    loading: true,
  },
}

/**
 * Invalid dates are handled without throwing errors.
 */
export const InvalidDate: Story = {
  args: {
    date: 'invalid',
    items: [],
  },
}
