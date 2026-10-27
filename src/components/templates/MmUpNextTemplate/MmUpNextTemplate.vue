<template>
  <div class="up-next-template">
    <header class="up-next-template__header">
      <div class="up-next-template__heading">
        <h2 id="up-next-title" class="up-next-template__title">Up Next</h2>

        <p class="up-next-template__description">
          <slot name="description">Recently added, unwatched media from Jellyfin.</slot>
        </p>
      </div>

      <div v-if="$slots.actions" class="up-next-template__actions">
        <slot name="actions" />
      </div>
    </header>

    <section v-if="$slots.filters" class="up-next-template__filters" aria-label="Arrival filters">
      <slot name="filters" />
    </section>

    <section class="up-next-template__content" aria-labelledby="up-next-title">
      <slot />
    </section>

    <nav
      v-if="$slots.pagination"
      class="up-next-template__pagination"
      aria-label="Arrival pagination"
    >
      <slot name="pagination" />
    </nav>
  </div>
</template>

<style scoped>
.up-next-template {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  min-width: 0;
}

.up-next-template__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.up-next-template__heading {
  min-width: 0;
}

.up-next-template__title {
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: 1.3;
}

.up-next-template__description {
  margin: var(--space-1) 0 0;
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.up-next-template__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  gap: var(--space-2);
}

.up-next-template__filters {
  min-width: 0;
}

.up-next-template__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}

.up-next-template__pagination {
  display: block;
  width: 100%;
  min-width: 0;
}
</style>
