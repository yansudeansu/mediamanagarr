<script setup lang="ts">
import { computed } from 'vue'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'small' | 'medium'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'medium',
  disabled: false,
  loading: false,
  block: false,
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
      },
    ]"
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading || undefined"
    @click="handleClick"
  >
    <span v-if="loading" class="button__spinner" aria-hidden="true" />

    <span class="button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 34px;
  padding: 8px 12px;

  border: 1px solid transparent;
  border-radius: var(--radius-md);

  font: inherit;
  font-size: 12px;
  font-weight: 600;
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
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Primary */

.button--primary {
  background: var(--accent);
  color: #052e16;
}

.button--primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

/* Secondary */

.button--secondary {
  border-color: var(--border);
  background: var(--surface);
  color: var(--text);
}

.button--secondary:hover:not(:disabled) {
  background: var(--surface-hover);
}

/* Danger */

.button--danger {
  border-color: #a9444d;
  background: #87343d;
  color: #fff;
}

.button--danger:hover:not(:disabled) {
  border-color: #c75560;
  background: #a23e49;
}

/* Ghost */

.button--ghost {
  background: transparent;
  color: var(--muted);
}

.button--ghost:hover:not(:disabled) {
  background: var(--surface-hover);
  color: var(--text);
}

/* Sizes */

.button--small {
  min-height: 30px;
  padding: 6px 10px;
  font-size: 11px;
}

.button--medium {
  min-height: 34px;
  padding: 8px 12px;
  font-size: 12px;
}

/* Layout */

.button--block {
  display: flex;
  width: 100%;
}

/* Loading */

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
