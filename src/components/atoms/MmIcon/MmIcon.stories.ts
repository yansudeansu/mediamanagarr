import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmIcon from './MmIcon.vue'

const meta = {
  title: 'Atoms/Icon',
  component: MmIcon,
  tags: ['autodocs'],

  argTypes: {
    name: {
      control: 'select',
      options: [
        'settings',
        'arrow-left',
        'arrow-right',
        'chevron-left',
        'chevron-right',
        'refresh',
      ],
      description: 'Name of the icon to display.',
    },
    size: {
      control: {
        type: 'number',
        min: 12,
        max: 48,
        step: 2,
      },
      description: 'Icon width and height in pixels.',
    },
  },

  args: {
    name: 'settings',
    size: 18,
  },
} satisfies Meta<typeof MmIcon>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive icon playground.
 */
export const Playground: Story = {}

/**
 * Settings icon, used in the application header.
 */
export const Settings: Story = {
  args: {
    name: 'settings',
  },
}

/**
 * Back navigation icon.
 */
export const ArrowLeft: Story = {
  args: {
    name: 'arrow-left',
  },
}

/**
 * Forward navigation icon.
 */
export const ArrowRight: Story = {
  args: {
    name: 'arrow-right',
  },
}

/**
 * Previous month chevron.
 */
export const ChevronLeft: Story = {
  args: {
    name: 'chevron-left',
  },
}

/**
 * Next month chevron.
 */
export const ChevronRight: Story = {
  args: {
    name: 'chevron-right',
  },
}

/**
 * Refresh icon, used for reloading service data.
 */
export const Refresh: Story = {
  args: {
    name: 'refresh',
  },
}

/**
 * All available icons displayed together.
 */
export const Gallery: Story = {
  render: () => ({
    components: { MmIcon },
    setup() {
      const icons = [
        'settings',
        'arrow-left',
        'arrow-right',
        'chevron-left',
        'chevron-right',
        'refresh',
      ] as const

      return { icons }
    },
    template: `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <div
          v-for="icon in icons"
          :key="icon"
          style="display: flex; flex-direction: column; align-items: center; gap: 8px;"
        >
          <mm-icon :name="icon" :size="24" />
          <span style="font-size: 12px;">{{ icon }}</span>
        </div>
      </div>
    `,
  }),
}

/**
 * Compare common icon sizes.
 */
export const Sizes: Story = {
  render: () => ({
    components: { MmIcon },
    setup() {
      return {
        sizes: [16, 18, 24, 32],
      }
    },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div
          v-for="size in sizes"
          :key="size"
          style="display: flex; flex-direction: column; align-items: center; gap: 8px;"
        >
          <mm-icon name="settings" :size="size" />
          <span style="font-size: 12px;">{{ size }}px</span>
        </div>
      </div>
    `,
  }),
}
