<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import MmHeader from './components/molecules/MmHeader/MmHeader.vue'
import MmNavigation from './components/molecules/MmNavigation/MmNavigation.vue'
import type { NavigationView } from './components/molecules/MmNavigation/MmNavigation.vue'
import MmFooter from './components/atoms/MmFooter/MmFooter.vue'
import MmRequestView from './views/MmRequestView.vue'
import MmUpNextView from './views/MmUpNextView.vue'
import MmCalendarView from './views/MmCalendarView.vue'
import MmDownloadsView from './views/MmDownloadsView.vue'
import SettingsView from './views/SettingsView.vue'
import { sendBackgroundMessage } from './utils/background-messaging'
import { getAppVersion } from './utils/version'
import { getWorkspaceNavigationState, saveWorkspaceNavigationState } from './utils/workspace-state'

const settingsOpen = ref(false)
const activeView = ref<NavigationView>('requests')

const windowMode = ref<'popup' | 'detached'>(
  new URLSearchParams(window.location.search).get('workspace') === 'detached'
    ? 'detached'
    : 'popup',
)

const workspaceError = ref('')
const workspaceLoading = ref(false)
const workspaceStateReady = ref(false)

const version = getAppVersion()

function hasWorkspaceStorage(): boolean {
  return (
    typeof chrome !== 'undefined' &&
    typeof chrome.storage?.session?.get === 'function' &&
    typeof chrome.storage?.session?.set === 'function'
  )
}

onMounted(async () => {
  try {
    if (hasWorkspaceStorage()) {
      const state = await getWorkspaceNavigationState()

      activeView.value = state.activeView
      settingsOpen.value = state.settingsOpen
    }
  } catch (error) {
    console.warn('MediaManagarr: Unable to restore workspace navigation:', error)
  } finally {
    workspaceStateReady.value = true
  }
})

watch([activeView, settingsOpen], async () => {
  if (!workspaceStateReady.value || !hasWorkspaceStorage()) {
    return
  }

  try {
    await saveWorkspaceNavigationState({
      activeView: activeView.value,
      settingsOpen: settingsOpen.value,
    })
  } catch (error) {
    console.warn('MediaManagarr: Unable to save workspace navigation:', error)
  }
})

async function detachWorkspace(): Promise<void> {
  if (workspaceLoading.value) {
    return
  }

  workspaceError.value = ''
  workspaceLoading.value = true

  try {
    if (hasWorkspaceStorage()) {
      await saveWorkspaceNavigationState({
        activeView: activeView.value,
        settingsOpen: settingsOpen.value,
      })
    }

    const response = await sendBackgroundMessage({
      type: 'OPEN_DETACHED_WORKSPACE',
    })

    if (!response.success) {
      workspaceError.value = response.error
    }
  } catch (error) {
    workspaceError.value =
      error instanceof Error ? error.message : 'Unable to open the detached workspace.'
  } finally {
    workspaceLoading.value = false
  }
}

function attachWorkspace(): void {
  window.close()
}
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--detached': windowMode === 'detached' }">
    <mm-header
      :mode="settingsOpen ? 'settings' : 'main'"
      :window-mode="windowMode"
      @settings="settingsOpen = true"
      @back="settingsOpen = false"
      @detach="detachWorkspace"
      @attach="attachWorkspace"
    />

    <p v-if="workspaceError" class="workspace-error" role="alert">
      {{ workspaceError }}
    </p>

    <mm-navigation v-if="!settingsOpen" :active-view="activeView" @navigate="activeView = $event" />

    <main class="app-content" :class="{ 'app-content--settings': settingsOpen }">
      <settings-view v-if="settingsOpen" />

      <mm-request-view v-else-if="activeView === 'requests'" />

      <mm-up-next-view v-else-if="activeView === 'up-next'" />

      <mm-calendar-view v-else-if="activeView === 'calendar'" />

      <mm-downloads-view v-else-if="activeView === 'downloads'" />
    </main>

    <mm-footer :version="version" />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 480px;
}

.app-shell--detached {
  height: 100vh;
}

.app-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--space-5);
}

.app-content--settings {
  padding: 0;
}

.workspace-error {
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  color: var(--danger);
  font-size: var(--font-size-sm);
}
</style>
