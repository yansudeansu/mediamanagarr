<template>
  <div class="settings-template">
    <section class="settings-template__section" aria-labelledby="service-connections-title">
      <h2 id="service-connections-title" class="settings-template__title">Service Connections</h2>

      <slot name="selector" />
    </section>

    <slot name="configuration" />
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

.settings-template__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.settings-template__title {
  margin: 0;
  color: var(--muted);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
