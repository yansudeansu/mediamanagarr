<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MmUpNextTemplate from '../components/templates/MmUpNextTemplate/MmUpNextTemplate.vue'
import MmArrivalCard from '../components/molecules/MmArrivalCard/MmArrivalCard.vue'
import MmPagination from '../components/molecules/MmPagination/MmPagination.vue'
import MmFilterGroup from '../components/molecules/MmFilterGroup/MmFilterGroup.vue'
import MmButton from '../components/atoms/MmButton/MmButton.vue'
import type { JellyfinArrival, JellyfinArrivalFilter } from '../types/jellyfin'
import { sendBackgroundMessage } from '../utils/background-messaging'

const PAGE_SIZE = 10

const filters = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
]

const arrivals = ref<JellyfinArrival[]>([])
const images = ref<Record<string, string | null>>({})
const busyItems = ref<string[]>([])
const activeFilter = ref<JellyfinArrivalFilter>('all')
const page = ref(1)
const total = ref(0)
const allTotal = ref(0)
const unreadCount = ref(0)
const loading = ref(false)
const clearing = ref(false)
const error = ref('')
const actionError = ref('')

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

const description = computed(() =>
  unreadCount.value > 0
    ? `${unreadCount.value} new · ${allTotal.value} unwatched items`
    : `${allTotal.value} unwatched items`,
)

let requestSequence = 0

function getErrorMessage(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'An unexpected error occurred.'
}

async function loadImage(arrival: JellyfinArrival, sequence: number): Promise<void> {
  if (Object.hasOwn(images.value, arrival.imageId)) {
    return
  }

  try {
    const response = await sendBackgroundMessage({
      type: 'GET_JELLYFIN_IMAGE',
      itemId: arrival.imageId,
      imageTag: arrival.imageTag,
    })

    if (sequence !== requestSequence) {
      return
    }

    images.value[arrival.imageId] = response.success ? response.image : null
  } catch {
    if (sequence === requestSequence) {
      images.value[arrival.imageId] = null
    }
  }
}

async function loadArrivals(): Promise<void> {
  const sequence = ++requestSequence

  loading.value = true
  error.value = ''
  actionError.value = ''

  try {
    const response = await sendBackgroundMessage({
      type: 'GET_JELLYFIN_ARRIVALS',
      page: page.value,
      pageSize: PAGE_SIZE,
      filter: activeFilter.value,
    })

    if (sequence !== requestSequence) {
      return
    }

    if (!response.success) {
      throw new Error(response.error)
    }

    arrivals.value = response.arrivals.items
    total.value = response.arrivals.total
    unreadCount.value = response.unreadCount

    if (activeFilter.value === 'all') {
      allTotal.value = response.arrivals.total
    }

    for (const arrival of response.arrivals.items) {
      void loadImage(arrival, sequence)
    }
  } catch (caught) {
    if (sequence !== requestSequence) {
      return
    }

    arrivals.value = []
    total.value = 0
    error.value = getErrorMessage(caught)
  } finally {
    if (sequence === requestSequence) {
      loading.value = false
    }
  }
}

function selectFilter(filter: string): void {
  if (filter !== 'all' && filter !== 'new') {
    return
  }

  if (filter === activeFilter.value) {
    return
  }

  activeFilter.value = filter
  page.value = 1

  void loadArrivals()
}

function selectPage(nextPage: number): void {
  if (
    !Number.isInteger(nextPage) ||
    nextPage < 1 ||
    nextPage > totalPages.value ||
    nextPage === page.value
  ) {
    return
  }

  page.value = nextPage
  void loadArrivals()
}

function refresh(): void {
  if (loading.value) {
    return
  }

  void loadArrivals()
}

