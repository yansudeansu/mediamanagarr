<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useId, watch } from 'vue'
import { Check, ChevronDown, LoaderCircle } from 'lucide-vue-next'

defineOptions({
  inheritAttrs: false,
})

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface Props {
  modelValue?: string
  label: string
  options: SelectOption[]
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  loading?: boolean
  required?: boolean
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  hint: '',
  error: '',
  disabled: false,
  loading: false,
  required: false,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const generatedId = useId()

const selectId = `mm-select-${generatedId}`
const labelId = `${selectId}-label`
const hintId = `${selectId}-hint`
const errorId = `${selectId}-error`
const listboxId = `${selectId}-listbox`

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const optionRefs = ref<(HTMLButtonElement | null)[]>([])

const isOpen = ref(false)
const activeIndex = ref(-1)

const isDisabled = computed(() => props.disabled || props.loading)

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue),
)

const selectedLabel = computed(() => selectedOption.value?.label ?? props.placeholder)

const describedBy = computed(() => {
  const ids: string[] = []

  if (props.hint) ids.push(hintId)
  if (props.error) ids.push(errorId)

  if (typeof attrs['aria-describedby'] === 'string') {
    ids.push(attrs['aria-describedby'])
  }

  return ids.join(' ') || undefined
})

const availableIndexes = computed(() =>
  props.options.flatMap((option, index) => (option.disabled ? [] : [index])),
)

function getInitialIndex() {
  const selectedIndex = props.options.findIndex(
    (option) => option.value === props.modelValue && !option.disabled,
  )

  return selectedIndex >= 0 ? selectedIndex : (availableIndexes.value[0] ?? -1)
}

function focusOption(index: number) {
  activeIndex.value = index

  nextTick(() => {
    optionRefs.value[index]?.focus()
  })
}

function openDropdown(focus = false) {
  if (isDisabled.value || isOpen.value) return

  isOpen.value = true
  activeIndex.value = getInitialIndex()

  if (focus && activeIndex.value >= 0) {
    focusOption(activeIndex.value)
  }
}

function closeDropdown(restoreFocus = false) {
  isOpen.value = false
  activeIndex.value = -1

  if (restoreFocus) {
    nextTick(() => triggerRef.value?.focus())
  }
}

function toggleDropdown() {
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

function selectOption(option: SelectOption) {
  if (option.disabled) return

  emit('update:modelValue', option.value)
  closeDropdown(true)
}

function moveActive(direction: 1 | -1) {
  const indexes = availableIndexes.value

  if (!indexes.length) return

  const currentPosition = indexes.indexOf(activeIndex.value)

  let nextPosition: number

  if (currentPosition === -1) {
    nextPosition = direction === 1 ? 0 : indexes.length - 1
  } else {
    nextPosition = (currentPosition + direction + indexes.length) % indexes.length
  }

  const nextIndex = indexes[nextPosition]

  if (nextIndex !== undefined) {
    focusOption(nextIndex)
  }
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    openDropdown(true)
  }
}

function handleOptionKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeDropdown(true)
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()

    const first = availableIndexes.value[0]

    if (first !== undefined) focusOption(first)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()

    const last = availableIndexes.value.at(-1)

    if (last !== undefined) focusOption(last)
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()

    const option = props.options[index]

    if (option) selectOption(option)
    return
  }

  if (event.key === 'Tab') {
    closeDropdown()
  }
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (!rootRef.value?.contains(event.target as Node)) {
    closeDropdown()
  }
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeDropdown(true)
  }
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('pointerdown', handleDocumentPointerDown)
    document.addEventListener('keydown', handleDocumentKeydown)
  } else {
    document.removeEventListener('pointerdown', handleDocumentPointerDown)
    document.removeEventListener('keydown', handleDocumentKeydown)
  }
})

watch(isDisabled, (disabled) => {
  if (disabled) closeDropdown()
})

