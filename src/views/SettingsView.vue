<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import MmSettingsTemplate from '../components/templates/MmSettingsTemplate/MmSettingsTemplate.vue'
import MmServiceSelector from '../components/organisms/MmServiceSelector/MmServiceSelector.vue'
import MmServiceForm from '../components/organisms/MmServiceForm/MmServiceForm.vue'
import MmTabs from '../components/molecules/MmTabs/MmTabs.vue'
import type { TabItem } from '../components/molecules/MmTabs/MmTabs.vue'
import MmSelect from '../components/atoms/MmSelect/MmSelect.vue'
import MmButton from '../components/atoms/MmButton/MmButton.vue'
import MmPanel from '../components/atoms/MmPanel/MmPanel.vue'
import {
  type SafeServiceConfigs,
  type ServiceHealthStates,
  type ServiceId,
  type ServiceState,
} from '../types/service'
import { SERVICES, SERVICE_REGISTRY } from '../services/registry'
import type { JellyfinUser } from '../types/jellyfin'
import type { WorkspaceMode } from '../types/workspace'
import { DEFAULT_WORKSPACE_PREFERENCES, isWorkspaceMode } from '../types/workspace'
import { sendBackgroundMessage } from '../utils/background-messaging'
import { getHostPermission, normalizeServerUrl } from '../utils/service-config'
import { getWorkspacePreferences, saveWorkspacePreferences } from '../utils/workspace-storage'

interface ConnectPayload {
  url: string
  apiKey: string
}

type SettingsSection = 'connections' | 'workspace'

const emit = defineEmits<{
  'open-sidebar': []
  'open-detached': []
}>()

const activeSection = ref<SettingsSection>('connections')

const settingsTabs: TabItem[] = [
  { id: 'connections', label: 'Connections' },
  { id: 'workspace', label: 'Workspace' },
]

const workspaceOptions = [
  { label: 'Popup', value: 'popup' },
  { label: 'Sidebar', value: 'sidebar' },
  { label: 'Detached window', value: 'detached' },
]

const workspaceMode = ref<WorkspaceMode>(DEFAULT_WORKSPACE_PREFERENCES.defaultMode)
const workspaceLoading = ref(true)
const workspaceSaving = ref(false)
const workspaceError = ref('')
const workspaceSuccess = ref('')

const selectedService = ref<ServiceId>('jellyfin')

const configs = ref<SafeServiceConfigs>({})
const healthStates = ref<ServiceHealthStates>({})
const statuses = ref<Partial<Record<ServiceId, ServiceState>>>({})
const loadingServices = ref<Partial<Record<ServiceId, boolean>>>({})
const testingServices = ref<Partial<Record<ServiceId, boolean>>>({})
const removingServices = ref<Partial<Record<ServiceId, boolean>>>({})
const serviceErrors = ref<Partial<Record<ServiceId, string>>>({})
const serviceSuccesses = ref<Partial<Record<ServiceId, string>>>({})

const jellyfinUsers = ref<JellyfinUser[]>([])
const jellyfinUserId = ref('')
const jellyfinUsersLoading = ref(false)
const jellyfinUserSaving = ref(false)
const jellyfinUsersError = ref('')
const jellyfinUserSuccess = ref('')

// The parent owns the registry and maps domain-specific service
// state into the generic selector's presentational contract.
const serviceSelectorItems = computed(() =>
  SERVICES.map((serviceId) => ({
    id: serviceId,
    name: SERVICE_REGISTRY[serviceId].name,
    status: statuses.value[serviceId] ?? 'not-configured',
  })),
)

const selectedUrl = computed(() => configs.value[selectedService.value]?.url ?? '')
const configured = computed(() => configs.value[selectedService.value]?.configured ?? false)
const loading = computed(() => loadingServices.value[selectedService.value] ?? false)
const testing = computed(() => testingServices.value[selectedService.value] ?? false)
const removing = computed(() => removingServices.value[selectedService.value] ?? false)
const error = computed(() => serviceErrors.value[selectedService.value] ?? '')
const success = computed(() => serviceSuccesses.value[selectedService.value] ?? '')
const selectedHealth = computed(() => healthStates.value[selectedService.value])
const selectedServiceName = computed(() => SERVICE_REGISTRY[selectedService.value].name)

