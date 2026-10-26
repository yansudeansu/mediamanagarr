import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmDownloadsTemplate from './MmDownloadsTemplate.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import MmTransferStats from '../../molecules/MmTransferStats/MmTransferStats.vue'
import MmTorrentList from '../../organisms/MmTorrentList/MmTorrentList.vue'
import MmTorrentConfirmation from '../../molecules/MmTorrentConfirmation/MmTorrentConfirmation.vue'
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

const mockTorrents = createTorrents(12)

const meta = {
  title: 'Templates/DownloadsTemplate',
  component: MmDownloadsTemplate,
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
  },

  decorators: [
    () => ({
      template: '<div style="width: 340px; max-width: 100%;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmDownloadsTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      MmDownloadsTemplate,
      MmButton,
      MmTransferStats,
      MmTorrentList,
      MmTorrentConfirmation,
    },

    setup() {
      const page = ref(1)
      const selectedTorrent = ref<QBittorrentTorrent | null>(null)

      function selectTorrent(hash: string) {
        selectedTorrent.value = mockTorrents.find((torrent) => torrent.hash === hash) ?? null
      }

      function confirmRemoval() {
        selectedTorrent.value = null
      }

      return {
        page,
        mockTorrents,
        selectedTorrent,
        selectTorrent,
        confirmRemoval,
      }
    },

    template: `
      <MmDownloadsTemplate>
        <template #actions>
          <MmButton variant="secondary" size="small" icon="refresh">
            Refresh
          </MmButton>
        </template>

        <template #stats>
          <MmTransferStats
            :download-speed="4 * 1024 * 1024"
            :upload-speed="512 * 1024"
          />
        </template>

        <template v-if="selectedTorrent" #confirmation>
          <MmTorrentConfirmation
            :torrent="selectedTorrent"
            @cancel="selectedTorrent = null"
            @confirm="confirmRemoval"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="mockTorrents"
          @remove="selectTorrent"
        />
      </MmDownloadsTemplate>
    `,
  }),
}

export const Empty: Story = {
  render: () => ({
    components: {
      MmDownloadsTemplate,
      MmTransferStats,
      MmTorrentList,
    },

    setup() {
      const page = ref(1)

      return { page }
    },

    template: `
      <MmDownloadsTemplate>
        <template #stats>
          <MmTransferStats
            :download-speed="0"
            :upload-speed="0"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="[]"
        />
      </MmDownloadsTemplate>
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { MmDownloadsTemplate },

    template: `
      <MmDownloadsTemplate>
        <p
          role="status"
          style="margin: 0; color: var(--muted); font-size: 12px;"
        >
          Loading downloads…
        </p>
      </MmDownloadsTemplate>
    `,
  }),
}

export const Error: Story = {
  render: () => ({
    components: {
      MmDownloadsTemplate,
      MmButton,
    },

    setup() {
      const retrying = ref(false)

      function retry() {
        retrying.value = true
      }

      return {
        retrying,
        retry,
      }
    },

    template: `
      <MmDownloadsTemplate>
        <div role="alert">
          <p style="margin: 0 0 10px; color: var(--danger); font-size: 12px;">
            Unable to load downloads from qBittorrent.
          </p>

          <MmButton
            variant="secondary"
            size="small"
            :loading="retrying"
            @click="retry"
          >
            Retry
          </MmButton>
        </div>
      </MmDownloadsTemplate>
    `,
  }),
}

export const RemovalConfirmation: Story = {
  render: () => ({
    components: {
      MmDownloadsTemplate,
      MmTransferStats,
      MmTorrentList,
      MmTorrentConfirmation,
    },

    setup() {
      const page = ref(1)
      const selectedTorrent = ref<QBittorrentTorrent | null>(mockTorrents[0])

      return {
        page,
        mockTorrents,
        selectedTorrent,
      }
    },

    template: `
      <MmDownloadsTemplate>
        <template #stats>
          <MmTransferStats
            :download-speed="4 * 1024 * 1024"
            :upload-speed="512 * 1024"
          />
        </template>

        <template #confirmation>
          <MmTorrentConfirmation
            :torrent="selectedTorrent"
            @cancel="selectedTorrent = null"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="mockTorrents"
        />
      </MmDownloadsTemplate>
    `,
  }),
}