async function toggleUnread(itemId: string, unread: boolean): Promise<void> {
  if (busyItems.value.includes(itemId)) {
    return
  }

  busyItems.value = [...busyItems.value, itemId]
  actionError.value = ''

  try {
    const response = await sendBackgroundMessage({
      type: 'SET_JELLYFIN_ARRIVAL_UNREAD',
      itemId,
      unread,
    })

    if (!response.success) {
      throw new Error(response.error)
    }

    unreadCount.value = response.unreadCount

    if (activeFilter.value === 'new' && !unread) {
      const remainingPages = Math.max(1, Math.ceil(response.unreadCount / PAGE_SIZE))

      page.value = Math.min(page.value, remainingPages)

      await loadArrivals()
    } else {
      arrivals.value = arrivals.value.map((arrival) =>
        arrival.id === itemId ? { ...arrival, unread } : arrival,
      )
    }
  } catch (caught) {
    actionError.value = getErrorMessage(caught)
  } finally {
    busyItems.value = busyItems.value.filter((id) => id !== itemId)
  }
}

async function clearNotifications(): Promise<void> {
  if (clearing.value || unreadCount.value === 0) {
    return
  }

  clearing.value = true
  actionError.value = ''

  try {
    const response = await sendBackgroundMessage({
      type: 'CLEAR_JELLYFIN_NOTIFICATIONS',
    })

    if (!response.success) {
      throw new Error(response.error)
    }

    unreadCount.value = response.unreadCount

    if (activeFilter.value === 'new') {
      page.value = 1
      await loadArrivals()
    } else {
      arrivals.value = arrivals.value.map((arrival) => ({
        ...arrival,
        unread: false,
      }))
    }
  } catch (caught) {
    actionError.value = getErrorMessage(caught)
  } finally {
    clearing.value = false
  }
}

onMounted(() => {
  void loadArrivals()
})
</script>

<template>
  <mm-up-next-template>
    <template #description>
      {{ description }}
    </template>

    <template #actions>
      <mm-button
        v-if="unreadCount > 0"
        variant="secondary"
        size="small"
        :loading="clearing"
        :disabled="loading || clearing"
        @click="clearNotifications"
      >
        Clear notifications
      </mm-button>

      <mm-button
        variant="secondary"
        size="small"
        icon="refresh"
        :loading="loading"
        :disabled="loading || clearing"
        @click="refresh"
      >
        Refresh
      </mm-button>
    </template>

    <template #filters>
      <mm-filter-group
        :model-value="activeFilter"
        :options="filters"
        aria-label="Arrival filters"
        @update:model-value="selectFilter"
      />
    </template>

    <p v-if="loading" class="up-next-view__message" role="status">Loading arrivals…</p>

    <div v-else-if="error" class="up-next-view__error" role="alert">
      <p>{{ error }}</p>

      <mm-button variant="secondary" size="small" @click="refresh"> Retry </mm-button>
    </div>

    <template v-else>
      <p v-if="actionError" class="up-next-view__action-error" role="alert">
        {{ actionError }}
      </p>

      <p v-if="arrivals.length === 0" class="up-next-view__message">
        {{
          activeFilter === 'new'
            ? 'No new items right now.'
            : 'Nothing unwatched in your recent library.'
        }}
      </p>

      <mm-arrival-card
        v-for="arrival in arrivals"
        :key="arrival.id"
        :arrival="arrival"
        :image="images[arrival.imageId]"
        :busy="busyItems.includes(arrival.id)"
        @toggle-unread="toggleUnread"
      />
    </template>

    <template v-if="!loading && !error && totalPages > 1" #pagination>
      <mm-pagination :page="page" :total-pages="totalPages" @update:page="selectPage" />
    </template>
  </mm-up-next-template>
</template>

<style scoped>
.up-next-view__message {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
}

.up-next-view__error {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.up-next-view__error p {
  margin: 0;
  color: var(--danger);
  font-size: 12px;
  line-height: 1.5;
}

.up-next-view__action-error {
  margin: 0;
  color: var(--danger);
  font-size: 11px;
  line-height: 1.5;
}
</style>
