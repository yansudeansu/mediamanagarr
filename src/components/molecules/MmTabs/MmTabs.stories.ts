import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import MmTabs from './MmTabs.vue'
import type { TabItem } from './MmTabs.vue'

const tabItems: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'history', label: 'History' },
]

const navigationItems: TabItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'explore', label: 'Explore' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'activity', label: 'Activity' },
]

const extendedNavigationItems: TabItem[] = [
  ...navigationItems,
  { id: 'collections', label: 'Collections' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'help', label: 'Help' },
]

const disabledItems: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'history', label: 'History', disabled: true },
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

function renderTabs(args: Story['args'], width = '400px') {
  return {
    components: { MmTabs },
    setup() {
      const selected = ref(args?.modelValue ?? '')

      return { args, selected, width }
    },
    template: `
      <div :style="{ width, maxWidth: '100%' }">
        <nav
          v-if="args.variant === 'navigation'"
          :aria-label="args.label"
        >
          <mm-tabs
            v-model="selected"
            :items="args.items"
            variant="navigation"
          />
        </nav>

        <mm-tabs
          v-else
          v-model="selected"
          :items="args.items"
          variant="tabs"
          :label="args.label"
        />

        <div style="padding: 16px;">
          <p>Selected: {{ selected }}</p>
        </div>
      </div>
    `,
  }
}

export const Default: Story = {
  args: {
    modelValue: 'overview',
    items: tabItems,
    variant: 'tabs',
    label: 'Content sections',
  },
  render: (args) => renderTabs(args),
}

export const Navigation: Story = {
  args: {
    modelValue: 'home',
    items: navigationItems,
    variant: 'navigation',
    label: 'Primary navigation',
  },
  render: (args) => renderTabs(args),
}

export const DisabledTabs: Story = {
  args: {
    modelValue: 'overview',
    items: disabledItems,
    variant: 'tabs',
    label: 'Content sections',
  },
  render: (args) => renderTabs(args),
}

export const NarrowNavigation: Story = {
  args: {
    modelValue: 'home',
    items: navigationItems,
    variant: 'navigation',
    label: 'Primary navigation',
  },
  render: (args) => renderTabs(args, '240px'),
}

export const OverflowingNavigation: Story = {
  args: {
    modelValue: 'home',
    items: extendedNavigationItems,
    variant: 'navigation',
    label: 'Primary navigation',
  },
  render: (args) => renderTabs(args, '360px'),
}

export const ActiveItemAtEnd: Story = {
  args: {
    modelValue: 'help',
    items: extendedNavigationItems,
    variant: 'navigation',
    label: 'Primary navigation',
  },
  render: (args) => renderTabs(args, '360px'),
}
