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
  color: #aeb9c9;
  background: #252a33;
  border-color: #353d49;
}

.status-badge--configured {
  color: #93c5fd;
  background: #17283e;
  border-color: #28476b;
}

.status-badge--connected {
  color: #86efac;
  background: #153326;
  border-color: #28563c;
}

.status-badge--failed {
  color: #fca5a5;
  background: #382225;
  border-color: #68383e;
}
</style>
