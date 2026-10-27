<script setup lang="ts">
import { computed } from 'vue'
import MmCard from '../../atoms/MmCard/MmCard.vue'
import MmMediaPoster from '../../atoms/MmMediaPoster/MmMediaPoster.vue'
import type { SeerrRequest, SeerrRequestStatus, SeerrMediaStatus } from '../../../types/seerr'

interface Props {
  request: SeerrRequest
}

const props = defineProps<Props>()

const mediaTypeLabel = computed(() => (props.request.type === 'movie' ? 'Movie' : 'TV Show'))

const posterUrl = computed(() => {
  const path = props.request.posterPath

  if (!path || !path.startsWith('/')) {
    return null
  }

  return `https://image.tmdb.org/t/p/w185${path}`
})

const requestStatusClass: Record<SeerrRequestStatus, string> = {
  Pending: 'pending',
  Approved: 'approved',
  Declined: 'declined',
  Unknown: 'unknown',
}

const mediaStatusClass: Record<SeerrMediaStatus, string> = {
  Pending: 'pending',
  Processing: 'processing',
  'Partially Available': 'partial',
  Available: 'available',
  Unknown: 'unknown',
}

const displayStatus = computed<SeerrRequestStatus | SeerrMediaStatus>(() => {
  const mediaStatus = props.request.mediaStatus

  if (
    mediaStatus === 'Available' ||
    mediaStatus === 'Partially Available' ||
    mediaStatus === 'Processing'
  ) {
    return mediaStatus
  }

  return props.request.status
})

const displayStatusClass = computed(() => {
  const status = displayStatus.value

  if (status === 'Available' || status === 'Partially Available' || status === 'Processing') {
    return mediaStatusClass[status]
  }

  return requestStatusClass[status]
})

const formattedDate = computed(() => {
  const date = new Date(props.request.createdAt)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
})
</script>

<template>
  <mm-card padding="none">
    <div class="request-card">
      <mm-media-poster :title="request.title" :type="request.type" :image="posterUrl" />

      <div class="request-card__details">
        <div class="request-card__heading">
          <h3 class="request-card__title" :title="request.title">
            {{ request.title }}
          </h3>

          <span class="request-card__type">
            {{ mediaTypeLabel }}
          </span>
        </div>

        <div class="request-card__statuses">
          <span class="request-card__badge" :class="`request-card__badge--${displayStatusClass}`">
            {{ displayStatus }}
          </span>
        </div>

        <div class="request-card__metadata">
          <span class="request-card__requester" :title="request.requestedBy">
            Requested by {{ request.requestedBy }}
          </span>

          <time
            v-if="formattedDate !== 'Unknown date'"
            class="request-card__date"
            :datetime="request.createdAt"
          >
            {{ formattedDate }}
          </time>

          <span v-else class="request-card__date">Unknown date</span>
        </div>
      </div>
    </div>
  </mm-card>
</template>

<style scoped>
.request-card {
  display: flex;
  gap: var(--space-3);
  min-width: 0;
  padding: var(--space-3);
}

.request-card__details {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.request-card__heading {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.request-card__title {
  overflow: hidden;
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.request-card__type {
  color: var(--muted);
  font-size: var(--font-size-sm);
  line-height: 1.3;
}

.request-card__statuses {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1);
}

.request-card__badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 7px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  white-space: nowrap;
}

.request-card__badge--pending {
  color: var(--status-warning);
  background: var(--status-warning-bg);
  border-color: var(--status-warning-border);
}

.request-card__badge--approved,
.request-card__badge--available {
  color: var(--status-success);
  background: var(--status-success-bg);
  border-color: var(--status-success-border);
}

.request-card__badge--declined {
  color: var(--status-danger);
  background: var(--status-danger-bg);
  border-color: var(--status-danger-border);
}

.request-card__badge--processing {
  color: var(--status-info);
  background: var(--status-info-bg);
  border-color: var(--status-info-border);
}

.request-card__badge--partial {
  color: var(--status-partial);
  background: var(--status-partial-bg);
  border-color: var(--status-partial-border);
}

.request-card__badge--unknown {
  color: var(--status-neutral);
  background: var(--status-neutral-bg);
  border-color: var(--status-neutral-border);
}

.request-card__metadata {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-top: auto;
  min-width: 0;
  color: var(--muted);
  font-size: var(--font-size-xs);
  line-height: 1.4;
}

.request-card__requester {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.request-card__date {
  color: var(--muted);
}
</style>
