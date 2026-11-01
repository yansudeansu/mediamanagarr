import { ref } from 'vue'
import { fn } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmTorrentConfirmation from './MmTorrentConfirmation.vue'
import type { ConfirmationItem } from './MmTorrentConfirmation.vue'

const item: ConfirmationItem = {
  id: 'a'.repeat(40),
  name: 'Example Download (2026) 1080p WEB-DL',
}

const anotherItem: ConfirmationItem = {
  id: 'b'.repeat(40),
  name: 'Another Download S01E01 1080p WEB-DL',
}

const meta = {
  title: 'Molecules/TorrentConfirmation',
  component: MmTorrentConfirmation,
  tags: ['autodocs'],

  args: {
    item,
    loading: false,
    title: 'Remove item?',
    description:
      'This will remove the item. Its associated files will be kept unless you choose to delete them below.',
    deleteFilesLabel: 'Also delete associated files',
    deleteFilesHint: 'Permanently delete the associated files from disk.',
    deleteFilesWarning: 'Warning: Associated files will also be deleted. This cannot be undone.',
    onConfirm: fn(),
    onCancel: fn(),
  },

  argTypes: {
    item: {
      control: 'object',
      description: 'The item selected for removal, or null to hide the confirmation.',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the removal operation is processing.',
    },
    title: {
      control: 'text',
      description: 'Confirmation heading.',
    },
    description: {
      control: 'text',
      description: 'Explanation of the removal operation.',
    },
    deleteFilesLabel: {
      control: 'text',
      description: 'Label for the optional file-deletion checkbox.',
    },
    deleteFilesHint: {
      control: 'text',
      description: 'Additional explanation of the file-deletion option.',
    },
    deleteFilesWarning: {
      control: 'text',
      description: 'Warning displayed when file deletion is selected.',
    },
    onConfirm: {
      description: 'Emitted with the item ID and deleteFiles choice.',
    },
    onCancel: {
      description: 'Emitted when the user cancels removal.',
    },
  },

  decorators: [
    () => ({
      template: '<div style="width: 380px; max-width: 100%;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmTorrentConfirmation>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    loading: true,
  },
}

export const LongTorrentName: Story = {
  args: {
    item: {
      ...item,
      name: 'Example Download (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing 2160p HDR',
    },
  },
}

export const Hidden: Story = {
  args: {
    item: null,
  },
}

export const CustomCopy: Story = {
  args: {
    title: 'Remove download?',
    description:
      'This download will be removed from the service. Downloaded files will be kept unless you select the option below.',
    deleteFilesLabel: 'Also delete downloaded files',
    deleteFilesHint: 'Permanently delete the downloaded data from disk.',
    deleteFilesWarning: 'Warning: Downloaded files will also be deleted. This cannot be undone.',
  },
}

/**
 * Demonstrates opening, cancelling, and reopening the confirmation.
 *
 * The delete-files checkbox must be unchecked every time the
 * confirmation is reopened or a different item is selected.
 */
export const Interactive: Story = {
  render: (args) => ({
    components: { MmTorrentConfirmation },

    setup() {
      const selectedItem = ref<ConfirmationItem | null>(item)

      function handleCancel(): void {
        selectedItem.value = null
        args.onCancel?.()
      }

      function handleConfirm(payload: { id: string; deleteFiles: boolean }): void {
        args.onConfirm?.(payload)
        selectedItem.value = null
      }

      return {
        args,
        selectedItem,
        item,
        anotherItem,
        handleCancel,
        handleConfirm,
      }
    },

    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button
            type="button"
            @click="selectedItem = item"
          >
            Open first item
          </button>

          <button
            type="button"
            @click="selectedItem = anotherItem"
          >
            Open second item
          </button>
        </div>

        <mm-torrent-confirmation
          :item="selectedItem"
          :loading="args.loading"
          :title="args.title"
          :description="args.description"
          :delete-files-label="args.deleteFilesLabel"
          :delete-files-hint="args.deleteFilesHint"
          :delete-files-warning="args.deleteFilesWarning"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />
      </div>
    `,
  }),
}
