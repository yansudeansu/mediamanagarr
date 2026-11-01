<template>
  <div class="settings-template">
    <slot name="navigation" />

    <div class="settings-template__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.settings-template {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  padding: var(--space-4);
}

.settings-template__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}
</style>
