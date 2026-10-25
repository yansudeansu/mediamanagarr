<script setup lang="ts">
import { ref } from 'vue'
import MmHeader from './components/molecules/MmHeader/MmHeader.vue'
import MmNavigation from './components/molecules/MmNavigation/MmNavigation.vue'
import type { NavigationView } from './components/molecules/MmNavigation/MmNavigation.vue'
import MmFooter from './components/molecules/MmFooter/MmFooter.vue'
import { getAppVersion } from './utils/version'

const settingsOpen = ref(false)
const activeView = ref<NavigationView>('requests')

const version = getAppVersion()

const viewTitles: Record<NavigationView, string> = {
  requests: 'Requests',
  'up-next': 'Up Next',
  calendar: 'Calendar',
  downloads: 'Downloads',
}
</script>

<template>
  <div class="app-shell">
    <mm-header
      :mode="settingsOpen ? 'settings' : 'main'"
      @settings="settingsOpen = true"
      @back="settingsOpen = false"
    />

    <mm-navigation v-if="!settingsOpen" :active-view="activeView" @navigate="activeView = $event" />

    <main class="app-content">
      <section v-if="settingsOpen" aria-labelledby="settings-title">
        <h2 id="settings-title">Service Connections</h2>
        <p>Service configuration will be implemented in a future milestone.</p>
      </section>

      <section v-else aria-labelledby="view-title">
        <h2 id="view-title" aria-live="polite" aria-atomic="true">
          {{ viewTitles[activeView] }}
        </h2>
        <p>This view will be implemented in a future milestone.</p>
      </section>
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

.app-content h2 {
  margin: 0 0 8px;
  font-size: 16px;
}

.app-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
}
</style>
