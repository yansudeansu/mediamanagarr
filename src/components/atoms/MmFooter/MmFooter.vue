<script setup lang="ts">
interface Props {
  brand: string
  version?: string
}

withDefaults(defineProps<Props>(), {
  version: '',
})
</script>

<template>
  <footer class="footer">
    <span class="footer__brand">{{ brand }}</span>

    <span v-if="version" class="footer__version">v{{ version }}</span>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 10px 18px;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.footer__brand {
  font-weight: var(--font-weight-semibold);
}

.footer__version {
  font-variant-numeric: tabular-nums;
}
</style>
