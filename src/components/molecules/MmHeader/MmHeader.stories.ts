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
    windowMode: {
      control: 'radio',
      options: ['popup', 'detached', 'sidebar'],
      description:
        'Determines whether the workspace is displayed as a popup, detached window, or native browser sidebar.',
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
    onDetach: {
      description: 'Emitted when the detach button is clicked.',
      table: {
        category: 'events',
      },
    },
    onAttach: {
      description: 'Emitted when the attach button is clicked.',
      table: {
        category: 'events',
      },
    },
    onSidebar: {
      description: 'Emitted when the native browser sidebar button is clicked.',
      table: {
        category: 'events',
      },
    },
    onSidebarClose: {
      description: 'Emitted when the close browser sidebar button is clicked.',
      table: {
        category: 'events',
      },
    },
  },

  args: {
    mode: 'main',
    windowMode: 'popup',
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
 * Switch between main/settings and popup/detached/sidebar.
 * Edit the service configurations using Storybook Controls.
 *
 * In main mode, click the three-dot button to open Quick Access.
 */
export const Playground: Story = {}

/**
 * Default popup header.
 *
 * Shows the application title, sidebar button, detach button,
 * and Quick Access menu containing all configured services.
 */
export const Main: Story = {
  args: {
    mode: 'main',
    windowMode: 'popup',
    services: configuredServices,
  },
}

/**
 * Popup settings header.
 *
 * Shows the Settings title, sidebar button, detach button,
 * and back button.
 *
 * Quick Access is hidden while Settings is open.
 */
export const Settings: Story = {
  args: {
    mode: 'settings',
    windowMode: 'popup',
  },
}

/**
 * Detached workspace.
 *
 * Shows the application title, sidebar button, attach button,
 * and Quick Access menu.
 */
export const DetachedMain: Story = {
  args: {
    mode: 'main',
    windowMode: 'detached',
    services: configuredServices,
  },
}

/**
 * Detached workspace showing Settings.
 *
 * Shows the Settings title, sidebar button, attach button,
 * and back button.
 */
export const DetachedSettings: Story = {
  args: {
    mode: 'settings',
    windowMode: 'detached',
  },
}

/**
 * Native browser sidebar.
 *
 * Shows the application title, close sidebar button,
 * and Quick Access menu.
 *
 * Opening and detaching actions are hidden because
 * the application is already running inside the sidebar.
 */
export const SidebarMain: Story = {
  args: {
    mode: 'main',
    windowMode: 'sidebar',
    services: configuredServices,
  },
}

/**
 * Native browser sidebar showing Settings.
 *
 * Shows the Settings title, close sidebar button,
 * and back button.
 */
export const SidebarSettings: Story = {
  args: {
    mode: 'settings',
    windowMode: 'sidebar',
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
    windowMode: 'popup',
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
    windowMode: 'popup',
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
    windowMode: 'popup',
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