watch(
  () => props.options,
  () => {
    if (isOpen.value) {
      activeIndex.value = getInitialIndex()
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('keydown', handleDocumentKeydown)
})
</script>

<template>
  <div ref="rootRef" class="select-field">
    <label :id="labelId" class="select-field__label">
      {{ label }}
      <span v-if="required" class="select-field__required" aria-hidden="true">*</span>
    </label>

    <div class="select-field__wrapper">
      <button
        v-bind="$attrs"
        :id="selectId"
        ref="triggerRef"
        type="button"
        class="select-field__trigger"
        :class="{
          'select-field__trigger--open': isOpen,
          'select-field__trigger--error': error,
          'select-field__trigger--placeholder': !selectedOption,
        }"
        :disabled="isDisabled"
        :aria-labelledby="labelId"
        :aria-describedby="describedBy"
        :aria-invalid="error ? 'true' : undefined"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-busy="loading ? 'true' : undefined"
        aria-haspopup="listbox"
        @click="toggleDropdown"
        @keydown="handleTriggerKeydown"
      >
        <span class="select-field__value">
          {{ loading ? 'Loading...' : selectedLabel || 'Select an option' }}
        </span>

        <LoaderCircle v-if="loading" :size="15" class="select-field__spinner" aria-hidden="true" />

        <ChevronDown
          v-else
          :size="15"
          class="select-field__chevron"
          :class="{ 'select-field__chevron--open': isOpen }"
          aria-hidden="true"
        />
      </button>

      <div
        v-if="isOpen"
        :id="listboxId"
        class="select-field__dropdown"
        role="listbox"
        :aria-labelledby="labelId"
      >
        <p v-if="!options.length" class="select-field__empty">No options available</p>

        <button
          v-for="(option, index) in options"
          :key="option.value"
          :ref="(element) => (optionRefs[index] = element as HTMLButtonElement | null)"
          type="button"
          role="option"
          class="select-field__option"
          :class="{
            'select-field__option--selected': option.value === modelValue,
            'select-field__option--active': index === activeIndex,
          }"
          :aria-selected="option.value === modelValue"
          :aria-disabled="option.disabled ? 'true' : undefined"
          :disabled="option.disabled"
          :tabindex="index === activeIndex ? 0 : -1"
          @click="selectOption(option)"
          @keydown="handleOptionKeydown($event, index)"
          @focus="activeIndex = index"
        >
          <span class="select-field__option-label">{{ option.label }}</span>

          <Check
            v-if="option.value === modelValue"
            :size="15"
            class="select-field__check"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <input v-if="name" type="hidden" :name="name" :value="modelValue" />

    <p v-if="hint" :id="hintId" class="select-field__hint">
      {{ hint }}
    </p>

    <p v-if="error" :id="errorId" class="select-field__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.select-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.select-field__label {
  color: var(--muted);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
}

.select-field__required {
  margin-left: 2px;
  color: var(--danger);
}

.select-field__wrapper {
  position: relative;
  width: 100%;
}

.select-field__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 38px;
  padding: 10px 12px;

  border: 1px solid var(--border);
  border-radius: var(--radius-md);

  background: var(--background);
  color: var(--text);

  font: inherit;
  font-size: 12px;
  text-align: left;

  cursor: pointer;

  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast);
}

.select-field__trigger:hover:not(:disabled) {
  border-color: var(--muted);
}

.select-field__trigger:focus-visible,
.select-field__trigger--open {
  border-color: var(--accent);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.select-field__trigger--error {
  border-color: var(--danger);
}

.select-field__trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-field__trigger--placeholder .select-field__value {
  color: var(--muted);
}

.select-field__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-field__chevron {
  flex-shrink: 0;
  color: var(--muted);
  transition: transform var(--transition-fast);
}

.select-field__chevron--open {
  transform: rotate(180deg);
}

.select-field__spinner {
  flex-shrink: 0;
  color: var(--accent);
  animation: spin 1s linear infinite;
}

.select-field__dropdown {
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  left: 0;
  right: 0;

  max-height: 220px;
  overflow-y: auto;
  padding: 5px;

  border: 1px solid var(--border);
  border-radius: var(--radius-md);

  background: var(--background);
  box-shadow: 0 12px 32px rgb(0 0 0 / 35%);
}

.select-field__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 34px;
  padding: 8px 10px;

  border: none;
  border-radius: 5px;

  background: transparent;
  color: var(--text);

  font: inherit;
  font-size: 12px;
  text-align: left;

  cursor: pointer;
}

.select-field__option:hover:not(:disabled),
.select-field__option--active:not(:disabled) {
  background: rgb(255 255 255 / 7%);
}

.select-field__option--selected {
  color: var(--accent);
}

.select-field__option:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.select-field__option:focus {
  outline: none;
}

.select-field__option:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.select-field__option-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-field__check {
  flex-shrink: 0;
  color: var(--accent);
}

.select-field__empty {
  margin: 0;
  padding: 12px 10px;
  color: var(--muted);
  font-size: 12px;
}

.select-field__hint,
.select-field__error {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
}

.select-field__hint {
  color: var(--muted);
}

.select-field__error {
  color: var(--danger);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .select-field__trigger,
  .select-field__chevron {
    transition: none;
  }

  .select-field__spinner {
    animation: none;
  }
}
</style>
