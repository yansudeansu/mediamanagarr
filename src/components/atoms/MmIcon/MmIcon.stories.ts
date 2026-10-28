import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmIcon from './MmIcon.vue'
import type { IconName } from './MmIcon.vue'

const icons: IconName[] = [
  'settings',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'arrow-down',
  'chevron-left',
  'chevron-right',
  'refresh',
  'detach',
  'attach',
  'sidebar',
  'sidebar-close',
]

const meta = {
  title: 'Atoms/Icon',
  component: MmIcon,
  tags: ['autodocs'],

  argTypes: {
    name: {
      control: 'select',
      options: icons,
      description: 'Icon to display.',
    },

    size: {
      control: {
        type: 'number',
        min: 12,
        max: 48,
        step: 2,
      },
      description: 'Icon size in pixels.',
    },
  },

  args: {
    name: 'settings',
    size: 18,
  },
} satisfies Meta<typeof MmIcon>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Settings: Story = {
  args: {
    name: 'settings',
  },
}

export const ArrowLeft: Story = {
  args: {
    name: 'arrow-left',
  },
}

export const ArrowRight: Story = {
  args: {
    name: 'arrow-right',
  },
}

export const ArrowUp: Story = {
  args: {
    name: 'arrow-up',
  },
}

export const ArrowDown: Story = {
  args: {
    name: 'arrow-down',
  },
}

export const ChevronLeft: Story = {
  args: {
    name: 'chevron-left',
  },
}

export const ChevronRight: Story = {
  args: {
    name: 'chevron-right',
  },
}

export const Refresh: Story = {
  args: {
    name: 'refresh',
  },
}

export const Detach: Story = {
  args: {
    name: 'detach',
  },
}

export const Attach: Story = {
  args: {
    name: 'attach',
  },
}

export const Sidebar: Story = {
  args: {
    name: 'sidebar',
  },
}

export const SidebarClose: Story = {
  args: {
    name: 'sidebar-close',
  },
}

export const Gallery: Story = {
  render: () => ({
    components: {
      MmIcon,
    },

    setup() {
      return {
        icons,
      }
    },

    template: `
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 16px;
          max-width: 600px;
        "
      >
        <div
          v-for="icon in icons"
          :key="icon"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding: 16px 8px;
            border: 1px solid var(--border);
            border-radius: 8px;
          "
        >
          <mm-icon :name="icon" :size="24" />

          <span style="font-size: 12px">
            {{ icon }}
          </span>
        </div>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: {
      MmIcon,
    },

    setup() {
      return {
        sizes: [16, 18, 24, 32],
      }
    },

    template: `
      <div style="display: flex; align-items: center; gap: 24px">
        <div
          v-for="size in sizes"
          :key="size"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          "
        >
          <mm-icon name="settings" :size="size" />

          <span style="font-size: 12px">
            {{ size }}px
          </span>
        </div>
      </div>
    `,
  }),
}
