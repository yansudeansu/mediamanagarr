import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmServiceCard from './MmServiceCard.vue'
import { SERVICE_INFO } from '../../../types/service'

const meta = {
  title: 'Molecules/Service Card',
  component: MmServiceCard,
  tags: ['autodocs'],

  argTypes: {
    service: {
      control: 'object',
      description: 'Service information to display.',
    },
    status: {
      control: 'select',
      options: ['not-configured', 'configured', 'connected', 'failed'],
      description: 'Current connection status.',
    },
    selected: {
      control: 'boolean',
      description: 'Whether this service row is selected.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether this service row is disabled.',
    },
  },

  args: {
    service: SERVICE_INFO.jellyfin,
    status: 'not-configured',
    selected: false,
    disabled: false,
  },

  render: (args) => ({
    components: { MmServiceCard },

    setup() {
      return { args }
    },

    template: `
      <div
        style="
          width: 320px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--background);
        "
      >
        <mm-service-card v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof MmServiceCard>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive component playground.
 */
export const Playground: Story = {}

/**
 * Jellyfin with a successful connection.
 */
export const Jellyfin: Story = {
  args: {
    service: SERVICE_INFO.jellyfin,
    status: 'connected',
  },
}

/**
 * Seerr with saved configuration.
 */
export const Seerr: Story = {
  args: {
    service: SERVICE_INFO.seerr,
    status: 'configured',
  },
}

/**
 * Sonarr without configuration.
 */
export const Sonarr: Story = {
  args: {
    service: SERVICE_INFO.sonarr,
    status: 'not-configured',
  },
}

/**
 * Radarr with a failed connection.
 */
export const Radarr: Story = {
  args: {
    service: SERVICE_INFO.radarr,
    status: 'failed',
  },
}

/**
 * qBittorrent with a successful connection.
 */
export const QBittorrent: Story = {
  args: {
    service: SERVICE_INFO.qbittorrent,
    status: 'connected',
  },
}

/**
 * Selected service row.
 */
export const Selected: Story = {
  args: {
    selected: true,
    status: 'connected',
  },
}

/**
 * Disabled service row.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

/**
 * All five services displayed in a compact, grouped selector.
 *
 * This matches the original MediaManagarr Settings layout.
 */
export const AllServices: Story = {
  render: () => ({
    components: { MmServiceCard },

    setup() {
      return { SERVICE_INFO }
    },

    template: `
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 320px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--background);
        "
      >
        <mm-service-card
          :service="SERVICE_INFO.jellyfin"
          status="connected"
          selected
        />

        <mm-service-card
          :service="SERVICE_INFO.seerr"
          status="configured"
        />

        <mm-service-card
          :service="SERVICE_INFO.sonarr"
          status="not-configured"
        />

        <mm-service-card
          :service="SERVICE_INFO.radarr"
          status="failed"
        />

        <mm-service-card
          :service="SERVICE_INFO.qbittorrent"
          status="not-configured"
        />
      </div>
    `,
  }),
}
