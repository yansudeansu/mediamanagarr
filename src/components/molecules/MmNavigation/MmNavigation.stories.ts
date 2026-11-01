import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { fn } from 'storybook/test'
import MmNavigation from './MmNavigation.vue'
import type { TabItem } from '../MmTabs/MmTabs.vue'

const defaultItems: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity' },
  { id: 'library', label: 'Library' },
]

const extendedItems: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'projects', label: 'Projects' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
]

const meta = {
  title: 'Molecules/Navigation',
  component: MmNavigation,
  tags: ['autodocs'],

  argTypes: {
    activeView: {
      control: 'text',
      description: 'ID of the currently active navigation item.',
    },

    items: {
      control: 'object',
      description: 'Navigation items supplied by the parent.',
    },

    label: {
      control: 'text',
      description: 'Accessible label for the navigation landmark.',
    },

    onNavigate: {
      description: 'Emitted with the selected navigation item ID.',
      table: {
        category: 'events',
      },
    },
  },

  args: {
    activeView: 'overview',
    items: defaultItems,
    label: 'Main navigation',
    onNavigate: fn(),
  },

  decorators: [
    () => ({
      template: '<div style="width: 380px"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmNavigation>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { MmNavigation },

    setup() {
      const activeView = ref(args.activeView)

      watch(
        () => args.activeView,
        (value) => {
          activeView.value = value
        },
      )

      function handleNavigate(view: string): void {
        activeView.value = view
        args.onNavigate?.(view)
      }

      return {
        args,
        activeView,
        handleNavigate,
      }
    },

    template: `
      <mm-navigation
        :active-view="activeView"
        :items="args.items"
        :label="args.label"
        @navigate="handleNavigate"
      />
    `,
  }),
}

export const Overview: Story = {}

export const Activity: Story = {
  args: {
    activeView: 'activity',
  },
}

export const Library: Story = {
  args: {
    activeView: 'library',
  },
}

export const ExtendedNavigation: Story = {
  args: {
    activeView: 'dashboard',
    items: extendedItems,
  },
}

export const DisabledItem: Story = {
  args: {
    activeView: 'overview',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'activity', label: 'Activity', disabled: true },
      { id: 'library', label: 'Library' },
    ],
  },
}

export const CustomLabel: Story = {
  args: {
    label: 'Library sections',
  },
}
