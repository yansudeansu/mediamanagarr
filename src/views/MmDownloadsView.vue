<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import MmDownloadsTemplate from '../components/templates/MmDownloadsTemplate/MmDownloadsTemplate.vue'
import MmTransferStats from '../components/molecules/MmTransferStats/MmTransferStats.vue'
import MmTorrentConfirmation from '../components/molecules/MmTorrentConfirmation/MmTorrentConfirmation.vue'
import type { ConfirmationItem } from '../components/molecules/MmTorrentConfirmation/MmTorrentConfirmation.vue'
import type {
  TorrentCardData,
  TorrentCardStatusVariant,
} from '../components/molecules/MmTorrentCard/MmTorrentCard.vue'
import MmTorrentList from '../components/organisms/MmTorrentList/MmTorrentList.vue'
import MmButton from '../components/atoms/MmButton/MmButton.vue'
import type {
  QBittorrentPendingAction,
  QBittorrentSnapshot,
  QBittorrentTorrent,
  QBittorrentTorrentAction,
} from '../types/qbittorrent'
import {
  formatBytes,
  formatEta,
  formatProgress,
  formatSpeed,
  formatTorrentStatus,
  isTorrentStopped,
} from '../utils/qbittorrent-format'
import { sendBackgroundMessage } from '../utils/background-messaging'

const PAGE_SIZE = 10
const POLL_INTERVAL_MS = 5000
const ACTION_VERIFY_INTERVAL_MS = 500
const ACTION_VERIFY_ATTEMPTS = 8

const snapshot = ref<QBittorrentSnapshot>({
  torrents: [],
  downloadSpeed: 0,
  uploadSpeed: 0,
})

const page = ref(1)
const loading = ref(true)
const refreshing = ref(false)
const error = ref('')
const actionError = ref('')

const pendingAction = ref<QBittorrentPendingAction | null>(null)
const selectedTorrent = ref<QBittorrentTorrent | null>(null)

const torrents = computed(() => snapshot.value.torrents)

function getStatusVariant(torrent: QBittorrentTorrent): TorrentCardStatusVariant {
  const state = torrent.state

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
}

function toTorrentCardData(torrent: QBittorrentTorrent): TorrentCardData {
  const progress = Number.isFinite(torrent.progress)
    ? Math.min(1, Math.max(0, torrent.progress))
    : 0

  return {
    id: torrent.hash,
    name: torrent.name,
    statusLabel: formatTorrentStatus(torrent.state),
    statusVariant: getStatusVariant(torrent),
    progress: progress * 100,
    progressLabel: formatProgress(progress),
    sizeLabel: `${formatBytes(torrent.downloaded)} / ${formatBytes(torrent.size)}`,
    downloadSpeedLabel: formatSpeed(torrent.downloadSpeed),
    uploadSpeedLabel: formatSpeed(torrent.uploadSpeed),
    etaLabel: formatEta(torrent.eta),
    primaryActionLabel: isTorrentStopped(torrent.state) ? 'Start' : 'Stop',
  }
}

const torrentCards = computed<TorrentCardData[]>(() => torrents.value.map(toTorrentCardData))

const listPendingAction = computed<{
  id: string
  action: 'primary' | 'remove'
} | null>(() => {
  if (!pendingAction.value) {
    return null
  }

  return {
    id: pendingAction.value.hash,
    action: pendingAction.value.action === 'remove' ? 'remove' : 'primary',
  }
})

const confirmationItem = computed<ConfirmationItem | null>(() => {
  if (!selectedTorrent.value) {
    return null
  }

  return {
    id: selectedTorrent.value.hash,
    name: selectedTorrent.value.name,
  }
})

const pendingRemoval = computed(() => pendingAction.value?.action === 'remove')

let mounted = false
let pollTimer: ReturnType<typeof setInterval> | null = null
let requestInFlight = false
let lifecycleSequence = 0

