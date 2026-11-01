<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
  serviceId: ServiceId
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

const selectedUrl = computed(() => configs.value[selectedService.value]?.url ?? '')
const configured = computed(() => configs.value[selectedService.value]?.configured ?? false)
const loading = computed(() => loadingServices.value[selectedService.value] ?? false)
const testing = computed(() => testingServices.value[selectedService.value] ?? false)
const removing = computed(() => removingServices.value[selectedService.value] ?? false)
const error = computed(() => serviceErrors.value[selectedService.value] ?? '')
const success = computed(() => serviceSuccesses.value[selectedService.value] ?? '')
const selectedHealth = computed(() => healthStates.value[selectedService.value])

function selectSection(value: string): void {
  if (value === 'connections' || value === 'workspace') {
    activeSection.value = value
  }
}

function getErrorMessage(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'An unexpected error occurred.'
}

async function loadWorkspacePreferences(): Promise<void> {
  workspaceLoading.value = true
  workspaceError.value = ''

  try {
    const preferences = await getWorkspacePreferences()
    workspaceMode.value = preferences.defaultMode
  } catch (caught) {
    workspaceError.value = getErrorMessage(caught)
  } finally {
    workspaceLoading.value = false
  }
}

async function updateWorkspaceMode(value: string): Promise<void> {
  if (!isWorkspaceMode(value) || workspaceSaving.value || workspaceLoading.value) {
    return
  }

  const previousMode = workspaceMode.value

  if (value === previousMode) {
    return
  }

  workspaceMode.value = value
  workspaceSaving.value = true
  workspaceError.value = ''
  workspaceSuccess.value = ''

  try {
    await saveWorkspacePreferences({
      defaultMode: value,
    })

    workspaceSuccess.value = 'Default workspace saved.'
  } catch (caught) {
    workspaceMode.value = previousMode
    workspaceError.value = getErrorMessage(caught)
  } finally {
    workspaceSaving.value = false
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
  const response = await sendBackgroundMessage({
    type: 'GET_SERVICE_HEALTH',
  })

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
    console.warn(`MediaManagarr: Unable to load service health for ${serviceId}:`, caught)
  }
}

async function loadJellyfinUsers(): Promise<void> {
  if (!configs.value.jellyfin?.configured) {
    clearJellyfinUsers()
    return
  }

  jellyfinUsersLoading.value = true
  clearJellyfinUserFeedback()

  try {
    const response = await sendBackgroundMessage({
      type: 'GET_JELLYFIN_USERS',
    })

    if (!response.success) {
      throw new Error(response.error)
    }

    jellyfinUsers.value = response.users
    jellyfinUserId.value = response.selectedUserId
  } catch (caught) {
    jellyfinUsers.value = []
    jellyfinUserId.value = ''
    jellyfinUsersError.value = getErrorMessage(caught)
  } finally {
    jellyfinUsersLoading.value = false
  }
}

async function selectJellyfinUser(userId: string): Promise<void> {
  if (
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

    if (!response.success) {
      throw new Error(response.error)
    }

    jellyfinUserId.value = response.userId
    jellyfinUserSuccess.value = 'Jellyfin user saved successfully.'
  } catch (caught) {
    jellyfinUsersError.value = getErrorMessage(caught)
  } finally {
    jellyfinUserSaving.value = false
  }
}

async function loadConfigs(): Promise<void> {
  try {
    const response = await sendBackgroundMessage({
      type: 'GET_SERVICE_CONFIGS',
    })

    if (!response.success) {
      throw new Error(response.error)
    }

    configs.value = response.configs

    for (const serviceId of SERVICES) {
      updateServiceStatus(serviceId)
    }

    await refreshHealthSafely(selectedService.value)

    if (response.configs.jellyfin?.configured) {
      await loadJellyfinUsers()
    } else {
      clearJellyfinUsers()
    }
  } catch (caught) {
    serviceErrors.value[selectedService.value] = getErrorMessage(caught)
  }
}

async function connectService(payload: ConnectPayload): Promise<void> {
  const { serviceId } = payload

  if (isServiceBusy(serviceId)) {
    return
  }

  loadingServices.value[serviceId] = true
  clearConnectionFeedback(serviceId)

  if (serviceId === 'jellyfin') {
    clearJellyfinUserFeedback()
  }

  try {
    const normalizedUrl = normalizeServerUrl(payload.url)
    const permission = getHostPermission(normalizedUrl)

    // Keep the permission request in the direct user gesture.
    const granted = await chrome.permissions.request({
      origins: [permission],
    })

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

    if (serviceId === 'jellyfin') {
      await loadJellyfinUsers()
    }
  } catch (caught) {
    updateServiceStatus(serviceId)

    if (!configs.value[serviceId]?.configured) {
      statuses.value[serviceId] = 'failed'
    }

    serviceErrors.value[serviceId] = getErrorMessage(caught)
  } finally {
    loadingServices.value[serviceId] = false
  }
}

async function testConnection(serviceId: ServiceId): Promise<void> {
  if (isServiceBusy(serviceId) || !configs.value[serviceId]?.configured) {
    return
  }

  testingServices.value[serviceId] = true
  clearConnectionFeedback(serviceId)

  try {
    const response = await sendBackgroundMessage({
      type: 'TEST_SERVICE_CONNECTION',
      serviceId,
    })

    if (!response.success) {
      throw new Error(response.error)
    }

    statuses.value[serviceId] = 'connected'
    serviceSuccesses.value[serviceId] =
      `Connected to ${SERVICE_REGISTRY[serviceId].name} successfully.`
  } catch (caught) {
    statuses.value[serviceId] = 'failed'
    serviceErrors.value[serviceId] = getErrorMessage(caught)
  } finally {
    await refreshHealthSafely(serviceId)
    testingServices.value[serviceId] = false
  }
}

async function removeService(serviceId: ServiceId): Promise<void> {
  if (isServiceBusy(serviceId) || !configs.value[serviceId]?.configured) {
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
    serviceErrors.value[serviceId] = getErrorMessage(caught)
  } finally {
    removingServices.value[serviceId] = false
  }
}

onMounted(() => {
  void loadConfigs()
  void loadWorkspacePreferences()
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

      <mm-service-selector v-model="selectedService" :statuses="statuses" />

      <mm-service-form
        :service-id="selectedService"
        :url="selectedUrl"
        :configured="configured"
        :loading="loading"
        :testing="testing"
        :removing="removing"
        :error="error"
        :success="success"
        :health="selectedHealth"
        :jellyfin-users="jellyfinUsers"
        :jellyfin-user-id="jellyfinUserId"
        :jellyfin-users-loading="jellyfinUsersLoading"
        :jellyfin-user-saving="jellyfinUserSaving"
        :jellyfin-users-error="jellyfinUsersError"
        :jellyfin-user-success="jellyfinUserSuccess"
        @connect="connectService"
        @test-connection="testConnection"
        @remove="removeService"
        @edit="clearConnectionFeedback(selectedService)"
        @select-jellyfin-user="selectJellyfinUser"
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
