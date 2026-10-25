<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MmSettingsTemplate from '../components/templates/MmSettingsTemplate/MmSettingsTemplate.vue'
import MmServiceSelector from '../components/organisms/MmServiceSelector/MmServiceSelector.vue'
import MmServiceForm from '../components/organisms/MmServiceForm/MmServiceForm.vue'
import {
  SERVICES,
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
const serviceErrors = ref<Partial<Record<ServiceId, string>>>({})

const jellyfinUsers = ref<JellyfinUser[]>([])
const jellyfinUserId = ref('')
const jellyfinUsersLoading = ref(false)
const jellyfinUserSaving = ref(false)
const jellyfinUsersError = ref('')

const selectedUrl = computed(() => configs.value[selectedService.value]?.url ?? '')
const configured = computed(() => configs.value[selectedService.value]?.configured ?? false)
const loading = computed(() => loadingServices.value[selectedService.value] ?? false)
const error = computed(() => serviceErrors.value[selectedService.value] ?? '')

function getErrorMessage(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'An unexpected error occurred.'
}

async function loadJellyfinUsers(): Promise<void> {
  if (!configs.value.jellyfin?.configured) {
    jellyfinUsers.value = []
    jellyfinUserId.value = ''
    return
  }

  jellyfinUsersLoading.value = true
  jellyfinUsersError.value = ''

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
  if (jellyfinUserSaving.value || jellyfinUsersLoading.value) return

  jellyfinUserSaving.value = true
  jellyfinUsersError.value = ''

  try {
    const response = await sendBackgroundMessage({
      type: 'SET_JELLYFIN_USER',
      userId,
    })

    if (!response.success) {
      throw new Error(response.error)
    }

    jellyfinUserId.value = response.userId
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
    }
  } catch (caught) {
    serviceErrors.value[selectedService.value] = getErrorMessage(caught)
  }
}

async function connectService(payload: ConnectPayload): Promise<void> {
  const { serviceId } = payload

  if (loadingServices.value[serviceId]) return

  loadingServices.value[serviceId] = true
  serviceErrors.value[serviceId] = ''

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
        :error="error"
        :jellyfin-users="jellyfinUsers"
        :jellyfin-user-id="jellyfinUserId"
        :jellyfin-users-loading="jellyfinUsersLoading"
        :jellyfin-user-saving="jellyfinUserSaving"
        :jellyfin-users-error="jellyfinUsersError"
        @connect="connectService"
        @select-jellyfin-user="selectJellyfinUser"
      />
    </template>
  </mm-settings-template>
</template>
