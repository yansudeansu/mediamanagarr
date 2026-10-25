<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MmSettingsTemplate from '../components/templates/MmSettingsTemplate/MmSettingsTemplate.vue'
import MmServiceSelector from '../components/organisms/MmServiceSelector/MmServiceSelector.vue'
import MmServiceForm from '../components/organisms/MmServiceForm/MmServiceForm.vue'
import {
  SERVICES,
  SERVICE_INFO,
  type SafeServiceConfigs,
  type ServiceId,
  type ServiceState,
} from '../types/service'
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
const statuses = ref<Partial<Record<ServiceId, ServiceState>>>({})
const loadingServices = ref<Partial<Record<ServiceId, boolean>>>({})
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
const removing = computed(() => removingServices.value[selectedService.value] ?? false)
const error = computed(() => serviceErrors.value[selectedService.value] ?? '')
const success = computed(() => serviceSuccesses.value[selectedService.value] ?? '')

function getErrorMessage(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'An unexpected error occurred.'
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
    removingServices.value.jellyfin ||
    loadingServices.value.jellyfin ||
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
      statuses.value[serviceId] = response.configs[serviceId]?.configured
        ? 'configured'
        : 'not-configured'
    }

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

  if (loadingServices.value[serviceId] || removingServices.value[serviceId]) {
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
    serviceSuccesses.value[serviceId] = `Connected to ${SERVICE_INFO[serviceId].name} successfully.`

    if (serviceId === 'jellyfin') {
      await loadJellyfinUsers()
    }
  } catch (caught) {
    statuses.value[serviceId] = 'failed'
    serviceErrors.value[serviceId] = getErrorMessage(caught)
  } finally {
    loadingServices.value[serviceId] = false
  }
}

async function removeService(serviceId: ServiceId): Promise<void> {
  if (
    loadingServices.value[serviceId] ||
    removingServices.value[serviceId] ||
    !configs.value[serviceId]?.configured
  ) {
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

    // Update local state only after background removal succeeds.
    delete configs.value[serviceId]

    statuses.value[serviceId] = 'not-configured'

    if (serviceId === 'jellyfin') {
      clearJellyfinUsers()
    }

    serviceSuccesses.value[serviceId] =
      `${SERVICE_INFO[serviceId].name} server removed successfully.`
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
        :removing="removing"
        :error="error"
        :success="success"
        :jellyfin-users="jellyfinUsers"
        :jellyfin-user-id="jellyfinUserId"
        :jellyfin-users-loading="jellyfinUsersLoading"
        :jellyfin-user-saving="jellyfinUserSaving"
        :jellyfin-users-error="jellyfinUsersError"
        :jellyfin-user-success="jellyfinUserSuccess"
        @connect="connectService"
        @remove="removeService"
        @edit="clearConnectionFeedback(selectedService)"
        @select-jellyfin-user="selectJellyfinUser"
      />
    </template>
  </mm-settings-template>
</template>
