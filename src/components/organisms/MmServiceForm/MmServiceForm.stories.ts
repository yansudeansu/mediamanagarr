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
    error: '',
    jellyfinUsers: [],
    jellyfinUserId: '',
    jellyfinUsersLoading: false,
    jellyfinUserSaving: false,
    jellyfinUsersError: '',
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
    error: {
      control: 'text',
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
  { id: 'user-1', name: 'Alice' },
  { id: 'user-2', name: 'Bob' },
  { id: 'user-3', name: 'Charlie' },
]

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

export const Sonarr: Story = {
  args: {
    serviceId: 'sonarr',
    url: 'https://sonarr.example.com',
    configured: true,
  },
}

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

export const ConnectionError: Story = {
  args: {
    serviceId: 'radarr',
    url: 'https://radarr.example.com',
    configured: true,
    error: 'Could not reach the server.',
  },
}
