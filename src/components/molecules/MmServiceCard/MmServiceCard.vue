<script setup lang="ts">
import MmStatusBadge from '../../atoms/MmStatusBadge/MmStatusBadge.vue'
import type { ServiceInfo, ServiceState } from '../../../types/service'

interface Props {
  service: ServiceInfo
  status: ServiceState
  selected?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  disabled: false,
})

const emit = defineEmits<{
  select: []
}>()

function handleSelect() {
  if (props.disabled) return

  emit('select')
}
</script>

<template>
  <button
    type="button"
    class="service-card"
    :class="{ 'service-card--selected': selected }"
    :disabled="disabled"
    :aria-current="selected ? 'true' : undefined"
    @click="handleSelect"
  >
    <span class="service-card__name">
      {{ service.name }}
    </span>

    <mm-status-badge :status="status" />
  </button>
</template>

<style scoped>
.service-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
  min-height: 39px;
  padding: 10px var(--space-3);
  border: none;
  border-bottom: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.service-card:last-child {
  border-bottom: none;
}

.service-card:hover:not(:disabled) {
  background: var(--overlay-subtle);
}

.service-card:focus-visible {
  z-index: 1;
  outline: 2px solid var(--primary);
  outline-offset: -2px;
}

.service-card--selected {
  background: var(--primary-subtle);
  box-shadow: inset 3px 0 0 var(--primary);
}

.service-card--selected:hover:not(:disabled) {
  background: var(--primary-subtle);
}

.service-card:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.service-card__name {
  overflow: hidden;
  color: var(--text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .service-card {
    transition: none;
  }
}
</style>
