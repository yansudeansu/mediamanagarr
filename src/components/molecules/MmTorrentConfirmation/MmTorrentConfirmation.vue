<script setup lang="ts">
import { ref, useId, watch } from 'vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import MmCard from '../../atoms/MmCard/MmCard.vue'
import MmCheckbox from '../../atoms/MmCheckbox/MmCheckbox.vue'

export interface ConfirmationItem {
  id: string
  name: string
}

interface Props {
  item: ConfirmationItem | null
  loading?: boolean
  title?: string
  description?: string
  deleteFilesLabel?: string
  deleteFilesHint?: string
  deleteFilesWarning?: string
  confirmLabel?: string
  confirmWithFilesLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  title: 'Remove item?',
  description:
    'This will remove the item. Its associated files will be kept unless you choose to delete them below.',
  deleteFilesLabel: 'Also delete associated files',
  deleteFilesHint: 'Permanently delete the associated files from disk.',
  deleteFilesWarning: 'Warning: Associated files will also be deleted. This cannot be undone.',
  confirmLabel: 'Remove item',
  confirmWithFilesLabel: 'Remove + files',
})

const emit = defineEmits<{
  confirm: [payload: { id: string; deleteFiles: boolean }]
  cancel: []
}>()

const titleId = useId()
const deleteFiles = ref(false)

watch(
  () => props.item,
  () => {
    deleteFiles.value = false
  },
)

function handleConfirm(): void {
  if (!props.item || props.loading) {
    return
  }

  emit('confirm', {
    id: props.item.id,
    deleteFiles: deleteFiles.value,
  })
}

function handleCancel(): void {
  if (props.loading) {
    return
  }

  deleteFiles.value = false
  emit('cancel')
}
</script>

<template>
  <mm-card v-if="item" padding="none">
    <section class="torrent-confirmation" :aria-labelledby="titleId">
      <div class="torrent-confirmation__content">
        <h3 :id="titleId" class="torrent-confirmation__title">
          {{ title }}
        </h3>

        <p class="torrent-confirmation__name" :title="item.name">
          {{ item.name }}
        </p>

        <p class="torrent-confirmation__description">
          {{ description }}
        </p>

        <div class="torrent-confirmation__option">
          <mm-checkbox
            v-model="deleteFiles"
            :label="deleteFilesLabel"
            :hint="deleteFilesHint"
            :disabled="loading"
          />
        </div>

        <p v-if="deleteFiles" class="torrent-confirmation__warning" role="alert">
          {{ deleteFilesWarning }}
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
          {{ deleteFiles ? confirmWithFilesLabel : confirmLabel }}
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
