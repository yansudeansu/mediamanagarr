<script setup lang="ts">
withDefaults(
  defineProps<{
    padding?: 'sm' | 'md'
  }>(),
  {
    padding: 'md',
  },
)
</script>

<template>
  <section class="mm-panel" :class="`mm-panel--padding-${padding}`">
    <slot />
  </section>
</template>

<style scoped>
.mm-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
  padding: var(--panel-padding);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background);
}

.mm-panel--padding-sm {
  --panel-padding: var(--space-3);
}

.mm-panel--padding-md {
  --panel-padding: var(--space-4);
}
</style>
