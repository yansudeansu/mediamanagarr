import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import MmTorrentCard from './MmTorrentCard.vue'
import type { TorrentCardData } from './MmTorrentCard.vue'

const baseTorrent: TorrentCardData = {
  id: 'a'.repeat(40),
  name: 'Example Download (2026) 1080p WEB-DL',
  statusLabel: 'Downloading',
  statusVariant: 'downloading',
  progress: 42.5,
  progressLabel: '42.5%',
  sizeLabel: '3.2 GiB / 7.5 GiB',
  downloadSpeedLabel: '2.4 MiB/s',
  uploadSpeedLabel: '122 KiB/s',
  etaLabel: '1h 0m',
  primaryActionLabel: 'Stop',
}

const meta = {
  title: 'Molecules/TorrentCard',
  component: MmTorrentCard,
  tags: ['autodocs'],
  args: {
    torrent: baseTorrent,
    pendingAction: null,
    disabled: false,
    onPrimaryAction: fn(),
    onRemove: fn(),
  },
  argTypes: {
    torrent: {
      control: 'object',
      description: 'Formatted display data for the transfer.',
    },
    pendingAction: {
      control: 'select',
      options: [null, 'primary', 'remove'],
      description: 'Action currently in progress.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable both actions.',
    },
    onPrimaryAction: {
      action: 'primaryAction',
      description: 'Emitted when the primary action is requested.',
    },
    onRemove: {
      action: 'remove',
      description: 'Emitted when removal is requested.',
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
      statusLabel: 'Stalled',
      statusVariant: 'neutral',
      downloadSpeedLabel: '0 B/s',
      etaLabel: 'Unknown',
    },
  },
}

export const Seeding: Story = {
  args: {
    torrent: {
      ...baseTorrent,
      statusLabel: 'Seeding',
      statusVariant: 'seeding',
      progress: 100,
      progressLabel: '100.0%',
      sizeLabel: '7.5 GiB / 7.5 GiB',
      downloadSpeedLabel: '0 B/s',
      uploadSpeedLabel: '781 KiB/s',
      etaLabel: 'Complete',
    },
  },
}

export const Stopped: Story = {
  args: {
    torrent: {
      ...baseTorrent,
      statusLabel: 'Stopped',
      statusVariant: 'stopped',
      downloadSpeedLabel: '0 B/s',
      uploadSpeedLabel: '0 B/s',
      etaLabel: 'Unknown',
      primaryActionLabel: 'Start',
    },
  },
}

export const NearlyComplete: Story = {
  args: {
    torrent: {
      ...baseTorrent,
      progress: 98.7,
      progressLabel: '98.7%',
      sizeLabel: '7.4 GiB / 7.5 GiB',
      etaLabel: '2m 0s',
    },
  },
}

export const Error: Story = {
  args: {
    torrent: {
      ...baseTorrent,
      statusLabel: 'Error',
      statusVariant: 'error',
      downloadSpeedLabel: '0 B/s',
      uploadSpeedLabel: '0 B/s',
      etaLabel: 'Unknown',
    },
  },
}

export const LongName: Story = {
  args: {
    torrent: {
      ...baseTorrent,
      name: 'Example Download (2026) Extended Edition With Additional Bonus Content and an Extremely Long Filename for Layout Testing - 2160p HDR',
    },
  },
}

export const StopPending: Story = {
  args: {
    pendingAction: 'primary',
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
