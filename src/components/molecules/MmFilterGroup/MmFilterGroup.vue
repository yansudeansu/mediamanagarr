<script setup lang="ts">
import MmButton from '../../atoms/MmButton/MmButton.vue'

export interface FilterOption {
  label: string
  value: string
  indicator?: boolean
  disabled?: boolean
}

interface Props {
  modelValue: string
  options: FilterOption[]
  ariaLabel?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  ariaLabel: 'Filters',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function selectFilter(value: string): void {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="filter-group" role="group" :aria-label="ariaLabel">
    <mm-button
      v-for="option in options"
      :key="option.value"
      variant="secondary"
      size="small"
      class="filter-group__button"
      :class="{ 'filter-group__button--active': modelValue === option.value }"
      :aria-pressed="modelValue === option.value"
      :disabled="disabled || option.disabled"
      @click="selectFilter(option.value)"
    >
      <span>{{ option.label }}</span>

      <span v-if="option.indicator" class="filter-group__indicator" aria-hidden="true" />
    </mm-button>
  </div>
</template>

<style scoped>
.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  min-width: 0;
}

.filter-group__button {
  gap: var(--space-2);
}

.filter-group__button--active {
  border-color: var(--primary);
  background: var(--primary-subtle);
  color: var(--primary);
}

.filter-group__indicator {
  display: inline-block;
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 8px var(--primary-glow);
}
</style>
