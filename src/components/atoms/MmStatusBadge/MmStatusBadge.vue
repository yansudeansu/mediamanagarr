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
  gap: 6px;

  width: fit-content;
  padding: 5px 9px;

  border: 1px solid transparent;
  border-radius: 999px;

  font-size: 10px;
  font-weight: 600;
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
  color: var(--muted);
  background: rgb(148 163 184 / 10%);
  border-color: rgb(148 163 184 / 15%);
}

.status-badge--configured {
  color: #93c5fd;
  background: rgb(59 130 246 / 12%);
  border-color: rgb(59 130 246 / 20%);
}

.status-badge--connected {
  color: #86efac;
  background: rgb(34 197 94 / 12%);
  border-color: rgb(34 197 94 / 20%);
}

.status-badge--failed {
  color: #fca5a5;
  background: rgb(239 68 68 / 12%);
  border-color: rgb(239 68 68 / 20%);
}
</style>
