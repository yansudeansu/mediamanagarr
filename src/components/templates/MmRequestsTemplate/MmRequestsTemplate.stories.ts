import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmRequestsTemplate from './MmRequestsTemplate.vue'
import MmRequestCard from '../../molecules/MmRequestCard/MmRequestCard.vue'
import MmPagination from '../../molecules/MmPagination/MmPagination.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import type { SeerrRequest, SeerrRequestFilter } from '../../../types/seerr'

const mockRequests: SeerrRequest[] = [
  {
    id: 1,
    type: 'movie',
    title: 'The Emerald Horizon',
    status: 'Approved',
    mediaStatus: 'Available',
    requestedBy: 'Alice',
    createdAt: '2026-10-20T12:00:00.000Z',
    posterPath: null,
  },
  {
    id: 2,
    type: 'tv',
    title: 'Signals from Tomorrow',
    status: 'Pending',
    mediaStatus: 'Pending',
    requestedBy: 'Bob',
    createdAt: '2026-10-19T09:30:00.000Z',
    posterPath: null,
  },
  {
    id: 3,
    type: 'movie',
    title: 'Beyond the Glass Moon',
    status: 'Approved',
    mediaStatus: 'Processing',
    requestedBy: 'Charlie',
    createdAt: '2026-10-18T16:45:00.000Z',
    posterPath: null,
  },
  {
    id: 4,
    type: 'tv',
    title: 'The Midnight Archive',
    status: 'Pending',
    mediaStatus: 'Pending',
    requestedBy: 'Alice',
    createdAt: '2026-10-17T11:20:00.000Z',
    posterPath: null,
  },
  {
    id: 5,
    type: 'movie',
    title: 'Starlight Over Evermere',
    status: 'Approved',
    mediaStatus: 'Available',
    requestedBy: 'David',
    createdAt: '2026-10-16T14:10:00.000Z',
    posterPath: null,
  },
  {
    id: 6,
    type: 'tv',
    title: 'The Clockwork Garden',
    status: 'Approved',
    mediaStatus: 'Partially Available',
    requestedBy: 'Emma',
    createdAt: '2026-10-15T08:00:00.000Z',
    posterPath: null,
  },
  {
    id: 7,
    type: 'movie',
    title: 'Whispers of the Aurora',
    status: 'Pending',
    mediaStatus: 'Pending',
    requestedBy: 'Frank',
    createdAt: '2026-10-14T19:25:00.000Z',
    posterPath: null,
  },
  {
    id: 8,
    type: 'tv',
    title: 'Aether Station Nine',
    status: 'Approved',
    mediaStatus: 'Processing',
    requestedBy: 'Grace',
    createdAt: '2026-10-13T10:15:00.000Z',
    posterPath: null,
  },
  {
    id: 9,
    type: 'movie',
    title: 'The Last Lantern Keeper',
    status: 'Approved',
    mediaStatus: 'Available',
    requestedBy: 'Henry',
    createdAt: '2026-10-12T13:40:00.000Z',
    posterPath: null,
  },
  {
    id: 10,
    type: 'tv',
    title: 'Tales of Silver Hollow',
    status: 'Pending',
    mediaStatus: 'Pending',
    requestedBy: 'Isabel',
    createdAt: '2026-10-11T17:55:00.000Z',
    posterPath: null,
  },
  {
    id: 11,
    type: 'movie',
    title: 'Voyage to the Violet Sun',
    status: 'Approved',
    mediaStatus: 'Available',
    requestedBy: 'Jack',
    createdAt: '2026-10-10T12:30:00.000Z',
    posterPath: null,
  },
  {
    id: 12,
    type: 'tv',
    title: 'The Forgotten Observatory',
    status: 'Pending',
    mediaStatus: 'Pending',
    requestedBy: 'Kelly',
    createdAt: '2026-10-09T09:15:00.000Z',
    posterPath: null,
  },
]

const filters: { label: string; value: SeerrRequestFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
]

const PAGE_SIZE = 10

