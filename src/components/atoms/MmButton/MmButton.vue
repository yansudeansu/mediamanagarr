<script setup lang="ts">
import { computed } from 'vue'
import MmIcon from '../MmIcon/MmIcon.vue'
import type { IconName } from '../MmIcon/MmIcon.vue'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'pagination'
export type ButtonSize = 'small' | 'medium'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  block?: boolean
  iconOnly?: boolean
  icon?: IconName
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'medium',
  disabled: false,
  loading: false,
  block: false,
  iconOnly: false,
  icon: undefined,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const isDisabled = computed(() => props.disabled || props.loading)

function handleClick(event: MouseEvent) {
  if (isDisabled.value) return

  emit('click', event)
}
</script>

<template>
  <button
    class="button"
    :class="[
      `button--${variant}`,
      `button--${size}`,
      {
        'button--block': block,
        'button--loading': loading,
        'button--icon-only': iconOnly,
      },
    ]"
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading || undefined"
    @click="handleClick"
  >
    <span v-if="loading" class="button__spinner" aria-hidden="true" />

    <span v-if="!iconOnly" class="button__content">
      <mm-icon v-if="icon && !loading" :name="icon" :size="size === 'small' ? 14 : 16" />
      <slot />
    </span>

    <mm-icon v-else-if="icon && !loading" :name="icon" :size="size === 'small' ? 16 : 18" />
  </button>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 34px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font: inherit;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast),
    filter var(--transition-fast);
}

.button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--primary {
  background: var(--primary);
  color: var(--primary-foreground);
}

.button--primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

.button--secondary {
  border-color: var(--border);
  background: var(--surface);
  color: var(--text);
}

.button--secondary:hover:not(:disabled) {
  background: var(--surface-hover);
}

.button--danger {
  border-color: var(--button-danger-border);
  background: var(--button-danger-bg);
  color: var(--text);
}

.button--danger:hover:not(:disabled) {
  border-color: var(--button-danger-hover-border);
  background: var(--button-danger-hover-bg);
}

.button--ghost {
  background: transparent;
  color: var(--muted);
}

.button--ghost:hover:not(:disabled) {
  background: var(--surface-hover);
  color: var(--text);
}

.button--pagination {
  min-width: 30px;
  min-height: 30px;
  height: 30px;
  padding: 0 7px;
  border-color: var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.button--pagination:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.button--pagination[aria-current='page'] {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--primary-foreground);
  font-weight: var(--font-weight-bold);
  cursor: default;
}

.button--pagination[aria-current='page']:disabled {
  opacity: 1;
}

.button--pagination:disabled:not([aria-current='page']) {
  opacity: 0.3;
  cursor: default;
}

.button--small {
  min-height: 30px;
  padding: 6px 10px;
  font-size: var(--font-size-sm);
}

.button--medium {
  min-height: 34px;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
}

.button--pagination.button--small,
.button--pagination.button--medium {
  min-height: 30px;
  height: 30px;
  padding: 0 7px;
  font-size: var(--font-size-sm);
}

.button--block {
  display: flex;
  width: 100%;
}

.button--icon-only {
  padding: 0;
}

.button--icon-only.button--small {
  width: 30px;
  height: 30px;
  font-size: var(--font-size-lg);
}

.button--icon-only.button--medium {
  width: 34px;
  height: 34px;
  font-size: var(--font-size-lg);
}

.button--loading {
  cursor: wait;
}

.button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.button__spinner {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: button-spin 700ms linear infinite;
}

@keyframes button-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }

  .button__spinner {
    animation: none;
  }
}
</style>
