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
