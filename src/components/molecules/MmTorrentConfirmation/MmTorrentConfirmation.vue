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
  gap: 14px;

  padding: 14px;
}

.torrent-confirmation__content {
  display: flex;
  flex-direction: column;
  gap: 10px;

  min-width: 0;
}

.torrent-confirmation__title {
  margin: 0;

  color: var(--text);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.torrent-confirmation__name {
  overflow-wrap: anywhere;

  margin: 0;

  color: var(--text);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
}

.torrent-confirmation__description {
  margin: 0;

  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

.torrent-confirmation__option {
  padding: 12px;

  border: 1px solid var(--border);
  border-radius: var(--radius-md);

  background: var(--background);
}

.torrent-confirmation__warning {
  margin: 0;
  padding: 10px 12px;

  border: 1px solid var(--danger);
  border-radius: var(--radius-sm);

  color: var(--text);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.5;
}

.torrent-confirmation__actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;

  padding-top: 12px;

  border-top: 1px solid var(--border);
}

@media (max-width: 320px) {
  .torrent-confirmation {
    padding: 12px;
  }

  .torrent-confirmation__actions {
    justify-content: stretch;
  }

  .torrent-confirmation__actions > * {
    flex: 1;
  }
}
</style>
