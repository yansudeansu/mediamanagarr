<script setup lang="ts">
import MmTabs from '../MmTabs/MmTabs.vue'
import type { TabItem } from '../MmTabs/MmTabs.vue'

interface Props {
  activeView: string
  items: TabItem[]
  label?: string
}

withDefaults(defineProps<Props>(), {
  label: 'Main navigation',
})

const emit = defineEmits<{
  navigate: [view: string]
}>()
</script>

<template>
  <nav :aria-label="label">
    <mm-tabs
      :model-value="activeView"
      :items="items"
      variant="navigation"
      @update:model-value="emit('navigate', $event)"
    />
  </nav>
</template>
