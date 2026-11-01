import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import MmTabs from './MmTabs.vue'
import type { TabItem } from './MmTabs.vue'

const settingsItems: TabItem[] = [
  { id: 'connections', label: 'Connections' },
  { id: 'workspace', label: 'Workspace' },
]

const navigationItems: TabItem[] = [
  { id: 'requests', label: 'Requests' },
  { id: 'up-next', label: 'Up Next' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'downloads', label: 'Downloads' },
]

const meta = {
  title: 'Molecules/Tabs',
  component: MmTabs,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['tabs', 'navigation'],
    },
    modelValue: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof MmTabs>

export default meta

type Story = StoryObj<typeof meta>

export const Settings: Story = {
  args: {
    modelValue: 'connections',
    items: settingsItems,
    variant: 'tabs',
    label: 'Settings sections',
  },
  render: (args) => ({
    components: { MmTabs },
    setup() {
      const selected = ref(args.modelValue)

      return { args, selected }
    },
    template: `
      <div style="width: 100%; max-width: 400px;">
        <mm-tabs
          v-model="selected"
          :items="args.items"
          :variant="args.variant"
          :label="args.label"
        />

        <div style="padding: 16px;">
          <p v-if="selected === 'connections'">
            Service connection settings
          </p>

          <p v-else-if="selected === 'workspace'">
            Workspace preferences
          </p>
        </div>
      </div>
    `,
  }),
}

export const MainNavigation: Story = {
  args: {
    modelValue: 'requests',
    items: navigationItems,
    variant: 'navigation',
    label: 'Main navigation',
  },
  render: (args) => ({
    components: { MmTabs },
    setup() {
      const selected = ref(args.modelValue)

      return { args, selected }
    },
    template: `
      <div style="width: 100%; max-width: 400px;">
        <nav aria-label="Main navigation">
          <mm-tabs
            v-model="selected"
            :items="args.items"
            variant="navigation"
          />
        </nav>

        <div style="padding: 16px;">
          <p>Active view: {{ selected }}</p>
        </div>
      </div>
    `,
  }),
}

export const DisabledTabs: Story = {
  args: {
    modelValue: 'connections',
    items: [
      { id: 'connections', label: 'Connections' },
      { id: 'workspace', label: 'Workspace' },
      { id: 'advanced', label: 'Advanced', disabled: true },
    ],
    variant: 'tabs',
    label: 'Settings sections',
  },
  render: (args) => ({
    components: { MmTabs },
    setup() {
      const selected = ref(args.modelValue)

      return { args, selected }
    },
    template: `
      <div style="width: 100%; max-width: 400px;">
        <mm-tabs
          v-model="selected"
          :items="args.items"
          :variant="args.variant"
          :label="args.label"
        />

        <div style="padding: 16px;">
          <p>Selected: {{ selected }}</p>
        </div>
      </div>
    `,
  }),
}
