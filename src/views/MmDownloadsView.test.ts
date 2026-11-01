import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import MmDownloadsView from './MmDownloadsView.vue'
import MmTorrentConfirmation from '../components/molecules/MmTorrentConfirmation/MmTorrentConfirmation.vue'
import MmTorrentList from '../components/organisms/MmTorrentList/MmTorrentList.vue'
import type { TorrentCardData } from '../components/molecules/MmTorrentCard/MmTorrentCard.vue'
import type { QBittorrentSnapshot, QBittorrentTorrent } from '../types/qbittorrent'
import { sendBackgroundMessage } from '../utils/background-messaging'
import type { BackgroundMessage, BackgroundResponse } from '../types/messages.ts'

vi.mock('../utils/background-messaging', () => ({
  sendBackgroundMessage: vi.fn(),
}))

const mockedSendMessage = vi.mocked(sendBackgroundMessage)

const torrent: QBittorrentTorrent = {
  hash: 'a'.repeat(40),
  name: 'Example Download',
  progress: 0.5,
  state: 'downloading',
  downloadSpeed: 1024 * 1024,
  uploadSpeed: 0,
  eta: 3600,
  size: 1024 ** 3,
  downloaded: 512 * 1024 ** 2,
}

const stoppedTorrent: QBittorrentTorrent = {
  ...torrent,
  state: 'stoppedDL',
  downloadSpeed: 0,
}

const snapshot: QBittorrentSnapshot = {
  torrents: [torrent],
  downloadSpeed: 1024 * 1024,
  uploadSpeed: 0,
}

function downloadsResponse(downloads: QBittorrentSnapshot = snapshot) {
  return {
    success: true as const,
    downloads,
  }
}

function actionResponse() {
  return {
    success: true as const,
    completed: true as const,
  }
}

function mockMessages(
  handler: (message: BackgroundMessage) => BackgroundResponse<BackgroundMessage> = () =>
    downloadsResponse(),
) {
  mockedSendMessage.mockImplementation((message) => Promise.resolve(handler(message)))
}

function getTorrentCards(wrapper: ReturnType<typeof mount>): TorrentCardData[] {
  return wrapper.getComponent(MmTorrentList).props('torrents') as TorrentCardData[]
}

