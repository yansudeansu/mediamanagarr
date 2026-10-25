<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'outlined'
    padding?: 'none' | 'sm' | 'md'
  }>(),
  {
    variant: 'default',
    padding: 'md',
  },
)
</script>

<template>
  <article class="mm-card" :class="[`mm-card--${variant}`, `mm-card--padding-${padding}`]">
    <header v-if="$slots.header" class="mm-card__header">
      <slot name="header" />
    </header>

    <div class="mm-card__content">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="mm-card__footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<style scoped>
.mm-card {
  width: 100%;
  min-width: 0;
  overflow: hidden;

  border-radius: var(--radius-md);

  color: var(--text);
}

.mm-card--default {
  background: var(--surface);
  border: 1px solid var(--border);
}

.mm-card--outlined {
  background: transparent;
  border: 1px solid var(--border);
}

.mm-card--padding-none {
  --card-padding: 0px;
}

.mm-card--padding-sm {
  --card-padding: 10px;
}

.mm-card--padding-md {
  --card-padding: 14px;
}

.mm-card__header,
.mm-card__content,
.mm-card__footer {
  padding: var(--card-padding);
}

.mm-card__header {
  border-bottom: 1px solid var(--border);
}

.mm-card__footer {
  border-top: 1px solid var(--border);
}

.mm-card__header + .mm-card__content {
  padding-top: var(--card-padding);
}

.mm-card__content {
  min-width: 0;
}
</style>
