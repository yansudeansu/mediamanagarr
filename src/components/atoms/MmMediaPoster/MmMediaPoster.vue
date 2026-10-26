<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  type: 'movie' | 'tv'
  image?: string | null
  size?: 'small' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  image: null,
  size: 'default',
})

const placeholderIcon = computed(() => (props.type === 'movie' ? '🎬' : '📺'))
</script>

<template>
  <div
    class="media-poster"
    :class="{
      'media-poster--small': size === 'small',
    }"
  >
    <img
      v-if="image"
      class="media-poster__image"
      :src="image"
      :alt="`${title} poster`"
      loading="lazy"
    />

    <div
      v-else
      class="media-poster__placeholder"
      role="img"
      :aria-label="`No poster available for ${title}`"
    >
      <span aria-hidden="true">
        {{ placeholderIcon }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.media-poster {
  flex: 0 0 64px;

  width: 64px;
  height: 96px;

  overflow: hidden;

  border-radius: var(--radius-sm);
  background: var(--background);
}

.media-poster--small {
  flex-basis: 48px;

  width: 48px;
  height: 72px;
}

.media-poster__image {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

.media-poster__placeholder {
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

.media-poster--small .media-poster__placeholder {
  font-size: 20px;
}
</style>