describe('MmDownloadsView', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('loads downloads on mount', async () => {
    mockMessages()

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledWith({
      type: 'GET_QBITTORRENT_DOWNLOADS',
    })

    expect(wrapper.text()).toContain('Example Download')

    wrapper.unmount()
  })

  it('renders transfer statistics', async () => {
    mockMessages()

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    expect(wrapper.text()).toContain('Download')
    expect(wrapper.text()).toContain('Upload')

    wrapper.unmount()
  })

  it('shows loading state while the initial request is pending', () => {
    mockedSendMessage.mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(MmDownloadsView)

    expect(wrapper.text()).toContain('Loading downloads…')

    wrapper.unmount()
  })

  it('shows an error when loading fails', async () => {
    mockMessages(() => ({
      success: false,
      error: 'qBittorrent is unavailable.',
    }))

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    expect(wrapper.text()).toContain('qBittorrent is unavailable.')

    wrapper.unmount()
  })

  it('renders the empty state', async () => {
    mockMessages(() =>
      downloadsResponse({
        torrents: [],
        downloadSpeed: 0,
        uploadSpeed: 0,
      }),
    )

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    expect(wrapper.text()).toContain('No torrents')

    wrapper.unmount()
  })

  it('maps qBittorrent data into display-ready torrent cards', async () => {
    mockMessages()

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    expect(getTorrentCards(wrapper)).toEqual([
      {
        id: torrent.hash,
        name: torrent.name,
        statusLabel: 'Downloading',
        statusVariant: 'downloading',
        progress: 50,
        progressLabel: '50.0%',
        sizeLabel: '512 MiB / 1.0 GiB',
        downloadSpeedLabel: '1.0 MiB/s',
        uploadSpeedLabel: '0 B/s',
        etaLabel: '1h 0m',
        primaryActionLabel: 'Stop',
      },
    ])

    wrapper.unmount()
  })

  it('maps stopped torrents to start-labelled cards', async () => {
    mockMessages(() =>
      downloadsResponse({
        ...snapshot,
        torrents: [stoppedTorrent],
      }),
    )

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    expect(getTorrentCards(wrapper)[0]).toMatchObject({
      id: stoppedTorrent.hash,
      statusLabel: 'Stopped',
      statusVariant: 'stopped',
      primaryActionLabel: 'Start',
    })

    wrapper.unmount()
  })

  it('normalizes invalid torrent progress in the view', async () => {
    mockMessages(() =>
      downloadsResponse({
        ...snapshot,
        torrents: [
          {
            ...torrent,
            progress: Number.NaN,
          },
        ],
      }),
    )

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    expect(getTorrentCards(wrapper)[0]).toMatchObject({
      progress: 0,
      progressLabel: '0.0%',
    })

    wrapper.unmount()
  })

  it('clamps torrent progress above 100 percent', async () => {
    mockMessages(() =>
      downloadsResponse({
        ...snapshot,
        torrents: [
          {
            ...torrent,
            progress: 1.5,
          },
        ],
      }),
    )

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    expect(getTorrentCards(wrapper)[0]).toMatchObject({
      progress: 100,
      progressLabel: '100.0%',
    })

    wrapper.unmount()
  })

  it('polls every five seconds', async () => {
    mockMessages()

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(5000)

    expect(mockedSendMessage).toHaveBeenCalledTimes(2)

    wrapper.unmount()
  })

  it('stops polling after unmount', async () => {
    mockMessages()

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    wrapper.unmount()

    await vi.advanceTimersByTimeAsync(10000)

    expect(mockedSendMessage).toHaveBeenCalledTimes(1)
  })

  it('does not overlap snapshot requests', async () => {
    let resolveRequest!: (value: ReturnType<typeof downloadsResponse>) => void

    mockedSendMessage.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
    )

    const wrapper = mount(MmDownloadsView)

    await vi.advanceTimersByTimeAsync(10000)

    expect(mockedSendMessage).toHaveBeenCalledTimes(1)

    resolveRequest(downloadsResponse())

    await flushPromises()

    wrapper.unmount()
  })

  it('refreshes manually', async () => {
    mockMessages()

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    const refreshButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Refresh'))

    expect(refreshButton).toBeDefined()

    await refreshButton!.trigger('click')
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledTimes(2)

    wrapper.unmount()
  })

  it('starts a torrent and verifies its state', async () => {
    let snapshotCalls = 0

    mockMessages((message) => {
      if (message.type === 'START_QBITTORRENT_TORRENT') {
        return actionResponse()
      }

      snapshotCalls += 1

      return downloadsResponse(
        snapshotCalls === 1 ? { ...snapshot, torrents: [stoppedTorrent] } : snapshot,
      )
    })

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    const startButton = wrapper.findAll('button').find((button) => button.text().includes('Start'))

    expect(startButton).toBeDefined()

    await startButton!.trigger('click')
    await flushPromises()

    await vi.advanceTimersByTimeAsync(500)

    expect(mockedSendMessage).toHaveBeenCalledWith({
      type: 'START_QBITTORRENT_TORRENT',
      hash: torrent.hash,
    })

    expect(wrapper.text()).toContain('Example Download')

    wrapper.unmount()
  })

  it('stops a torrent and verifies its state', async () => {
    let snapshotCalls = 0

    mockMessages((message) => {
      if (message.type === 'STOP_QBITTORRENT_TORRENT') {
        return actionResponse()
      }

      snapshotCalls += 1

      return downloadsResponse(
        snapshotCalls === 1 ? snapshot : { ...snapshot, torrents: [stoppedTorrent] },
      )
    })

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    const stopButton = wrapper.findAll('button').find((button) => button.text().includes('Stop'))

    expect(stopButton).toBeDefined()

    await stopButton!.trigger('click')
    await flushPromises()

    await vi.advanceTimersByTimeAsync(500)

    expect(mockedSendMessage).toHaveBeenCalledWith({
      type: 'STOP_QBITTORRENT_TORRENT',
      hash: torrent.hash,
    })

    wrapper.unmount()
  })

  it('maps a pending stop action to the generic primary state', async () => {
    let resolveAction!: (value: ReturnType<typeof actionResponse>) => void

    mockedSendMessage.mockImplementation((message) => {
      if (message.type === 'STOP_QBITTORRENT_TORRENT') {
        return new Promise((resolve) => {
          resolveAction = resolve
        })
      }

      return Promise.resolve(downloadsResponse())
    })

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    await wrapper.get('[aria-label="Stop Example Download"]').trigger('click')

    await flushPromises()

    expect(wrapper.getComponent(MmTorrentList).props('pendingAction')).toEqual({
      id: torrent.hash,
      action: 'primary',
    })

    expect(wrapper.getComponent(MmTorrentList).props('disabled')).toBe(true)

    resolveAction(actionResponse())

    await flushPromises()

    wrapper.unmount()
  })

  it('does not remove a torrent before confirmation', async () => {
    mockMessages()

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    const removeButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Remove'))

    expect(removeButton).toBeDefined()

    await removeButton!.trigger('click')

    expect(wrapper.text()).toContain('Remove torrent?')

    expect(mockedSendMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'DELETE_QBITTORRENT_TORRENT',
      }),
    )

    wrapper.unmount()
  })

  it('passes the selected torrent as a generic confirmation item', async () => {
    mockMessages()

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    await wrapper.get('[aria-label="Remove Example Download"]').trigger('click')

    const confirmation = wrapper.getComponent(MmTorrentConfirmation)

    expect(confirmation.props('item')).toEqual({
      id: torrent.hash,
      name: torrent.name,
    })

    expect(confirmation.props('title')).toBe('Remove torrent?')

    expect(confirmation.props('description')).toContain(
      'This will remove the torrent from qBittorrent.',
    )

    expect(confirmation.props('deleteFilesLabel')).toBe('Also delete downloaded files')

    wrapper.unmount()
  })

  it('does not remove a torrent when the confirmation ID does not match', async () => {
    mockMessages()

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    await wrapper.get('[aria-label="Remove Example Download"]').trigger('click')

    const confirmation = wrapper.getComponent(MmTorrentConfirmation)

    confirmation.vm.$emit('confirm', {
      id: 'b'.repeat(40),
      deleteFiles: true,
    })

    await flushPromises()

    expect(mockedSendMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'DELETE_QBITTORRENT_TORRENT',
      }),
    )

    wrapper.unmount()
  })

  it('removes a torrent without deleting files by default', async () => {
    let removed = false

    mockMessages((message) => {
      if (message.type === 'DELETE_QBITTORRENT_TORRENT') {
        removed = true
        return actionResponse()
      }

      return downloadsResponse(removed ? { ...snapshot, torrents: [] } : snapshot)
    })

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    const removeButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Remove'))

    await removeButton!.trigger('click')
    await flushPromises()

    const confirmButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Remove torrent')

    expect(confirmButton).toBeDefined()

    await confirmButton!.trigger('click')
    await flushPromises()

    await vi.advanceTimersByTimeAsync(500)

    expect(mockedSendMessage).toHaveBeenCalledWith({
      type: 'DELETE_QBITTORRENT_TORRENT',
      hash: torrent.hash,
      deleteFiles: false,
    })

    wrapper.unmount()
  })

  it('deletes downloaded files only when explicitly selected', async () => {
    let removed = false

    mockMessages((message) => {
      if (message.type === 'DELETE_QBITTORRENT_TORRENT') {
        removed = true
        return actionResponse()
      }

      return downloadsResponse(removed ? { ...snapshot, torrents: [] } : snapshot)
    })

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    const removeButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Remove'))

    await removeButton!.trigger('click')

    await wrapper.get('input[type="checkbox"]').setValue(true)

    const confirmButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Remove + files')

    expect(confirmButton).toBeDefined()

    await confirmButton!.trigger('click')
    await flushPromises()

    await vi.advanceTimersByTimeAsync(500)

    expect(mockedSendMessage).toHaveBeenCalledWith({
      type: 'DELETE_QBITTORRENT_TORRENT',
      hash: torrent.hash,
      deleteFiles: true,
    })

    wrapper.unmount()
  })

  it('does not perform removal when cancelled', async () => {
    mockMessages()

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    const removeButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Remove'))

    await removeButton!.trigger('click')

    const cancelButton = wrapper.findAll('button').find((button) => button.text() === 'Cancel')

    await cancelButton!.trigger('click')

    expect(wrapper.text()).not.toContain('Remove torrent?')

    expect(mockedSendMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'DELETE_QBITTORRENT_TORRENT',
      }),
    )

    wrapper.unmount()
  })

  it('shows an action error when an operation fails', async () => {
    mockMessages((message) => {
      if (message.type === 'STOP_QBITTORRENT_TORRENT') {
        return {
          success: false,
          error: 'Unable to stop torrent.',
        }
      }

      return downloadsResponse()
    })

    const wrapper = mount(MmDownloadsView)

    await flushPromises()

    const stopButton = wrapper.findAll('button').find((button) => button.text().includes('Stop'))

    await stopButton!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Unable to stop torrent.')

    wrapper.unmount()
  })

  it('passes its page size explicitly to the torrent list', async () => {
    mockMessages()

    const wrapper = mount(MmDownloadsView)
    await flushPromises()

    expect(wrapper.getComponent(MmTorrentList).props('pageSize')).toBe(10)

    wrapper.unmount()
  })

  it('clamps the current page when the torrent count shrinks', async () => {
    const manyTorrents = Array.from({ length: 21 }, (_, index) => ({
      ...torrent,
      hash: String(index).padStart(40, '0'),
      name: `Download ${index + 1}`,
    }))

    let currentSnapshot: QBittorrentSnapshot = {
      ...snapshot,
      torrents: manyTorrents,
    }

    mockMessages(() => downloadsResponse(currentSnapshot))

    const wrapper = mount(MmDownloadsView)
    await flushPromises()

    const list = wrapper.getComponent(MmTorrentList)

    list.vm.$emit('update:page', 3)
    await flushPromises()

    expect(list.props('page')).toBe(3)

    currentSnapshot = {
      ...snapshot,
      torrents: [torrent],
    }

    const refreshButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Refresh'))

    expect(refreshButton).toBeDefined()

    await refreshButton!.trigger('click')
    await flushPromises()

    expect(wrapper.getComponent(MmTorrentList).props('page')).toBe(1)

    wrapper.unmount()
  })
})
