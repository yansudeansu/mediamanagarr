<script setup lang="ts">
import { computed } from 'vue'
import type { CalendarItem } from '../../../types/calendar'
import { parseCalendarDateKey } from '../../../utils/calendar-date'

interface Props {
  date: string
  items: CalendarItem[]
}

const props = defineProps<Props>()

const formattedDate = computed(() => {
  const date = parseCalendarDateKey(props.date)

  if (!date) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
})

const visibleItems = computed(() => props.items.slice(0, 4))

const remainingCount = computed(() => Math.max(0, props.items.length - visibleItems.value.length))

const releaseCountLabel = computed(() =>
  props.items.length === 1 ? '1 release' : `${props.items.length} releases`,
)
</script>

<template>
  <div class="calendar-tooltip" role="tooltip">
    <div class="calendar-tooltip__heading">
      <span class="calendar-tooltip__date">
        {{ formattedDate }}
      </span>

      <span class="calendar-tooltip__count">
        {{ releaseCountLabel }}
      </span>
    </div>

    <div class="calendar-tooltip__items">
      <div v-for="item in visibleItems" :key="item.id" class="calendar-tooltip__item">
        <span
          class="calendar-tooltip__indicator"
          :class="{
            'calendar-tooltip__indicator--tv': item.type === 'tv',
            'calendar-tooltip__indicator--movie': item.type === 'movie',
          }"
          aria-hidden="true"
        />

        <div class="calendar-tooltip__details">
          <span class="calendar-tooltip__title">
            {{ item.title }}
          </span>

          <span class="calendar-tooltip__subtitle">
            {{ item.subtitle }}
          </span>
        </div>
      </div>

      <div v-if="remainingCount > 0" class="calendar-tooltip__remaining">
        +{{ remainingCount }} more
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-tooltip {
  display: flex;
  flex-direction: column;
  gap: 9px;

  width: 220px;
  max-width: 100%;
  padding: 11px;

  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);

  box-shadow: 0 8px 24px rgb(0 0 0 / 35%);

  color: var(--text);
  font-family: var(--font-family);
}

.calendar-tooltip__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.calendar-tooltip__date {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.calendar-tooltip__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  min-height: 20px;
  padding: 3px 7px;

  border-radius: 999px;
  background: var(--surface-hover);

  color: var(--text);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

.calendar-tooltip__items {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.calendar-tooltip__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}

.calendar-tooltip__indicator {
  flex-shrink: 0;

  width: 7px;
  height: 7px;
  margin-top: 5px;

  border-radius: 50%;
}

.calendar-tooltip__indicator--tv {
  background: var(--accent);
}

.calendar-tooltip__indicator--movie {
  background: #3b82f6;
}

.calendar-tooltip__details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.calendar-tooltip__title {
  overflow: hidden;

  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar-tooltip__subtitle {
  overflow: hidden;

  color: var(--muted);
  font-size: 10px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar-tooltip__remaining {
  padding-left: 15px;

  color: var(--muted);
  font-size: 10px;
}
</style>
