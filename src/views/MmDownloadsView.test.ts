import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import MmDownloadsView from './MmDownloadsView.vue'
import MmTorrentConfirmation from '../components/molecules/MmTorrentConfirmation/MmTorrentConfirmation.vue'
import MmTorrentList from '../components/organisms/MmTorrentList/MmTorrentList.vue'
import type { TorrentCardData } from '../components/molecules/MmTorrentCard/MmTorrentCard.vue'
import type { QBittorrentSnapshot, QBittorrentTorrent } from '../types/qbittorrent'
import { sendBackgroundMessage } from '../utils/background-messaging'
import type { BackgroundMessage, BackgroundResponse } from '../types/messages.ts'
import { mmDownloadsViewSelectors } from '../test/selectors/views/mmDownloadsView.selectors'

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
  return { success: true as const, downloads }
}

function actionResponse() {
  return { success: true as const, completed: true as const }
}

function mockMessages(
  handler: (message: BackgroundMessage) => BackgroundResponse<BackgroundMessage> = () =>
    downloadsResponse(),
) {
  mockedSendMessage.mockImplementation((message) => Promise.resolve(handler(message)))
}

let wrapper: VueWrapper

const view = mmDownloadsViewSelectors((selector) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.downloads-template /, ''))
})

function mountView() {
  wrapper = mount(MmDownloadsView)
  return wrapper
}

