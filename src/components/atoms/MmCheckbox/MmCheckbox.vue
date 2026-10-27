<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue?: boolean
  label: string
  hint?: string
  disabled?: boolean
  required?: boolean
  name?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  hint: '',
  disabled: false,
  required: false,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const generatedId = useId()
const inputId = computed(() => `mm-checkbox-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement

  emit('update:modelValue', target.checked)
}
</script>

<template>
  <div class="checkbox-field" :class="{ 'checkbox-field--disabled': disabled }">
    <div class="checkbox-field__row">
      <input
        :id="inputId"
        class="checkbox-field__control"
        type="checkbox"
        :name="name"
        :checked="modelValue"
        :disabled="disabled"
        :required="required"
        :aria-describedby="hint ? hintId : undefined"
        @change="handleChange"
      />

      <label class="checkbox-field__label" :for="inputId">
        {{ label }}
        <span v-if="required" class="checkbox-field__required" aria-hidden="true">*</span>
      </label>
    </div>

    <p v-if="hint" :id="hintId" class="checkbox-field__hint">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.checkbox-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 100%;
  min-width: 0;
}

.checkbox-field__row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
}

.checkbox-field__control {
  position: relative;
  box-sizing: border-box;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin: 1px 0 0;
  border: 1px solid var(--border);
  border-radius: 4px;
  appearance: none;
  background: var(--background);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.checkbox-field__control:hover:not(:disabled) {
  border-color: var(--primary);
}

.checkbox-field__control:checked {
  border-color: var(--primary);
  background-color: var(--primary);
}

.checkbox-field__control:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  display: block;
  width: 4px;
  height: 8px;
  border: solid var(--primary-foreground);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-field__control:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

.checkbox-field__control:disabled {
  border-color: var(--border);
  background-color: var(--surface);
  cursor: not-allowed;
}

.checkbox-field__control:checked:disabled {
  border-color: var(--primary);
  background-color: var(--primary);
  opacity: 0.65;
}

.checkbox-field__label {
  min-width: 0;
  color: var(--text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
  cursor: pointer;
}

.checkbox-field__required {
  margin-left: 2px;
  color: var(--danger);
}

.checkbox-field__hint {
  margin: 0 0 0 24px;
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.checkbox-field--disabled .checkbox-field__label {
  color: var(--muted);
  cursor: not-allowed;
}

.checkbox-field--disabled .checkbox-field__required {
  color: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  .checkbox-field__control {
    transition: none;
  }
}
</style>
