import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import MmHeader from './MmHeader.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'

const exampleLogo =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><rect width="28" height="28" rx="6" fill="#2563eb"/><circle cx="14" cy="14" r="7" fill="#ffffff"/></svg>',
  )

const onAction = fn()

const meta = {
  title: 'Atoms/Header',
  component: MmHeader,
  tags: ['autodocs'],
  args: {
    title: 'Example App',
    logo: null,
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Heading displayed in the header.',
    },
    logo: {
      control: 'text',
      description: 'Optional logo image URL.',
    },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    () => ({
      template: `
        <div style="width: 380px; max-width: 100%;">
          <story />
        </div>
      `,
    }),
  ],
} satisfies Meta<typeof MmHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    title: 'Dashboard',
  },
}

export const WithLogo: Story = {
  args: {
    title: 'Example App',
    logo: exampleLogo,
  },
}

export const WithActions: Story = {
  args: {
    title: 'Dashboard',
  },
  render: (args) => ({
    components: { MmHeader, MmButton },
    setup() {
      return { args, onAction }
    },
    template: `
      <MmHeader v-bind="args">
        <template #actions>
          <MmButton
            variant="secondary"
            size="small"
            icon="settings"
            icon-only
            aria-label="Open preferences"
            title="Open preferences"
            @click="onAction('preferences')"
          />
        </template>
      </MmHeader>
    `,
  }),
}

export const MultipleActions: Story = {
  args: {
    title: 'Dashboard',
    logo: exampleLogo,
  },
  render: (args) => ({
    components: { MmHeader, MmButton },
    setup() {
      return { args, onAction }
    },
    template: `
      <MmHeader v-bind="args">
        <template #actions>
          <MmButton
            variant="secondary"
            size="small"
            icon="search"
            icon-only
            aria-label="Search"
            title="Search"
            @click="onAction('search')"
          />
          <MmButton
            variant="secondary"
            size="small"
            icon="settings"
            icon-only
            aria-label="Open preferences"
            title="Open preferences"
            @click="onAction('preferences')"
          />
        </template>
      </MmHeader>
    `,
  }),
}

export const LongTitle: Story = {
  args: {
    title: 'A Very Long Application Title That Needs to Wrap Within a Narrow Header',
    logo: exampleLogo,
  },
}

export const WithoutLogo: Story = {
  args: {
    title: 'Preferences',
    logo: null,
  },
}
