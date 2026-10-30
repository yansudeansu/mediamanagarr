<script setup lang="ts">
import MmServiceCard from '../../molecules/MmServiceCard/MmServiceCard.vue'
import { SERVICES, SERVICE_REGISTRY } from '../../../services/registry'
import type { ServiceId, ServiceState } from '../../../types/service'

interface Props {
  modelValue?: ServiceId | null
  statuses?: Partial<Record<ServiceId, ServiceState>>
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: null,
  statuses: () => ({}),
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: ServiceId]
}>()

function selectService(serviceId: ServiceId) {
  emit('update:modelValue', serviceId)
}
</script>

<template>
  <div class="service-selector">
    <div class="service-selector__list" role="group" aria-label="Service connections">
      <mm-service-card
        v-for="serviceId in SERVICES"
        :key="serviceId"
        :service="SERVICE_REGISTRY[serviceId]"
        :status="statuses[serviceId] ?? 'not-configured'"
        :selected="modelValue === serviceId"
        :disabled="disabled"
        @select="selectService(serviceId)"
      />
    </div>
  </div>
</template>

<style scoped>
.service-selector {
  width: 100%;
}

.service-selector__list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background);
}
</style>
