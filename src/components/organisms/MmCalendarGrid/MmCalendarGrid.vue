<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import MmCalendarDay from '../../molecules/MmCalendarDay/MmCalendarDay.vue'
import MmCalendarTooltip from '../../molecules/MmCalendarTooltip/MmCalendarTooltip.vue'
import type { CalendarItem } from '../../../types/calendar'
import {
  calendarDateKey,
  calendarItemDateKey,
  parseCalendarDateKey,
} from '../../../utils/calendar-date'

interface Props {
  month: string
  selectedDate?: string | null
  today?: string
  items?: CalendarItem[]
}

const props = withDefaults(defineProps<Props>(), {
  selectedDate: null,
  today: () => calendarDateKey(new Date()),
  items: () => [],
})

const emit = defineEmits<{
  select: [date: string]
}>()

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const gridRef = ref<HTMLElement | null>(null)
const activePreviewDate = ref<string | null>(null)
const tooltipLeft = ref(0)
const tooltipTop = ref(0)

const TOOLTIP_WIDTH = 220
const TOOLTIP_GAP = 8

const monthDate = computed(() => {
  const parsed = parseCalendarDateKey(props.month)

  if (!parsed) {
    return null
  }

  return new Date(parsed.getFullYear(), parsed.getMonth(), 1, 12)
})

const monthLabel = computed(() => {
  if (!monthDate.value) {
    return 'Unknown month'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(monthDate.value)
})

const calendarDays = computed(() => {
  const firstDay = monthDate.value

  if (!firstDay) {
    return []
  }

  const year = firstDay.getFullYear()
  const month = firstDay.getMonth()

  const daysInMonth = new Date(year, month + 1, 0, 12).getDate()
  const leadingDays = (firstDay.getDay() + 6) % 7
  const totalDays = Math.ceil((leadingDays + daysInMonth) / 7) * 7

  const start = new Date(year, month, 1 - leadingDays, 12)

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index, 12)

    return {
      date: calendarDateKey(date),
      day: date.getDate(),
      isOutsideMonth: date.getMonth() !== month || date.getFullYear() !== year,
    }
  })
})

const itemsByDate = computed(() => {
  const grouped = new Map<string, CalendarItem[]>()

  for (const item of props.items) {
    const date = calendarItemDateKey(item.date)

    if (!date) {
      continue
    }

    const existing = grouped.get(date)

    if (existing) {
      existing.push(item)
    } else {
      grouped.set(date, [item])
    }
  }

  return grouped
})

const previewItems = computed(() =>
  activePreviewDate.value ? (itemsByDate.value.get(activePreviewDate.value) ?? []) : [],
)

function itemsForDate(date: string): CalendarItem[] {
  return itemsByDate.value.get(date) ?? []
}

async function showPreview(date: string): Promise<void> {
  if (itemsForDate(date).length === 0) {
    return
  }

  activePreviewDate.value = date

  await nextTick()

  if (activePreviewDate.value !== date || !gridRef.value) {
    return
  }

  const button = Array.from(gridRef.value.querySelectorAll<HTMLButtonElement>('[data-date]')).find(
    (element) => element.dataset.date === date,
  )

  if (!button) {
    return
  }

  const gridRect = gridRef.value.getBoundingClientRect()
  const buttonRect = button.getBoundingClientRect()

  const buttonCenter = buttonRect.left - gridRect.left + buttonRect.width / 2

  const maxLeft = Math.max(0, gridRect.width - TOOLTIP_WIDTH)

  tooltipLeft.value = Math.min(Math.max(0, buttonCenter - TOOLTIP_WIDTH / 2), maxLeft)

  tooltipTop.value = buttonRect.bottom - gridRect.top + TOOLTIP_GAP
}

function hidePreview(date: string): void {
  if (activePreviewDate.value === date) {
    activePreviewDate.value = null
  }
}

function selectDate(date: string): void {
  activePreviewDate.value = null
  emit('select', date)
}

watch(
  () => props.month,
  () => {
    activePreviewDate.value = null
  },
)

watch(
  () => props.items,
  () => {
    activePreviewDate.value = null
  },
)
</script>

<template>
  <section ref="gridRef" class="calendar-grid" :aria-label="`${monthLabel} calendar`">
    <div class="calendar-grid__weekdays" aria-hidden="true">
      <span v-for="weekday in weekdays" :key="weekday" class="calendar-grid__weekday">
        {{ weekday }}
      </span>
    </div>

    <div class="calendar-grid__days">
      <mm-calendar-day
        v-for="day in calendarDays"
        :key="day.date"
        :date="day.date"
        :day="day.day"
        :items="itemsForDate(day.date)"
        :is-today="day.date === today"
        :is-selected="day.date === selectedDate"
        :is-outside-month="day.isOutsideMonth"
        :tooltip-id="activePreviewDate === day.date ? 'calendar-day-tooltip' : undefined"
        @select="selectDate"
        @preview="showPreview"
        @hide-preview="hidePreview"
      />
    </div>

    <div
      v-if="activePreviewDate && previewItems.length > 0"
      class="calendar-grid__tooltip"
      :style="{
        left: `${tooltipLeft}px`,
        top: `${tooltipTop}px`,
      }"
    >
      <mm-calendar-tooltip
        id="calendar-day-tooltip"
        :date="activePreviewDate"
        :items="previewItems"
      />
    </div>
  </section>
</template>

<style scoped>
.calendar-grid {
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 6px;

  min-width: 0;
  overflow: visible;
}

.calendar-grid__weekdays,
.calendar-grid__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.calendar-grid__weekdays {
  gap: 4px;
  padding-bottom: 4px;

  border-bottom: 1px solid var(--border);
}

.calendar-grid__weekday {
  padding: 6px 0;

  color: var(--muted);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
}

.calendar-grid__days {
  gap: 4px;
}

.calendar-grid__tooltip {
  position: absolute;
  z-index: 20;

  width: 220px;
  max-width: 100%;

  pointer-events: none;
}
</style>