// A configured service may reuse its saved key only for its saved URL.
// The background connection handler remains responsible for enforcing this.
const canReuseSavedKey = computed(() => configured.value && Boolean(selectedUrl.value.trim()))

const healthStatus = computed<'connected' | 'failed' | 'not-checked'>(() => {
  const status = selectedHealth.value?.status

  return status === 'connected' || status === 'failed' ? status : 'not-checked'
})

const healthLastCheckedLabel = computed(() => {
  const timestamp = selectedHealth.value?.lastCheckedAt

  if (!timestamp) return ''

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
})

const healthError = computed(() => selectedHealth.value?.error ?? '')

const showJellyfinUsers = computed(() => selectedService.value === 'jellyfin')

const jellyfinUserOptions = computed(() =>
  jellyfinUsers.value.map((user) => ({
    label: user.name,
    value: user.id,
  })),
)

let isUnmounted = false
let healthRequestSequence = 0
let jellyfinUsersRequestSequence = 0

function selectSection(value: string): void {
  if (value === 'connections' || value === 'workspace') {
    activeSection.value = value
  }
}

function selectService(value: string): void {
  // The generic selector emits strings. Only registered service IDs
  // are permitted to enter this view's domain-specific state.
  const serviceId = SERVICES.find((id) => id === value)

  if (serviceId !== undefined) {
    selectedService.value = serviceId
  }
}

function getErrorMessage(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'An unexpected error occurred.'
}

async function loadWorkspacePreferences(): Promise<void> {
  if (isUnmounted) return

  workspaceLoading.value = true
  workspaceError.value = ''
  workspaceSuccess.value = ''

  try {
    const preferences = await getWorkspacePreferences()

    if (isUnmounted) return

    workspaceMode.value = preferences.defaultMode
  } catch (caught) {
    if (!isUnmounted) {
      workspaceError.value = getErrorMessage(caught)
    }
  } finally {
    if (!isUnmounted) {
      workspaceLoading.value = false
    }
  }
}

async function updateWorkspaceMode(value: string): Promise<void> {
  if (isUnmounted || !isWorkspaceMode(value) || workspaceSaving.value || workspaceLoading.value) {
    return
  }

  const previousMode = workspaceMode.value

  if (value === previousMode) return

  workspaceMode.value = value
  workspaceSaving.value = true
  workspaceError.value = ''
  workspaceSuccess.value = ''

  try {
    await saveWorkspacePreferences({
      defaultMode: value,
    })

    if (isUnmounted) return

    workspaceSuccess.value = 'Default workspace saved.'
  } catch (caught) {
    if (isUnmounted) return

    workspaceMode.value = previousMode
    workspaceError.value = getErrorMessage(caught)
  } finally {
    if (!isUnmounted) {
      workspaceSaving.value = false
    }
  }
}

function openSidebar(): void {
  emit('open-sidebar')
}

function openDetached(): void {
  emit('open-detached')
}

function isServiceBusy(serviceId: ServiceId): boolean {
  return Boolean(
    loadingServices.value[serviceId] ||
    testingServices.value[serviceId] ||
    removingServices.value[serviceId],
  )
}

function clearConnectionFeedback(serviceId: ServiceId): void {
  serviceErrors.value[serviceId] = ''
  serviceSuccesses.value[serviceId] = ''
}

function clearJellyfinUserFeedback(): void {
  jellyfinUsersError.value = ''
  jellyfinUserSuccess.value = ''
}

function clearJellyfinUsers(): void {
  jellyfinUsersRequestSequence += 1
  jellyfinUsersLoading.value = false
  jellyfinUsers.value = []
  jellyfinUserId.value = ''
  clearJellyfinUserFeedback()
}

