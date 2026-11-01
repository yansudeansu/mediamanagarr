import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'
import MmFilterGroup from './MmFilterGroup.vue'

const render: NonNullable<StoryObj<typeof MmFilterGroup>['render']> = (args) => {
  const [, updateArgs] = useArgs()

  return {
    components: { MmFilterGroup },
    setup() {
      const onUpdateModelValue = (value: string) => {
        updateArgs({ modelValue: value })
      }

      return { args, onUpdateModelValue }
    },
    template: `
      <MmFilterGroup
        v-bind="args"
        @update:model-value="onUpdateModelValue"
      />
    `,
  }
}

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
      { label: 'Active', value: 'active' },
      { label: 'Completed', value: 'completed' },
    ],
  },
  argTypes: {
    modelValue: { control: 'text', description: 'Currently selected filter value.' },
    options: { control: 'object', description: 'Available filter options.' },
    ariaLabel: { control: 'text', description: 'Accessible label for the filter group.' },
    disabled: { control: 'boolean', description: 'Disable every filter option.' },
  },
  parameters: {
    layout: 'centered',
  },
  render,
} satisfies Meta<typeof MmFilterGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIndicators: Story = {
  args: {
    options: [
      { label: 'All', value: 'all' },
      { label: 'New', value: 'new', indicator: true },
      { label: 'Archived', value: 'archived' },
    ],
  },
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
      { label: 'Active', value: 'active', disabled: true },
      { label: 'Completed', value: 'completed' },
    ],
  },
}

export const ManyOptions: Story = {
  args: {
    options: [
      { label: 'All', value: 'all' },
      { label: 'Draft', value: 'draft' },
      { label: 'Pending', value: 'pending' },
      { label: 'Active', value: 'active' },
      { label: 'Paused', value: 'paused' },
      { label: 'Completed', value: 'completed' },
      { label: 'Archived', value: 'archived' },
    ],
  },
}
