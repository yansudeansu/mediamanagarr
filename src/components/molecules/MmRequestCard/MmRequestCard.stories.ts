import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmRequestCard from './MmRequestCard.vue'
import type { SeerrRequest } from '../../../types/seerr'

const baseRequest: SeerrRequest = {
  id: 42,
  type: 'movie',
  title: 'Movie 1',
  status: 'Pending',
  mediaStatus: 'Processing',
  requestedBy: 'Test User 1',
  createdAt: '2026-10-20T12:00:00.000Z',
  posterPath: null,
}

const meta = {
  title: 'Molecules/RequestCard',
  component: MmRequestCard,
  tags: ['autodocs'],
  args: {
    request: baseRequest,
  },
} satisfies Meta<typeof MmRequestCard>

export default meta

type Story = StoryObj<typeof meta>

export const Pending: Story = {}

export const Approved: Story = {
  args: {
    request: {
      ...baseRequest,
      status: 'Approved',
      mediaStatus: 'Available',
    },
  },
}

export const Declined: Story = {
  args: {
    request: {
      ...baseRequest,
      status: 'Declined',
      mediaStatus: 'Unknown',
    },
  },
}

export const TVShow: Story = {
  args: {
    request: {
      ...baseRequest,
      id: 43,
      type: 'tv',
      title: 'TV Show 1',
      status: 'Approved',
      mediaStatus: 'Partially Available',
      requestedBy: 'Test User 2',
    },
  },
}

export const LongTitle: Story = {
  args: {
    request: {
      ...baseRequest,
      title:
        'Movie 1 — Extended Edition With Additional Bonus Content and an Extremely Long Title for Layout Testing',
      requestedBy: 'Test User With an Extremely Long Display Name',
    },
  },
}

export const MissingPoster: Story = {
  args: {
    request: {
      ...baseRequest,
      posterPath: null,
    },
  },
}

export const WithPoster: Story = {
  args: {
    request: {
      ...baseRequest,
      title: 'Movie 2',
      posterPath: '/storybook-test-poster.jpg',
    },
  },
}
