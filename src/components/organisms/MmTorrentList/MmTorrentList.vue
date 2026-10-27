<script setup lang="ts">
import { computed, watch } from 'vue'
import MmTorrentCard from '../../molecules/MmTorrentCard/MmTorrentCard.vue'
import MmPagination from '../../molecules/MmPagination/MmPagination.vue'
import type { QBittorrentPendingAction, QBittorrentTorrent } from '../../../types/qbittorrent'

interface Props {
  torrents: QBittorrentTorrent[]
  page: number
  pageSize?: number
  pendingAction?: QBittorrentPendingAction | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10,
  pendingAction: null,
  disabled: false,
})

const emit = defineEmits<{
  'update:page': [page: number]
  start: [hash: string]
  stop: [hash: string]
  remove: [hash: string]
}>()

const normalizedPageSize = computed(() => {
  if (!Number.isFinite(props.pageSize) || props.pageSize < 1) {
    return 10
  }

  return Math.max(1, Math.floor(props.pageSize))
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.torrents.length / normalizedPageSize.value)),
)

const currentPage = computed(() => {
  if (!Number.isFinite(props.page)) {
    return 1
  }

  return Math.min(Math.max(1, Math.floor(props.page)), totalPages.value)
})

const visibleTorrents = computed(() => {
  const start = (currentPage.value - 1) * normalizedPageSize.value

  return props.torrents.slice(start, start + normalizedPageSize.value)
})

watch(
  () => [props.page, totalPages.value],
  () => {
    if (props.page !== currentPage.value) {
      emit('update:page', currentPage.value)
    }
  },
)

function handlePageChange(page: number) {
  emit('update:page', page)
}

function pendingActionFor(hash: string) {
  return props.pendingAction?.hash === hash ? props.pendingAction.action : null
}
</script>

<template>
  <section class="torrent-list" aria-label="Torrent downloads">
    <div v-if="torrents.length === 0" class="torrent-list__empty">
      <p class="torrent-list__empty-title">No torrents found</p>
      <p class="torrent-list__empty-description">Torrents added to qBittorrent will appear here.</p>
    </div>

    <template v-else>
      <ul class="torrent-list__items">
        <li v-for="torrent in visibleTorrents" :key="torrent.hash" class="torrent-list__item">
          <mm-torrent-card
            :torrent="torrent"
            :pending-action="pendingActionFor(torrent.hash)"
            :disabled="disabled"
            @start="emit('start', $event)"
            @stop="emit('stop', $event)"
            @remove="emit('remove', $event)"
          />
        </li>
      </ul>

      <mm-pagination
        :page="currentPage"
        :total-pages="totalPages"
        @update:page="handlePageChange"
      />
    </template>
  </section>
</template>

<style scoped>
.torrent-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
  min-width: 0;
}

.torrent-list__items {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.torrent-list__item {
  min-width: 0;
}

.torrent-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-6) var(--space-4);
  border: 1px dashed var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  text-align: center;
}

.torrent-list__empty-title {
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
}

.torrent-list__empty-description {
  margin: 0;
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}
</style>
