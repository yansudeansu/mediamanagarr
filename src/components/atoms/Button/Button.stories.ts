import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from './Button.vue'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],

  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
      description: 'Visual appearance of the button.',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium'],
      description: 'Size of the button.',
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
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Native HTML button type.',
    },
    default: {
      control: 'text',
      description: 'Button label.',
      table: {
        category: 'slots',
      },
    },
  },

  args: {
    variant: 'secondary',
    size: 'medium',
    disabled: false,
    loading: false,
    block: false,
    type: 'button',
    default: 'Button',
  },

  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: `
      <Button v-bind="args">
        {{ args.default }}
      </Button>
    `,
  }),
} satisfies Meta<typeof Button>

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
