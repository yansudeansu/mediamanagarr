<script setup lang="ts">
import { computed } from 'vue'
import MmStatusBadge from '../../atoms/MmStatusBadge/MmStatusBadge.vue'

type HealthStatus = 'connected' | 'failed' | 'not-checked'

interface Props {
  status?: HealthStatus
  lastCheckedLabel?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: 'not-checked',
  lastCheckedLabel: '',
  error: '',
})

const badge = computed(() => {
  switch (props.status) {
    case 'connected':
      return {
        variant: 'success' as const,
        label: 'Connected',
      }
    case 'failed':
      return {
        variant: 'danger' as const,
        label: 'Connection failed',
      }
    default:
      return {
        variant: 'info' as const,
        label: 'Not checked yet',
      }
  }
})

const visibleError = computed(() => (props.status === 'failed' ? props.error : ''))
</script>

<template>
  <div class="service-health">
    <div class="service-health__row">
      <mm-status-badge :variant="badge.variant" :label="badge.label" />

      <span v-if="lastCheckedLabel" class="service-health__time">
        {{ lastCheckedLabel }}
      </span>
    </div>

    <p v-if="visibleError" class="service-health__error" role="alert">
      {{ visibleError }}
    </p>
  </div>
</template>

<style scoped>
.service-health {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.service-health__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.service-health__time {
  margin-left: auto;
  color: var(--muted);
  font-size: var(--font-size-xs, 0.75rem);
}

.service-health__error {
  margin: 0;
  color: var(--danger);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}
</style>
