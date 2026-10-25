<script setup lang="ts">
import { computed } from 'vue'
import MmCard from '../../atoms/MmCard/MmCard.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import type { JellyfinArrival } from '../../../types/jellyfin'

interface Props {
  arrival: JellyfinArrival
  image?: string | null
  busy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  image: null,
  busy: false,
})

const emit = defineEmits<{
  toggleUnread: [itemId: string, unread: boolean]
}>()

const formattedDate = computed(() => {
  const date = new Date(props.arrival.dateAdded)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
})

function toggleUnread(): void {
  if (props.busy) {
    return
  }

  emit('toggleUnread', props.arrival.id, !props.arrival.unread)
}
</script>

<template>
  <mm-card padding="none">
    <article class="arrival-card" :class="{ 'arrival-card--unread': arrival.unread }">
      <div class="arrival-card__poster">
        <img
          v-if="image"
          class="arrival-card__poster-image"
          :src="image"
          :alt="`${arrival.title} poster`"
          loading="lazy"
        />

        <div
          v-else
          class="arrival-card__poster-placeholder"
          role="img"
          :aria-label="`No poster available for ${arrival.title}`"
        >
          <span aria-hidden="true">
            {{ arrival.type === 'Movie' ? '🎬' : '📺' }}
          </span>
        </div>
      </div>

      <div class="arrival-card__details">
        <div class="arrival-card__heading">
          <h3 class="arrival-card__title" :title="arrival.title">
            {{ arrival.title }}
          </h3>

          <span class="arrival-card__type">
            {{ arrival.type }}
          </span>
        </div>

        <p class="arrival-card__subtitle" :title="arrival.subtitle">
          {{ arrival.subtitle }}
        </p>

        <div class="arrival-card__footer">
          <time
            v-if="formattedDate !== 'Unknown date'"
            class="arrival-card__date"
            :datetime="arrival.dateAdded"
          >
            {{ formattedDate }}
          </time>

          <span v-else class="arrival-card__date">Unknown date</span>

          <mm-button
            variant="secondary"
            size="small"
            :loading="busy"
            :disabled="busy"
            @click="toggleUnread"
          >
            {{ arrival.unread ? 'Dismiss' : 'Flag as new' }}
          </mm-button>
        </div>
      </div>

      <span
        v-if="arrival.unread"
        class="arrival-card__indicator"
        aria-label="New arrival"
        title="New arrival"
      />
    </article>
  </mm-card>
</template>

<style scoped>
.arrival-card {
  position: relative;

  display: flex;
  gap: 12px;

  min-width: 0;
  padding: 12px;
}

.arrival-card--unread {
  box-shadow: inset 0 0 0 1px var(--primary);
}

.arrival-card__poster {
  flex: 0 0 64px;

  width: 64px;
  height: 96px;

  overflow: hidden;

  border-radius: var(--radius-sm);
  background: var(--background);
}

.arrival-card__poster-image {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

.arrival-card__poster-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  border: 1px solid var(--border);
  border-radius: var(--radius-sm);

  color: var(--muted);
  font-size: 24px;
}

.arrival-card__details {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 7px;

  min-width: 0;
}

.arrival-card__heading {
  display: flex;
  flex-direction: column;
  gap: 3px;

  min-width: 0;
}

.arrival-card__title {
  overflow: hidden;

  margin: 0;

  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrival-card__type {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.3;
}

.arrival-card__subtitle {
  overflow: hidden;

  margin: 0;

  color: var(--text);
  font-size: 11px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrival-card__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;

  margin-top: auto;
}

.arrival-card__date {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.4;
}

.arrival-card__indicator {
  position: absolute;
  top: 10px;
  right: 10px;

  width: 7px;
  height: 7px;

  border-radius: 50%;
  background: #22c55e;
}
</style>
