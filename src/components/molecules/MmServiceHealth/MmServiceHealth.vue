<script setup lang="ts">
import { computed } from 'vue'
import MmStatusBadge from '../../atoms/MmStatusBadge/MmStatusBadge.vue'
import type { ServiceHealth, ServiceState } from '../../../types/service'

interface Props {
  health?: ServiceHealth
}

const props = withDefaults(defineProps<Props>(), {
  health: undefined,
})

const status = computed<ServiceState>(() => {
  switch (props.health?.status) {
    case 'connected':
      return 'connected'
    case 'failed':
      return 'failed'
    default:
      return 'configured'
  }
})

const customLabel = computed(() => {
  switch (props.health?.status) {
    case 'failed':
      return 'Connection failed'
    case 'connected':
      return undefined
    default:
      return 'Not checked yet'
  }
})

const lastCheckedLabel = computed(() => {
  const timestamp = props.health?.lastCheckedAt

  if (!timestamp) return ''

  const date = new Date(timestamp)

  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString()
})

const error = computed(() => (props.health?.status === 'failed' ? props.health.error : undefined))
</script>

<template>
  <div class="service-health">
    <div class="service-health__row">
      <mm-status-badge :status="status" :custom-label="customLabel" />

      <span v-if="lastCheckedLabel" class="service-health__time">
        {{ lastCheckedLabel }}
      </span>
    </div>

    <p v-if="error" class="service-health__error" role="alert">
      {{ error }}
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
