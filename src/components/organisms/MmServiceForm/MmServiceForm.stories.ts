import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { nextTick } from 'vue'
import MmServiceForm from './MmServiceForm.vue'

const exampleUsers = [
  { label: 'Test User 1', value: 'user-1' },
  { label: 'Test User 2', value: 'user-2' },
  { label: 'Test User 3', value: 'user-3' },
]

const jellyfinUrl = 'https://jellyfin.example.com'
const sonarrUrl = 'https://sonarr.example.com'
const radarrUrl = 'https://radarr.example.com'
const seerrUrl = 'https://seerr.example.com'

const jellyfinUserProps = {
  userSelectionLabel: 'Jellyfin User',
  userSelectionHint: 'Select the Jellyfin user whose library should be displayed.',
  userOptions: exampleUsers,
  selectedUserId: 'user-1',
  removalNote: 'The selected Jellyfin user will also be cleared.',
}

const meta = {
  title: 'Organisms/Service Form',
  component: MmServiceForm,
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Presentational configuration form. The parent supplies service metadata, saved-key reuse permission, connection health, and optional user selection. The parent also owns URL normalization, connection persistence, health checks, and removal.',
      },
    },
  },

  args: {
    name: 'Jellyfin',
    description: 'Recently added movies and episodes',
    url: '',
    configured: false,
    loading: false,
    testing: false,
    removing: false,
    error: '',
    success: '',
    healthStatus: 'not-checked',
    healthLastCheckedLabel: '',
    healthError: '',
    canReuseSavedKey: false,
    userSelectionLabel: '',
    userSelectionHint: '',
    userOptions: [],
    selectedUserId: '',
    usersLoading: false,
    userSaving: false,
    usersError: '',
    userSuccess: '',
    removalNote: '',
    onConnect: fn(),
    onTestConnection: fn(),
    onRemove: fn(),
    onSelectUser: fn(),
    onEdit: fn(),
  },

  argTypes: {
    name: {
      control: 'text',
      description: 'Display name of the configured service.',
    },
    description: {
      control: 'text',
      description: 'Short description shown beneath the service name.',
    },
    url: {
      control: 'text',
      description: 'Saved server URL.',
    },
    configured: {
      control: 'boolean',
      description: 'Whether the service has a saved configuration.',
    },
    loading: {
      control: 'boolean',
      description: 'Whether connection setup is in progress.',
    },
    testing: {
      control: 'boolean',
      description: 'Whether the saved connection is being tested.',
    },
    removing: {
      control: 'boolean',
      description: 'Whether server removal is in progress.',
    },
    error: {
      control: 'text',
      description: 'Connection or removal error.',
    },
    success: {
      control: 'text',
      description: 'Connection or removal success message.',
    },
    healthStatus: {
      control: 'select',
      options: ['connected', 'failed', 'not-checked'],
      description: 'Presentation status of the saved connection.',
    },
    healthLastCheckedLabel: {
      control: 'text',
      description: 'Already-formatted label for the last health check.',
    },
    healthError: {
      control: 'text',
      description: 'Error from the most recent health check.',
    },
    canReuseSavedKey: {
      control: 'boolean',
      description: 'Whether a blank API key may reuse saved credentials.',
    },
    userSelectionLabel: {
      control: 'text',
      description: 'Optional user-selector label. Empty hides the selector.',
    },
    userSelectionHint: {
      control: 'text',
      description: 'Optional explanatory text for user selection.',
    },
    userOptions: {
      control: 'object',
      description: 'Generic user options with label and value fields.',
    },
    selectedUserId: {
      control: 'text',
      description: 'Currently selected user ID.',
    },
    usersLoading: {
      control: 'boolean',
      description: 'Whether user options are loading.',
    },
    userSaving: {
      control: 'boolean',
      description: 'Whether the selected user is being saved.',
    },
    usersError: {
      control: 'text',
      description: 'User loading or saving error.',
    },
    userSuccess: {
      control: 'text',
      description: 'User selection success feedback.',
    },
    removalNote: {
      control: 'text',
      description: 'Optional additional note in removal confirmation.',
    },
  },

  render: (args) => ({
    components: { MmServiceForm },
    setup() {
      return { args }
    },
    template: `
      <div style="width: min(420px, 90vw)">
        <mm-service-form v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof MmServiceForm>

export default meta

type Story = StoryObj<typeof meta>

// General configuration

export const Playground: Story = {}

export const FreshInstall: Story = {
  args: {
    name: 'Jellyfin',
    configured: false,
  },
}

export const Configured: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
  },
}

export const Sonarr: Story = {
  args: {
    name: 'Sonarr',
    description: 'TV series management',
    url: sonarrUrl,
    configured: true,
    canReuseSavedKey: true,
  },
}

// Connection health

export const HealthConnected: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    healthStatus: 'connected',
    healthLastCheckedLabel: 'October 31, 2026 at 12:00',
    ...jellyfinUserProps,
  },
}

export const HealthFailed: Story = {
  args: {
    name: 'Sonarr',
    description: 'TV series management',
    url: sonarrUrl,
    configured: true,
    canReuseSavedKey: true,
    healthStatus: 'failed',
    healthLastCheckedLabel: 'October 31, 2026 at 12:00',
    healthError: 'Unable to reach the Sonarr server.',
  },
}

export const HealthNotChecked: Story = {
  args: {
    name: 'Radarr',
    description: 'Movie management',
    url: radarrUrl,
    configured: true,
    canReuseSavedKey: true,
    healthStatus: 'not-checked',
  },
}

// Connection feedback

export const Loading: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    loading: true,
    ...jellyfinUserProps,
  },
}

export const ConnectionSuccess: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    success: 'Connected to Jellyfin successfully.',
    ...jellyfinUserProps,
  },
}

export const ConnectionError: Story = {
  args: {
    name: 'Radarr',
    description: 'Movie management',
    url: radarrUrl,
    configured: true,
    canReuseSavedKey: true,
    error: 'Could not reach the server.',
  },
}

// Saved connection testing

export const ReadyToTest: Story = {
  args: {
    name: 'Sonarr',
    description: 'TV series management',
    url: sonarrUrl,
    configured: true,
    canReuseSavedKey: true,
  },
}

export const TestingConnection: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    testing: true,
    ...jellyfinUserProps,
  },
}

export const TestConnectionSuccess: Story = {
  args: {
    name: 'Sonarr',
    description: 'TV series management',
    url: sonarrUrl,
    configured: true,
    canReuseSavedKey: true,
    success: 'Connected to Sonarr successfully.',
  },
}

export const TestConnectionFailed: Story = {
  args: {
    name: 'Radarr',
    description: 'Movie management',
    url: radarrUrl,
    configured: true,
    canReuseSavedKey: true,
    error: 'The server is temporarily unavailable (HTTP 503). Please try again later.',
  },
}

export const TestConnectionRateLimited: Story = {
  args: {
    name: 'Seerr',
    description: 'Media requests',
    url: seerrUrl,
    configured: true,
    canReuseSavedKey: true,
    error: 'The service is receiving too many requests. Please try again later.',
  },
}

export const TestConnectionUnavailable: Story = {
  args: {
    name: 'Jellyfin',
    configured: true,
    url: '',
    canReuseSavedKey: false,
  },
}

// Server removal

/**
 * Opens the removal confirmation so its appearance can be inspected directly.
 * Uses the public button interaction rather than component internals.
 */
export const RemovalConfirmation: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
  },

  render: (args) => ({
    components: { MmServiceForm },

    setup() {
      async function openConfirmation(element: Element | null): Promise<void> {
        if (!element) return

        await nextTick()

        const removeButton = Array.from(element.querySelectorAll('button')).find(
          (button) => button.textContent?.trim() === 'Remove server',
        )

        removeButton?.click()
      }

      return { args, openConfirmation }
    },

    template: `
      <div
        style="width: min(420px, 90vw)"
        :ref="openConfirmation"
      >
        <mm-service-form v-bind="args" />
      </div>
    `,
  }),
}

export const Removing: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    removing: true,
    ...jellyfinUserProps,
  },
}

export const RemovalSuccess: Story = {
  args: {
    name: 'Jellyfin',
    configured: false,
    success: 'Jellyfin server removed successfully.',
  },
}

export const RemovalError: Story = {
  args: {
    name: 'Sonarr',
    description: 'TV series management',
    url: sonarrUrl,
    configured: true,
    canReuseSavedKey: true,
    error: 'Unable to remove server.',
  },
}

// Optional user selection

export const JellyfinUserSelected: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    selectedUserId: 'user-2',
  },
}

export const JellyfinUsersLoading: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    userOptions: [],
    usersLoading: true,
  },
}

export const JellyfinUsersError: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    userOptions: [],
    usersError: 'Unable to load Jellyfin users: HTTP 403.',
  },
}

// User save feedback

export const JellyfinUserSaving: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    userSaving: true,
  },
}

export const JellyfinUserSaved: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    selectedUserId: 'user-2',
    userSuccess: 'Jellyfin user saved successfully.',
  },
}

export const JellyfinUserSaveError: Story = {
  args: {
    name: 'Jellyfin',
    url: jellyfinUrl,
    configured: true,
    canReuseSavedKey: true,
    ...jellyfinUserProps,
    usersError: 'Unable to save Jellyfin user.',
  },
}
