''
<script setup lang="ts">
import { computed } from 'vue'
import type { ServiceState } from '../../../types/service'

interface Props {
  status: ServiceState
}

const props = defineProps<Props>()

const statusLabels: Record<ServiceState, string> = {
  'not-configured': 'Not set',
  configured: 'Configured',
  connected: 'Connected',
  failed: 'Failed',
}

const label = computed(() => statusLabels[props.status])
</script>

<template>
  <span class="status-badge" :class="`status-badge--${status}`">
    <span class="status-badge__dot" aria-hidden="true"></span>
    <span class="status-badge__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  width: fit-content;
  padding: 5px 9px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  white-space: nowrap;
}

.status-badge__dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-badge--not-configured {
  color: var(--status-neutral);
  background: var(--status-neutral-bg);
  border-color: var(--status-neutral-border);
}

.status-badge--configured {
  color: var(--status-info);
  background: var(--status-info-bg);
  border-color: var(--status-info-border);
}

.status-badge--connected {
  color: var(--status-success);
  background: var(--status-success-bg);
  border-color: var(--status-success-border);
}

.status-badge--failed {
  color: var(--status-danger);
  background: var(--status-danger-bg);
  border-color: var(--status-danger-border);
}
</style>
