import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmDownloadsTemplate from './MmDownloadsTemplate.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import MmTransferStats from '../../molecules/MmTransferStats/MmTransferStats.vue'
import MmTorrentList from '../../organisms/MmTorrentList/MmTorrentList.vue'
import MmTorrentConfirmation from '../../molecules/MmTorrentConfirmation/MmTorrentConfirmation.vue'
import type { TorrentCardData } from '../../molecules/MmTorrentCard/MmTorrentCard.vue'
import type { ConfirmationItem } from '../../molecules/MmTorrentConfirmation/MmTorrentConfirmation.vue'

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
    sizeLabel: `${Math.round(progress * 1024)} MiB / 1.0 GiB`,
    downloadSpeedLabel: index % 4 === 0 ? '0 B/s' : `${index}.0 MiB/s`,
    uploadSpeedLabel: index % 3 === 0 ? '512 KiB/s' : '0 B/s',
    etaLabel: `${index * 10}m`,
    primaryActionLabel: stopped ? 'Start' : 'Stop',
  }
}

function createTorrents(count: number): TorrentCardData[] {
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
      const torrents = ref<TorrentCardData[]>([...mockTorrents])
      const selectedTorrent = ref<ConfirmationItem | null>(null)

      function selectTorrent(id: string): void {
        const torrent = torrents.value.find((item) => item.id === id)

        selectedTorrent.value = torrent ? { id: torrent.id, name: torrent.name } : null
      }

      function confirmRemoval(payload: { id: string; deleteFiles: boolean }): void {
        torrents.value = torrents.value.filter((torrent) => torrent.id !== payload.id)

        selectedTorrent.value = null
      }

      function handlePrimaryAction(id: string): void {
        torrents.value = torrents.value.map((torrent) => {
          if (torrent.id !== id) {
            return torrent
          }

          const stopped = torrent.primaryActionLabel === 'Start'

          return {
            ...torrent,
            statusLabel: stopped ? 'Downloading' : 'Stopped',
            statusVariant: stopped ? ('downloading' as const) : ('stopped' as const),
            primaryActionLabel: stopped ? 'Stop' : 'Start',
          }
        })
      }

      return {
        page,
        torrents,
        selectedTorrent,
        selectTorrent,
        confirmRemoval,
        handlePrimaryAction,
      }
    },

    template: `
      <MmDownloadsTemplate>
        <template #actions>
          <MmButton
            variant="secondary"
            size="small"
            icon="refresh"
          >
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
            :item="selectedTorrent"
            title="Remove torrent?"
            description="Remove this torrent from the download client."
            delete-files-label="Also delete downloaded files"
            delete-files-hint="Permanently delete downloaded data."
            delete-files-warning="This cannot be undone."
            confirm-label="Remove torrent"
            @cancel="selectedTorrent = null"
            @confirm="confirmRemoval"
          />
        </template>

        <MmTorrentList
          v-model:page="page"
          :torrents="torrents"
          @primary-action="handlePrimaryAction"
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

      function retry(): void {
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
          <p
            style="margin: 0 0 10px; color: var(--danger); font-size: 12px;"
          >
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
      const selectedTorrent = ref<ConfirmationItem | null>({
        id: mockTorrents[0]!.id,
        name: mockTorrents[0]!.name,
      })

      function confirmRemoval(): void {
        selectedTorrent.value = null
      }

      return {
        page,
        mockTorrents,
        selectedTorrent,
        confirmRemoval,
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

        <template v-if="selectedTorrent" #confirmation>
          <MmTorrentConfirmation
            :item="selectedTorrent"
            title="Remove torrent?"
            description="Remove this torrent from the download client."
            delete-files-label="Also delete downloaded files"
            delete-files-hint="Permanently delete downloaded data."
            delete-files-warning="This cannot be undone."
            confirm-label="Remove torrent"
            @cancel="selectedTorrent = null"
            @confirm="confirmRemoval"
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
