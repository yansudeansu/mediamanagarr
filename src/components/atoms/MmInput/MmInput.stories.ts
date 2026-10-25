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
    label: 'Server URL',
    type: 'url',
    placeholder: 'https://jellyfin.example.com',
    hint: '',
    error: '',
    disabled: false,
    required: false,
    autocomplete: 'off',
    name: 'url',
  },

  render: (args) => ({
    components: { MmInput },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px">
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
 * URL field used when configuring a service.
 */
export const ServerUrl: Story = {
  args: {
    label: 'Server URL',
    type: 'url',
    placeholder: 'https://jellyfin.example.com',
    required: true,
  },
}

/**
 * Password field used for service API keys.
 */
export const ApiKey: Story = {
  args: {
    label: 'API Key',
    type: 'password',
    placeholder: 'Enter API key',
    name: 'apiKey',
  },
}

/**
 * Existing credentials can be reused.
 */
export const ExistingApiKey: Story = {
  args: {
    label: 'API Key',
    type: 'password',
    placeholder: 'Leave blank to reuse saved API key',
    hint: 'Leave this field empty to keep your existing API key.',
    name: 'apiKey',
  },
}

/**
 * Helper text provides additional guidance.
 */
export const WithHint: Story = {
  args: {
    label: 'Server URL',
    type: 'url',
    hint: 'Enter the HTTPS address of your server.',
  },
}

/**
 * Validation errors are announced to assistive technology.
 */
export const WithError: Story = {
  args: {
    label: 'Server URL',
    type: 'url',
    modelValue: 'http://localhost:8096',
    error: 'Only HTTPS server URLs are supported.',
  },
}

/**
 * Required fields display a visual indicator.
 */
export const Required: Story = {
  args: {
    label: 'Server URL',
    required: true,
  },
}

/**
 * Disabled inputs cannot be edited.
 */
export const Disabled: Story = {
  args: {
    label: 'Server URL',
    modelValue: 'https://jellyfin.example.com',
    disabled: true,
  },
}
