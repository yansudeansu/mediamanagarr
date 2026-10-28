<script setup lang="ts">
import MmButton from '../../atoms/MmButton/MmButton.vue'
import mmLogo from '../../../assets/mm-logo.svg'

interface Props {
  mode?: 'main' | 'settings'
  windowMode?: 'popup' | 'detached' | 'sidebar'
}

withDefaults(defineProps<Props>(), {
  mode: 'main',
  windowMode: 'popup',
})

const emit = defineEmits<{
  settings: []
  back: []
  detach: []
  attach: []
  sidebar: []
  sidebarClose: []
}>()
</script>

<template>
  <header class="header">
    <div class="header__branding">
      <img :src="mmLogo" alt="" class="header__logo" width="28" height="28" />

      <h1 class="header__title">
        {{ mode === 'settings' ? 'Settings' : 'MediaManagarr' }}
      </h1>
    </div>

    <div class="header__actions">
      <mm-button
        v-if="windowMode === 'sidebar'"
        variant="secondary"
        icon="sidebar-close"
        icon-only
        aria-label="Close browser sidebar"
        title="Close browser sidebar"
        @click="emit('sidebarClose')"
      />

      <template v-else>
        <mm-button
          variant="secondary"
          icon="sidebar"
          icon-only
          aria-label="Open workspace in browser sidebar"
          title="Open workspace in browser sidebar"
          @click="emit('sidebar')"
        />

        <mm-button
          v-if="windowMode === 'detached'"
          variant="secondary"
          icon="attach"
          icon-only
          aria-label="Attach workspace to toolbar"
          title="Attach workspace to toolbar"
          @click="emit('attach')"
        />

        <mm-button
          v-else
          variant="secondary"
          icon="detach"
          icon-only
          aria-label="Detach workspace into a window"
          title="Detach workspace into a window"
          @click="emit('detach')"
        />
      </template>

      <mm-button
        v-if="mode === 'settings'"
        variant="secondary"
        icon="arrow-left"
        icon-only
        aria-label="Back to previous view"
        title="Back to previous view"
        @click="emit('back')"
      />

      <mm-button
        v-else
        variant="secondary"
        icon="settings"
        icon-only
        aria-label="Open settings"
        title="Open settings"
        @click="emit('settings')"
      />
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) 18px;
  border-bottom: 1px solid var(--border);
}

.header__branding {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.header__logo {
  display: block;
  flex-shrink: 0;
  width: 28px;
}

.header__title {
  min-width: 0;
  margin: 0;
  color: var(--text);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}
</style>
