import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { ref } from 'vue'
import MmServiceCard from './MmServiceCard.vue'
import type { ServiceState } from '../../../types/service'

const meta = {
  title: 'Molecules/Service Card',
  component: MmServiceCard,
  tags: ['autodocs'],

  parameters: {
    docs: {
      description: {
        component:
          'A selectable service row with a connection status badge. The parent controls selection and supplies the display name.',
      },
    },
  },

  argTypes: {
    name: {
      control: 'text',
      description: 'Service display name.',
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
    name: 'Example Service',
    status: 'not-configured',
    selected: false,
    disabled: false,
    onSelect: fn(),
  },

  decorators: [
    () => ({
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
          <story />
        </div>
      `,
    }),
  ],
} satisfies Meta<typeof MmServiceCard>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Connected: Story = {
  args: {
    status: 'connected',
  },
}

export const Configured: Story = {
  args: {
    status: 'configured',
  },
}

export const NotConfigured: Story = {
  args: {
    status: 'not-configured',
  },
}

export const Failed: Story = {
  args: {
    status: 'failed',
  },
}

export const Selected: Story = {
  args: {
    selected: true,
    status: 'connected',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const LongName: Story = {
  args: {
    name: 'Example Service With an Extremely Long Display Name for Layout Testing',
    status: 'connected',
  },
}

export const InteractiveSelection: Story = {
  render: (args) => ({
    components: { MmServiceCard },

    setup() {
      const selectedId = ref('one')

      const services: Array<{
        id: string
        name: string
        status: ServiceState
      }> = [
        {
          id: 'one',
          name: 'Example Service One',
          status: 'connected',
        },
        {
          id: 'two',
          name: 'Example Service Two',
          status: 'configured',
        },
        {
          id: 'three',
          name: 'Example Service Three',
          status: 'failed',
        },
      ]

      function selectService(id: string): void {
        selectedId.value = id
        args.onSelect?.()
      }

      return {
        selectedId,
        services,
        selectService,
      }
    },

    template: `
      <div style="display: flex; flex-direction: column;">
        <mm-service-card
          v-for="service in services"
          :key="service.id"
          :name="service.name"
          :status="service.status"
          :selected="selectedId === service.id"
          @select="selectService(service.id)"
        />
      </div>
    `,
  }),
}
