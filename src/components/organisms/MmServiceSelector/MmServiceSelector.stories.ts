import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'
import MmServiceSelector from './MmServiceSelector.vue'

const notConfiguredServices = [
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    status: 'not-configured',
  },
  {
    id: 'seerr',
    name: 'Seerr',
    status: 'not-configured',
  },
  {
    id: 'sonarr',
    name: 'Sonarr',
    status: 'not-configured',
  },
  {
    id: 'radarr',
    name: 'Radarr',
    status: 'not-configured',
  },
  {
    id: 'qbittorrent',
    name: 'qBittorrent',
    status: 'not-configured',
  },
] as const

const partiallyConfiguredServices = [
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    status: 'configured',
  },
  {
    id: 'seerr',
    name: 'Seerr',
    status: 'configured',
  },
  {
    id: 'sonarr',
    name: 'Sonarr',
    status: 'not-configured',
  },
  {
    id: 'radarr',
    name: 'Radarr',
    status: 'not-configured',
  },
  {
    id: 'qbittorrent',
    name: 'qBittorrent',
    status: 'not-configured',
  },
] as const

const connectedServices = [
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    status: 'connected',
  },
  {
    id: 'seerr',
    name: 'Seerr',
    status: 'connected',
  },
  {
    id: 'sonarr',
    name: 'Sonarr',
    status: 'connected',
  },
  {
    id: 'radarr',
    name: 'Radarr',
    status: 'connected',
  },
  {
    id: 'qbittorrent',
    name: 'qBittorrent',
    status: 'connected',
  },
] as const

const failedConnectionServices = [
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    status: 'connected',
  },
  {
    id: 'seerr',
    name: 'Seerr',
    status: 'configured',
  },
  {
    id: 'sonarr',
    name: 'Sonarr',
    status: 'connected',
  },
  {
    id: 'radarr',
    name: 'Radarr',
    status: 'failed',
  },
  {
    id: 'qbittorrent',
    name: 'qBittorrent',
    status: 'not-configured',
  },
] as const

const meta = {
  title: 'Organisms/Service Selector',
  component: MmServiceSelector,
  tags: ['autodocs'],

  argTypes: {
    modelValue: {
      control: 'select',
      options: [null, 'jellyfin', 'seerr', 'sonarr', 'radarr', 'qbittorrent'],
      description: 'ID of the currently selected service.',
    },
    services: {
      control: 'object',
      description:
        'Ordered list of services, including each service ID, display name, and connection status.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction with all services.',
    },
  },

  args: {
    modelValue: 'jellyfin',
    services: partiallyConfiguredServices.map((service) => ({
      ...service,
    })),
    disabled: false,
  },

  render: (args) => {
    const [, updateArgs] = useArgs()

    return {
      components: { MmServiceSelector },

      setup() {
        function updateSelection(value: string): void {
          updateArgs({ modelValue: value })
        }

        return {
          args,
          updateSelection,
        }
      },

      template: `
        <div style="width: 320px">
          <mm-service-selector
            v-bind="args"
            @update:model-value="updateSelection"
          />
        </div>
      `,
    }
  },
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
    services: notConfiguredServices.map((service) => ({
      ...service,
    })),
  },
}

/**
 * Some services have saved configuration.
 */
export const PartiallyConfigured: Story = {
  args: {
    modelValue: 'jellyfin',
    services: partiallyConfiguredServices.map((service) => ({
      ...service,
    })),
  },
}

/**
 * All services are connected.
 */
export const AllConnected: Story = {
  args: {
    modelValue: 'jellyfin',
    services: connectedServices.map((service) => ({
      ...service,
    })),
  },
}

/**
 * A service has failed its connection test.
 */
export const ConnectionFailed: Story = {
  args: {
    modelValue: 'radarr',
    services: failedConnectionServices.map((service) => ({
      ...service,
    })),
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

/**
 * The selector renders an empty group when no services are supplied.
 */
export const Empty: Story = {
  args: {
    modelValue: null,
    services: [],
  },
}

/**
 * The selector supports services outside MediaManagarr's registry.
 */
export const CustomServices: Story = {
  args: {
    modelValue: 'alpha',
    services: [
      {
        id: 'alpha',
        name: 'Alpha Server',
        status: 'connected',
      },
      {
        id: 'beta',
        name: 'Beta Server',
        status: 'configured',
      },
      {
        id: 'gamma',
        name: 'Gamma Server',
        status: 'failed',
      },
    ],
  },
}
