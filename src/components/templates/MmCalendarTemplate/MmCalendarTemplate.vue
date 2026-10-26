<template>
  <div class="calendar-template">
    <header class="calendar-template__header">
      <div class="calendar-template__heading">
        <h2 id="calendar-title" class="calendar-template__title">Calendar</h2>

        <p class="calendar-template__description">
          <slot name="description">Upcoming TV episodes and movie releases.</slot>
        </p>
      </div>
    </header>

    <section
      v-if="$slots.filters || $slots.actions"
      class="calendar-template__toolbar"
      aria-label="Calendar controls"
    >
      <div v-if="$slots.filters" class="calendar-template__filters">
        <slot name="filters" />
      </div>

      <div v-if="$slots.actions" class="calendar-template__actions">
        <slot name="actions" />
      </div>
    </section>

    <section
      v-if="$slots.navigation"
      class="calendar-template__navigation"
      aria-label="Calendar navigation"
    >
      <slot name="navigation" />
    </section>

    <div v-if="$slots.status" class="calendar-template__status">
      <slot name="status" />
    </div>

    <section class="calendar-template__content" aria-labelledby="calendar-title">
      <slot />
    </section>

    <div v-if="$slots.details" class="calendar-template__details">
      <slot name="details" />
    </div>
  </div>
</template>

<style scoped>
.calendar-template {
  display: flex;
  flex-direction: column;
  gap: 12px;

  width: 100%;
  min-width: 0;
}

.calendar-template__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.calendar-template__heading {
  min-width: 0;
}

.calendar-template__title {
  margin: 0;

  color: var(--text);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
}

.calendar-template__description {
  margin: 5px 0 0;

  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

.calendar-template__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  width: 100%;
  min-width: 0;
}

.calendar-template__filters {
  min-width: 0;
}

.calendar-template__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.calendar-template__navigation,
.calendar-template__status,
.calendar-template__content,
.calendar-template__details {
  min-width: 0;
}

.calendar-template__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
