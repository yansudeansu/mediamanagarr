<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import MmIcon from '../../atoms/MmIcon/MmIcon.vue'
import { SERVICE_REGISTRY, SERVICES } from '../../../services/registry'
import { normalizeServerUrl } from '../../../utils/service-config'
import type { SafeServiceConfigs } from '../../../types/service'

interface Props {
  services: SafeServiceConfigs
}

const props = defineProps<Props>()

const emit = defineEmits<{
  settings: []
}>()

const isOpen = ref(false)
const triggerRef = ref<InstanceType<typeof MmButton> | null>(null)
const menuRef = ref<HTMLElement | null>(null)

const configuredServices = computed(() =>
  SERVICES.flatMap((serviceId) => {
    const config = props.services[serviceId]

    if (!config?.configured) {
      return []
    }

    try {
      return [
        {
          id: serviceId,
          name: SERVICE_REGISTRY[serviceId].name,
          url: normalizeServerUrl(config.url),
        },
      ]
    } catch {
      return []
    }
  }),
)

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

function openSettings(): void {
  closeMenu()
  emit('settings')
}

onBeforeUnmount(removeDocumentListeners)
</script>

<template>
  <div class="quick-access">
    <mm-button
      ref="triggerRef"
      variant="secondary"
      icon="menu"
      icon-only
      aria-label="Open workspace menu"
      aria-controls="quick-access-menu"
      :aria-expanded="isOpen"
      @click="toggleMenu"
    />

    <div v-if="isOpen" id="quick-access-menu" ref="menuRef" class="quick-access__menu">
      <div class="quick-access__heading">Quick Access</div>

      <div class="quick-access__services">
        <a
          v-for="service in configuredServices"
          :key="service.id"
          class="quick-access__item"
          :href="service.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Open ${service.name} in a new tab`"
          @click="closeMenu()"
        >
          <span class="quick-access__name">{{ service.name }}</span>

          <mm-icon name="external-link" :size="15" />
        </a>

        <p v-if="configuredServices.length === 0" class="quick-access__empty">
          No services configured
        </p>
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
