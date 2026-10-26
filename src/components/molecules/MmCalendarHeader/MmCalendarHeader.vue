<script setup lang="ts">
import { computed } from 'vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import { parseCalendarDateKey } from '../../../utils/calendar-date'

interface Props {
  month: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  previous: []
  next: []
}>()

const monthLabel = computed(() => {
  const date = parseCalendarDateKey(props.month)

  if (!date) {
    return 'Unknown month'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(date)
})
</script>

<template>
  <div class="calendar-header">
    <div class="calendar-header__navigation" role="group" aria-label="Calendar month navigation">
      <mm-button
        variant="secondary"
        size="small"
        icon="chevron-left"
        icon-only
        aria-label="Previous month"
        title="Previous month"
        @click="emit('previous')"
      />

      <h2 class="calendar-header__title" aria-live="polite">
        {{ monthLabel }}
      </h2>

      <mm-button
        variant="secondary"
        size="small"
        icon="chevron-right"
        icon-only
        aria-label="Next month"
        title="Next month"
        @click="emit('next')"
      />
    </div>
  </div>
</template>

<style scoped>
.calendar-header {
  width: 100%;
  min-width: 0;
}

.calendar-header__navigation {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.calendar-header__title {
  margin: 0;
  color: var(--text);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
}
</style>
