<script setup lang="ts">
interface Props {
  version?: string
}

withDefaults(defineProps<Props>(), {
  version: '',
})
</script>

<template>
  <footer class="footer">
    <span class="footer__brand">MediaManagarr</span>

    <span v-if="version" class="footer__version">v{{ version }}</span>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 10px 18px;
  border-top: 1px solid var(--border);

  color: var(--muted);
  font-size: 11px;
  line-height: 1.4;
}

.footer__brand {
  font-weight: 600;
}

.footer__version {
  font-variant-numeric: tabular-nums;
}
</style>
