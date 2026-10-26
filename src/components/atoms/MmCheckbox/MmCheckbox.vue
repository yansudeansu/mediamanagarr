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
  gap: 5px;

  width: 100%;
  min-width: 0;
}

.checkbox-field__row {
  display: flex;
  align-items: flex-start;
  gap: 9px;
}

.checkbox-field__control {
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
  border-color: var(--accent);
}

.checkbox-field__control:checked {
  border-color: var(--accent);
  background-color: var(--accent);
}

.checkbox-field__control:checked::after {
  content: '';

  display: block;

  width: 4px;
  height: 8px;
  margin: 1px 0 0 4px;

  border: solid var(--background);
  border-width: 0 2px 2px 0;

  transform: rotate(45deg);
}

.checkbox-field__control:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.checkbox-field__control:disabled {
  border-color: var(--border);
  background-color: var(--surface);
  cursor: not-allowed;
}

.checkbox-field__control:checked:disabled {
  border-color: var(--accent);
  background-color: var(--accent);
}

.checkbox-field__label {
  min-width: 0;

  color: var(--text);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;

  cursor: pointer;
}

.checkbox-field__required {
  margin-left: 2px;
  color: var(--danger);
}

.checkbox-field__hint {
  margin: 0 0 0 25px;

  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

.checkbox-field--disabled .checkbox-field__label {
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .checkbox-field__control {
    transition: none;
  }
}
</style>
