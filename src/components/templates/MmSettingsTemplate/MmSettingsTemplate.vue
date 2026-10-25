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
  gap: 16px;

  width: 100%;
  padding: 16px;
}

.settings-template__section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.settings-template__title {
  margin: 0;

  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
