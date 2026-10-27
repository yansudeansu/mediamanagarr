import { ref } from 'vue'
import { fn } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmTorrentConfirmation from './MmTorrentConfirmation.vue'
import type { QBittorrentTorrent } from '../../../types/qbittorrent'

const torrent: QBittorrentTorrent = {
  hash: 'a'.repeat(40),
  name: 'Movie 1 (2026) 1080p WEB-DL',
  progress: 0.5,
  state: 'downloading',
  downloadSpeed: 1024 * 1024,
  uploadSpeed: 0,
  eta: 3600,
  size: 1024 ** 3,
  downloaded: 512 * 1024 ** 2,
}

const anotherTorrent: QBittorrentTorrent = {
  ...torrent,
  hash: 'b'.repeat(40),
  name: 'TV Show 1 S01E01 1080p WEB-DL',
}

const meta = {
  title: 'Molecules/TorrentConfirmation',
  component: MmTorrentConfirmation,
  tags: ['autodocs'],

  args: {
    torrent,
    loading: false,
    onConfirm: fn(),
    onCancel: fn(),
  },

  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the removal operation is processing.',
    },
    onConfirm: {
      description: 'Emitted with the torrent hash and deleteFiles choice.',
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
    torrent: {
      ...torrent,
      name: 'Movie 1 (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing 2160p HDR',
    },
  },
}

export const Hidden: Story = {
  args: {
    torrent: null,
  },
}

/**
 * Demonstrates opening, cancelling, and reopening the confirmation.
 *
 * The delete-files checkbox must be unchecked every time the
 * confirmation is reopened.
 */
export const Interactive: Story = {
  render: (args) => ({
    components: { MmTorrentConfirmation },

    setup() {
      const selectedTorrent = ref<QBittorrentTorrent | null>(torrent)

      function handleCancel() {
        selectedTorrent.value = null
        args.onCancel?.()
      }

      function handleConfirm(payload: { hash: string; deleteFiles: boolean }) {
        args.onConfirm?.(payload)
        selectedTorrent.value = null
      }

      return {
        args,
        selectedTorrent,
        torrent,
        anotherTorrent,
        handleCancel,
        handleConfirm,
      }
    },

    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button
            type="button"
            @click="selectedTorrent = torrent"
          >
            Open first torrent
          </button>

          <button
            type="button"
            @click="selectedTorrent = anotherTorrent"
          >
            Open second torrent
          </button>
        </div>

        <mm-torrent-confirmation
          :torrent="selectedTorrent"
          :loading="args.loading"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />
      </div>
    `,
  }),
}
