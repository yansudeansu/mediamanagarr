<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import MmCalendarTemplate from '../components/templates/MmCalendarTemplate/MmCalendarTemplate.vue'
import MmCalendarHeader from '../components/molecules/MmCalendarHeader/MmCalendarHeader.vue'
import MmCalendarGrid from '../components/organisms/MmCalendarGrid/MmCalendarGrid.vue'
import MmCalendarDetails from '../components/organisms/MmCalendarDetails/MmCalendarDetails.vue'
import MmFilterGroup from '../components/molecules/MmFilterGroup/MmFilterGroup.vue'
import MmButton from '../components/atoms/MmButton/MmButton.vue'
import type {
  CalendarFilter,
  CalendarItem,
  CalendarPosition,
  CalendarServiceStatus,
} from '../types/calendar'
import {
  calendarDateKey,
  calendarItemDateKey,
  calendarMonthRange,
  nextCalendarMonth,
  parseCalendarDateKey,
  previousCalendarMonth,
  startOfCalendarMonth,
} from '../utils/calendar-date'
import { sendBackgroundMessage } from '../utils/background-messaging'

const STORAGE_KEY = 'mediaManagarrCalendarPosition'

const filters = [
  { label: 'All', value: 'all' },
  { label: 'TV', value: 'tv' },
  { label: 'Movies', value: 'movie' },
]

const today = calendarDateKey(new Date())

const month = ref(calendarDateKey(startOfCalendarMonth(new Date())))
const selectedDate = ref(today)
const activeFilter = ref<CalendarFilter>('all')

const items = ref<CalendarItem[]>([])
const services = ref<CalendarServiceStatus[]>([])
const loading = ref(false)
const error = ref('')

const images = ref<Record<string, string | null>>({})
const imageCache = new Map<string, string | null>()
const pendingImages = new Map<string, Promise<string | null>>()

let requestSequence = 0
let isUnmounted = false

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') {
    return items.value
  }

  return items.value.filter((item) => item.type === activeFilter.value)
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
  releaseCount.value === 1 ? '1 release this month' : `${releaseCount.value} releases this month`,
)

const serviceWarnings = computed(() =>
  services.value
    .filter((service) => service.state === 'failed')
    .map((service) => ({
      service: service.service === 'sonarr' ? 'Sonarr' : 'Radarr',
      message: service.error ?? 'Unable to load calendar releases.',
    })),
)

const noServicesConfigured = computed(
  () =>
    services.value.length > 0 &&
    services.value.every((service) => service.state === 'not-configured'),
)

function getErrorMessage(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'An unexpected error occurred.'
}

function currentMonthDate(): Date {
  return parseCalendarDateKey(month.value) ?? startOfCalendarMonth(new Date())
}

async function savePosition(): Promise<void> {
  try {
    await chrome.storage.local.set({
      [STORAGE_KEY]: {
        month: month.value,
        selectedDate: selectedDate.value,
      } satisfies CalendarPosition,
    })
  } catch {
    // Storage failures should not prevent calendar navigation.
  }
}

async function restorePosition(): Promise<void> {
  try {
    const result = (await chrome.storage.local.get(STORAGE_KEY)) as {
      [STORAGE_KEY]?: CalendarPosition
    }

    if (isUnmounted) {
      return
    }

    const stored = result[STORAGE_KEY]

    if (!stored) {
      return
    }

    const storedMonth = parseCalendarDateKey(stored.month)
    const storedDate = parseCalendarDateKey(stored.selectedDate)

    if (!storedMonth || !storedDate) {
      return
    }

    const normalizedMonth = calendarDateKey(startOfCalendarMonth(storedMonth))

    if (stored.selectedDate.slice(0, 7) !== normalizedMonth.slice(0, 7)) {
      return
    }

    month.value = normalizedMonth
    selectedDate.value = calendarDateKey(storedDate)
  } catch {
    // Storage is optional; use the current month if unavailable.
  }
}

async function loadCalendar(): Promise<void> {
  if (isUnmounted) {
    return
  }

  const sequence = ++requestSequence
  const { start, end } = calendarMonthRange(currentMonthDate())

  loading.value = true
  error.value = ''

  try {
    const response = await sendBackgroundMessage({
      type: 'GET_CALENDAR',
      start: calendarDateKey(start),
      end: calendarDateKey(end),
    })

    if (isUnmounted || sequence !== requestSequence) {
      return
    }

    if (!response.success) {
      throw new Error(response.error)
    }

    items.value = response.calendar.items
    services.value = response.calendar.services
  } catch (caught) {
    if (isUnmounted || sequence !== requestSequence) {
      return
    }

    items.value = []
    services.value = []
    error.value = getErrorMessage(caught)
  } finally {
    if (!isUnmounted && sequence === requestSequence) {
      loading.value = false
    }
  }
}

