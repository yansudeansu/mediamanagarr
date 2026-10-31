import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import MmSettingsTemplate from './MmSettingsTemplate.vue'
import MmServiceSelector from '../../organisms/MmServiceSelector/MmServiceSelector.vue'
import MmServiceForm from '../../organisms/MmServiceForm/MmServiceForm.vue'
import type { ServiceHealthStates, ServiceId, ServiceState } from '../../../types/service'

const meta = {
  title: 'Templates/Settings',
  component: MmSettingsTemplate,
  tags: ['autodocs'],
} satisfies Meta<typeof MmSettingsTemplate>

export default meta

type Story = StoryObj<typeof meta>

const configuredStatuses: Partial<Record<ServiceId, ServiceState>> = {
  jellyfin: 'configured',
  seerr: 'configured',
  sonarr: 'not-configured',
  radarr: 'not-configured',
  qbittorrent: 'not-configured',
}

const connectedStatuses: Partial<Record<ServiceId, ServiceState>> = {
  jellyfin: 'connected',
  seerr: 'connected',
  sonarr: 'connected',
  radarr: 'connected',
  qbittorrent: 'connected',
}

const connectedHealth: ServiceHealthStates = {
  jellyfin: {
    status: 'connected',
    lastCheckedAt: '2026-10-31T12:00:00.000Z',
  },
  seerr: {
    status: 'connected',
    lastCheckedAt: '2026-10-31T12:00:00.000Z',
  },
  sonarr: {
    status: 'connected',
    lastCheckedAt: '2026-10-31T12:00:00.000Z',
  },
  radarr: {
    status: 'connected',
    lastCheckedAt: '2026-10-31T12:00:00.000Z',
  },
  qbittorrent: {
    status: 'connected',
    lastCheckedAt: '2026-10-31T12:00:00.000Z',
  },
}

const failedHealth: ServiceHealthStates = {
  radarr: {
    status: 'failed',
    lastCheckedAt: '2026-10-31T12:00:00.000Z',
    error: 'Unable to reach the Radarr server.',
  },
}

const exampleJellyfinUsers = [
  { id: 'user-1', name: 'Test User 1' },
  { id: 'user-2', name: 'Test User 2' },
  { id: 'user-3', name: 'Test User 3' },
]

function createStory(
  statuses: Partial<Record<ServiceId, ServiceState>>,
  initialService: ServiceId = 'jellyfin',
  healthStates: ServiceHealthStates = {},
): Story['render'] {
  return () => ({
    components: {
      MmSettingsTemplate,
      MmServiceSelector,
      MmServiceForm,
    },

    setup() {
      const selectedService = ref<ServiceId>(initialService)
      const jellyfinUserId = ref('user-1')

      const urls: Partial<Record<ServiceId, string>> = {
        jellyfin: 'https://jellyfin.example.com',
        seerr: 'https://seerr.example.com',
        sonarr: 'https://sonarr.example.com',
        radarr: 'https://radarr.example.com',
        qbittorrent: 'https://qbittorrent.example.com',
      }

      const selectedUrl = computed(() => urls[selectedService.value] ?? '')

      const configured = computed(
        () => (statuses[selectedService.value] ?? 'not-configured') !== 'not-configured',
      )

      const selectedHealth = computed(() => healthStates[selectedService.value])

      return {
        selectedService,
        statuses,
        selectedUrl,
        selectedHealth,
        configured,
        jellyfinUsers: exampleJellyfinUsers,
        jellyfinUserId,
      }
    },

    template: `
      <div style="width: 340px">
        <mm-settings-template>
          <template #selector>
            <mm-service-selector
              v-model="selectedService"
              :statuses="statuses"
            />
          </template>

          <template #configuration>
            <mm-service-form
              :service-id="selectedService"
              :url="selectedUrl"
              :configured="configured"
              :health="selectedHealth"
              :jellyfin-users="jellyfinUsers"
              :jellyfin-user-id="jellyfinUserId"
              @select-jellyfin-user="jellyfinUserId = $event"
            />
          </template>
        </mm-settings-template>
      </div>
    `,
  })
}

/**
 * Settings layout with configured services that have not been checked yet.
 */
export const Playground: Story = {
  render: createStory(configuredStatuses),
}

/**
 * No services configured.
 */
export const FreshInstall: Story = {
  render: createStory({}),
}

/**
 * All services connected with recorded health checks.
 */
export const AllConnected: Story = {
  render: createStory(connectedStatuses, 'jellyfin', connectedHealth),
}

/**
 * Radarr selected with a failed connection and an actionable error.
 */
export const ConnectionFailed: Story = {
  render: createStory(
    {
      ...configuredStatuses,
      radarr: 'failed',
    },
    'radarr',
    failedHealth,
  ),
}
