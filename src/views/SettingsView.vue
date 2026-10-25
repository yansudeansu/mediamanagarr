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

const selectedStatus = computed(() => statuses.value[selectedService.value] ?? 'not-configured')

const selectedUrl = computed(() => configs.value[selectedService.value]?.url ?? '')

const configured = computed(() => selectedStatus.value !== 'not-configured')

const loading = computed(() => loadingServices.value[selectedService.value] ?? false)

const error = computed(() => serviceErrors.value[selectedService.value] ?? '')

function getErrorMessage(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'An unexpected error occurred.'
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
  } catch (caught) {
    serviceErrors.value[selectedService.value] = getErrorMessage(caught)
  }
}

async function connectService(payload: ConnectPayload): Promise<void> {
  const { serviceId } = payload

  if (loadingServices.value[serviceId]) {
    return
  }

  loadingServices.value[serviceId] = true
  serviceErrors.value[serviceId] = ''

  try {
    const normalizedUrl = normalizeServerUrl(payload.url)
    const permission = getHostPermission(normalizedUrl)

    // Request permission directly from the user's Connect & Test action.
    // Firefox requires this call to retain the user gesture.
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
        @connect="connectService"
      />
    </template>
  </mm-settings-template>
</template>
