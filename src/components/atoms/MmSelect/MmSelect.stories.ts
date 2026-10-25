import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmSelect from './MmSelect.vue'

const users = [
  { label: 'Alice', value: 'user-1' },
  { label: 'Bob', value: 'user-2' },
  { label: 'Charlie', value: 'user-3' },
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
      description: 'Native HTML select name.',
    },
  },

  args: {
    modelValue: '',
    label: 'Jellyfin user',
    options: users,
    placeholder: 'Select a user',
    hint: '',
    error: '',
    disabled: false,
    loading: false,
    required: false,
    name: 'jellyfinUser',
  },

  render: (args) => ({
    components: { MmSelect },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px">
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
 * Interactive playground.
 */
export const Playground: Story = {}

/**
 * Jellyfin account selection.
 */
export const JellyfinUser: Story = {
  args: {
    label: 'Jellyfin user',
    placeholder: 'Select a user',
    hint: 'Watched movies and episodes will be hidden for the selected user.',
  },
}

/**
 * An existing user selection.
 */
export const Selected: Story = {
  args: {
    modelValue: 'user-2',
  },
}

/**
 * A required selection.
 */
export const Required: Story = {
  args: {
    required: true,
  },
}

/**
 * A select with a disabled option.
 */
export const DisabledOption: Story = {
  args: {
    options: [
      { label: 'Alice', value: 'user-1' },
      { label: 'Bob', value: 'user-2', disabled: true },
      { label: 'Charlie', value: 'user-3' },
    ],
  },
}

/**
 * Loading Jellyfin users.
 */
export const Loading: Story = {
  args: {
    loading: true,
    placeholder: 'Loading users...',
    options: [],
  },
}

/**
 * A disabled select.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: 'user-1',
  },
}

/**
 * An invalid selection.
 */
export const WithError: Story = {
  args: {
    error: 'Please select a Jellyfin user.',
    required: true,
  },
}

/**
 * A select with additional guidance.
 */
export const WithHint: Story = {
  args: {
    hint: 'Choose the account whose watch history should be used.',
  },
}
