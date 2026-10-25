import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import MmServiceSelector from './MmServiceSelector.vue'
import type { ServiceId } from '../../../types/service'

const meta = {
  title: 'Organisms/Service Selector',
  component: MmServiceSelector,
  tags: ['autodocs'],

  argTypes: {
    modelValue: {
      control: 'select',
      options: [null, 'jellyfin', 'seerr', 'sonarr', 'radarr', 'qbittorrent'],
      description: 'Currently selected service.',
    },
    statuses: {
      control: 'object',
      description: 'Connection status for each service.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction with all services.',
    },
  },

  args: {
    modelValue: 'jellyfin',
    statuses: {
      jellyfin: 'configured',
      seerr: 'configured',
      sonarr: 'not-configured',
      radarr: 'not-configured',
      qbittorrent: 'not-configured',
    },
    disabled: false,
  },

  render: (args) => ({
    components: { MmServiceSelector },

    setup() {
      const selected = ref<ServiceId | null>(args.modelValue ?? null)

      watch(
        () => args.modelValue,
        (value) => {
          selected.value = value ?? null
        },
      )

      return { args, selected }
    },

    template: `
      <div style="width: 320px">
        <mm-service-selector
          v-bind="args"
          v-model="selected"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof MmServiceSelector>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive service selection.
 */
export const Playground: Story = {}

/**
 * No services have been configured yet.
 */
export const FreshInstall: Story = {
  args: {
    modelValue: null,
    statuses: {},
  },
}

/**
 * Some services have saved configuration.
 */
export const PartiallyConfigured: Story = {
  args: {
    modelValue: 'jellyfin',
    statuses: {
      jellyfin: 'configured',
      seerr: 'configured',
      sonarr: 'not-configured',
      radarr: 'not-configured',
      qbittorrent: 'not-configured',
    },
  },
}

/**
 * All services are connected.
 */
export const AllConnected: Story = {
  args: {
    modelValue: 'jellyfin',
    statuses: {
      jellyfin: 'connected',
      seerr: 'connected',
      sonarr: 'connected',
      radarr: 'connected',
      qbittorrent: 'connected',
    },
  },
}

/**
 * A service has failed its connection test.
 */
export const ConnectionFailed: Story = {
  args: {
    modelValue: 'radarr',
    statuses: {
      jellyfin: 'connected',
      seerr: 'configured',
      sonarr: 'connected',
      radarr: 'failed',
      qbittorrent: 'not-configured',
    },
  },
}

/**
 * All service rows are disabled.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
