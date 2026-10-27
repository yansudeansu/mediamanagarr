<script setup lang="ts">
import { computed } from 'vue'
import type { CalendarItem } from '../../../types/calendar'
import { parseCalendarDateKey } from '../../../utils/calendar-date'

interface Props {
  date: string
  day: number
  items?: CalendarItem[]
  isToday?: boolean
  isSelected?: boolean
  isOutsideMonth?: boolean
  tooltipId?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  isToday: false,
  isSelected: false,
  isOutsideMonth: false,
  tooltipId: undefined,
})

const emit = defineEmits<{
  select: [date: string]
  preview: [date: string]
  'hide-preview': [date: string]
}>()

const hasTv = computed(() => props.items.some((item) => item.type === 'tv'))
const hasMovies = computed(() => props.items.some((item) => item.type === 'movie'))

const accessibleLabel = computed(() => {
  const parsedDate = parseCalendarDateKey(props.date)

  const formattedDate = parsedDate
    ? new Intl.DateTimeFormat('en', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(parsedDate)
    : props.date

  const count = props.items.length

  return count === 0
    ? formattedDate
    : `${formattedDate}, ${count} ${count === 1 ? 'release' : 'releases'}`
})

function showPreview(): void {
  if (props.items.length > 0) {
    emit('preview', props.date)
  }
}

function hidePreview(): void {
  emit('hide-preview', props.date)
}
</script>

<template>
  <button
    type="button"
    class="calendar-day"
    :class="{
      'calendar-day--today': isToday,
      'calendar-day--selected': isSelected,
      'calendar-day--outside': isOutsideMonth,
    }"
    :aria-label="accessibleLabel"
    :aria-pressed="isSelected"
    :aria-describedby="items.length > 0 ? tooltipId : undefined"
    :data-date="date"
    @click="emit('select', date)"
    @mouseenter="showPreview"
    @mouseleave="hidePreview"
    @focus="showPreview"
    @blur="hidePreview"
    @keydown.esc.stop="hidePreview"
  >
    <span class="calendar-day__number">
      {{ day }}
    </span>

    <span v-if="hasTv || hasMovies" class="calendar-day__indicators" aria-hidden="true">
      <span v-if="hasTv" class="calendar-day__dot calendar-day__dot--tv" />

      <span v-if="hasMovies" class="calendar-day__dot calendar-day__dot--movie" />
    </span>
  </button>
</template>

<style scoped>
.calendar-day {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  min-height: 48px;
  padding: 6px 2px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text);
  font-family: var(--font-family);
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast);
}

.calendar-day:hover {
  background: var(--surface-hover);
}

.calendar-day:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.calendar-day--today {
  border-color: var(--primary);
}

.calendar-day--selected {
  border-color: var(--info);
  background: var(--info-subtle);
}

.calendar-day--selected:hover {
  background: var(--info-hover);
}

.calendar-day--today.calendar-day--selected {
  border-color: var(--info);
  background: var(--info-subtle);
}

.calendar-day--outside {
  color: var(--muted);
}

.calendar-day__number {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
}

.calendar-day__indicators {
  position: absolute;
  bottom: var(--space-2);
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  transform: translateX(-50%);
}

.calendar-day__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.calendar-day__dot--tv {
  background: var(--primary);
}

.calendar-day__dot--movie {
  background: var(--info);
}

@media (prefers-reduced-motion: reduce) {
  .calendar-day {
    transition: none;
  }
}
</style>
