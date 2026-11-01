<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import MmHeader from './components/atoms/MmHeader/MmHeader.vue'
import MmQuickAccess from './components/molecules/MmQuickAccess/MmQuickAccess.vue'
import type { QuickAccessItem } from './components/molecules/MmQuickAccess/MmQuickAccess.vue'
import MmNavigation from './components/molecules/MmNavigation/MmNavigation.vue'
import MmFooter from './components/atoms/MmFooter/MmFooter.vue'
import MmButton from './components/atoms/MmButton/MmButton.vue'
import mmLogo from './assets/mm-logo.svg'
import MmRequestView from './views/MmRequestView.vue'
import MmUpNextView from './views/MmUpNextView.vue'
import MmCalendarView from './views/MmCalendarView.vue'
import MmDownloadsView from './views/MmDownloadsView.vue'
import SettingsView from './views/SettingsView.vue'
import { getAvailableNavigationItems } from './navigation/features'
import { SERVICE_REGISTRY, SERVICES } from './services/registry'
import { sendBackgroundMessage } from './utils/background-messaging'
import { normalizeServerUrl } from './utils/service-config'
import { openWorkspaceSidebar } from './utils/workspace-sidebar'
import { getSafeServiceConfigs } from './utils/service-storage'
import { getAppVersion } from './utils/version'
import { getWorkspaceNavigationState, saveWorkspaceNavigationState } from './utils/workspace-state'
import type { NavigationView } from './utils/workspace-state'
import type { SafeServiceConfigs } from './types/service'
import type { WorkspaceMode } from './types/workspace'

const settingsOpen = ref(false)
const activeView = ref<NavigationView>('requests')
const safeServices = ref<SafeServiceConfigs>({})

const navigationItems = computed(() => getAvailableNavigationItems(safeServices.value))

const quickAccessItems = computed<QuickAccessItem[]>(() =>
  SERVICES.flatMap((serviceId) => {
    const config = safeServices.value[serviceId]

    if (!config?.configured) {
      return []
    }

    try {
      return [
        {
          id: serviceId,
          label: SERVICE_REGISTRY[serviceId].name,
          href: normalizeServerUrl(config.url),
        },
      ]
    } catch {
      return []
    }
  }),
)

const servicesReady = ref(false)
const workspaceStateReady = ref(false)

const navigationReady = computed(() => workspaceStateReady.value && servicesReady.value)

const availableActiveView = computed<NavigationView | null>(() => {
  if (!navigationReady.value) return null

  const available = navigationItems.value

  if (available.some((item) => item.id === activeView.value)) {
    return activeView.value
  }

  return (available[0]?.id as NavigationView | undefined) ?? null
})

const workspaceParameter = new URLSearchParams(window.location.search).get('workspace')

const windowMode = ref<WorkspaceMode>(
  workspaceParameter === 'detached'
    ? 'detached'
    : workspaceParameter === 'sidebar'
      ? 'sidebar'
      : 'popup',
)

const workspaceError = ref('')
const workspaceLoading = ref(false)

const version = getAppVersion()

let serviceLoadVersion = 0
let isUnmounted = false

// Navigation writes run sequentially so a stale write cannot
// overwrite a newer state in session storage.
let navigationSaveQueue: Promise<void> = Promise.resolve()

function hasWorkspaceStorage(): boolean {
  return (
    typeof chrome !== 'undefined' &&
    typeof chrome.storage?.session?.get === 'function' &&
    typeof chrome.storage?.session?.set === 'function'
  )
}

function hasServiceStorage(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage?.local
}

async function refreshSafeServices(): Promise<void> {
  if (isUnmounted) return

  const loadVersion = ++serviceLoadVersion

  if (!hasServiceStorage()) {
    safeServices.value = {}
    servicesReady.value = true
    return
  }

  try {
    const configs = await getSafeServiceConfigs()

    if (!isUnmounted && loadVersion === serviceLoadVersion) {
      safeServices.value = configs
    }
  } catch (error) {
    if (!isUnmounted && loadVersion === serviceLoadVersion) {
      console.warn('MediaManagarr: Unable to load safe service configurations:', error)
      safeServices.value = {}
    }
  } finally {
    if (!isUnmounted && loadVersion === serviceLoadVersion) {
      servicesReady.value = true
    }
  }
}

function handleStorageChange(
  changes: Record<string, chrome.storage.StorageChange>,
  areaName: string,
): void {
  if (isUnmounted || areaName !== 'local' || !changes.mediaManagarrServices) {
    return
  }

  void refreshSafeServices()
}

function saveNavigationState(): Promise<void> {
  if (isUnmounted || !workspaceStateReady.value || !hasWorkspaceStorage()) {
    return Promise.resolve()
  }

  // Capture the state when the save is requested, rather than
  // reading potentially different values when the queue runs.
  const state = {
    activeView: activeView.value,
    settingsOpen: settingsOpen.value,
  }

  const save = navigationSaveQueue.then(() => saveWorkspaceNavigationState(state))

  // Keep the queue usable even if an individual write fails.
  navigationSaveQueue = save.catch(() => undefined)

  return save
}

