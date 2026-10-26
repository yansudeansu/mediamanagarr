import { ref } from 'vue'
import { fn } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmTorrentList from './MmTorrentList.vue'
import type { QBittorrentTorrent } from '../../../types/qbittorrent'

function createTorrent(index: number): QBittorrentTorrent {
  const states = ['downloading', 'stalledDL', 'uploading', 'stoppedDL'] as const

  const isMovie = index % 2 !== 0
  const mediaNumber = Math.ceil(index / 2)

  const name = isMovie
    ? `Movie ${mediaNumber} (2026) 1080p WEB-DL`
    : `TV Show ${mediaNumber} S01E01 1080p WEB-DL`

  return {
    hash: index.toString(16).padStart(40, '0'),
    name,
    progress: Math.min(1, index / 20),
    state: states[(index - 1) % states.length],
    downloadSpeed: index % 4 === 0 ? 0 : 1024 * 1024 * index,
    uploadSpeed: index % 3 === 0 ? 512 * 1024 : 0,
    eta: index * 600,
    size: 1024 ** 3,
    downloaded: Math.min(1, index / 20) * 1024 ** 3,
  }
}

function createTorrents(count: number): QBittorrentTorrent[] {
  return Array.from({ length: count }, (_, index) => createTorrent(index + 1))
}

const meta = {
  title: 'Organisms/MmTorrentList',
  component: MmTorrentList,
  tags: ['autodocs'],

  args: {
    torrents: createTorrents(5),
    page: 1,
    pageSize: 10,
    pendingAction: null,
    disabled: false,
    onStart: fn(),
    onStop: fn(),
    onRemove: fn(),
    'onUpdate:page': fn(),
  },

  argTypes: {
    page: {
      control: 'number',
      description: 'Current page number (1-based).',
    },
    pageSize: {
      control: 'number',
      description: 'Maximum number of torrents per page.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all torrent actions.',
    },
    onStart: {
      description: 'Emitted when a torrent should start.',
    },
    onStop: {
      description: 'Emitted when a torrent should stop.',
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

  render: (args) => ({
    components: { MmTorrentList },

    setup() {
      const page = ref(args.page)

      return {
        args,
        page,
      }
    },

    template: `
      <mm-torrent-list
        v-bind="args"
        v-model:page="page"
      />
    `,
  }),
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
      hash: createTorrent(1).hash,
      action: 'stop',
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
