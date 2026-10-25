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
  gap: 8px;
  min-width: 0;
}

.filter-group__button {
  gap: 10px;
}

.filter-group__button--active {
  border-color: var(--accent);
  background: rgb(34 197 94 / 10%);
  color: var(--accent);
}

.filter-group__indicator {
  display: inline-block;
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px rgb(34 197 94 / 30%);
}
</style>
