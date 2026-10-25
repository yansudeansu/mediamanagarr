import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmUpNextTemplate from './MmUpNextTemplate.vue'
import MmArrivalCard from '../../molecules/MmArrivalCard/MmArrivalCard.vue'
import MmPagination from '../../molecules/MmPagination/MmPagination.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import type { JellyfinArrival } from '../../../types/jellyfin'

type ArrivalFilter = 'all' | 'new'

const PAGE_SIZE = 10

const mockArrivals: JellyfinArrival[] = [
  {
    id: 'movie-1',
    type: 'Movie',
    title: 'Dune: Part Two',
    subtitle: '2024',
    dateAdded: '2026-10-24T18:30:00.000Z',
    imageId: 'movie-1',
    imageTag: null,
    unread: true,
  },
  {
    id: 'episode-2',
    type: 'Episode',
    title: 'The We We Are',
    subtitle: 'Severance · S01E09',
    dateAdded: '2026-10-23T14:15:00.000Z',
    imageId: 'series-2',
    imageTag: null,
    unread: true,
  },
  {
    id: 'movie-3',
    type: 'Movie',
    title: 'Interstellar',
    subtitle: '2014',
    dateAdded: '2026-10-22T11:00:00.000Z',
    imageId: 'movie-3',
    imageTag: null,
    unread: false,
  },
  {
    id: 'episode-4',
    type: 'Episode',
    title: 'When You’re Lost in the Darkness',
    subtitle: 'The Last of Us · S01E01',
    dateAdded: '2026-10-21T20:45:00.000Z',
    imageId: 'series-4',
    imageTag: null,
    unread: true,
  },
  {
    id: 'movie-5',
    type: 'Movie',
    title: 'Oppenheimer',
    subtitle: '2023',
    dateAdded: '2026-10-20T09:30:00.000Z',
    imageId: 'movie-5',
    imageTag: null,
    unread: false,
  },
  {
    id: 'episode-6',
    type: 'Episode',
    title: 'Pilot',
    subtitle: 'Fallout · S01E01',
    dateAdded: '2026-10-19T16:00:00.000Z',
    imageId: 'series-6',
    imageTag: null,
    unread: false,
  },
  {
    id: 'movie-7',
    type: 'Movie',
    title: 'The Batman',
    subtitle: '2022',
    dateAdded: '2026-10-18T13:20:00.000Z',
    imageId: 'movie-7',
    imageTag: null,
    unread: false,
  },
  {
    id: 'episode-8',
    type: 'Episode',
    title: 'The Heirs of the Dragon',
    subtitle: 'House of the Dragon · S01E01',
    dateAdded: '2026-10-17T08:45:00.000Z',
    imageId: 'series-8',
    imageTag: null,
    unread: true,
  },
  {
    id: 'movie-9',
    type: 'Movie',
    title: 'Everything Everywhere All at Once',
    subtitle: '2022',
    dateAdded: '2026-10-16T17:10:00.000Z',
    imageId: 'movie-9',
    imageTag: null,
    unread: false,
  },
  {
    id: 'episode-10',
    type: 'Episode',
    title: 'System Shutdown',
    subtitle: 'Silo · S01E10',
    dateAdded: '2026-10-15T12:00:00.000Z',
    imageId: 'series-10',
    imageTag: null,
    unread: false,
  },
  {
    id: 'movie-11',
    type: 'Movie',
    title: 'Blade Runner 2049',
    subtitle: '2017',
    dateAdded: '2026-10-14T10:00:00.000Z',
    imageId: 'movie-11',
    imageTag: null,
    unread: true,
  },
  {
    id: 'episode-12',
    type: 'Episode',
    title: 'The Original',
    subtitle: 'Westworld · S01E01',
    dateAdded: '2026-10-13T19:30:00.000Z',
    imageId: 'series-12',
    imageTag: null,
    unread: false,
  },
]

const filters: { label: string; value: ArrivalFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
]

