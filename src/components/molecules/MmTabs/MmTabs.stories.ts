import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'
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
  args: {
    modelValue: 'overview',
    items: tabItems,
    variant: 'tabs',
    label: 'Content sections',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['tabs', 'navigation'],
      description: 'Tab-list or navigation presentation.',
    },
    modelValue: {
      control: 'text',
      description: 'ID of the selected item.',
    },
    items: {
      control: 'object',
      description: 'Items with IDs, labels, and optional disabled states.',
    },
    label: {
      control: 'text',
      description: 'Accessible label for the tab list or surrounding navigation.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Reusable tabs and horizontally scrollable navigation. Selection is controlled by modelValue. Parents own tab-panel content or navigation behavior.',
      },
    },
  },
} satisfies Meta<typeof MmTabs>

export default meta

type Story = StoryObj<typeof meta>

function renderTabs(args: Story['args'], width = '400px') {
  const [, updateArgs] = useArgs()

  return {
    components: { MmTabs },
    setup() {
      function updateSelection(value: string): void {
        updateArgs({ modelValue: value })
      }

      return { args, width, updateSelection }
    },
    template: `
      <div :style="{ width, maxWidth: '90vw' }">
        <nav
          v-if="args.variant === 'navigation'"
          :aria-label="args.label"
        >
          <mm-tabs
            :model-value="args.modelValue"
            :items="args.items"
            variant="navigation"
            @update:model-value="updateSelection"
          />
        </nav>

        <mm-tabs
          v-else
          :model-value="args.modelValue"
          :items="args.items"
          variant="tabs"
          :label="args.label"
          @update:model-value="updateSelection"
        />

        <div style="padding: 16px;">
          <p>Selected: {{ args.modelValue }}</p>
        </div>
      </div>
    `,
  }
}

export const Default: Story = {
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

export const InvalidSelection: Story = {
  args: {
    modelValue: 'missing',
    items: tabItems,
    variant: 'tabs',
    label: 'Content sections',
  },
  render: (args) => renderTabs(args),
}

export const AllDisabled: Story = {
  args: {
    modelValue: 'overview',
    items: tabItems.map((item) => ({ ...item, disabled: true })),
    variant: 'tabs',
    label: 'Unavailable sections',
  },
  render: (args) => renderTabs(args),
}
