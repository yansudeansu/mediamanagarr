<script setup lang="ts">
import { ref, watch } from 'vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import MmCard from '../../atoms/MmCard/MmCard.vue'
import MmCheckbox from '../../atoms/MmCheckbox/MmCheckbox.vue'
import type { QBittorrentTorrent } from '../../../types/qbittorrent'

interface Props {
  torrent: QBittorrentTorrent | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  confirm: [payload: { hash: string; deleteFiles: boolean }]
  cancel: []
}>()

const deleteFiles = ref(false)

// Reset the destructive option whenever the confirmation opens,
// closes, or switches to a different torrent.
watch(
  () => props.torrent,
  () => {
    deleteFiles.value = false
  },
)

function handleConfirm() {
  if (!props.torrent || props.loading) {
    return
  }

  emit('confirm', {
    hash: props.torrent.hash,
    deleteFiles: deleteFiles.value,
  })
}

function handleCancel() {
  if (props.loading) {
    return
  }

  deleteFiles.value = false
  emit('cancel')
}
</script>

<template>
  <mm-card v-if="torrent" padding="none">
    <section class="torrent-confirmation" aria-labelledby="torrent-confirmation-title">
      <div class="torrent-confirmation__content">
        <h3 id="torrent-confirmation-title" class="torrent-confirmation__title">Remove torrent?</h3>

        <p class="torrent-confirmation__name" :title="torrent.name">
          {{ torrent.name }}
        </p>

        <p class="torrent-confirmation__description">
          This will remove the torrent from qBittorrent. Your downloaded files will be kept unless
          you choose to delete them below.
        </p>

        <div class="torrent-confirmation__option">
          <mm-checkbox
            v-model="deleteFiles"
            label="Also delete downloaded files"
            hint="Permanently delete the downloaded data from disk."
            :disabled="loading"
          />
        </div>

        <p v-if="deleteFiles" class="torrent-confirmation__warning" role="alert">
          Warning: Downloaded files will also be deleted. This cannot be undone.
        </p>
      </div>

      <div class="torrent-confirmation__actions">
        <mm-button variant="secondary" size="small" :disabled="loading" @click="handleCancel">
          Cancel
        </mm-button>

        <mm-button
          variant="danger"
          size="small"
          :loading="loading"
          :disabled="loading"
          @click="handleConfirm"
        >
          {{ deleteFiles ? 'Remove + files' : 'Remove torrent' }}
        </mm-button>
      </div>
    </section>
  </mm-card>
</template>

<style scoped>
.torrent-confirmation {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
}

.torrent-confirmation__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.torrent-confirmation__title {
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  line-height: 1.4;
}

.torrent-confirmation__name {
  overflow-wrap: anywhere;
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
}

.torrent-confirmation__description {
  margin: 0;
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.torrent-confirmation__option {
  padding: var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background);
}

.torrent-confirmation__warning {
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--danger);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
}

.torrent-confirmation__actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border);
}

@media (max-width: 320px) {
  .torrent-confirmation__actions {
    justify-content: stretch;
  }

  .torrent-confirmation__actions > * {
    flex: 1;
  }
}
</style>
