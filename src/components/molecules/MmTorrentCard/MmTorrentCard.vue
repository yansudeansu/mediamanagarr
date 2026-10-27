<script setup lang="ts">
import { computed } from 'vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import MmCard from '../../atoms/MmCard/MmCard.vue'
import MmProgressBar from '../../atoms/MmProgressBar/MmProgressBar.vue'
import type { QBittorrentTorrent, QBittorrentTorrentAction } from '../../../types/qbittorrent'
import {
  formatBytes,
  formatEta,
  formatProgress,
  formatSpeed,
  formatTorrentStatus,
  isTorrentStopped,
} from '../../../utils/qbittorrent-format'

interface Props {
  torrent: QBittorrentTorrent
  pendingAction?: QBittorrentTorrentAction | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pendingAction: null,
  disabled: false,
})

const emit = defineEmits<{
  start: [hash: string]
  stop: [hash: string]
  remove: [hash: string]
}>()

const isStopped = computed(() => isTorrentStopped(props.torrent.state))

const isPending = computed(() => props.pendingAction !== null)

const progressPercentage = computed(() => {
  if (!Number.isFinite(props.torrent.progress)) {
    return 0
  }

  return Math.min(100, Math.max(0, props.torrent.progress * 100))
})

const statusLabel = computed(() => formatTorrentStatus(props.torrent.state))

const statusVariant = computed(() => {
  const state = props.torrent.state

  if (state === 'error' || state === 'missingFiles') {
    return 'error'
  }

  if (isTorrentStopped(state)) {
    return 'stopped'
  }

  if (state === 'downloading' || state === 'forcedDL') {
    return 'downloading'
  }

  if (state === 'uploading' || state === 'forcedUP' || state === 'stalledUP') {
    return 'seeding'
  }

  return 'neutral'
})

const actionLabel = computed(() => (isStopped.value ? 'Start' : 'Stop'))

const isActionLoading = computed(() => {
  return props.pendingAction === (isStopped.value ? 'start' : 'stop')
})

const isRemoveLoading = computed(() => props.pendingAction === 'remove')

function handleToggle() {
  if (props.disabled || isPending.value) {
    return
  }

  if (isStopped.value) {
    emit('start', props.torrent.hash)
  } else {
    emit('stop', props.torrent.hash)
  }
}

function handleRemove() {
  if (props.disabled || isPending.value) {
    return
  }

  emit('remove', props.torrent.hash)
}
</script>

<template>
  <mm-card padding="none">
    <div class="torrent-card">
      <div class="torrent-card__heading">
        <h3 class="torrent-card__name" :title="torrent.name">
          {{ torrent.name }}
        </h3>

        <span class="torrent-card__status" :class="`torrent-card__status--${statusVariant}`">
          {{ statusLabel }}
        </span>
      </div>

      <div class="torrent-card__progress">
        <div class="torrent-card__progress-details">
          <span class="torrent-card__size">
            {{ formatBytes(torrent.downloaded) }} / {{ formatBytes(torrent.size) }}
          </span>

          <span class="torrent-card__percentage">
            {{ formatProgress(torrent.progress) }}
          </span>
        </div>

        <mm-progress-bar :value="progressPercentage" :label="`${torrent.name} download progress`" />
      </div>

      <div class="torrent-card__stats">
        <span class="torrent-card__stat" :title="`Download: ${formatSpeed(torrent.downloadSpeed)}`">
          <span class="torrent-card__stat-label">DL</span>
          {{ formatSpeed(torrent.downloadSpeed) }}
        </span>

        <span class="torrent-card__stat" :title="`Upload: ${formatSpeed(torrent.uploadSpeed)}`">
          <span class="torrent-card__stat-label">UL</span>
          {{ formatSpeed(torrent.uploadSpeed) }}
        </span>

        <span class="torrent-card__stat torrent-card__stat--eta">
          ETA: {{ formatEta(torrent.eta) }}
        </span>
      </div>

      <div class="torrent-card__actions">
        <mm-button
          variant="secondary"
          size="small"
          :loading="isActionLoading"
          :disabled="disabled || isPending"
          :aria-label="`${actionLabel} ${torrent.name}`"
          @click="handleToggle"
        >
          {{ actionLabel }}
        </mm-button>

        <mm-button
          variant="danger"
          size="small"
          :loading="isRemoveLoading"
          :disabled="disabled || isPending"
          :aria-label="`Remove ${torrent.name}`"
          @click="handleRemove"
        >
          Remove
        </mm-button>
      </div>
    </div>
  </mm-card>
</template>

<style scoped>
.torrent-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
  padding: var(--space-3);
}

.torrent-card__heading {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  min-width: 0;
}

.torrent-card__name {
  width: 100%;
  overflow: hidden;
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.torrent-card__status {
  display: inline-flex;
  align-items: center;
  padding: 4px 7px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  white-space: nowrap;
}

.torrent-card__status--downloading {
  color: var(--status-info);
  background: var(--status-info-bg);
  border-color: var(--status-info-border);
}

.torrent-card__status--seeding {
  color: var(--status-success);
  background: var(--status-success-bg);
  border-color: var(--status-success-border);
}

.torrent-card__status--stopped {
  color: var(--status-neutral);
  background: var(--status-neutral-bg);
  border-color: var(--status-neutral-border);
}

.torrent-card__status--error {
  color: var(--status-danger);
  background: var(--status-danger-bg);
  border-color: var(--status-danger-border);
}

.torrent-card__status--neutral {
  color: var(--status-warning);
  background: var(--status-warning-bg);
  border-color: var(--status-warning-border);
}

.torrent-card__progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.torrent-card__progress-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.torrent-card__size {
  overflow: hidden;
  color: var(--muted);
  font-size: var(--font-size-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.torrent-card__percentage {
  flex-shrink: 0;
  color: var(--text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  font-variant-numeric: tabular-nums;
}

.torrent-card__stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-3);
  color: var(--muted);
  font-size: var(--font-size-sm);
}

.torrent-card__stat {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.torrent-card__stat--eta {
  margin-left: auto;
}

.torrent-card__actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border);
}

@media (max-width: 320px) {
  .torrent-card__stat--eta {
    margin-left: 0;
  }
}
</style>