const meta = {
  title: 'Templates/UpNextTemplate',
  component: MmUpNextTemplate,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    () => ({
      template: '<div style="width: 340px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmUpNextTemplate>

export default meta

type Story = StoryObj<typeof meta>

function createStory(initialFilter: ArrivalFilter = 'all') {
  return () => ({
    components: {
      MmUpNextTemplate,
      MmArrivalCard,
      MmPagination,
      MmButton,
    },

    setup() {
      const arrivals = ref<JellyfinArrival[]>(mockArrivals.map((arrival) => ({ ...arrival })))
      const activeFilter = ref<ArrivalFilter>(initialFilter)
      const page = ref(1)

      const unreadCount = computed(() => arrivals.value.filter((arrival) => arrival.unread).length)

      const totalPages = computed(() => Math.max(1, Math.ceil(arrivals.value.length / PAGE_SIZE)))

      const currentPageArrivals = computed(() => {
        const start = (page.value - 1) * PAGE_SIZE

        return arrivals.value.slice(start, start + PAGE_SIZE)
      })

      const visibleArrivals = computed(() =>
        activeFilter.value === 'new'
          ? currentPageArrivals.value.filter((arrival) => arrival.unread)
          : currentPageArrivals.value,
      )

      const description = computed(() =>
        unreadCount.value > 0
          ? `${unreadCount.value} new · ${arrivals.value.length} unwatched items`
          : `${arrivals.value.length} unwatched items`,
      )

      function selectFilter(filter: ArrivalFilter) {
        activeFilter.value = filter
      }

      function toggleUnread(itemId: string, unread: boolean) {
        arrivals.value = arrivals.value.map((arrival) =>
          arrival.id === itemId ? { ...arrival, unread } : arrival,
        )
      }

      function clearNotifications() {
        arrivals.value = arrivals.value.map((arrival) => ({
          ...arrival,
          unread: false,
        }))
      }

      function refresh() {
        arrivals.value = mockArrivals.map((arrival) => ({ ...arrival }))
        activeFilter.value = 'all'
        page.value = 1
      }

      return {
        filters,
        activeFilter,
        page,
        totalPages,
        visibleArrivals,
        unreadCount,
        description,
        selectFilter,
        toggleUnread,
        clearNotifications,
        refresh,
      }
    },

    template: `
      <MmUpNextTemplate>
        <template #description>
          {{ description }}
        </template>

        <template #actions>
          <MmButton
            v-if="unreadCount > 0"
            variant="secondary"
            size="small"
            @click="clearNotifications"
          >
            Clear notifications
          </MmButton>

          <MmButton
            variant="secondary"
            size="small"
            icon="refresh"
            @click="refresh"
          >
            Refresh
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

        <p
          v-if="visibleArrivals.length === 0"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          No new items right now.
        </p>

        <MmArrivalCard
          v-for="arrival in visibleArrivals"
          :key="arrival.id"
          :arrival="arrival"
          @toggle-unread="toggleUnread"
        />

        <template v-if="totalPages > 1" #pagination>
          <MmPagination
            v-model:page="page"
            :total-pages="totalPages"
          />
        </template>
      </MmUpNextTemplate>
    `,
  })
}

export const Default: Story = {
  render: createStory(),
}

export const New: Story = {
  render: createStory('new'),
}

export const Empty: Story = {
  render: () => ({
    components: {
      MmUpNextTemplate,
      MmButton,
    },

    setup() {
      const activeFilter = ref<ArrivalFilter>('all')

      return {
        filters,
        activeFilter,
      }
    },

    template: `
      <MmUpNextTemplate>
        <template #description>
          0 unwatched items
        </template>

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
          Nothing unwatched in your recent library.
        </p>
      </MmUpNextTemplate>
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: {
      MmUpNextTemplate,
    },

    template: `
      <MmUpNextTemplate>
        <p
          role="status"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          Loading arrivals…
        </p>
      </MmUpNextTemplate>
    `,
  }),
}

export const Error: Story = {
  render: () => ({
    components: {
      MmUpNextTemplate,
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
      <MmUpNextTemplate>
        <div role="alert">
          <p style="margin: 0 0 10px; color: var(--danger); font-size: 12px;">
            Unable to load arrivals from Jellyfin.
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
      </MmUpNextTemplate>
    `,
  }),
}

export const LongTitle: Story = {
  render: () => ({
    components: {
      MmUpNextTemplate,
      MmArrivalCard,
    },

    setup() {
      const arrival: JellyfinArrival = {
        ...mockArrivals[0]!,
        title:
          'An Extremely Long Movie Title That Should Be Truncated Gracefully Without Breaking the Popup Layout',
        subtitle: '2026 · An Extremely Long Subtitle That Should Also Be Truncated',
      }

      return { arrival }
    },

    template: `
      <MmUpNextTemplate>
        <MmArrivalCard :arrival="arrival" />
      </MmUpNextTemplate>
    `,
  }),
}
