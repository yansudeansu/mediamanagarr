import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmHeader from './MmHeader.vue'
import type { SafeServiceConfigs } from '../../../types/service'

const configuredServices: SafeServiceConfigs = {
  jellyfin: {
    url: 'https://media.example.com/jellyfin',
    configured: true,
  },
  seerr: {
    url: 'https://requests.example.com:5055',
    configured: true,
  },
  sonarr: {
    url: 'http://localhost:8989/sonarr',
    configured: true,
  },
  radarr: {
    url: 'http://localhost:7878/radarr',
    configured: true,
  },
  qbittorrent: {
    url: 'http://localhost:8080',
    configured: true,
  },
}

const partiallyConfiguredServices: SafeServiceConfigs = {
  jellyfin: {
    url: 'https://media.example.com/jellyfin',
    configured: true,
  },
  seerr: {
    url: 'https://requests.example.com:5055',
    configured: true,
  },
  sonarr: {
    url: '',
    configured: false,
  },
  radarr: {
    url: '',
    configured: false,
  },
  qbittorrent: {
    url: '',
    configured: false,
  },
}

const meta = {
  title: 'Molecules/Header',
  component: MmHeader,
  tags: ['autodocs'],

  argTypes: {
    mode: {
      control: 'radio',
      options: ['main', 'settings'],
      description:
        'Determines whether the header displays the application title and Quick Access menu or the Settings title and back button.',
    },
    services: {
      control: 'object',
      description:
        'Safe service configuration used to populate the Quick Access menu. Only configured services with valid URLs are shown.',
    },
    onSettings: {
      description: 'Emitted when Settings is selected from the Quick Access menu.',
      table: {
        category: 'events',
      },
    },
    onBack: {
      description: 'Emitted when the back button is clicked.',
      table: {
        category: 'events',
      },
    },
  },

  args: {
    mode: 'main',
    services: configuredServices,
  },

  decorators: [
    () => ({
      template: `
        <div style="width: 380px; min-height: 350px; display: flex; align-items: flex-start;">
          <div style="width: 100%;">
            <story />
          </div>
        </div>
      `,
    }),
  ],
} satisfies Meta<typeof MmHeader>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive playground.
 *
 * Switch between main and settings modes.
 * Edit service configurations using Storybook Controls.
 *
 * In main mode, click the three-dot button to open Quick Access.
 */
export const Playground: Story = {}

/**
 * Default application header.
 *
 * Shows the application title and Quick Access menu
 * containing all configured services.
 */
export const Main: Story = {
  args: {
    mode: 'main',
    services: configuredServices,
  },
}

/**
 * Settings header.
 *
 * Shows the Settings title and back button.
 * Quick Access is hidden while Settings is open.
 */
export const Settings: Story = {
  args: {
    mode: 'settings',
  },
}

/**
 * Quick Access with only two configured services.
 *
 * Unconfigured services should not appear in the dropdown.
 */
export const PartiallyConfigured: Story = {
  args: {
    mode: 'main',
    services: partiallyConfiguredServices,
  },
}

/**
 * Quick Access with no configured services.
 *
 * The dropdown should display an empty-state message
 * while keeping Settings accessible.
 */
export const NoServices: Story = {
  args: {
    mode: 'main',
    services: {},
  },
}

/**
 * Quick Access with services behind reverse proxies.
 *
 * Service links should preserve their URL paths and ports.
 */
export const ReverseProxyUrls: Story = {
  args: {
    mode: 'main',
    services: {
      jellyfin: {
        url: 'https://home.example.com/jellyfin',
        configured: true,
      },
      sonarr: {
        url: 'https://home.example.com:8443/sonarr',
        configured: true,
      },
      radarr: {
        url: 'https://home.example.com/radarr',
        configured: true,
      },
    },
  },
}
