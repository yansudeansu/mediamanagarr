import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmButton from './MmButton.vue'

const meta = {
  title: 'Atoms/Button',
  component: MmButton,
  tags: ['autodocs'],

  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost', 'pagination'],
      description: 'Visual appearance of the button.',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium'],
      description: 'Size of the button.',
    },
    icon: {
      control: 'select',
      options: [undefined, 'settings', 'arrow-left', 'refresh'],
      description: 'Optional icon displayed by the button.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction.',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner and prevents interaction.',
    },
    block: {
      control: 'boolean',
      description: 'Makes the button fill its container.',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Displays a square icon button. Requires an accessible name.',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Native HTML button type.',
    },
    default: {
      control: 'text',
      description: 'Button label or accessible name for icon-only buttons.',
      table: {
        category: 'slots',
      },
    },
  },

  args: {
    variant: 'secondary',
    size: 'medium',
    icon: undefined,
    disabled: false,
    loading: false,
    block: false,
    iconOnly: false,
    type: 'button',
    default: 'Button',
  },

  render: (args) => ({
    components: { MmButton },
    setup() {
      return { args }
    },
    template: `
      <mm-button
        v-bind="args"
        :aria-label="args.iconOnly ? args.default : undefined"
      >
        {{ args.default }}
      </mm-button>
    `,
  }),
} satisfies Meta<typeof MmButton>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive playground.
 * Change props using Storybook's Controls panel.
 */
export const Playground: Story = {}

/**
 * Primary actions, such as saving settings.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    default: 'Save settings',
  },
}

/**
 * Standard actions, such as refreshing data.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    default: 'Refresh',
  },
}

/**
 * Destructive actions, such as removing a torrent.
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    default: 'Remove torrent',
  },
}

/**
 * Subtle actions, such as dismissing a notification.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    default: 'Dismiss',
  },
}

/**
 * Pagination page button.
 */
export const Pagination: Story = {
  args: {
    variant: 'pagination',
    size: 'small',
    default: '3',
  },
}

/**
 * Active pagination page.
 */
export const PaginationActive: Story = {
  args: {
    variant: 'pagination',
    size: 'small',
    disabled: true,
    default: '3',
  },
  render: (args) => ({
    components: { MmButton },
    setup() {
      return { args }
    },
    template: `
      <mm-button
        v-bind="args"
        aria-current="page"
      >
        {{ args.default }}
      </mm-button>
    `,
  }),
}

/**
 * Compact buttons for cards and toolbars.
 */
export const Small: Story = {
  args: {
    size: 'small',
    default: 'Mark as read',
  },
}

/**
 * A disabled button cannot be activated.
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    default: 'Save settings',
  },
}

/**
 * Loading buttons show progress and prevent repeated clicks.
 */
export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    default: 'Connecting...',
  },
}

/**
 * Full-width buttons, useful in settings forms.
 */
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    block: true,
    default: 'Save configuration',
  },
  decorators: [
    () => ({
      template: '<div style="width: 320px"><story /></div>',
    }),
  ],
}

/**
 * Button with an icon and text label.
 */
export const WithIcon: Story = {
  args: {
    icon: 'refresh',
    default: 'Refresh',
  },
}

/**
 * Square icon-only button.
 *
 * The icon is decorative. The button receives an accessible name.
 */
export const IconOnly: Story = {
  args: {
    icon: 'settings',
    iconOnly: true,
    default: 'Open settings',
  },
}

/**
 * Compact icon-only button for toolbars.
 */
export const SmallIconOnly: Story = {
  args: {
    icon: 'refresh',
    iconOnly: true,
    size: 'small',
    default: 'Refresh',
  },
}

/**
 * Loading replaces the icon with a spinner.
 */
export const LoadingWithIcon: Story = {
  args: {
    variant: 'primary',
    icon: 'refresh',
    loading: true,
    default: 'Refreshing...',
  },
}

/**
 * Icon-only loading state.
 */
export const LoadingIconOnly: Story = {
  args: {
    icon: 'refresh',
    iconOnly: true,
    loading: true,
    default: 'Refreshing',
  },
}
