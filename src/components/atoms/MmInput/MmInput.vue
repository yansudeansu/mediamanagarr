<script setup lang="ts">
import { computed, useId } from 'vue'

export type InputType = 'text' | 'url' | 'password'

interface Props {
  modelValue?: string
  label: string
  type?: InputType
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  autocomplete?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  hint: '',
  error: '',
  disabled: false,
  required: false,
  autocomplete: 'off',
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const inputId = computed(() => `mm-input-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)

const describedBy = computed(() => {
  const ids: string[] = []

  if (props.hint) {
    ids.push(hintId.value)
  }

  if (props.error) {
    ids.push(errorId.value)
  }

  return ids.join(' ') || undefined
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement

  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="input-field">
    <label class="input-field__label" :for="inputId">
      {{ label }}
      <span v-if="required" class="input-field__required" aria-hidden="true">*</span>
    </label>

    <input
      :id="inputId"
      class="input-field__control"
      :class="{ 'input-field__control--error': error }"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="handleInput"
    />

    <p v-if="hint" :id="hintId" class="input-field__hint">
      {{ hint }}
    </p>

    <p v-if="error" :id="errorId" class="input-field__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.input-field__label {
  color: var(--muted);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
}

.input-field__required {
  margin-left: 2px;
  color: var(--danger);
}

.input-field__control {
  box-sizing: border-box;
  display: block;
  width: 100%;
  min-height: 38px;
  padding: 10px 12px;

  border: 1px solid var(--border);
  border-radius: var(--radius-md);

  background: var(--background);
  color: var(--text);

  font: inherit;
  font-size: 12px;
  line-height: 1.4;

  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.input-field__control::placeholder {
  color: var(--muted);
  opacity: 0.75;
}

.input-field__control:hover:not(:disabled) {
  border-color: var(--muted);
}

.input-field__control:focus-visible {
  border-color: var(--accent);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.input-field__control:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-field__control--error {
  border-color: var(--danger);
}

.input-field__control--error:focus-visible {
  border-color: var(--danger);
  outline-color: var(--danger);
}

.input-field__hint,
.input-field__error {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
}

.input-field__hint {
  color: var(--muted);
}

.input-field__error {
  color: var(--danger);
}

@media (prefers-reduced-motion: reduce) {
  .input-field__control {
    transition: none;
  }
}
</style>
