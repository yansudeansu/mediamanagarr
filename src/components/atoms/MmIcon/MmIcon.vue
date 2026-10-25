<script setup lang="ts">
import { ArrowLeft, ArrowRight, RefreshCw, Settings } from 'lucide-vue-next'

export type IconName = 'settings' | 'arrow-left' | 'arrow-right' | 'refresh'

withDefaults(
  defineProps<{
    name: IconName
    size?: number
  }>(),
  {
    size: 18,
  },
)
</script>

<template>
  <settings
    v-if="name === 'settings'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />

  <arrow-left
    v-else-if="name === 'arrow-left'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />

  <arrow-right
    v-else-if="name === 'arrow-right'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />

  <refresh-cw
    v-else-if="name === 'refresh'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />
</template>