function updateServiceStatus(serviceId: ServiceId): void {
  if (!configs.value[serviceId]?.configured) {
    statuses.value[serviceId] = 'not-configured'
    return
  }

  const health = healthStates.value[serviceId]

  statuses.value[serviceId] =
    health?.status === 'connected' || health?.status === 'failed' ? health.status : 'configured'
}

async function loadHealth(): Promise<void> {
  if (isUnmounted) return

  const sequence = ++healthRequestSequence

  const response = await sendBackgroundMessage({
    type: 'GET_SERVICE_HEALTH',
  })

  if (isUnmounted || sequence !== healthRequestSequence) return

  if (!response.success) {
    throw new Error(response.error)
  }

  healthStates.value = response.health

  for (const serviceId of SERVICES) {
    updateServiceStatus(serviceId)
  }
}

async function refreshHealthSafely(serviceId: ServiceId): Promise<void> {
  try {
    await loadHealth()
  } catch (caught) {
    if (!isUnmounted) {
      console.warn(`MediaManagarr: Unable to load service health for ${serviceId}:`, caught)
    }
  }
}

async function loadJellyfinUsers(): Promise<void> {
  if (isUnmounted) return

  if (!configs.value.jellyfin?.configured) {
    clearJellyfinUsers()
    return
  }

  const sequence = ++jellyfinUsersRequestSequence

  jellyfinUsersLoading.value = true
  clearJellyfinUserFeedback()

  try {
    const response = await sendBackgroundMessage({
      type: 'GET_JELLYFIN_USERS',
    })

    if (isUnmounted || sequence !== jellyfinUsersRequestSequence) return

    if (!response.success) {
      throw new Error(response.error)
    }

    if (!configs.value.jellyfin?.configured) {
      clearJellyfinUsers()
      return
    }

    jellyfinUsers.value = response.users
    jellyfinUserId.value = response.selectedUserId
  } catch (caught) {
    if (isUnmounted || sequence !== jellyfinUsersRequestSequence) return

    jellyfinUsers.value = []
    jellyfinUserId.value = ''
    jellyfinUsersError.value = getErrorMessage(caught)
  } finally {
    if (!isUnmounted && sequence === jellyfinUsersRequestSequence) {
      jellyfinUsersLoading.value = false
    }
  }
}

async function selectJellyfinUser(userId: string): Promise<void> {
  if (
    isUnmounted ||
    jellyfinUserSaving.value ||
    jellyfinUsersLoading.value ||
    isServiceBusy('jellyfin') ||
    !configs.value.jellyfin?.configured
  ) {
    return
  }

  jellyfinUserSaving.value = true
  clearJellyfinUserFeedback()

  try {
    const response = await sendBackgroundMessage({
      type: 'SET_JELLYFIN_USER',
      userId,
    })

    if (isUnmounted) return

    if (!response.success) {
      throw new Error(response.error)
    }

    jellyfinUserId.value = response.userId
    jellyfinUserSuccess.value = 'Jellyfin user saved successfully.'
  } catch (caught) {
    if (!isUnmounted) {
      jellyfinUsersError.value = getErrorMessage(caught)
    }
  } finally {
    if (!isUnmounted) {
      jellyfinUserSaving.value = false
    }
  }
}

async function loadConfigs(): Promise<void> {
  if (isUnmounted) return

  try {
    const response = await sendBackgroundMessage({
      type: 'GET_SERVICE_CONFIGS',
    })

    if (isUnmounted) return

    if (!response.success) {
      throw new Error(response.error)
    }

    configs.value = response.configs

    for (const serviceId of SERVICES) {
      updateServiceStatus(serviceId)
    }

    await refreshHealthSafely(selectedService.value)

    if (isUnmounted) return

    if (configs.value.jellyfin?.configured) {
      await loadJellyfinUsers()
    } else {
      clearJellyfinUsers()
    }
  } catch (caught) {
    if (!isUnmounted) {
      serviceErrors.value[selectedService.value] = getErrorMessage(caught)
    }
  }
}

