import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmServiceForm from './MmServiceForm.vue'

const meta = {
  title: 'Organisms/Service Form',
  component: MmServiceForm,
  tags: ['autodocs'],

  args: {
    serviceId: 'jellyfin',
    url: '',
    configured: false,
    loading: false,
    testing: false,
    removing: false,
    error: '',
    success: '',
    health: undefined,
    jellyfinUsers: [],
    jellyfinUserId: '',
    jellyfinUsersLoading: false,
    jellyfinUserSaving: false,
    jellyfinUsersError: '',
    jellyfinUserSuccess: '',
  },

  argTypes: {
    serviceId: {
      control: 'select',
      options: ['jellyfin', 'seerr', 'sonarr', 'radarr', 'qbittorrent'],
    },
    url: {
      control: 'text',
    },
    configured: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    testing: {
      control: 'boolean',
      description: 'Whether the saved connection is currently being tested.',
    },
    removing: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    success: {
      control: 'text',
    },
    health: {
      control: 'object',
      description:
        'Persisted connection health, including status, last check time, and optional error.',
    },
    jellyfinUserId: {
      control: 'text',
    },
    jellyfinUsersLoading: {
      control: 'boolean',
    },
    jellyfinUserSaving: {
      control: 'boolean',
    },
    jellyfinUsersError: {
      control: 'text',
    },
    jellyfinUserSuccess: {
      control: 'text',
    },
  },

  render: (args) => ({
    components: { MmServiceForm },

    setup() {
      return { args }
    },

    template: `
      <div style="width: 320px">
        <mm-service-form v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof MmServiceForm>

export default meta

type Story = StoryObj<typeof meta>

const exampleUsers = [
  { id: 'user-1', name: 'Test User 1' },
  { id: 'user-2', name: 'Test User 2' },
  { id: 'user-3', name: 'Test User 3' },
]

// General configuration

export const Playground: Story = {}

export const FreshInstall: Story = {
  args: {
    serviceId: 'jellyfin',
    configured: false,
  },
}

export const Configured: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
  },
}

export const Sonarr: Story = {
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true,
  },
}

// Persisted connection health

export const HealthConnected: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    health: {
      status: 'connected',
      lastCheckedAt: '2026-10-31T12:00:00.000Z',
    },
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
  },
}

export const HealthFailed: Story = {
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true,
    health: {
      status: 'failed',
      lastCheckedAt: '2026-10-31T12:00:00.000Z',
      error: 'Unable to reach the Sonarr server.',
    },
  },
}

export const HealthNotChecked: Story = {
  args: {
    serviceId: 'radarr',
    url: 'https://radarr.example.com',
    configured: true,
    health: {
      status: 'unknown',
      lastCheckedAt: null,
    },
  },
}

// Connection feedback

export const Loading: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    loading: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
  },
}

export const ConnectionSuccess: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    success: 'Connected to Jellyfin successfully.',
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
  },
}

export const ConnectionError: Story = {
  args: {
    serviceId: 'radarr',
    url: 'https://radarr.example.com',
    configured: true,
    error: 'Could not reach the server.',
  },
}

// Saved connection testing

export const ReadyToTest: Story = {
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true,
    testing: false,
  },
}

export const TestingConnection: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    testing: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
  },
}

export const TestConnectionSuccess: Story = {
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true,
    success: 'Connected to Sonarr successfully.',
  },
}

export const TestConnectionFailed: Story = {
  args: {
    serviceId: 'radarr',
    url: 'https://radarr.example.com',
    configured: true,
    error: 'The server is temporarily unavailable (HTTP 503). Please try again later.',
  },
}

export const TestConnectionRateLimited: Story = {
  args: {
    serviceId: 'seerr',
    url: 'https://seerr.example.com',
    configured: true,
    error: 'The service is receiving too many requests. Please try again later.',
  },
}

export const TestConnectionUnavailable: Story = {
  args: {
    serviceId: 'jellyfin',
    configured: true,
    url: '',
    testing: false,
  },
}

// Server removal

export const RemovalConfirmation: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
  },
}

export const Removing: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    removing: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
  },
}

export const RemovalSuccess: Story = {
  args: {
    serviceId: 'jellyfin',
    configured: false,
    success: 'Jellyfin server removed successfully.',
  },
}

export const RemovalError: Story = {
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true,
    error: 'Unable to remove server.',
  },
}

// Jellyfin users

export const JellyfinUserSelected: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-2',
  },
}

export const JellyfinUsersLoading: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsersLoading: true,
  },
}

export const JellyfinUsersError: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsersError: 'Unable to load Jellyfin users: HTTP 403.',
  },
}

// Jellyfin user save feedback

export const JellyfinUserSaving: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
    jellyfinUserSaving: true,
  },
}

export const JellyfinUserSaved: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-2',
    jellyfinUserSuccess: 'Jellyfin user saved successfully.',
  },
}

export const JellyfinUserSaveError: Story = {
  args: {
    serviceId: 'jellyfin',
    url: 'https://jellyfin.example.com',
    configured: true,
    jellyfinUsers: exampleUsers,
    jellyfinUserId: 'user-1',
    jellyfinUsersError: 'Unable to save Jellyfin user.',
  },
}
