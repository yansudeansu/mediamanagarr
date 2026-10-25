<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MmRequestsTemplate from '../components/templates/MmRequestsTemplate/MmRequestsTemplate.vue'
import MmRequestCard from '../components/molecules/MmRequestCard/MmRequestCard.vue'
import MmPagination from '../components/molecules/MmPagination/MmPagination.vue'
import MmFilterGroup from '../components/molecules/MmFilterGroup/MmFilterGroup.vue'
import MmButton from '../components/atoms/MmButton/MmButton.vue'
import type { SeerrRequest, SeerrRequestFilter } from '../types/seerr'
import { sendBackgroundMessage } from '../utils/background-messaging'

const PAGE_SIZE = 10

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
]

const requests = ref<SeerrRequest[]>([])
const activeFilter = ref<SeerrRequestFilter>('all')
const page = ref(1)
const total = ref(0)
const loading = ref(false)
const error = ref('')

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

let requestSequence = 0

function getErrorMessage(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'An unexpected error occurred.'
}

async function loadRequests(): Promise<void> {
  const sequence = ++requestSequence
  const requestedPage = page.value
  const requestedFilter = activeFilter.value

  loading.value = true
  error.value = ''

  try {
    const response = await sendBackgroundMessage({
      type: 'GET_SEERR_REQUESTS',
      page: requestedPage,
      pageSize: PAGE_SIZE,
      filter: requestedFilter,
    })

    if (sequence !== requestSequence) {
      return
    }

    if (!response.success) {
      throw new Error(response.error)
    }

    requests.value = response.requests.items
    total.value = response.requests.total
  } catch (caught) {
    if (sequence !== requestSequence) {
      return
    }

    requests.value = []
    total.value = 0
    error.value = getErrorMessage(caught)
  } finally {
    if (sequence === requestSequence) {
      loading.value = false
    }
  }
}

function selectFilter(filter: string): void {
  if (filter !== 'all' && filter !== 'pending' && filter !== 'approved') {
    return
  }

  if (activeFilter.value === filter) {
    return
  }

  activeFilter.value = filter
  page.value = 1

  void loadRequests()
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

  void loadRequests()
}

function refresh(): void {
  if (loading.value) {
    return
  }

  void loadRequests()
}

onMounted(() => {
  void loadRequests()
})
</script>

<template>
  <mm-requests-template>
    <template #actions>
      <mm-button
        variant="secondary"
        size="small"
        icon="refresh"
        :loading="loading"
        :disabled="loading"
        @click="refresh"
      >
        Refresh
      </mm-button>
    </template>

    <template #filters>
      <mm-filter-group
        :model-value="activeFilter"
        :options="filters"
        aria-label="Request status filters"
        @update:model-value="selectFilter"
      />
    </template>

    <p v-if="loading" class="request-view__message" role="status">Loading requests…</p>

    <div v-else-if="error" class="request-view__error" role="alert">
      <p>{{ error }}</p>

      <mm-button variant="secondary" size="small" @click="refresh"> Retry </mm-button>
    </div>

    <p v-else-if="requests.length === 0" class="request-view__message">No requests found.</p>

    <template v-else>
      <mm-request-card v-for="request in requests" :key="request.id" :request="request" />
    </template>

    <template v-if="!loading && !error && totalPages > 1" #pagination>
      <mm-pagination :page="page" :total-pages="totalPages" @update:page="selectPage" />
    </template>
  </mm-requests-template>
</template>

<style scoped>
.request-view__message {
  margin: 0;

  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
}

.request-view__error {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.request-view__error p {
  margin: 0;

  color: var(--danger);
  font-size: 12px;
  line-height: 1.5;
}
</style>
