import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import MmCalendarTemplate from './MmCalendarTemplate.vue'
import MmCalendarHeader from '../../molecules/MmCalendarHeader/MmCalendarHeader.vue'
import MmCalendarGrid from '../../organisms/MmCalendarGrid/MmCalendarGrid.vue'
import MmCalendarDetails from '../../organisms/MmCalendarDetails/MmCalendarDetails.vue'
import MmFilterGroup from '../../molecules/MmFilterGroup/MmFilterGroup.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import type { CalendarFilter, CalendarItem } from '../../../types/calendar'
import {
  calendarDateKey,
  calendarItemDateKey,
  nextCalendarMonth,
  parseCalendarDateKey,
  previousCalendarMonth,
} from '../../../utils/calendar-date'

const items: CalendarItem[] = [
  {
    id: 'sonarr-101',
    source: 'sonarr',
    type: 'tv',
    title: 'TV Show 1',
    subtitle: 'S02E03 · Episode 3',
    date: '2026-11-05',
    releaseType: 'air',
    posterUrl: null,
  },
  {
    id: 'radarr-201',
    source: 'radarr',
    type: 'movie',
    title: 'Movie 1',
    subtitle: '2026',
    date: '2026-11-05',
    releaseType: 'digital',
    posterUrl: null,
  },
  {
    id: 'sonarr-102',
    source: 'sonarr',
    type: 'tv',
    title: 'TV Show 2',
    subtitle: 'S01E01 · Episode 1',
    date: '2026-11-12',
    releaseType: 'air',
    posterUrl: null,
  },
  {
    id: 'radarr-202',
    source: 'radarr',
    type: 'movie',
    title: 'Movie 2',
    subtitle: '2026',
    date: '2026-11-20',
    releaseType: 'physical',
    posterUrl: null,
  },
]

const filters = [
  { label: 'All', value: 'all' },
  { label: 'TV', value: 'tv' },
  { label: 'Movies', value: 'movie' },
]

const meta = {
  title: 'Templates/Calendar',
  component: MmCalendarTemplate,
  tags: ['autodocs'],
} satisfies Meta<typeof MmCalendarTemplate>

export default meta

type Story = StoryObj<typeof meta>

interface StoryOptions {
  items?: CalendarItem[]
  loading?: boolean
}

function createStory(options: StoryOptions = {}): Story['render'] {
  return () => ({
    components: {
      MmCalendarTemplate,
      MmCalendarHeader,
      MmCalendarGrid,
      MmCalendarDetails,
      MmFilterGroup,
      MmButton,
    },

    setup() {
      const today = '2026-11-05'

      const month = ref('2026-11-01')
      const selectedDate = ref('2026-11-05')
      const activeFilter = ref<CalendarFilter>('all')

      const loading = ref(options.loading ?? false)
      const calendarItems = ref<CalendarItem[]>(options.items ?? items)

      const filteredItems = computed(() => {
        if (activeFilter.value === 'all') {
          return calendarItems.value
        }

        return calendarItems.value.filter((item) => item.type === activeFilter.value)
      })

      const selectedItems = computed(() =>
        filteredItems.value.filter((item) => calendarItemDateKey(item.date) === selectedDate.value),
      )

      const releaseCount = computed(() => {
        const currentMonth = month.value.slice(0, 7)

        return filteredItems.value.filter((item) =>
          calendarItemDateKey(item.date)?.startsWith(currentMonth),
        ).length
      })

      const description = computed(() =>
        releaseCount.value === 1
          ? '1 release this month'
          : `${releaseCount.value} releases this month`,
      )

      function selectFilter(value: string): void {
        if (value !== 'all' && value !== 'tv' && value !== 'movie') {
          return
        }

        activeFilter.value = value
      }

      function selectDate(date: string): void {
        selectedDate.value = date

        const selectedMonth = `${date.slice(0, 7)}-01`

        if (selectedMonth !== month.value) {
          month.value = selectedMonth
        }
      }

      function previousMonth(): void {
        const currentMonth = parseCalendarDateKey(month.value)

        if (!currentMonth) {
          return
        }

        month.value = calendarDateKey(previousCalendarMonth(currentMonth))
        selectedDate.value = month.value
      }

      function nextMonth(): void {
        const currentMonth = parseCalendarDateKey(month.value)

        if (!currentMonth) {
          return
        }

        month.value = calendarDateKey(nextCalendarMonth(currentMonth))
        selectedDate.value = month.value
      }

      function goToToday(): void {
        month.value = `${today.slice(0, 7)}-01`
        selectedDate.value = today
      }

      function refresh(): void {
        if (loading.value) {
          return
        }

        loading.value = true

        window.setTimeout(() => {
          loading.value = false
        }, 600)
      }

      return {
        today,
        month,
        selectedDate,
        activeFilter,
        loading,
        filters,
        filteredItems,
        selectedItems,
        description,
        selectFilter,
        selectDate,
        previousMonth,
        nextMonth,
        goToToday,
        refresh,
      }
    },

    template: `
      <div style="width: 340px">
        <mm-calendar-template>
          <template #description>
            {{ description }}
          </template>

          <template #filters>
            <mm-filter-group
              :model-value="activeFilter"
              :options="filters"
              aria-label="Calendar filters"
              :disabled="loading"
              @update:model-value="selectFilter"
            />
          </template>

          <template #actions>
            <mm-button
              variant="secondary"
              size="small"
              @click="goToToday"
            >
              Today
            </mm-button>

            <mm-button
              variant="secondary"
              size="small"
              icon="refresh"
              icon-only
              aria-label="Refresh calendar"
              title="Refresh calendar"
              :disabled="loading"
              @click="refresh"
            />
          </template>

          <template #navigation>
            <mm-calendar-header
              :month="month"
              @previous="previousMonth"
              @next="nextMonth"
            />
          </template>

          <template v-if="loading" #status>
            <p role="status">Loading calendar releases…</p>
          </template>

          <mm-calendar-grid
            :month="month"
            :selected-date="selectedDate"
            :today="today"
            :items="filteredItems"
            @select="selectDate"
          />

          <template #details>
            <mm-calendar-details
              :date="selectedDate"
              :items="selectedItems"
              :loading="loading"
            />
          </template>
        </mm-calendar-template>
      </div>
    `,
  })
}

/**
 * Interactive calendar with TV episodes and movie releases.
 */
export const Playground: Story = {
  render: createStory(),
}

/**
 * Calendar without scheduled releases.
 */
export const Empty: Story = {
  render: createStory({
    items: [],
  }),
}

/**
 * Calendar displaying its loading state.
 */
export const Loading: Story = {
  render: createStory({
    loading: true,
  }),
}

/**
 * Calendar containing only TV releases.
 */
export const TvReleases: Story = {
  render: createStory({
    items: items.filter((item) => item.type === 'tv'),
  }),
}

/**
 * Calendar containing only movie releases.
 */
export const MovieReleases: Story = {
  render: createStory({
    items: items.filter((item) => item.type === 'movie'),
  }),
}
