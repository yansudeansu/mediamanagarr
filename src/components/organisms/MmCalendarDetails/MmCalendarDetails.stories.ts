import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmCalendarDetails from './MmCalendarDetails.vue'
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
        title: 'Another Series',
        subtitle: 'S01E01 · Pilot',
      },
      {
        ...movieItem,
        id: 'radarr-202',
        title: 'Another Movie',
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
      'sonarr-101': 'https://placehold.co/128x192/272c35/e5e7eb?text=TV',
      'radarr-201': 'https://placehold.co/128x192/272c35/e5e7eb?text=Movie',
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
