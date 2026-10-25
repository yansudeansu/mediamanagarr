<script setup lang="ts">
import { computed, ref } from 'vue'
import MmSettingsTemplate from '../components/templates/MmSettingsTemplate/MmSettingsTemplate.vue'
import MmServiceSelector from '../components/organisms/MmServiceSelector/MmServiceSelector.vue'
import MmServiceForm from '../components/organisms/MmServiceForm/MmServiceForm.vue'
import type { ServiceId, ServiceState } from '../types/service'

interface Props {
  statuses?: Partial<Record<ServiceId, ServiceState>>
  urls?: Partial<Record<ServiceId, string>>
}

const props = withDefaults(defineProps<Props>(), {
  statuses: () => ({}),
  urls: () => ({}),
})

const emit = defineEmits<{
  connect: [payload: { serviceId: ServiceId; url: string; apiKey: string }]
}>()

const selectedService = ref<ServiceId>('jellyfin')

const selectedStatus = computed(() => props.statuses[selectedService.value] ?? 'not-configured')

const selectedUrl = computed(() => props.urls[selectedService.value] ?? '')

const configured = computed(() => selectedStatus.value !== 'not-configured')
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
        @connect="emit('connect', $event)"
      />
    </template>
  </mm-settings-template>
</template>
