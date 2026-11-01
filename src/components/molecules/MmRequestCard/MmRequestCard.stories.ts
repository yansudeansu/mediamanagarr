import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmRequestCard from './MmRequestCard.vue'
import type { RequestCardData } from './MmRequestCard.vue'

const baseRequest: RequestCardData = {
  type: 'movie',
  title: 'Example Movie',
  status: 'Pending',
  mediaStatus: 'Pending',
  requestedBy: 'Alex',
  createdAt: '2026-10-20T12:00:00.000Z',
  posterUrl: null,
}

const meta = {
  title: 'Molecules/RequestCard',
  component: MmRequestCard,
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A presentation-only card showing a media request, its status, requester, date, and optional poster. The parent supplies display-ready data and poster URLs.',
      },
    },
  },

  argTypes: {
    request: {
      control: 'object',
      description:
        'Display-ready request data, including title, media type, statuses, requester, creation date, and optional poster URL.',
    },
  },

  args: {
    request: baseRequest,
  },

  decorators: [
    () => ({
      template: `
        <div style="width: min(420px, calc(100vw - 32px));">
          <story />
        </div>
      `,
    }),
  ],
} satisfies Meta<typeof MmRequestCard>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

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

export const Processing: Story = {
  args: {
    request: {
      ...baseRequest,
      status: 'Approved',
      mediaStatus: 'Processing',
    },
  },
}

export const PartiallyAvailable: Story = {
  args: {
    request: {
      ...baseRequest,
      type: 'tv',
      title: 'Example Series',
      status: 'Approved',
      mediaStatus: 'Partially Available',
    },
  },
}

export const TVShow: Story = {
  args: {
    request: {
      ...baseRequest,
      type: 'tv',
      title: 'Example Series',
      status: 'Approved',
      mediaStatus: 'Available',
      requestedBy: 'Jordan',
    },
  },
}

export const LongTitle: Story = {
  args: {
    request: {
      ...baseRequest,
      title:
        'Example Movie — Extended Edition With Additional Bonus Content and an Extremely Long Title for Layout Testing',
      requestedBy: 'A User With an Extremely Long Display Name',
    },
  },
}

export const MissingPoster: Story = {
  args: {
    request: {
      ...baseRequest,
      posterUrl: null,
    },
  },
}

export const WithPoster: Story = {
  args: {
    request: {
      ...baseRequest,
      title: 'Example Movie With Poster',
      posterUrl: 'https://image.tmdb.org/t/p/w185/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    },
  },
}

export const UnknownStatus: Story = {
  args: {
    request: {
      ...baseRequest,
      status: 'Unknown',
      mediaStatus: 'Unknown',
    },
  },
}

export const InvalidDate: Story = {
  args: {
    request: {
      ...baseRequest,
      createdAt: 'invalid-date',
    },
  },
}
