<script setup lang="ts">
import { ref } from 'vue'
import MmHeader from './components/molecules/MmHeader/MmHeader.vue'
import MmNavigation from './components/molecules/MmNavigation/MmNavigation.vue'
import type { NavigationView } from './components/molecules/MmNavigation/MmNavigation.vue'
import MmFooter from './components/molecules/MmFooter/MmFooter.vue'
import MmRequestView from './views/MmRequestView.vue'
import MmUpNextView from './views/MmUpNextView.vue'
import MmCalendarView from './views/MmCalendarView.vue'
import MmDownloadsView from './views/MmDownloadsView.vue'
import SettingsView from './views/SettingsView.vue'
import { getAppVersion } from './utils/version'

const settingsOpen = ref(false)
const activeView = ref<NavigationView>('requests')

const version = getAppVersion()
</script>

<template>
  <div class="app-shell">
    <mm-header
      :mode="settingsOpen ? 'settings' : 'main'"
      @settings="settingsOpen = true"
      @back="settingsOpen = false"
    />

    <mm-navigation v-if="!settingsOpen" :active-view="activeView" @navigate="activeView = $event" />

    <main class="app-content" :class="{ 'app-content--settings': settingsOpen }">
      <settings-view v-if="settingsOpen" />

      <mm-request-view v-else-if="activeView === 'requests'" />

      <mm-up-next-view v-else-if="activeView === 'up-next'" />

      <mm-calendar-view v-else-if="activeView === 'calendar'" />

      <mm-downloads-view v-else-if="activeView === 'downloads'" />
    </main>

    <mm-footer :version="version" />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 480px;
}

.app-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
}

.app-content--settings {
  padding: 0;
}
</style>