async function connectService(serviceId: ServiceId, payload: ConnectPayload): Promise<void> {
  if (isUnmounted || isServiceBusy(serviceId)) return

  loadingServices.value[serviceId] = true
  clearConnectionFeedback(serviceId)

  if (serviceId === 'jellyfin') {
    clearJellyfinUserFeedback()
  }

  try {
    const normalizedUrl = normalizeServerUrl(payload.url)
    const savedConfig = configs.value[serviceId]

    // Never reuse a saved API key for a different server.
    if (!payload.apiKey.trim()) {
      if (!savedConfig?.configured || !savedConfig.url) {
        throw new Error('Enter an API key.')
      }

      if (normalizeServerUrl(savedConfig.url) !== normalizedUrl) {
        throw new Error('Enter an API key for the new server URL.')
      }
    }

    const permission = getHostPermission(normalizedUrl)

    // Keep the permission request in the direct user gesture.
    const granted = await chrome.permissions.request({
      origins: [permission],
    })

    if (isUnmounted) return

    if (!granted) {
      throw new Error('Server access was not granted.')
    }

    const response = await sendBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId,
      config: {
        url: normalizedUrl,
        apiKey: payload.apiKey,
      },
    })

    if (isUnmounted) return

    if (!response.success) {
      throw new Error(response.error)
    }

    configs.value[serviceId] = {
      url: normalizedUrl,
      configured: true,
    }

    statuses.value[serviceId] = 'connected'
    serviceSuccesses.value[serviceId] =
      `Connected to ${SERVICE_REGISTRY[serviceId].name} successfully.`

    await refreshHealthSafely(serviceId)

    if (isUnmounted) return

    if (serviceId === 'jellyfin') {
      await loadJellyfinUsers()
    }
  } catch (caught) {
    if (isUnmounted) return

    updateServiceStatus(serviceId)

    if (!configs.value[serviceId]?.configured) {
      statuses.value[serviceId] = 'failed'
    }

    serviceErrors.value[serviceId] = getErrorMessage(caught)
  } finally {
    if (!isUnmounted) {
      loadingServices.value[serviceId] = false
    }
  }
}

async function testConnection(serviceId: ServiceId): Promise<void> {
  if (isUnmounted || isServiceBusy(serviceId) || !configs.value[serviceId]?.configured) {
    return
  }

  testingServices.value[serviceId] = true
  clearConnectionFeedback(serviceId)

  try {
    const response = await sendBackgroundMessage({
      type: 'TEST_SERVICE_CONNECTION',
      serviceId,
    })

    if (isUnmounted) return

    if (!response.success) {
      throw new Error(response.error)
    }

    statuses.value[serviceId] = 'connected'
    serviceSuccesses.value[serviceId] =
      `Connected to ${SERVICE_REGISTRY[serviceId].name} successfully.`
  } catch (caught) {
    if (isUnmounted) return

    statuses.value[serviceId] = 'failed'
    serviceErrors.value[serviceId] = getErrorMessage(caught)
  } finally {
    if (!isUnmounted) {
      await refreshHealthSafely(serviceId)
      if (!isUnmounted) {
        testingServices.value[serviceId] = false
      }
    }
  }
}

async function removeService(serviceId: ServiceId): Promise<void> {
  if (isUnmounted || isServiceBusy(serviceId) || !configs.value[serviceId]?.configured) {
    return
  }

  if (serviceId === 'jellyfin' && (jellyfinUserSaving.value || jellyfinUsersLoading.value)) {
    return
  }

  removingServices.value[serviceId] = true
  clearConnectionFeedback(serviceId)

  if (serviceId === 'jellyfin') {
    clearJellyfinUserFeedback()
  }

  try {
    const response = await sendBackgroundMessage({
      type: 'REMOVE_SERVICE',
      serviceId,
    })

    if (isUnmounted) return

    if (!response.success) {
      throw new Error(response.error)
    }

    delete configs.value[serviceId]
    delete healthStates.value[serviceId]

    statuses.value[serviceId] = 'not-configured'

    if (serviceId === 'jellyfin') {
      clearJellyfinUsers()
    }

    serviceSuccesses.value[serviceId] =
      `${SERVICE_REGISTRY[serviceId].name} server removed successfully.`

    await refreshHealthSafely(serviceId)
  } catch (caught) {
    if (!isUnmounted) {
      serviceErrors.value[serviceId] = getErrorMessage(caught)
    }
  } finally {
    if (!isUnmounted) {
      removingServices.value[serviceId] = false
    }
  }
}

