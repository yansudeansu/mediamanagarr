<script setup lang="ts">
interface Props {
  variant: 'neutral' | 'info' | 'success' | 'danger'
  label: string
}

defineProps<Props>()
</script>

<template>
  <span class="status-badge" :class="`status-badge--${variant}`">
    <span class="status-badge__dot" aria-hidden="true"></span>
    <span class="status-badge__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  width: fit-content;
  padding: 5px 9px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  white-space: nowrap;
}

.status-badge__dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-badge--neutral {
  color: var(--status-neutral);
  background: var(--status-neutral-bg);
  border-color: var(--status-neutral-border);
}

.status-badge--info {
  color: var(--status-info);
  background: var(--status-info-bg);
  border-color: var(--status-info-border);
}

.status-badge--success {
  color: var(--status-success);
  background: var(--status-success-bg);
  border-color: var(--status-success-border);
}

.status-badge--danger {
  color: var(--status-danger);
  background: var(--status-danger-bg);
  border-color: var(--status-danger-border);
}
</style>
