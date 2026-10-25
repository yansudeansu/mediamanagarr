<script setup lang="ts">
import MmButton from '../../atoms/MmButton/MmButton.vue'

export type NavigationView = 'requests' | 'up-next' | 'calendar' | 'downloads'

interface Props {
  activeView: NavigationView
}

defineProps<Props>()

const emit = defineEmits<{
  navigate: [view: NavigationView]
}>()

const items: { id: NavigationView; label: string }[] = [
  { id: 'requests', label: 'Requests' },
  { id: 'up-next', label: 'Up Next' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'downloads', label: 'Downloads' },
]
</script>

<template>
  <nav class="navigation" aria-label="Main navigation">
    <mm-button
      v-for="item in items"
      :key="item.id"
      variant="ghost"
      size="small"
      class="navigation__item"
      :aria-current="activeView === item.id ? 'page' : undefined"
      @click="emit('navigate', item.id)"
    >
      {{ item.label }}
    </mm-button>
  </nav>
</template>

<style scoped>
.navigation {
  display: flex;
  align-items: stretch;

  background: var(--background);
  border-bottom: 1px solid var(--border);
}

.navigation__item {
  flex: 1;
  min-width: 0;

  min-height: 42px;
  padding: 10px 4px;

  border-radius: 0;
  background: var(--background);
}

.navigation__item:hover:not(:disabled) {
  background: var(--surface-hover);
}

.navigation__item:focus-visible {
  position: relative;
  z-index: 1;
  outline-offset: -2px;
}

.navigation__item[aria-current='page'] {
  color: var(--accent);
  font-weight: 650;
  box-shadow: inset 0 -2px 0 var(--accent);
}
</style>