function queueNavigationSave(): void {
  void saveNavigationState().catch((error: unknown) => {
    if (!isUnmounted) {
      console.warn('MediaManagarr: Unable to save workspace navigation:', error)
    }
  })
}

onMounted(async () => {
  if (hasServiceStorage()) {
    void refreshSafeServices()
    chrome.storage.onChanged?.addListener(handleStorageChange)
  } else {
    servicesReady.value = true
  }

  try {
    if (hasWorkspaceStorage()) {
      const state = await getWorkspaceNavigationState()

      if (isUnmounted) return

      activeView.value = state.activeView
      settingsOpen.value = state.settingsOpen
    }
  } catch (error) {
    if (!isUnmounted) {
      console.warn('MediaManagarr: Unable to restore workspace navigation:', error)
    }
  } finally {
    if (!isUnmounted) {
      workspaceStateReady.value = true
    }
  }
})

onBeforeUnmount(() => {
  isUnmounted = true
  serviceLoadVersion += 1

  if (typeof chrome !== 'undefined') {
    chrome.storage?.onChanged?.removeListener(handleStorageChange)
  }
})

watch([activeView, settingsOpen], () => {
  if (!workspaceStateReady.value || isUnmounted) return

  queueNavigationSave()
})

function handleNavigate(view: string): void {
  if (navigationItems.value.some((item) => item.id === view)) {
    activeView.value = view as NavigationView
  }
}

async function detachWorkspace(): Promise<void> {
  if (isUnmounted || workspaceLoading.value) {
    return
  }

  workspaceError.value = ''
  workspaceLoading.value = true

  try {
    if (hasWorkspaceStorage()) {
      await saveNavigationState()

      if (isUnmounted) return
    }

    const response = await sendBackgroundMessage({
      type: 'OPEN_DETACHED_WORKSPACE',
    })

    if (isUnmounted) return

    if (!response.success) {
      workspaceError.value = response.error
    }
  } catch (error) {
    if (!isUnmounted) {
      workspaceError.value =
        error instanceof Error ? error.message : 'Unable to open the detached workspace.'
    }
  } finally {
    if (!isUnmounted) {
      workspaceLoading.value = false
    }
  }
}

async function openSidebar(): Promise<void> {
  if (isUnmounted || workspaceLoading.value) {
    return
  }

  workspaceError.value = ''
  workspaceLoading.value = true

  try {
    // Start the browser operation while the user gesture is still active.
    const sidebarPromise = openWorkspaceSidebar()

    if (hasWorkspaceStorage()) {
      try {
        await saveNavigationState()
      } catch (error) {
        if (!isUnmounted) {
          console.warn('MediaManagarr: Unable to save workspace navigation:', error)
        }
      }
    }

    // Always observe the sidebar operation, including if the view
    // unmounted while navigation state was being saved.
    await sidebarPromise

    if (isUnmounted) return

    window.close()
  } catch (error) {
    if (!isUnmounted) {
      workspaceError.value =
        error instanceof Error ? error.message : 'Unable to open the browser sidebar.'
    }
  } finally {
    if (!isUnmounted) {
      workspaceLoading.value = false
    }
  }
}
</script>

<template>
  <div
    class="app-shell"
    :class="{
      'app-shell--detached': windowMode === 'detached',
      'app-shell--sidebar': windowMode === 'sidebar',
    }"
  >
    <mm-header :title="settingsOpen ? 'Settings' : 'MediaManagarr'" :logo="mmLogo">
      <template #actions>
        <mm-button
          v-if="settingsOpen"
          variant="secondary"
          icon="arrow-left"
          icon-only
          aria-label="Back to previous view"
          title="Back to previous view"
          @click="settingsOpen = false"
        />

        <mm-quick-access v-else :items="quickAccessItems" @settings="settingsOpen = true" />
      </template>
    </mm-header>

    <p v-if="workspaceError" class="workspace-error" role="alert">
      {{ workspaceError }}
    </p>

    <mm-navigation
      v-if="!settingsOpen && navigationReady && navigationItems.length > 1"
      :active-view="availableActiveView ?? ''"
      :items="navigationItems"
      @navigate="handleNavigate"
    />

    <main class="app-content" :class="{ 'app-content--settings': settingsOpen }">
      <settings-view
        v-if="settingsOpen"
        @open-sidebar="openSidebar"
        @open-detached="detachWorkspace"
      />

      <template v-else-if="navigationReady">
        <mm-request-view v-if="availableActiveView === 'requests'" />

        <mm-up-next-view
          v-else-if="availableActiveView === 'up-next'"
          :jellyfin-url="safeServices.jellyfin?.url"
        />

        <mm-calendar-view v-else-if="availableActiveView === 'calendar'" />

        <mm-downloads-view v-else-if="availableActiveView === 'downloads'" />

        <div v-else class="empty-navigation">
          <p>No services configured yet.</p>
          <p>Configure a service in Settings to get started.</p>
          <mm-button variant="primary" @click="settingsOpen = true"> Open Settings </mm-button>
        </div>
      </template>
    </main>

    <mm-footer brand="MediaManagarr" :version="version" />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 480px;
}

.app-shell--detached,
.app-shell--sidebar {
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

.empty-navigation {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
}

.empty-navigation p {
  margin: 0;
}
</style>
