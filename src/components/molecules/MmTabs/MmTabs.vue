<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'

export interface TabItem {
  id: string
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string
  items: TabItem[]
  variant?: 'tabs' | 'navigation'
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'tabs',
  label: 'Tabs',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const tabRefs = ref<HTMLElement[]>([])

const enabledIndexes = computed(() =>
  props.items.flatMap((item, index) => (item.disabled ? [] : [index])),
)

function selectTab(item: TabItem): void {
  if (item.disabled) return

  emit('update:modelValue', item.id)
}

function focusTab(index: number): void {
  nextTick(() => {
    tabRefs.value[index]?.focus()
  })
}

function handleKeydown(event: KeyboardEvent, index: number): void {
  if (props.variant !== 'tabs') return

  const indexes = enabledIndexes.value

  if (!indexes.length) return

  let nextIndex: number | undefined

  if (event.key === 'Home') {
    nextIndex = indexes[0]
  } else if (event.key === 'End') {
    nextIndex = indexes.at(-1)
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    const position = indexes.indexOf(index)
    const direction = event.key === 'ArrowRight' ? 1 : -1

    const nextPosition =
      position === -1 ? 0 : (position + direction + indexes.length) % indexes.length

    nextIndex = indexes[nextPosition]
  } else {
    return
  }

  if (nextIndex === undefined) return

  event.preventDefault()

  const item = props.items[nextIndex]

  if (!item) return

  selectTab(item)
  focusTab(nextIndex)
}

watch(
  () => props.items,
  () => {
    tabRefs.value = []
  },
)
</script>

<template>
  <div
    class="tabs"
    :class="`tabs--${variant}`"
    :role="variant === 'tabs' ? 'tablist' : undefined"
    :aria-label="variant === 'tabs' ? label : undefined"
  >
    <mm-button
      v-for="(item, index) in items"
      :key="item.id"
      :ref="
        (component) => {
          if (component && '$el' in component) {
            tabRefs[index] = component.$el as HTMLElement
          }
        }
      "
      variant="ghost"
      size="small"
      class="tabs__item"
      :disabled="item.disabled"
      :role="variant === 'tabs' ? 'tab' : undefined"
      :aria-selected="variant === 'tabs' ? modelValue === item.id : undefined"
      :aria-current="variant === 'navigation' && modelValue === item.id ? 'page' : undefined"
      :tabindex="variant === 'tabs' ? (modelValue === item.id ? 0 : -1) : undefined"
      @click="selectTab(item)"
      @keydown="handleKeydown($event, index)"
    >
      {{ item.label }}
    </mm-button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  align-items: stretch;
  background: var(--background);
  border-bottom: 1px solid var(--border);
}

.tabs__item {
  flex: 1;
  min-width: 0;
  min-height: 42px;
  padding: 10px var(--space-1);
  border-radius: 0;
  background: var(--background);
}

.tabs__item:hover:not(:disabled) {
  background: var(--surface-hover);
}

.tabs__item:focus-visible {
  position: relative;
  z-index: 1;
  outline-offset: -2px;
}

.tabs__item[aria-selected='true'],
.tabs__item[aria-current='page'] {
  color: var(--primary);
  font-weight: var(--font-weight-semibold);
  box-shadow: inset 0 -2px 0 var(--primary);
}
</style>
