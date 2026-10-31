import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmQuickAccess from './MmQuickAccess.vue'
import type { SafeServiceConfigs } from '../../../types/service'

const allServices: SafeServiceConfigs = {
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

const partialServices: SafeServiceConfigs = {
  jellyfin: allServices.jellyfin,
  seerr: allServices.seerr,
  sonarr: {
    url: 'http://localhost:8989',
    configured: false,
  },
}

const meta = {
  title: 'Molecules/QuickAccess',
  component: MmQuickAccess,
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A compact workspace menu providing shortcuts to configured services and access to Settings. Service URLs are supplied without API keys.',
      },
    },
  },

  argTypes: {
    services: {
      control: 'object',
      description: 'Configured services and their safe URLs.',
    },

    onSettings: {
      action: 'settings',
      description: 'Emitted when Settings is selected.',
    },
  },

  args: {
    services: allServices,
  },

  decorators: [
    () => ({
      template: `
        <div
          style="
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            width: 320px;
            min-height: 320px;
            padding: 16px;
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            background: var(--surface);
          "
        >
          <story />
        </div>
      `,
    }),
  ],
} satisfies Meta<typeof MmQuickAccess>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllConfigured: Story = {
  args: {
    services: allServices,
  },
}

export const PartiallyConfigured: Story = {
  args: {
    services: partialServices,
  },
}

export const NoServices: Story = {
  args: {
    services: {},
  },
}

export const InvalidUrl: Story = {
  args: {
    services: {
      jellyfin: {
        url: 'javascript:alert(1)',
        configured: true,
      },
      seerr: allServices.seerr,
    },
  },
}

export const ReverseProxyUrls: Story = {
  args: {
    services: {
      jellyfin: {
        url: 'https://example.com/media/jellyfin',
        configured: true,
      },
      sonarr: {
        url: 'https://example.com/apps/sonarr',
        configured: true,
      },
      radarr: {
        url: 'https://example.com/apps/radarr',
        configured: true,
      },
    },
  },
}
