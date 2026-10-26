<script setup lang="ts">
import { computed } from 'vue'
import MmCard from '../../atoms/MmCard/MmCard.vue'
import MmMediaPoster from '../../atoms/MmMediaPoster/MmMediaPoster.vue'
import type { CalendarItem } from '../../../types/calendar'
import { calendarItemDateKey, parseCalendarDateKey } from '../../../utils/calendar-date'

interface Props {
  item: CalendarItem
  image?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  image: null,
})

const isTv = computed(() => props.item.type === 'tv')

const mediaLabel = computed(() => (isTv.value ? 'TV episode' : 'Movie'))

const releaseLabel = computed(() => {
  if (props.item.releaseType === 'digital') {
    return 'Digital release'
  }

  if (props.item.releaseType === 'physical') {
    return 'Physical release'
  }

  return 'Airing'
})

const formattedDate = computed(() => {
  const dateKey = calendarItemDateKey(props.item.date)

  if (!dateKey) {
    return 'Unknown date'
  }

  const date = parseCalendarDateKey(dateKey)

  if (!date) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
})

const dateTime = computed(() => calendarItemDateKey(props.item.date))
</script>

<template>
  <mm-card padding="none">
    <article class="calendar-event">
      <mm-media-poster :title="item.title" :type="item.type" :image="image" />

      <div class="calendar-event__details">
        <div class="calendar-event__heading">
          <h3 class="calendar-event__title" :title="item.title">
            {{ item.title }}
          </h3>

          <span class="calendar-event__type">
            {{ mediaLabel }}
          </span>
        </div>

        <p class="calendar-event__subtitle" :title="item.subtitle">
          {{ item.subtitle }}
        </p>

        <div class="calendar-event__footer">
          <span class="calendar-event__release-type">
            {{ releaseLabel }}
          </span>

          <time v-if="dateTime" class="calendar-event__date" :datetime="dateTime">
            {{ formattedDate }}
          </time>

          <span v-else class="calendar-event__date">Unknown date</span>
        </div>
      </div>

      <span
        class="calendar-event__indicator"
        :class="{
          'calendar-event__indicator--tv': isTv,
          'calendar-event__indicator--movie': !isTv,
        }"
        aria-hidden="true"
      />
    </article>
  </mm-card>
</template>

<style scoped>
.calendar-event {
  position: relative;

  display: flex;
  gap: 12px;

  min-width: 0;
  padding: 12px;
}

.calendar-event__details {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 7px;

  min-width: 0;
}

.calendar-event__heading {
  display: flex;
  flex-direction: column;
  gap: 3px;

  min-width: 0;
}

.calendar-event__title {
  overflow: hidden;

  margin: 0;

  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar-event__type {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.3;
}

.calendar-event__subtitle {
  overflow: hidden;

  margin: 0;

  color: var(--text);
  font-size: 11px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar-event__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;

  margin-top: auto;
}

.calendar-event__release-type {
  color: var(--text);
  font-size: 10px;
  line-height: 1.4;
}

.calendar-event__date {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.4;
}

.calendar-event__indicator {
  position: absolute;
  top: 10px;
  right: 10px;

  width: 7px;
  height: 7px;

  border-radius: 50%;
}

.calendar-event__indicator--tv {
  background: var(--accent);
}

.calendar-event__indicator--movie {
  background: #3b82f6;
}
</style>
