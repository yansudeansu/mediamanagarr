import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmSelect from './MmSelect.vue'

const priorities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

const meta = {
  title: 'Atoms/Select',
  component: MmSelect,
  tags: ['autodocs'],

  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Currently selected option value.',
    },
    label: {
      control: 'text',
      description: 'Visible and accessible label.',
    },
    options: {
      control: 'object',
      description: 'Available options containing labels and values.',
    },
    placeholder: {
      control: 'text',
      description: 'Optional placeholder shown before a selection is made.',
    },
    hint: {
      control: 'text',
      description: 'Optional helper text.',
    },
    error: {
      control: 'text',
      description: 'Validation error message.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction.',
    },
    loading: {
      control: 'boolean',
      description: 'Disables the select while options are loading.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required.',
    },
    name: {
      control: 'text',
      description: 'Native form field name.',
    },
  },

  args: {
    modelValue: '',
    label: 'Priority',
    options: priorities,
    placeholder: 'Select a priority',
    hint: '',
    error: '',
    disabled: false,
    loading: false,
    required: false,
    name: 'priority',
  },

  render: (args) => ({
    components: { MmSelect },

    setup() {
      return { args }
    },

    template: `
      <div style="width: 320px; max-width: 100%;">
        <mm-select
          v-bind="args"
          @update:model-value="args.modelValue = $event"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof MmSelect>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive playground for select properties.
 */
export const Playground: Story = {}

/**
 * Default select without a selected value.
 */
export const Default: Story = {}

/**
 * Select with an existing value.
 */
export const Selected: Story = {
  args: {
    modelValue: 'medium',
  },
}

/**
 * Required selection with a visual indicator.
 */
export const Required: Story = {
  args: {
    required: true,
  },
}

/**
 * Select containing an unavailable option.
 */
export const DisabledOption: Story = {
  args: {
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium', disabled: true },
      { label: 'High', value: 'high' },
    ],
  },
}

/**
 * Select while options are loading.
 */
export const Loading: Story = {
  args: {
    loading: true,
    options: [],
  },
}

/**
 * Disabled select with an existing value.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: 'medium',
  },
}

/**
 * Select displaying a validation error.
 */
export const WithError: Story = {
  args: {
    error: 'Please select a priority.',
    required: true,
  },
}

/**
 * Select with additional guidance.
 */
export const WithHint: Story = {
  args: {
    hint: 'Choose how important this item is.',
  },
}
