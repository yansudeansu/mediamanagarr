import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmHeader from './MmHeader.vue'

const meta = {
  title: 'Molecules/Header',
  component: MmHeader,
  tags: ['autodocs'],

  argTypes: {
    mode: {
      control: 'radio',
      options: ['main', 'settings'],
      description: 'Determines the header title and navigation action.',
    },
    windowMode: {
      control: 'radio',
      options: ['popup', 'detached', 'sidebar'],
      description:
        'Determines whether the workspace is displayed as a popup, detached window, or native browser sidebar.',
    },
    onSettings: {
      description: 'Emitted when the settings button is clicked.',
      table: {
        category: 'events',
      },
    },
    onBack: {
      description: 'Emitted when the back button is clicked.',
      table: {
        category: 'events',
      },
    },
    onDetach: {
      description: 'Emitted when the detach button is clicked.',
      table: {
        category: 'events',
      },
    },
    onAttach: {
      description: 'Emitted when the attach button is clicked.',
      table: {
        category: 'events',
      },
    },
    onSidebar: {
      description: 'Emitted when the native browser sidebar button is clicked.',
      table: {
        category: 'events',
      },
    },
  },

  args: {
    mode: 'main',
    windowMode: 'popup',
  },

  decorators: [
    () => ({
      template: '<div style="width: 380px"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmHeader>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive playground.
 * Switch between main/settings and popup/detached/sidebar using Storybook Controls.
 */
export const Playground: Story = {}

/**
 * Default popup header with the application title,
 * sidebar button, detach button, and settings button.
 */
export const Main: Story = {
  args: {
    mode: 'main',
    windowMode: 'popup',
  },
}

/**
 * Popup settings header with the back button,
 * sidebar button, and detach button.
 */
export const Settings: Story = {
  args: {
    mode: 'settings',
    windowMode: 'popup',
  },
}

/**
 * Detached workspace with the application title,
 * sidebar button, attach button, and settings button.
 */
export const DetachedMain: Story = {
  args: {
    mode: 'main',
    windowMode: 'detached',
  },
}

/**
 * Detached workspace with the settings title,
 * sidebar button, attach button, and back button.
 */
export const DetachedSettings: Story = {
  args: {
    mode: 'settings',
    windowMode: 'detached',
  },
}

/**
 * Native browser sidebar with the application title
 * and settings button.
 *
 * Workspace actions are hidden because the application
 * is already running inside the sidebar.
 */
export const SidebarMain: Story = {
  args: {
    mode: 'main',
    windowMode: 'sidebar',
  },
}

/**
 * Native browser sidebar showing the settings title
 * and back button.
 *
 * Workspace actions remain hidden in sidebar mode.
 */
export const SidebarSettings: Story = {
  args: {
    mode: 'settings',
    windowMode: 'sidebar',
  },
}
