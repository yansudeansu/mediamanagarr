import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import MmPanel from './MmPanel.vue'
import MmSelect from '../MmSelect/MmSelect.vue'
import MmButton from '../MmButton/MmButton.vue'

const meta = {
  title: 'Atoms/Panel',
  component: MmPanel,
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Controls the internal padding of the panel.',
    },
  },
  args: {
    padding: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A bordered container for grouping related controls or information. ' +
          'Use MmPanel for settings and grouped UI; use MmCard for standalone content items.',
      },
    },
  },
} satisfies Meta<typeof MmPanel>

export default meta

type Story = StoryObj<typeof meta>

const workspaceOptions = [
  { label: 'Popup', value: 'popup' },
  { label: 'Sidebar', value: 'sidebar' },
  { label: 'Detached window', value: 'detached' },
]

/**
 * Basic panel demonstrating the default content slot and padding control.
 */
export const Playground: Story = {
  render: (args) => ({
    components: { MmPanel },

    setup() {
      return { args }
    },

    template: `
      <div style="width: 340px">
        <mm-panel v-bind="args" aria-label="Example panel">
          <h2 style="margin: 0; font-size: var(--font-size-md)">
            Panel heading
          </h2>

          <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm)">
            A reusable container for related information and controls.
          </p>
        </mm-panel>
      </div>
    `,
  }),
}

/**
 * Smaller padding for compact groups of related content.
 */
export const Compact: Story = {
  args: {
    padding: 'sm',
  },
  render: (args) => ({
    components: { MmPanel },

    setup() {
      return { args }
    },

    template: `
      <div style="width: 340px">
        <mm-panel v-bind="args" aria-label="Compact panel">
          <p style="margin: 0">
            Compact panel content
          </p>
        </mm-panel>
      </div>
    `,
  }),
}

/**
 * Illustrates the intended use in Workspace Settings.
 *
 * Interactions are local to Storybook and do not call extension APIs.
 */
export const WorkspacePreferences: Story = {
  render: (args) => ({
    components: {
      MmPanel,
      MmSelect,
      MmButton,
    },

    setup() {
      const workspaceMode = ref('popup')

      return {
        args,
        workspaceMode,
        workspaceOptions,
      }
    },

    template: `
      <div style="width: 340px">
        <mm-panel v-bind="args" aria-label="Workspace preferences">
          <mm-select
            v-model="workspaceMode"
            label="Default workspace"
            :options="workspaceOptions"
            hint="Choose how MediaManagarr opens when you click its toolbar icon."
          />

          <div style="display: flex; flex-direction: column; gap: var(--space-3)">
            <h3 style="margin: 0; font-size: var(--font-size-xs)">
              Open workspace
            </h3>

            <mm-button variant="secondary" block>
              Open Sidebar
            </mm-button>

            <mm-button variant="secondary" block>
              Open Detached Window
            </mm-button>
          </div>
        </mm-panel>
      </div>
    `,
  }),
}

/**
 * Demonstrates a panel containing a service configuration heading.
 */
export const ServiceConfiguration: Story = {
  render: (args) => ({
    components: {
      MmPanel,
      MmButton,
    },

    setup() {
      return { args }
    },

    template: `
      <div style="width: 340px">
        <mm-panel v-bind="args" aria-label="Jellyfin configuration">
          <div style="display: flex; flex-direction: column; gap: var(--space-1)">
            <h2 style="margin: 0; font-size: var(--font-size-md)">
              Jellyfin
            </h2>

            <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm)">
              Connect your Jellyfin media server.
            </p>
          </div>

          <mm-button variant="primary" block>
            Connect &amp; Test
          </mm-button>
        </mm-panel>
      </div>
    `,
  }),
}
