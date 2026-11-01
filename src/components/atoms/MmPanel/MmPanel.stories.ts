import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import MmPanel from './MmPanel.vue'
import MmSelect from '../MmSelect/MmSelect.vue'

const preferenceOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' },
]

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
          'A bordered container for grouping related content or controls. ' +
          'Use MmPanel for grouped layouts and MmCard for standalone content items.',
      },
    },
  },
} satisfies Meta<typeof MmPanel>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive playground demonstrating the default slot and padding control.
 */
export const Playground: Story = {
  render: (args) => ({
    components: { MmPanel },

    setup() {
      return { args }
    },

    template: `
      <div style="width: 340px; max-width: 100%">
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
      <div style="width: 340px; max-width: 100%">
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
 * Demonstrates a panel containing an interactive form control.
 * State is local to Storybook.
 */
export const WithControls: Story = {
  render: (args) => ({
    components: {
      MmPanel,
      MmSelect,
    },

    setup() {
      const preference = ref('comfortable')

      return {
        args,
        preference,
        preferenceOptions,
      }
    },

    template: `
      <div style="width: 340px; max-width: 100%">
        <mm-panel v-bind="args" aria-label="Display preferences">
          <h2 style="margin: 0; font-size: var(--font-size-md)">
            Display preferences
          </h2>

          <mm-select
            v-model="preference"
            label="Content density"
            :options="preferenceOptions"
            hint="Choose how much spacing to use between items."
          />

          <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm)">
            Selected density: {{ preference }}
          </p>
        </mm-panel>
      </div>
    `,
  }),
}

/**
 * Demonstrates a panel containing grouped information.
 */
export const WithInformation: Story = {
  render: (args) => ({
    components: { MmPanel },

    setup() {
      return { args }
    },

    template: `
      <div style="width: 340px; max-width: 100%">
        <mm-panel v-bind="args" aria-label="Account information">
          <h2 style="margin: 0; font-size: var(--font-size-md)">
            Account information
          </h2>

          <div style="display: flex; flex-direction: column; gap: var(--space-2)">
            <p style="margin: 0">
              <strong>Name:</strong> Example User
            </p>

            <p style="margin: 0">
              <strong>Role:</strong> Editor
            </p>

            <p style="margin: 0">
              <strong>Status:</strong> Active
            </p>
          </div>
        </mm-panel>
      </div>
    `,
  }),
}
