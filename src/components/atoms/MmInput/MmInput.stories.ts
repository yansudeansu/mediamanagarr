import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmInput from './MmInput.vue'

const meta = {
  title: 'Atoms/Input',
  component: MmInput,
  tags: ['autodocs'],

  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Current input value.',
    },
    label: {
      control: 'text',
      description: 'Visible and accessible label.',
    },
    type: {
      control: 'select',
      options: ['text', 'url', 'password'],
      description: 'Native HTML input type.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder displayed when the input is empty.',
    },
    hint: {
      control: 'text',
      description: 'Optional helper text below the input.',
    },
    error: {
      control: 'text',
      description: 'Validation error displayed below the input.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required.',
    },
    autocomplete: {
      control: 'text',
      description: 'Native autocomplete attribute.',
    },
    name: {
      control: 'text',
      description: 'Native input name.',
    },
  },

  args: {
    modelValue: '',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter your name',
    hint: '',
    error: '',
    disabled: false,
    required: false,
    autocomplete: 'off',
    name: 'name',
  },

  render: (args) => ({
    components: { MmInput },

    setup() {
      return { args }
    },

    template: `
      <div style="width: 320px; max-width: 100%;">
        <mm-input
          v-bind="args"
          @update:model-value="args.modelValue = $event"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof MmInput>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive playground for input properties.
 */
export const Playground: Story = {}

/**
 * Standard text input.
 */
export const Default: Story = {}

/**
 * URL input with native URL validation.
 */
export const Url: Story = {
  args: {
    label: 'Website',
    type: 'url',
    placeholder: 'https://example.com',
    name: 'website',
  },
}

/**
 * Password input with masked characters.
 */
export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    autocomplete: 'new-password',
    name: 'password',
  },
}

/**
 * Helper text provides additional guidance.
 */
export const WithHint: Story = {
  args: {
    label: 'Username',
    placeholder: 'Choose a username',
    hint: 'Use at least 3 characters.',
    name: 'username',
  },
}

/**
 * Validation errors are announced to assistive technology.
 */
export const WithError: Story = {
  args: {
    label: 'Username',
    modelValue: 'ab',
    placeholder: 'Choose a username',
    error: 'Username must be at least 3 characters.',
    name: 'username',
  },
}

/**
 * Required fields display a visual indicator.
 */
export const Required: Story = {
  args: {
    label: 'Full name',
    placeholder: 'Enter your full name',
    required: true,
    name: 'fullName',
  },
}

/**
 * Disabled inputs cannot be edited.
 */
export const Disabled: Story = {
  args: {
    label: 'Username',
    modelValue: 'example_user',
    disabled: true,
    name: 'username',
  },
}
