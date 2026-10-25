import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmRequestCard from './MmRequestCard.vue'
import type { SeerrRequest } from '../../../types/seerr'

const baseRequest: SeerrRequest = {
  id: 42,
  type: 'movie',
  title: 'Example Movie',
  status: 'Pending',
  mediaStatus: 'Processing',
  requestedBy: 'Alice',
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
      title: 'Example TV Series',
      status: 'Approved',
      mediaStatus: 'Partially Available',
      requestedBy: 'Bob',
    },
  },
}

export const LongTitle: Story = {
  args: {
    request: {
      ...baseRequest,
      title: 'An Extremely Long Movie Title That Should Be Truncated Gracefully Within the Card',
      requestedBy: 'A Very Long Requester Username',
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
      title: 'Example Movie With Poster',
      posterPath: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    },
  },
}
