<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  label?: string
  showPercentage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Progress',
  showPercentage: false,
})

const normalizedValue = computed(() => {
  if (!Number.isFinite(props.value)) {
    return 0
  }

  return Math.min(100, Math.max(0, props.value))
})

const percentage = computed(() => `${normalizedValue.value.toFixed(1)}%`)
</script>

<template>
  <div class="mm-progress-bar">
    <div v-if="showPercentage" class="mm-progress-bar__header">
      <span class="mm-progress-bar__label">{{ label }}</span>
      <span class="mm-progress-bar__percentage">{{ percentage }}</span>
    </div>

    <div
      class="mm-progress-bar__track"
      role="progressbar"
      :aria-label="label"
      :aria-valuenow="normalizedValue"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="mm-progress-bar__fill" :style="{ width: `${normalizedValue}%` }" />
    </div>
  </div>
</template>

<style scoped>
.mm-progress-bar {
  width: 100%;
  min-width: 0;
}

.mm-progress-bar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.mm-progress-bar__label {
  min-width: 0;
  overflow: hidden;
  color: var(--muted);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mm-progress-bar__percentage {
  flex-shrink: 0;
  color: var(--text);
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.mm-progress-bar__track {
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--surface-hover);
}

.mm-progress-bar__fill {
  height: 100%;
  border-radius: inherit;
  background: var(--accent);
  transition: width var(--transition-fast);
}

@media (prefers-reduced-motion: reduce) {
  .mm-progress-bar__fill {
    transition: none;
  }
}
</style>
