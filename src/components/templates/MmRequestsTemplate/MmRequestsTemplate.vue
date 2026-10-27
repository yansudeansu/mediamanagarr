<template>
  <div class="requests-template">
    <header class="requests-template__header">
      <div class="requests-template__heading">
        <h2 id="requests-title" class="requests-template__title">Requests</h2>

        <p class="requests-template__description">Browse media requests from Seerr.</p>
      </div>

      <div v-if="$slots.actions" class="requests-template__actions">
        <slot name="actions" />
      </div>
    </header>

    <section v-if="$slots.filters" class="requests-template__filters" aria-label="Request filters">
      <slot name="filters" />
    </section>

    <section class="requests-template__content" aria-labelledby="requests-title">
      <slot />
    </section>

    <nav
      v-if="$slots.pagination"
      class="requests-template__pagination"
      aria-label="Request pagination"
    >
      <slot name="pagination" />
    </nav>
  </div>
</template>

<style scoped>
.requests-template {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  min-width: 0;
}

.requests-template__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.requests-template__heading {
  min-width: 0;
}

.requests-template__title {
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: 1.3;
}

.requests-template__description {
  margin: var(--space-1) 0 0;
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.requests-template__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: var(--space-2);
}

.requests-template__filters {
  min-width: 0;
}

.requests-template__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}

.requests-template__pagination {
  display: block;
  width: 100%;
  min-width: 0;
}
</style>
