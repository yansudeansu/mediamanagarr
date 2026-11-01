<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
const scrollContainer = ref<HTMLElement | null>(null)

const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const enabledIndexes = computed(() =>
  props.items.flatMap((item, index) => (item.disabled ? [] : [index])),
)

const isNavigation = computed(() => props.variant === 'navigation')

let resizeObserver: ResizeObserver | undefined

function updateScrollState(): void {
  const container = scrollContainer.value

  if (!isNavigation.value || !container) {
    canScrollLeft.value = false
    canScrollRight.value = false
    return
  }

  const tolerance = 1
  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth)

  canScrollLeft.value = container.scrollLeft > tolerance
  canScrollRight.value = container.scrollLeft < maxScroll - tolerance
}

function scrollNavigation(direction: -1 | 1): void {
  const container = scrollContainer.value

  if (!container) return

  container.scrollBy({
    left: direction * Math.max(container.clientWidth * 0.75, 80),
    behavior: 'smooth',
  })
}

function scrollActiveIntoView(): void {
  if (!isNavigation.value) return

  const container = scrollContainer.value
  const index = props.items.findIndex((item) => item.id === props.modelValue)
  const activeTab = tabRefs.value[index]

  if (!container || !activeTab) return

  const containerRect = container.getBoundingClientRect()
  const tabRect = activeTab.getBoundingClientRect()

  if (tabRect.left < containerRect.left) {
    container.scrollBy({
      left: tabRect.left - containerRect.left,
      behavior: 'smooth',
    })
  } else if (tabRect.right > containerRect.right) {
    container.scrollBy({
      left: tabRect.right - containerRect.right,
      behavior: 'smooth',
    })
  }
}

async function refreshNavigation(): Promise<void> {
  await nextTick()
  updateScrollState()
  scrollActiveIntoView()
}

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
    void refreshNavigation()
  },
  { deep: true },
)

watch(
  () => props.modelValue,
  () => {
    void refreshNavigation()
  },
)

watch(
  () => props.variant,
  () => {
    void refreshNavigation()
  },
)

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      updateScrollState()
      scrollActiveIntoView()
    })

    if (scrollContainer.value) {
      resizeObserver.observe(scrollContainer.value)

      const content = scrollContainer.value.firstElementChild
      if (content) resizeObserver.observe(content)
    }
  }

  void refreshNavigation()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    class="tabs"
    :class="`tabs--${variant}`"
    :role="variant === 'tabs' ? 'tablist' : undefined"
    :aria-label="variant === 'tabs' ? label : undefined"
  >
    <mm-button
      v-if="isNavigation && (canScrollLeft || canScrollRight)"
      variant="ghost"
      size="small"
      icon-only
      icon="chevron-left"
      class="tabs__scroll-button tabs__scroll-button--left"
      aria-label="Scroll navigation left"
      :disabled="!canScrollLeft"
      @click="scrollNavigation(-1)"
    />

    <div
      ref="scrollContainer"
      class="tabs__viewport"
      :class="{ 'tabs__viewport--navigation': isNavigation }"
      @scroll="updateScrollState"
    >
      <div class="tabs__items">
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
    </div>

    <mm-button
      v-if="isNavigation && (canScrollLeft || canScrollRight)"
      variant="ghost"
      size="small"
      icon-only
      icon="chevron-right"
      class="tabs__scroll-button tabs__scroll-button--right"
      aria-label="Scroll navigation right"
      :disabled="!canScrollRight"
      @click="scrollNavigation(1)"
    />
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  align-items: stretch;
  min-width: 0;
  background: var(--background);
  border-bottom: 1px solid var(--border);
}

.tabs__viewport {
  flex: 1;
  min-width: 0;
}

.tabs__items {
  display: flex;
  align-items: stretch;
}

.tabs__item {
  flex: 1;
  min-width: 0;
  min-height: 42px;
  padding: 10px var(--space-1);
  border-radius: 0;
  background: var(--background);
}

.tabs--navigation .tabs__viewport {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
}

.tabs--navigation .tabs__viewport::-webkit-scrollbar {
  display: none;
}

.tabs--navigation .tabs__items {
  width: max-content;
  min-width: 100%;
}

.tabs--navigation .tabs__item {
  flex: 1 0 auto;
  min-width: max-content;
  white-space: nowrap;
}

.tabs--navigation .tabs__scroll-button {
  flex: 0 0 30px;
  align-self: stretch;
  width: 30px;
  height: auto;
  min-height: 42px;
  padding: 0;
  border-radius: 0;
  background: var(--background);
  color: var(--text);
}

.tabs--navigation .tabs__scroll-button:disabled {
  opacity: 0.35;
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
