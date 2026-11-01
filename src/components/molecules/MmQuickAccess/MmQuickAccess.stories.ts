import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import MmQuickAccess from './MmQuickAccess.vue'
import type { QuickAccessItem } from './MmQuickAccess.vue'

const defaultItems: QuickAccessItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: 'https://example.com/dashboard',
  },
  {
    id: 'reports',
    label: 'Reports',
    href: 'https://example.com/reports',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    href: 'https://docs.example.com',
  },
]

const extendedItems: QuickAccessItem[] = [
  ...defaultItems,
  {
    id: 'projects',
    label: 'Projects',
    href: 'https://example.com/projects',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: 'https://example.com/analytics',
  },
]

const meta = {
  title: 'Molecules/QuickAccess',
  component: MmQuickAccess,
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A compact dropdown menu providing quick access to external links and a Settings action. The parent supplies the links; the component handles menu interaction and accessibility.',
      },
    },
  },

  args: {
    items: defaultItems,
    onSettings: fn(),
  },

  argTypes: {
    items: {
      control: 'object',
      description: 'Links displayed in the menu. Each item requires an id, label, and href.',
    },

    onSettings: {
      description: 'Emitted when the Settings button is selected.',
      table: {
        category: 'events',
      },
    },
  },

  decorators: [
    () => ({
      template: `
        <div
          style="
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            width: 320px;
            min-height: 320px;
            padding: 16px;
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            background: var(--surface);
          "
        >
          <story />
        </div>
      `,
    }),
  ],
} satisfies Meta<typeof MmQuickAccess>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {}

export const SingleLink: Story = {
  args: {
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: 'https://example.com/dashboard',
      },
    ],
  },
}

export const MultipleLinks: Story = {
  args: {
    items: extendedItems,
  },
}

export const NoLinks: Story = {
  args: {
    items: [],
  },
}

export const CustomLinks: Story = {
  args: {
    items: [
      {
        id: 'design-system',
        label: 'Design System',
        href: 'https://example.com/design-system',
      },
      {
        id: 'api-reference',
        label: 'API Reference',
        href: 'https://example.com/api',
      },
      {
        id: 'support',
        label: 'Support Center',
        href: 'https://example.com/support',
      },
    ],
  },
}

export const LongLabels: Story = {
  args: {
    items: [
      {
        id: 'documentation',
        label: 'Comprehensive Documentation and Developer Resources',
        href: 'https://example.com/documentation',
      },
      {
        id: 'settings-guide',
        label: 'Advanced Configuration and Administration Guide',
        href: 'https://example.com/settings-guide',
      },
    ],
  },
}
