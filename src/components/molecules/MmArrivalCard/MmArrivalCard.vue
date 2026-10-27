<script setup lang="ts">
import { computed } from 'vue'
import MmCard from '../../atoms/MmCard/MmCard.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import MmMediaPoster from '../../atoms/MmMediaPoster/MmMediaPoster.vue'
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
      <mm-media-poster
        :title="arrival.title"
        :type="arrival.type === 'Movie' ? 'movie' : 'tv'"
        :image="image"
      />

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
        role="img"
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
  gap: var(--space-3);
  min-width: 0;
  padding: var(--space-3);
}

.arrival-card--unread {
  box-shadow: inset 0 0 0 1px var(--primary);
}

.arrival-card__details {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.arrival-card__heading {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.arrival-card__title {
  overflow: hidden;
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrival-card__type {
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.3;
}

.arrival-card__subtitle {
  overflow: hidden;
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-sm);
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrival-card__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-2);
  margin-top: auto;
}

.arrival-card__date {
  color: var(--muted);
  font-size: var(--font-size-xs);
  line-height: 1.4;
}

.arrival-card__indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--primary);
}
</style>
