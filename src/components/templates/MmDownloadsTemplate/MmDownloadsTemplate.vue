<template>
  <div class="downloads-template">
    <header class="downloads-template__header">
      <div class="downloads-template__heading">
        <h2 id="downloads-title" class="downloads-template__title">Downloads</h2>

        <p class="downloads-template__description">Monitor and manage torrents from qBittorrent.</p>
      </div>

      <div v-if="$slots.actions" class="downloads-template__actions">
        <slot name="actions" />
      </div>
    </header>

    <section v-if="$slots.stats" class="downloads-template__stats" aria-label="Transfer statistics">
      <slot name="stats" />
    </section>

    <section
      v-if="$slots.confirmation"
      class="downloads-template__confirmation"
      aria-label="Torrent removal confirmation"
    >
      <slot name="confirmation" />
    </section>

    <section class="downloads-template__content" aria-labelledby="downloads-title">
      <slot />
    </section>
  </div>
</template>

<style scoped>
.downloads-template {
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  min-width: 0;
}

.downloads-template__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.downloads-template__heading {
  min-width: 0;
}

.downloads-template__title {
  margin: 0;

  color: var(--text);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
}

.downloads-template__description {
  margin: 5px 0 0;

  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

.downloads-template__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
}

.downloads-template__stats,
.downloads-template__confirmation {
  min-width: 0;
}

.downloads-template__content {
  display: flex;
  flex-direction: column;
  gap: 10px;

  min-width: 0;
}
</style>
