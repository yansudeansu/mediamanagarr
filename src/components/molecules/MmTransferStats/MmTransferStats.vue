<script setup lang="ts">
import { computed } from 'vue'
import MmCard from '../../atoms/MmCard/MmCard.vue'
import MmIcon from '../../atoms/MmIcon/MmIcon.vue'
import { formatSpeed } from '../../../utils/qbittorrent-format'

interface Props {
  downloadSpeed: number
  uploadSpeed: number
}

const props = defineProps<Props>()

const formattedDownloadSpeed = computed(() => formatSpeed(props.downloadSpeed))
const formattedUploadSpeed = computed(() => formatSpeed(props.uploadSpeed))
</script>

<template>
  <mm-card padding="none">
    <section class="transfer-stats" aria-label="Overall transfer speeds">
      <div class="transfer-stats__item">
        <div class="transfer-stats__heading">
          <span class="transfer-stats__icon">
            <mm-icon name="arrow-down" :size="14" />
          </span>

          <span class="transfer-stats__label">Download</span>
        </div>

        <span class="transfer-stats__value">
          {{ formattedDownloadSpeed }}
        </span>
      </div>

      <div class="transfer-stats__divider" aria-hidden="true" />

      <div class="transfer-stats__item">
        <div class="transfer-stats__heading">
          <span class="transfer-stats__icon">
            <mm-icon name="arrow-up" :size="14" />
          </span>

          <span class="transfer-stats__label">Upload</span>
        </div>

        <span class="transfer-stats__value">
          {{ formattedUploadSpeed }}
        </span>
      </div>
    </section>
  </mm-card>
</template>

<style scoped>
.transfer-stats {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  min-width: 0;
  padding: var(--space-3);
}

.transfer-stats__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.transfer-stats__heading {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.transfer-stats__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--primary);
}

.transfer-stats__label {
  color: var(--muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.transfer-stats__value {
  overflow: hidden;
  color: var(--text);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  font-variant-numeric: tabular-nums;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transfer-stats__divider {
  align-self: stretch;
  width: 1px;
  background: var(--border);
}

@media (max-width: 320px) {
  .transfer-stats {
    gap: var(--space-2);
    padding: var(--space-2);
  }

  .transfer-stats__value {
    font-size: var(--font-size-md);
  }
}
</style>
