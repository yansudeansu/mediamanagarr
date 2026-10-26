<script setup lang="ts">
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Settings,
} from 'lucide-vue-next'

export type IconName =
  | 'settings'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'refresh'

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

  <arrow-up
    v-else-if="name === 'arrow-up'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />

  <arrow-down
    v-else-if="name === 'arrow-down'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />

  <chevron-left
    v-else-if="name === 'chevron-left'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />

  <chevron-right
    v-else-if="name === 'chevron-right'"
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
