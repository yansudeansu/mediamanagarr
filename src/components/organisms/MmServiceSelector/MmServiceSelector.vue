<script setup lang="ts">
import MmServiceCard from '../../molecules/MmServiceCard/MmServiceCard.vue'

export interface ServiceSelectorItem {
  id: string
  name: string
  status: 'connected' | 'failed' | 'configured' | 'not-configured'
}

interface Props {
  modelValue?: string | null
  services?: ServiceSelectorItem[]
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: null,
  services: () => [],
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function selectService(serviceId: string): void {
  emit('update:modelValue', serviceId)
}
</script>

<template>
  <div class="service-selector">
    <div class="service-selector__list" role="group" aria-label="Service connections">
      <mm-service-card
        v-for="service in services"
        :key="service.id"
        :name="service.name"
        :status="service.status"
        :selected="modelValue === service.id"
        :disabled="disabled"
        @select="selectService(service.id)"
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
