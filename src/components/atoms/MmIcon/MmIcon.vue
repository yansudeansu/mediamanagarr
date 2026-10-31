<script setup lang="ts">
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  ExternalLink,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Settings,
} from '@lucide/vue'

export type IconName =
  | 'settings'
  | 'menu'
  | 'external-link'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'refresh'
  | 'detach'
  | 'attach'
  | 'sidebar'
  | 'sidebar-close'

withDefaults(defineProps<{ name: IconName; size?: number }>(), {
  size: 18,
})
</script>

<template>
  <settings
    v-if="name === 'settings'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />

  <ellipsis-vertical
    v-else-if="name === 'menu'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />

  <external-link
    v-else-if="name === 'external-link'"
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

  <external-link
    v-else-if="name === 'detach'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />

  <minimize2
    v-else-if="name === 'attach'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />

  <panel-right-open
    v-else-if="name === 'sidebar'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />

  <panel-right-close
    v-else-if="name === 'sidebar-close'"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
    focusable="false"
  />
</template>
