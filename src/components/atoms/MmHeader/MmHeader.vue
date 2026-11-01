<script setup lang="ts">
interface Props {
  title: string
  logo?: string | null
}

withDefaults(defineProps<Props>(), {
  logo: null,
})
</script>

<template>
  <header class="header">
    <div class="header__branding">
      <img v-if="logo" :src="logo" alt="" class="header__logo" width="28" height="28" />

      <h1 class="header__title">
        {{ title }}
      </h1>
    </div>

    <div v-if="$slots.actions" class="header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) 18px;
  border-bottom: 1px solid var(--border);
}

.header__branding {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.header__logo {
  display: block;
  flex-shrink: 0;
  width: 28px;
}

.header__title {
  min-width: 0;
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}
</style>
