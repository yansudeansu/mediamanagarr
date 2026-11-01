<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import MmIcon from '../../atoms/MmIcon/MmIcon.vue'

export interface QuickAccessItem {
  id: string
  label: string
  href: string
}

interface Props {
  items: QuickAccessItem[]
}

defineProps<Props>()

const emit = defineEmits<{
  settings: []
}>()

const isOpen = ref(false)
const triggerRef = ref<InstanceType<typeof MmButton> | null>(null)
const menuRef = ref<HTMLElement | null>(null)

function getTriggerElement(): HTMLButtonElement | null {
  const element = triggerRef.value?.$el

  return element instanceof HTMLButtonElement ? element : null
}

function removeDocumentListeners(): void {
  document.removeEventListener('pointerdown', handlePointerDown)
  document.removeEventListener('keydown', handleKeydown)
}

function closeMenu(restoreFocus = false): void {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false
  removeDocumentListeners()

  if (restoreFocus) {
    void nextTick(() => getTriggerElement()?.focus())
  }
}

function openMenu(): void {
  isOpen.value = true

  document.addEventListener('pointerdown', handlePointerDown)
  document.addEventListener('keydown', handleKeydown)

  void nextTick(() => menuRef.value?.querySelector<HTMLElement>('a, button')?.focus())
}

function toggleMenu(): void {
  if (isOpen.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

function handlePointerDown(event: PointerEvent): void {
  const target = event.target

  if (!(target instanceof Node)) {
    return
  }

  if (!getTriggerElement()?.contains(target) && !menuRef.value?.contains(target)) {
    closeMenu()
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu(true)
  }
}

function handleFocusOut(event: FocusEvent): void {
  const nextTarget = event.relatedTarget

  if (
    nextTarget instanceof Node &&
    (menuRef.value?.contains(nextTarget) || getTriggerElement()?.contains(nextTarget))
  ) {
    return
  }

  closeMenu()
}

function openSettings(): void {
  closeMenu()
  emit('settings')
}

onBeforeUnmount(removeDocumentListeners)
</script>

<template>
  <div class="quick-access" @focusout="handleFocusOut">
    <mm-button
      ref="triggerRef"
      variant="secondary"
      icon="menu"
      icon-only
      aria-label="Open workspace menu"
      :aria-controls="isOpen ? 'quick-access-menu' : undefined"
      :aria-expanded="isOpen"
      @click="toggleMenu"
    />

    <div v-if="isOpen" id="quick-access-menu" ref="menuRef" class="quick-access__menu">
      <div class="quick-access__heading">Quick Access</div>

      <div class="quick-access__services">
        <a
          v-for="item in items"
          :key="item.id"
          class="quick-access__item"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Open ${item.label} in a new tab`"
          @click="closeMenu()"
        >
          <span class="quick-access__name">{{ item.label }}</span>

          <mm-icon name="external-link" :size="15" />
        </a>

        <p v-if="items.length === 0" class="quick-access__empty">No links available</p>
      </div>

      <div class="quick-access__separator" />

      <mm-button
        variant="ghost"
        icon="settings"
        block
        aria-label="Open settings"
        @click="openSettings"
      >
        Settings
      </mm-button>
    </div>
  </div>
</template>

<style scoped>
.quick-access {
  position: relative;
}

.quick-access__menu {
  position: absolute;
  z-index: 100;
  top: calc(100% + var(--space-2));
  right: 0;
  width: min(260px, calc(100vw - var(--space-6)));
  padding: var(--space-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  box-shadow: 0 var(--space-2) var(--space-6) var(--shadow);
}

.quick-access__heading {
  padding: var(--space-2);
  color: var(--muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.quick-access__services {
  max-height: 220px;
  overflow-y: auto;
}

.quick-access__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 38px;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  color: var(--text);
  font-size: var(--font-size-sm);
  text-decoration: none;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.quick-access__item:hover {
  background: var(--surface-hover);
}

.quick-access__item:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: -2px;
}

.quick-access__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-access__empty {
  margin: 0;
  padding: var(--space-3);
  color: var(--muted);
  font-size: var(--font-size-sm);
}

.quick-access__separator {
  height: 1px;
  margin: var(--space-1) 0;
  background: var(--border);
}
</style>
