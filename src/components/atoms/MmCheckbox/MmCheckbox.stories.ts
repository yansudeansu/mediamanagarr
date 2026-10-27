import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmCheckbox from './MmCheckbox.vue'

const meta = {
  title: 'Atoms/Checkbox',
  component: MmCheckbox,
  tags: ['autodocs'],

  args: {
    label: 'Enable notifications',
    modelValue: false,
    hint: '',
    disabled: false,
    required: false,
  },

  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Whether the checkbox is checked.',
    },
    label: {
      control: 'text',
      description: 'Accessible checkbox label.',
    },
    hint: {
      control: 'text',
      description: 'Optional helper text displayed below the checkbox.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable checkbox interaction.',
    },
    required: {
      control: 'boolean',
      description: 'Mark the checkbox as required.',
    },
  },

  decorators: [
    () => ({
      template: '<div style="width: 340px; max-width: 100%;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmCheckbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    modelValue: true,
  },
}

export const WithHint: Story = {
  args: {
    hint: 'Receive updates when something changes.',
  },
}

export const CheckedWithHint: Story = {
  args: {
    modelValue: true,
    hint: 'Receive updates when something changes.',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    modelValue: true,
    disabled: true,
  },
}

export const Required: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    required: true,
  },
}

export const Interactive: Story = {
  render: (args) => ({
    components: { MmCheckbox },

    setup() {
      const checked = ref(args.modelValue)

      return { args, checked }
    },

    template: `
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        <mm-checkbox
          v-bind="args"
          v-model="checked"
        />

        <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm);">
          Checked: {{ checked ? 'Yes' : 'No' }}
        </p>
      </div>
    `,
  }),
}