function getTorrentCards(): TorrentCardData[] {
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
    mountView()
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledWith({ type: 'GET_QBITTORRENT_DOWNLOADS' })
    expect(view.torrentNames().text()).toContain('Example Download')

    wrapper.unmount()
  })

  it('renders transfer statistics', async () => {
    mockMessages()
    mountView()
    await flushPromises()

    expect(view.stats().text()).toContain('Download')
    expect(view.stats().text()).toContain('Upload')

    wrapper.unmount()
  })

  it('shows loading state while the initial request is pending', () => {
    mockedSendMessage.mockImplementation(() => new Promise(() => {}))
    mountView()

    expect(view.loading().text()).toContain('Loading downloads…')

    wrapper.unmount()
  })

  it('shows an error when loading fails', async () => {
    mockMessages(() => ({ success: false, error: 'qBittorrent is unavailable.' }))
    mountView()
    await flushPromises()

    expect(view.errors().text()).toContain('qBittorrent is unavailable.')

    wrapper.unmount()
  })

  it('renders the empty state', async () => {
    mockMessages(() => downloadsResponse({ torrents: [], downloadSpeed: 0, uploadSpeed: 0 }))
    mountView()
    await flushPromises()

    expect(view.list().text()).toContain('No torrents')

    wrapper.unmount()
  })

  it('maps qBittorrent data into display-ready torrent cards', async () => {
    mockMessages()
    mountView()
    await flushPromises()

    expect(getTorrentCards()).toEqual([
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
    mockMessages(() => downloadsResponse({ ...snapshot, torrents: [stoppedTorrent] }))
    mountView()
    await flushPromises()

    expect(getTorrentCards()[0]).toMatchObject({
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
        torrents: [{ ...torrent, progress: Number.NaN }],
      }),
    )
    mountView()
    await flushPromises()

    expect(getTorrentCards()[0]).toMatchObject({
      progress: 0,
      progressLabel: '0.0%',
    })

    wrapper.unmount()
  })

  it('clamps torrent progress above 100 percent', async () => {
    mockMessages(() =>
      downloadsResponse({
        ...snapshot,
        torrents: [{ ...torrent, progress: 1.5 }],
      }),
    )
    mountView()
    await flushPromises()

    expect(getTorrentCards()[0]).toMatchObject({
      progress: 100,
      progressLabel: '100.0%',
    })

    wrapper.unmount()
  })

  it('polls every five seconds', async () => {
    mockMessages()
    mountView()
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(5000)

    expect(mockedSendMessage).toHaveBeenCalledTimes(2)

    wrapper.unmount()
  })

  it('stops polling after unmount', async () => {
    mockMessages()
    mountView()
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

    mountView()
    await vi.advanceTimersByTimeAsync(10000)

    expect(mockedSendMessage).toHaveBeenCalledTimes(1)

    resolveRequest(downloadsResponse())
    await flushPromises()

    wrapper.unmount()
  })

  it('refreshes manually', async () => {
    mockMessages()
    mountView()
    await flushPromises()

    expect(view.refresh().text()).toContain('Refresh')

    await view.refresh().trigger('click')
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledTimes(2)

    wrapper.unmount()
  })

  it('starts a torrent and verifies its state', async () => {
    let snapshotCalls = 0

    mockMessages((message) => {
      if (message.type === 'START_QBITTORRENT_TORRENT') return actionResponse()

      snapshotCalls += 1
      return downloadsResponse(
        snapshotCalls === 1 ? { ...snapshot, torrents: [stoppedTorrent] } : snapshot,
      )
    })

    mountView()
    await flushPromises()

    expect(view.start('Example Download').exists()).toBe(true)

    await view.start('Example Download').trigger('click')
    await flushPromises()
    await vi.advanceTimersByTimeAsync(500)

    expect(mockedSendMessage).toHaveBeenCalledWith({
      type: 'START_QBITTORRENT_TORRENT',
      hash: torrent.hash,
    })
    expect(view.torrentNames().text()).toContain('Example Download')

    wrapper.unmount()
  })

  it('stops a torrent and verifies its state', async () => {
    let snapshotCalls = 0

    mockMessages((message) => {
      if (message.type === 'STOP_QBITTORRENT_TORRENT') return actionResponse()

      snapshotCalls += 1
      return downloadsResponse(
        snapshotCalls === 1 ? snapshot : { ...snapshot, torrents: [stoppedTorrent] },
      )
    })

    mountView()
    await flushPromises()

    expect(view.stop('Example Download').exists()).toBe(true)

    await view.stop('Example Download').trigger('click')
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

    mountView()
    await flushPromises()

    await view.stop('Example Download').trigger('click')
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
    mountView()
    await flushPromises()

    expect(view.remove('Example Download').exists()).toBe(true)

    await view.remove('Example Download').trigger('click')

    expect(view.confirmation().text()).toContain('Remove torrent?')
    expect(mockedSendMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'DELETE_QBITTORRENT_TORRENT' }),
    )

    wrapper.unmount()
  })

  it('passes the selected torrent as a generic confirmation item', async () => {
    mockMessages()
    mountView()
    await flushPromises()

    await view.remove('Example Download').trigger('click')

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
    mountView()
    await flushPromises()

    await view.remove('Example Download').trigger('click')

    wrapper.getComponent(MmTorrentConfirmation).vm.$emit('confirm', {
      id: 'b'.repeat(40),
      deleteFiles: true,
    })
    await flushPromises()

    expect(mockedSendMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'DELETE_QBITTORRENT_TORRENT' }),
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

    mountView()
    await flushPromises()

    await view.remove('Example Download').trigger('click')
    await flushPromises()

    expect(view.confirm().text()).toBe('Remove torrent')

    await view.confirm().trigger('click')
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

    mountView()
    await flushPromises()

    await view.remove('Example Download').trigger('click')
    await view.deleteFiles().setValue(true)

    expect(view.confirm().text()).toBe('Remove + files')

    await view.confirm().trigger('click')
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
    mountView()
    await flushPromises()

    await view.remove('Example Download').trigger('click')
    await view.cancel().trigger('click')

    expect(view.confirmation().exists()).toBe(false)
    expect(mockedSendMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'DELETE_QBITTORRENT_TORRENT' }),
    )

    wrapper.unmount()
  })

  it('shows an action error when an operation fails', async () => {
    mockMessages((message) => {
      if (message.type === 'STOP_QBITTORRENT_TORRENT') {
        return { success: false, error: 'Unable to stop torrent.' }
      }
      return downloadsResponse()
    })

    mountView()
    await flushPromises()

    await view.stop('Example Download').trigger('click')
    await flushPromises()

    expect(view.errors().text()).toContain('Unable to stop torrent.')

    wrapper.unmount()
  })

  it('passes its page size explicitly to the torrent list', async () => {
    mockMessages()
    mountView()
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

    mountView()
    await flushPromises()

    const list = wrapper.getComponent(MmTorrentList)

    list.vm.$emit('update:page', 3)
    await flushPromises()

    expect(list.props('page')).toBe(3)

    currentSnapshot = { ...snapshot, torrents: [torrent] }

    await view.refresh().trigger('click')
    await flushPromises()

    expect(wrapper.getComponent(MmTorrentList).props('page')).toBe(1)

    wrapper.unmount()
  })
})
