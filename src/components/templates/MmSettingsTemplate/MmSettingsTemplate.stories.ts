import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import MmSettingsTemplate from './MmSettingsTemplate.vue'
import MmServiceSelector from '../../organisms/MmServiceSelector/MmServiceSelector.vue'
import MmServiceForm from '../../organisms/MmServiceForm/MmServiceForm.vue'
import type { ServiceId, ServiceState } from '../../../types/service'

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

const exampleJellyfinUsers = [
  { id: 'user-1', name: 'Alice' },
  { id: 'user-2', name: 'Bob' },
  { id: 'user-3', name: 'Charlie' },
]

function createStory(
  statuses: Partial<Record<ServiceId, ServiceState>>,
  initialService: ServiceId = 'jellyfin',
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

      return {
        selectedService,
        statuses,
        selectedUrl,
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
 * Original MediaManagarr Settings layout with configured services.
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
 * All services connected.
 */
export const AllConnected: Story = {
  render: createStory(connectedStatuses),
}

/**
 * Radarr selected with a failed connection.
 */
export const ConnectionFailed: Story = {
  render: createStory(
    {
      ...configuredStatuses,
      radarr: 'failed',
    },
    'radarr',
  ),
}
