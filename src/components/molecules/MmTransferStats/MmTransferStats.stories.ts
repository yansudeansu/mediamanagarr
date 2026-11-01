import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MmTransferStats from './MmTransferStats.vue'

const meta = {
  title: 'Molecules/TransferStats',
  component: MmTransferStats,
  tags: ['autodocs'],
  args: {
    downloadSpeed: 12.5 * 1024 * 1024,
    uploadSpeed: 2.3 * 1024 * 1024,
  },
  argTypes: {
    downloadSpeed: {
      control: 'number',
      description: 'Overall download speed in bytes per second.',
    },
    uploadSpeed: {
      control: 'number',
      description: 'Overall upload speed in bytes per second.',
    },
  },
  decorators: [
    () => ({
      template: '<div style="width: 340px; max-width: 100%;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MmTransferStats>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Idle: Story = {
  args: {
    downloadSpeed: 0,
    uploadSpeed: 0,
  },
}

export const Downloading: Story = {
  args: {
    downloadSpeed: 25 * 1024 * 1024,
    uploadSpeed: 512 * 1024,
  },
}

export const Seeding: Story = {
  args: {
    downloadSpeed: 0,
    uploadSpeed: 8 * 1024 * 1024,
  },
}

export const HighSpeed: Story = {
  args: {
    downloadSpeed: 1.5 * 1024 ** 3,
    uploadSpeed: 125 * 1024 ** 2,
  },
}

export const LowSpeed: Story = {
  args: {
    downloadSpeed: 512,
    uploadSpeed: 128,
  },
}

export const InvalidSpeeds: Story = {
  args: {
    downloadSpeed: -1024,
    uploadSpeed: Number.NaN,
  },
}

export const ReactiveUpdates: Story = {
  render: () => ({
    components: { MmTransferStats },
    setup() {
      const downloadSpeed = ref(0)
      const uploadSpeed = ref(0)

      function setIdle(): void {
        downloadSpeed.value = 0
        uploadSpeed.value = 0
      }

      function setDownloading(): void {
        downloadSpeed.value = 25 * 1024 * 1024
        uploadSpeed.value = 512 * 1024
      }

      function setSeeding(): void {
        downloadSpeed.value = 0
        uploadSpeed.value = 8 * 1024 * 1024
      }

      return {
        downloadSpeed,
        uploadSpeed,
        setIdle,
        setDownloading,
        setSeeding,
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          <button type="button" @click="setIdle">Idle</button>
          <button type="button" @click="setDownloading">Downloading</button>
          <button type="button" @click="setSeeding">Seeding</button>
        </div>

        <mm-transfer-stats
          :download-speed="downloadSpeed"
          :upload-speed="uploadSpeed"
        />
      </div>
    `,
  }),
}
