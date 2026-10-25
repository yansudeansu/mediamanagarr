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
  gap: 12px;

  width: 100%;
  min-height: 39px;
  padding: 10px 12px;

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
  background: rgb(255 255 255 / 4%);
}

.service-card:focus-visible {
  z-index: 1;
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.service-card--selected {
  background: rgb(34 197 94 / 9%);
  box-shadow: inset 3px 0 0 var(--accent);
}

.service-card--selected:hover:not(:disabled) {
  background: rgb(34 197 94 / 12%);
}

.service-card:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.service-card__name {
  overflow: hidden;

  color: var(--text);
  font-size: 12px;
  font-weight: 600;
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
