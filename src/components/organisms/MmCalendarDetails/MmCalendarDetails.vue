<script setup lang="ts">
import { computed } from 'vue'
import MmCalendarEvent from '../../molecules/MmCalendarEvent/MmCalendarEvent.vue'
import type { CalendarItem } from '../../../types/calendar'
import { parseCalendarDateKey } from '../../../utils/calendar-date'

interface Props {
  date: string
  items?: CalendarItem[]
  images?: Record<string, string | null>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  images: () => ({}),
  loading: false,
})

const formattedDate = computed(() => {
  const date = parseCalendarDateKey(props.date)

  if (!date) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
})

const releaseCount = computed(() => props.items.length)

const releaseLabel = computed(() =>
  releaseCount.value === 1 ? '1 release' : `${releaseCount.value} releases`,
)
</script>

<template>
  <section class="calendar-details" aria-labelledby="calendar-details-heading">
    <header class="calendar-details__header">
      <div class="calendar-details__heading">
        <h3 id="calendar-details-heading" class="calendar-details__title">
          {{ formattedDate }}
        </h3>

        <span class="calendar-details__count">
          {{ releaseLabel }}
        </span>
      </div>
    </header>

    <div v-if="loading" class="calendar-details__state" role="status">Loading releases…</div>

    <div v-else-if="items.length === 0" class="calendar-details__state">
      No releases scheduled for this day.
    </div>

    <div v-else class="calendar-details__events">
      <mm-calendar-event
        v-for="item in items"
        :key="item.id"
        :item="item"
        :image="images[item.id] ?? null"
      />
    </div>
  </section>
</template>

<style scoped>
.calendar-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}

.calendar-details__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.calendar-details__heading {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.calendar-details__title {
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
}

.calendar-details__count {
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.calendar-details__state {
  padding: var(--space-5) var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  text-align: center;
}

.calendar-details__events {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>