onMounted(() => {
  void loadConfigs()
  void loadWorkspacePreferences()
})

onBeforeUnmount(() => {
  isUnmounted = true
  healthRequestSequence += 1
  jellyfinUsersRequestSequence += 1
})
</script>

<template>
  <mm-settings-template>
    <template #navigation>
      <mm-tabs
        :model-value="activeSection"
        :items="settingsTabs"
        label="Settings sections"
        @update:model-value="selectSection"
      />
    </template>

    <section
      v-if="activeSection === 'connections'"
      class="settings-section"
      aria-labelledby="service-connections-title"
    >
      <h2 id="service-connections-title" class="settings-section__title">Service Connections</h2>

      <mm-service-selector
        :model-value="selectedService"
        :services="serviceSelectorItems"
        @update:model-value="selectService"
      />

      <mm-service-form
        :key="selectedService"
        :name="selectedServiceName"
        :url="selectedUrl"
        :configured="configured"
        :loading="loading"
        :testing="testing"
        :removing="removing"
        :error="error"
        :success="success"
        :health-status="healthStatus"
        :health-last-checked-label="healthLastCheckedLabel"
        :health-error="healthError"
        :can-reuse-saved-key="canReuseSavedKey"
        :user-selection-label="showJellyfinUsers ? 'Jellyfin User' : ''"
        :user-selection-hint="
          showJellyfinUsers ? 'Select the Jellyfin user whose library should be displayed.' : ''
        "
        :user-options="showJellyfinUsers ? jellyfinUserOptions : []"
        :selected-user-id="showJellyfinUsers ? jellyfinUserId : ''"
        :users-loading="showJellyfinUsers && jellyfinUsersLoading"
        :user-saving="showJellyfinUsers && jellyfinUserSaving"
        :users-error="showJellyfinUsers ? jellyfinUsersError : ''"
        :user-success="showJellyfinUsers ? jellyfinUserSuccess : ''"
        :removal-note="showJellyfinUsers ? 'The selected Jellyfin user will also be cleared.' : ''"
        @connect="connectService(selectedService, $event)"
        @test-connection="testConnection(selectedService)"
        @remove="removeService(selectedService)"
        @edit="clearConnectionFeedback(selectedService)"
        @select-user="selectJellyfinUser"
      />
    </section>

    <section v-else class="settings-section" aria-labelledby="workspace-settings-title">
      <h2 id="workspace-settings-title" class="settings-section__title">Workspace</h2>

      <mm-panel aria-labelledby="workspace-settings-title">
        <mm-select
          :model-value="workspaceMode"
          label="Default workspace"
          :options="workspaceOptions"
          hint="Choose how MediaManagarr opens when you click its toolbar icon."
          :disabled="workspaceLoading || workspaceSaving"
          :loading="workspaceLoading"
          @update:model-value="updateWorkspaceMode"
        />

        <div class="settings-section__actions">
          <h3 class="settings-section__title">Open workspace</h3>

          <mm-button variant="secondary" block @click="openSidebar"> Open Sidebar </mm-button>

          <mm-button variant="secondary" block @click="openDetached">
            Open Detached Window
          </mm-button>
        </div>

        <p v-if="workspaceError" class="settings-section__error" role="alert">
          {{ workspaceError }}
        </p>

        <p v-if="workspaceSuccess" class="settings-section__success" role="status">
          {{ workspaceSuccess }}
        </p>
      </mm-panel>
    </section>
  </mm-settings-template>
</template>

<style scoped>
.settings-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}

.settings-section__title {
  margin: 0;
  color: var(--muted);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.settings-section__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.settings-section__error {
  margin: 0;
  color: var(--danger);
  font-size: var(--font-size-sm);
}

.settings-section__success {
  margin: 0;
  color: var(--success);
  font-size: var(--font-size-sm);
}
</style>
