import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmFilterGroup from './MmFilterGroup.vue'

const meta = {
  title: 'Molecules/FilterGroup',
  component: MmFilterGroup,
  tags: ['autodocs'],
  args: {
    modelValue: 'all',
    ariaLabel: 'Filters',
    disabled: false,
    options: [
      { label: 'All', value: 'all' },
      { label: 'Pending', value: 'pending' },
      { label: 'Approved', value: 'approved' },
    ],
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MmFilterGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Requests: Story = {
  render: (args) => ({
    components: { MmFilterGroup },

    setup() {
      const selected = ref(args.modelValue)

      return { args, selected }
    },

    template: `
      <MmFilterGroup
        v-bind="args"
        v-model="selected"
        aria-label="Request status filters"
      />
    `,
  }),
}

export const UpNext: Story = {
  args: {
    options: [
      { label: 'All', value: 'all' },
      { label: 'New', value: 'new', indicator: true },
    ],
  },

  render: (args) => ({
    components: { MmFilterGroup },

    setup() {
      const selected = ref(args.modelValue)

      return { args, selected }
    },

    template: `
      <MmFilterGroup
        v-bind="args"
        v-model="selected"
        aria-label="Up Next filters"
      />
    `,
  }),
}

export const WithIndicators: Story = {
  args: {
    options: [
      { label: 'All', value: 'all' },
      { label: 'New', value: 'new', indicator: true },
      { label: 'Watched', value: 'watched' },
    ],
  },

  render: (args) => ({
    components: { MmFilterGroup },

    setup() {
      const selected = ref(args.modelValue)

      return { args, selected }
    },

    template: `
      <MmFilterGroup v-bind="args" v-model="selected" />
    `,
  }),
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const IndividualDisabled: Story = {
  args: {
    options: [
      { label: 'All', value: 'all' },
      { label: 'Pending', value: 'pending', disabled: true },
      { label: 'Approved', value: 'approved' },
    ],
  },
}