const meta = {
  title: 'Templates/RequestsTemplate',
  component: MmRequestsTemplate,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    () => ({
      template: '<div style="width: 340px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmRequestsTemplate>

export default meta

type Story = StoryObj<typeof meta>

function createStory(initialFilter: SeerrRequestFilter = 'all') {
  return () => ({
    components: {
      MmRequestsTemplate,
      MmRequestCard,
      MmPagination,
      MmButton,
    },

    setup() {
      const activeFilter = ref<SeerrRequestFilter>(initialFilter)
      const page = ref(1)

      const filteredRequests = computed(() => {
        if (activeFilter.value === 'all') {
          return mockRequests
        }

        const status = activeFilter.value === 'pending' ? 'Pending' : 'Approved'

        return mockRequests.filter((request) => request.status === status)
      })

      const totalPages = computed(() =>
        Math.max(1, Math.ceil(filteredRequests.value.length / PAGE_SIZE)),
      )

      const visibleRequests = computed(() => {
        const start = (page.value - 1) * PAGE_SIZE

        return filteredRequests.value.slice(start, start + PAGE_SIZE)
      })

      function selectFilter(filter: SeerrRequestFilter) {
        activeFilter.value = filter
        page.value = 1
      }

      function reset() {
        activeFilter.value = 'all'
        page.value = 1
      }

      return {
        filters,
        activeFilter,
        page,
        totalPages,
        visibleRequests,
        selectFilter,
        reset,
      }
    },

    template: `
      <MmRequestsTemplate>
        <template #actions>
          <MmButton
            variant="secondary"
            size="small"
            @click="reset"
          >
            Reset
          </MmButton>
        </template>

        <template #filters>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <MmButton
              v-for="filter in filters"
              :key="filter.value"
              size="small"
              :variant="activeFilter === filter.value ? 'primary' : 'secondary'"
              :aria-pressed="activeFilter === filter.value"
              @click="selectFilter(filter.value)"
            >
              {{ filter.label }}
            </MmButton>
          </div>
        </template>

        <MmRequestCard
          v-for="request in visibleRequests"
          :key="request.id"
          :request="request"
        />

        <template v-if="totalPages > 1" #pagination>
          <MmPagination
            v-model:page="page"
            :total-pages="totalPages"
          />
        </template>
      </MmRequestsTemplate>
    `,
  })
}

export const Default: Story = {
  render: createStory(),
}

export const Pending: Story = {
  render: createStory('pending'),
}

export const Approved: Story = {
  render: createStory('approved'),
}

export const Empty: Story = {
  render: () => ({
    components: {
      MmRequestsTemplate,
      MmButton,
    },

    setup() {
      const activeFilter = ref<SeerrRequestFilter>('all')

      return {
        filters,
        activeFilter,
      }
    },

    template: `
      <MmRequestsTemplate>
        <template #filters>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <MmButton
              v-for="filter in filters"
              :key="filter.value"
              size="small"
              :variant="activeFilter === filter.value ? 'primary' : 'secondary'"
              :aria-pressed="activeFilter === filter.value"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
            </MmButton>
          </div>
        </template>

        <p style="margin: 0; color: var(--muted); font-size: 12px;">
          No requests found.
        </p>
      </MmRequestsTemplate>
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { MmRequestsTemplate },

    template: `
      <MmRequestsTemplate>
        <p
          role="status"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          Loading requests…
        </p>
      </MmRequestsTemplate>
    `,
  }),
}

export const Error: Story = {
  render: () => ({
    components: {
      MmRequestsTemplate,
      MmButton,
    },

    setup() {
      const retrying = ref(false)

      function retry() {
        retrying.value = true
      }

      return {
        retrying,
        retry,
      }
    },

    template: `
      <MmRequestsTemplate>
        <div role="alert">
          <p style="margin: 0 0 10px; color: var(--danger); font-size: 12px;">
            Unable to load requests from Seerr.
          </p>

          <MmButton
            variant="secondary"
            size="small"
            :loading="retrying"
            @click="retry"
          >
            Retry
          </MmButton>
        </div>
      </MmRequestsTemplate>
    `,
  }),
}
