<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MmSettingsTemplate from '../components/templates/MmSettingsTemplate/MmSettingsTemplate.vue'
import MmServiceSelector from '../components/organisms/MmServiceSelector/MmServiceSelector.vue'
import MmServiceForm from '../components/organisms/MmServiceForm/MmServiceForm.vue'
import {
  type SafeServiceConfigs,
  type ServiceHealthStates,
  type ServiceId,
  type ServiceState,
} from '../types/service'
import { SERVICES, SERVICE_REGISTRY } from '../services/registry'
import type { JellyfinUser } from '../types/jellyfin'
import { sendBackgroundMessage } from '../utils/background-messaging'
import { getHostPermission, normalizeServerUrl } from '../utils/service-config'

interface ConnectPayload {
  serviceId: ServiceId
  url: string
  apiKey: string
}

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

function getErrorMessage(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'An unexpected error occurred.'
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

    // The background has tested and saved this configuration.
    statuses.value[serviceId] = 'connected'
    serviceSuccesses.value[serviceId] =
      `Connected to ${SERVICE_REGISTRY[serviceId].name} successfully.`

    await refreshHealthSafely(serviceId)

    if (serviceId === 'jellyfin') {
      await loadJellyfinUsers()
    }
  } catch (caught) {
    // A failed edit must not erase the health of an existing saved connection.
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
    // A failed test changes health, not the saved configuration.
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
})
</script>

<template>
  <mm-settings-template>
    <template #selector>
      <mm-service-selector v-model="selectedService" :statuses="statuses" />
    </template>

    <template #configuration>
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
    </template>
  </mm-settings-template>
</template>
