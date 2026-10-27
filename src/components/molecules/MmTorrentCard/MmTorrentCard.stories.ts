import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmTorrentCard from './MmTorrentCard.vue'
import type { QBittorrentTorrent } from '../../../types/qbittorrent'

const baseTorrent: QBittorrentTorrent = {
  hash: 'a'.repeat(40),
  name: 'Movie 1 (2026) 1080p WEB-DL',
  progress: 0.425,
  state: 'downloading',
  downloadSpeed: 2_500_000,
  uploadSpeed: 125_000,
  eta: 3600,
  size: 8_000_000_000,
  downloaded: 3_400_000_000,
}

const meta = {
  title: 'Molecules/TorrentCard',
  component: MmTorrentCard,
  tags: ['autodocs'],
  args: {
    torrent: baseTorrent,
    pendingAction: null,
    disabled: false,
  },
  argTypes: {
    pendingAction: {
      control: 'select',
      options: [null, 'start', 'stop', 'remove'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  decorators: [
    () => ({
      template: '<div style="width: 340px; max-width: 100%;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmTorrentCard>

export default meta

type Story = StoryObj<typeof meta>

export const Downloading: Story = {}

export const Stalled: Story = {
  args: {
    torrent: {
      ...baseTorrent,
      state: 'stalledDL',
      downloadSpeed: 0,
      eta: 8_640_000,
    },
  },
}

export const Seeding: Story = {
  args: {
    torrent: {
      ...baseTorrent,
      progress: 1,
      state: 'uploading',
      downloaded: baseTorrent.size,
      downloadSpeed: 0,
      uploadSpeed: 800_000,
      eta: 0,
    },
  },
}

export const Stopped: Story = {
  args: {
    torrent: {
      ...baseTorrent,
      state: 'stoppedDL',
      downloadSpeed: 0,
      uploadSpeed: 0,
    },
  },
}

export const NearlyComplete: Story = {
  args: {
    torrent: {
      ...baseTorrent,
      progress: 0.987,
      downloaded: 7_896_000_000,
      eta: 120,
    },
  },
}

export const Error: Story = {
  args: {
    torrent: {
      ...baseTorrent,
      state: 'error',
      downloadSpeed: 0,
      uploadSpeed: 0,
    },
  },
}

export const LongName: Story = {
  args: {
    torrent: {
      ...baseTorrent,
      name: 'Movie 1 (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing - 2160p HDR',
    },
  },
}

export const StopPending: Story = {
  args: {
    pendingAction: 'stop',
  },
}

export const RemovePending: Story = {
  args: {
    pendingAction: 'remove',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
