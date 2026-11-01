import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'
import { fn } from 'storybook/test'
import MmTorrentList from './MmTorrentList.vue'
import type { TorrentCardData } from '../../molecules/MmTorrentCard/MmTorrentCard.vue'

function createTorrent(index: number): TorrentCardData {
  const states = ['downloading', 'neutral', 'seeding', 'stopped'] as const

  const statusLabels = ['Downloading', 'Stalled', 'Seeding', 'Stopped'] as const

  const stateIndex = (index - 1) % states.length
  const statusVariant = states[stateIndex]!
  const statusLabel = statusLabels[stateIndex]!

  const isMovie = index % 2 !== 0
  const mediaNumber = Math.ceil(index / 2)

  const name = isMovie
    ? `Movie ${mediaNumber} (2026) 1080p WEB-DL`
    : `TV Show ${mediaNumber} S01E01 1080p WEB-DL`

  const progress = Math.min(1, index / 20)
  const stopped = statusVariant === 'stopped'

  return {
    id: index.toString(16).padStart(40, '0'),
    name,
    statusLabel,
    statusVariant,
    progress: progress * 100,
    progressLabel: `${(progress * 100).toFixed(1)}%`,
    sizeLabel: `${(progress * 1024).toFixed(0)} MiB / 1.0 GiB`,
    downloadSpeedLabel: index % 4 === 0 ? '0 B/s' : `${index}.0 MiB/s`,
    uploadSpeedLabel: index % 3 === 0 ? '512 KiB/s' : '0 B/s',
    etaLabel: `${index * 10}m`,
    primaryActionLabel: stopped ? 'Start' : 'Stop',
  }
}

function createTorrents(count: number): TorrentCardData[] {
  return Array.from({ length: count }, (_, index) => createTorrent(index + 1))
}

const meta = {
  title: 'Organisms/TorrentList',
  component: MmTorrentList,
  tags: ['autodocs'],
  args: {
    torrents: createTorrents(5),
    page: 1,
    pageSize: 10,
    pendingAction: null,
    disabled: false,
    onPrimaryAction: fn(),
    onRemove: fn(),
    'onUpdate:page': fn(),
  },
  argTypes: {
    torrents: {
      control: 'object',
      description: 'Display-ready torrent card data supplied by the parent.',
    },
    page: {
      control: 'number',
      description: 'Current page number (1-based).',
    },
    pageSize: {
      control: 'number',
      description: 'Maximum number of torrents per page.',
    },
    pendingAction: {
      control: 'object',
      description: 'Currently pending action, identified by torrent ID and action type.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all torrent actions.',
    },
    onPrimaryAction: {
      description:
        'Emitted when a torrent primary action is requested. The parent decides what that action does.',
    },
    onRemove: {
      description: 'Emitted when a torrent removal is requested.',
    },
    'onUpdate:page': {
      description: 'Emitted when the selected page changes.',
    },
  },
  decorators: [
    () => ({
      template: '<div style="width: 380px; max-width: 100%;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmTorrentList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    torrents: [],
  },
}

export const SingleTorrent: Story = {
  args: {
    torrents: createTorrents(1),
  },
}

export const FullPage: Story = {
  args: {
    torrents: createTorrents(10),
  },
}

export const MultiplePages: Story = {
  args: {
    torrents: createTorrents(23),
  },
  render: (args) => {
    const [, updateArgs] = useArgs()

    return {
      components: { MmTorrentList },
      setup() {
        function handlePageChange(page: number): void {
          updateArgs({ page })
        }

        return {
          args,
          handlePageChange,
        }
      },
      template: `
        <mm-torrent-list
          v-bind="args"
          @update:page="handlePageChange"
        />
      `,
    }
  },
}

export const SecondPage: Story = {
  args: {
    torrents: createTorrents(15),
    page: 2,
  },
}

export const PendingAction: Story = {
  args: {
    torrents: createTorrents(3),
    pendingAction: {
      id: createTorrent(1).id,
      action: 'primary',
    },
  },
}

export const Disabled: Story = {
  args: {
    torrents: createTorrents(3),
    disabled: true,
  },
}

export const CustomPageSize: Story = {
  args: {
    torrents: createTorrents(8),
    pageSize: 3,
  },
}
