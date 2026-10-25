<script setup lang="ts">
import MmButton from '../../atoms/MmButton/MmButton.vue'
import mmLogo from '../../../assets/mm-logo.svg'

interface Props {
  mode?: 'main' | 'settings'
}

withDefaults(defineProps<Props>(), {
  mode: 'main',
})

const emit = defineEmits<{
  settings: []
  back: []
}>()
</script>

<template>
  <header class="header">
    <div class="header__branding">
      <img :src="mmLogo" alt="" class="header__logo" width="28" height="28" />

      <h1 class="header__title">
        {{ mode === 'settings' ? 'Settings' : 'MediaManagarr' }}
      </h1>
    </div>

    <mm-button
      v-if="mode === 'settings'"
      variant="secondary"
      icon="arrow-left"
      icon-only
      aria-label="Back to previous view"
      @click="emit('back')"
    />

    <mm-button
      v-else
      variant="secondary"
      icon="settings"
      icon-only
      aria-label="Open settings"
      @click="emit('settings')"
    />
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 16px 18px;

  border-bottom: 1px solid var(--border);
}

.header__branding {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.header__logo {
  display: block;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
}

.header__title {
  min-width: 0;
  margin: 0;

  font-size: 15px;
  font-weight: 650;
  line-height: 1.4;

  overflow-wrap: anywhere;
}
</style>