async function loadImage(item: CalendarItem): Promise<void> {
  if (isUnmounted) {
    return
  }

  const mediaId = item.posterMediaId

  if (typeof mediaId !== 'number' || !Number.isSafeInteger(mediaId) || mediaId < 1) {
    return
  }

  const cacheKey = `${item.source}-${mediaId}`

  if (imageCache.has(cacheKey)) {
    images.value[item.id] = imageCache.get(cacheKey) ?? null
    return
  }

  let request = pendingImages.get(cacheKey)

  if (!request) {
    request = (async () => {
      try {
        const response = await sendBackgroundMessage({
          type: 'GET_CALENDAR_IMAGE',
          service: item.source,
          mediaId,
        })

        return response.success ? response.image : null
      } catch {
        return null
      }
    })()

    pendingImages.set(cacheKey, request)
  }

  try {
    const image = await request

    if (isUnmounted) {
      return
    }

    imageCache.set(cacheKey, image)
    images.value[item.id] = image
  } finally {
    if (pendingImages.get(cacheKey) === request) {
      pendingImages.delete(cacheKey)
    }
  }
}

watch(
  selectedItems,
  (currentItems) => {
    for (const item of currentItems) {
      if (item.posterUrl && item.posterMediaId) {
        void loadImage(item)
      }
    }
  },
  { immediate: true },
)

function selectFilter(value: string): void {
  if (value !== 'all' && value !== 'tv' && value !== 'movie') {
    return
  }

  activeFilter.value = value
}

function selectDate(date: string): void {
  const parsed = parseCalendarDateKey(date)

  if (!parsed) {
    return
  }

  selectedDate.value = date

  const selectedMonth = calendarDateKey(startOfCalendarMonth(parsed))

  if (selectedMonth !== month.value) {
    month.value = selectedMonth
    void loadCalendar()
  }

  void savePosition()
}

function previousMonth(): void {
  month.value = calendarDateKey(previousCalendarMonth(currentMonthDate()))
  selectedDate.value = month.value

  void savePosition()
  void loadCalendar()
}

function nextMonth(): void {
  month.value = calendarDateKey(nextCalendarMonth(currentMonthDate()))
  selectedDate.value = month.value

  void savePosition()
  void loadCalendar()
}

function goToToday(): void {
  const now = new Date()
  const currentToday = calendarDateKey(now)
  const todayMonth = calendarDateKey(startOfCalendarMonth(now))

  selectedDate.value = currentToday

  if (month.value !== todayMonth) {
    month.value = todayMonth
    void loadCalendar()
  }

  void savePosition()
}

function refresh(): void {
  if (loading.value) {
    return
  }

  void loadCalendar()
}

onMounted(async () => {
  await restorePosition()

  if (!isUnmounted) {
    await loadCalendar()
  }
})

onBeforeUnmount(() => {
  isUnmounted = true
  requestSequence += 1
})
</script>

<template>
  <mm-calendar-template>
    <template #description>
      {{ description }}
    </template>

    <template #filters>
      <mm-filter-group
        :model-value="activeFilter"
        :options="filters"
        aria-label="Calendar filters"
        @update:model-value="selectFilter"
      />
    </template>

    <template #actions>
      <mm-button variant="secondary" size="small" @click="goToToday"> Today </mm-button>

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
      <mm-calendar-header :month="month" @previous="previousMonth" @next="nextMonth" />
    </template>

    <template v-if="loading || error || serviceWarnings.length > 0" #status>
      <p v-if="loading" class="calendar-view__message" role="status">Loading calendar…</p>

      <div v-if="error" class="calendar-view__error" role="alert">
        <p>{{ error }}</p>

        <mm-button variant="secondary" size="small" @click="refresh"> Retry </mm-button>
      </div>

      <div
        v-for="warning in serviceWarnings"
        :key="warning.service"
        class="calendar-view__warning"
        role="status"
      >
        <strong>{{ warning.service }}:</strong> {{ warning.message }}
      </div>
    </template>

    <template v-if="!loading && !error">
      <p v-if="noServicesConfigured" class="calendar-view__message">
        Connect Sonarr or Radarr in Settings to see upcoming releases.
      </p>

      <mm-calendar-grid
        :month="month"
        :selected-date="selectedDate"
        :today="today"
        :items="filteredItems"
        @select="selectDate"
      />
    </template>

    <template v-if="!loading && !error && !noServicesConfigured" #details>
      <mm-calendar-details :date="selectedDate" :items="selectedItems" :images="images" />
    </template>
  </mm-calendar-template>
</template>

<style scoped>
.calendar-view__message {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
}

.calendar-view__error {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.calendar-view__error p {
  margin: 0;
  color: var(--danger);
  font-size: 12px;
  line-height: 1.5;
}

.calendar-view__warning {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

.calendar-view__warning strong {
  color: var(--text);
}
</style>