function getErrorMessage(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'An unexpected error occurred.'
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

async function fetchSnapshot(): Promise<QBittorrentSnapshot> {
  const response = await sendBackgroundMessage({
    type: 'GET_QBITTORRENT_DOWNLOADS',
  })

  if (!response.success) {
    throw new Error(response.error)
  }

  return response.downloads
}

function applySnapshot(nextSnapshot: QBittorrentSnapshot): void {
  snapshot.value = nextSnapshot

  // Keep the view's controlled page within the available range.
  const totalPages = Math.max(1, Math.ceil(nextSnapshot.torrents.length / PAGE_SIZE))

  if (page.value > totalPages) {
    page.value = totalPages
  }
}

async function loadDownloads(showLoading = false): Promise<void> {
  if (!mounted || requestInFlight || pendingAction.value) {
    return
  }

  const sequence = lifecycleSequence
  requestInFlight = true

  if (showLoading) {
    loading.value = true
  } else {
    refreshing.value = true
  }

  try {
    const nextSnapshot = await fetchSnapshot()

    if (!mounted || sequence !== lifecycleSequence) {
      return
    }

    applySnapshot(nextSnapshot)
    error.value = ''
  } catch (caught) {
    if (!mounted || sequence !== lifecycleSequence) {
      return
    }

    error.value = getErrorMessage(caught)
  } finally {
    requestInFlight = false

    if (mounted && sequence === lifecycleSequence) {
      loading.value = false
      refreshing.value = false
    }
  }
}

function refresh(): void {
  if (loading.value || refreshing.value || pendingAction.value) {
    return
  }

  void loadDownloads()
}

function selectPage(nextPage: number): void {
  if (!Number.isInteger(nextPage) || nextPage < 1) {
    return
  }

  page.value = nextPage
}

function selectTorrentForRemoval(hash: string): void {
  if (pendingAction.value) {
    return
  }

  selectedTorrent.value = torrents.value.find((torrent) => torrent.hash === hash) ?? null

  actionError.value = ''
}

function cancelRemoval(): void {
  if (pendingAction.value) {
    return
  }

  selectedTorrent.value = null
}

async function sendTorrentAction(
  action: QBittorrentTorrentAction,
  hash: string,
  deleteFiles = false,
): Promise<void> {
  let response

  switch (action) {
    case 'start':
      response = await sendBackgroundMessage({
        type: 'START_QBITTORRENT_TORRENT',
        hash,
      })
      break

    case 'stop':
      response = await sendBackgroundMessage({
        type: 'STOP_QBITTORRENT_TORRENT',
        hash,
      })
      break

    case 'remove':
      response = await sendBackgroundMessage({
        type: 'DELETE_QBITTORRENT_TORRENT',
        hash,
        deleteFiles,
      })
      break
  }

  if (!response.success) {
    throw new Error(response.error)
  }
}

function actionWasApplied(
  action: QBittorrentTorrentAction,
  hash: string,
  nextSnapshot: QBittorrentSnapshot,
): boolean {
  const torrent = nextSnapshot.torrents.find((item) => item.hash === hash)

  if (action === 'remove') {
    return torrent === undefined
  }

  if (!torrent) {
    return false
  }

  if (action === 'stop') {
    return isTorrentStopped(torrent.state)
  }

  return !isTorrentStopped(torrent.state)
}

async function verifyTorrentAction(
  action: QBittorrentTorrentAction,
  hash: string,
  sequence: number,
): Promise<boolean> {
  for (let attempt = 0; attempt < ACTION_VERIFY_ATTEMPTS; attempt += 1) {
    if (!mounted || sequence !== lifecycleSequence) {
      return false
    }

    await wait(ACTION_VERIFY_INTERVAL_MS)

    if (!mounted || sequence !== lifecycleSequence) {
      return false
    }

    try {
      const nextSnapshot = await fetchSnapshot()

      if (!mounted || sequence !== lifecycleSequence) {
        return false
      }

      applySnapshot(nextSnapshot)
      error.value = ''

      if (actionWasApplied(action, hash, nextSnapshot)) {
        return true
      }
    } catch {
      // Retry transient snapshot failures within the bounded window.
    }
  }

  return false
}

async function performAction(
  action: QBittorrentTorrentAction,
  hash: string,
  deleteFiles = false,
): Promise<void> {
  if (!mounted || pendingAction.value || requestInFlight) {
    return
  }

  const sequence = lifecycleSequence

  pendingAction.value = { hash, action }
  actionError.value = ''

  try {
    await sendTorrentAction(action, hash, deleteFiles)

    if (!mounted || sequence !== lifecycleSequence) {
      return
    }

    const verified = await verifyTorrentAction(action, hash, sequence)

    if (!mounted || sequence !== lifecycleSequence) {
      return
    }

    if (!verified) {
      throw new Error(
        `qBittorrent did not confirm that the torrent was ${
          action === 'remove' ? 'removed' : action === 'start' ? 'started' : 'stopped'
        }.`,
      )
    }

    if (action === 'remove') {
      selectedTorrent.value = null
    }
  } catch (caught) {
    if (!mounted || sequence !== lifecycleSequence) {
      return
    }

    actionError.value = getErrorMessage(caught)
  } finally {
    if (mounted && sequence === lifecycleSequence) {
      pendingAction.value = null
    }
  }
}

function handlePrimaryAction(hash: string): void {
  const torrent = torrents.value.find((item) => item.hash === hash)

  if (!torrent) {
    return
  }

  const action: QBittorrentTorrentAction = isTorrentStopped(torrent.state) ? 'start' : 'stop'

  void performAction(action, hash)
}

function confirmRemoval(payload: { id: string; deleteFiles: boolean }): void {
  if (selectedTorrent.value?.hash !== payload.id) {
    return
  }

  void performAction('remove', payload.id, payload.deleteFiles)
}

onMounted(() => {
  mounted = true
  lifecycleSequence += 1

  void loadDownloads(true)

  pollTimer = setInterval(() => {
    if (!loading.value && !refreshing.value && !pendingAction.value) {
      void loadDownloads()
    }
  }, POLL_INTERVAL_MS)
})

onUnmounted(() => {
  mounted = false
  lifecycleSequence += 1

  if (pollTimer !== null) {
    clearInterval(pollTimer)
    pollTimer = null
  }
})
</script>

<template>
  <mm-downloads-template>
    <template #actions>
      <mm-button
        variant="secondary"
        size="small"
        icon="refresh"
        :loading="loading || refreshing"
        :disabled="loading || refreshing || pendingAction !== null"
        @click="refresh"
      >
        Refresh
      </mm-button>
    </template>

    <template v-if="!loading && !error" #stats>
      <mm-transfer-stats
        :download-speed="snapshot.downloadSpeed"
        :upload-speed="snapshot.uploadSpeed"
      />
    </template>

    <template v-if="selectedTorrent && !loading" #confirmation>
      <mm-torrent-confirmation
        :item="confirmationItem"
        :loading="pendingRemoval"
        title="Remove torrent?"
        description="This will remove the torrent from qBittorrent. Your downloaded files will be kept unless you choose to delete them below."
        delete-files-label="Also delete downloaded files"
        delete-files-hint="Permanently delete the downloaded data from disk."
        delete-files-warning="Warning: Downloaded files will also be deleted. This cannot be undone."
        confirm-label="Remove torrent"
        @confirm="confirmRemoval"
        @cancel="cancelRemoval"
      />
    </template>

    <p v-if="loading" class="downloads-view__message" role="status">Loading downloads…</p>

    <div v-else-if="error" class="downloads-view__error" role="alert">
      <p>{{ error }}</p>

      <mm-button variant="secondary" size="small" @click="refresh"> Retry </mm-button>
    </div>

    <template v-else>
      <div v-if="actionError" class="downloads-view__error" role="alert">
        <p>{{ actionError }}</p>
      </div>

      <mm-torrent-list
        :torrents="torrentCards"
        :page="page"
        :page-size="PAGE_SIZE"
        :pending-action="listPendingAction"
        :disabled="pendingAction !== null"
        @update:page="selectPage"
        @primary-action="handlePrimaryAction"
        @remove="selectTorrentForRemoval"
      />
    </template>
  </mm-downloads-template>
</template>

<style scoped>
.downloads-view__message {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
}

.downloads-view__error {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.downloads-view__error p {
  margin: 0;
  color: var(--danger);
  font-size: 12px;
  line-height: 1.5;
}
</style>
