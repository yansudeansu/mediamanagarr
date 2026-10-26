import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmTorrentList from './MmTorrentList.vue'
import type { QBittorrentTorrent } from '../../../types/qbittorrent'

function createTorrent(index: number): QBittorrentTorrent {
  return {
    hash: index.toString(16).padStart(40, '0'),
    name: `Torrent ${index}`,
    progress: 0.5,
    state: 'downloading',
    downloadSpeed: 1024 * 1024,
    uploadSpeed: 512 * 1024,
    eta: 3600,
    size: 1024 ** 3,
    downloaded: 512 * 1024 ** 2,
  }
}

function createTorrents(count: number): QBittorrentTorrent[] {
  return Array.from({ length: count }, (_, index) => createTorrent(index + 1))
}

describe('MmTorrentList', () => {
  it('renders an accessible torrent list section', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: createTorrents(1),
        page: 1,
      },
    })

    expect(wrapper.get('section').attributes('aria-label')).toBe('Torrent downloads')
  })

  it('renders torrent cards', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: createTorrents(3),
        page: 1,
      },
    })

    expect(wrapper.findAll('.torrent-card')).toHaveLength(3)
  })

  it('uses semantic list markup', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: createTorrents(3),
        page: 1,
      },
    })

    expect(wrapper.findAll('ul > li')).toHaveLength(3)
  })

  it('shows an empty state when no torrents exist', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [],
        page: 1,
      },
    })

    expect(wrapper.text()).toContain('No torrents found')
    expect(wrapper.text()).toContain('Torrents added to qBittorrent will appear here.')
    expect(wrapper.find('.torrent-card').exists()).toBe(false)
  })

  it('does not show pagination when the list is empty', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [],
        page: 1,
      },
    })

    expect(wrapper.find('.pagination').exists()).toBe(false)
  })

  it('shows ten torrents per page by default', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: createTorrents(15),
        page: 1,
      },
    })

    expect(wrapper.findAll('.torrent-card')).toHaveLength(10)
    expect(wrapper.text()).toContain('Torrent 1')
    expect(wrapper.text()).not.toContain('Torrent 11')
  })

  it('shows the correct torrents on the second page', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: createTorrents(15),
        page: 2,
      },
    })

    expect(wrapper.findAll('.torrent-card')).toHaveLength(5)
    expect(wrapper.text()).toContain('Torrent 11')
    expect(wrapper.text()).not.toContain('Torrent 1\n')
  })

  it('supports a custom page size', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: createTorrents(8),
        page: 1,
        pageSize: 3,
      },
    })

    expect(wrapper.findAll('.torrent-card')).toHaveLength(3)
  })

  it('falls back to the default page size when invalid', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: createTorrents(15),
        page: 1,
        pageSize: 0,
      },
    })

    expect(wrapper.findAll('.torrent-card')).toHaveLength(10)
  })

  it('emits page changes from pagination', async () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: createTorrents(15),
        page: 1,
      },
    })

    await wrapper.get('[aria-label="Next page"]').trigger('click')

    expect(wrapper.emitted('update:page')?.[0]).toEqual([2])
  })

  it('corrects the page when torrents are removed', async () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: createTorrents(15),
        page: 2,
      },
    })

    await wrapper.setProps({
      torrents: createTorrents(8),
    })

    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    expect(wrapper.findAll('.torrent-card')).toHaveLength(8)
  })

  it('forwards start events', async () => {
    const torrent = {
      ...createTorrent(1),
      state: 'stoppedDL',
    }

    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [torrent],
        page: 1,
      },
    })

    await wrapper.get('[aria-label="Start Torrent 1"]').trigger('click')

    expect(wrapper.emitted('start')?.[0]).toEqual([torrent.hash])
  })

  it('forwards stop events', async () => {
    const torrent = createTorrent(1)

    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [torrent],
        page: 1,
      },
    })

    await wrapper.get('[aria-label="Stop Torrent 1"]').trigger('click')

    expect(wrapper.emitted('stop')?.[0]).toEqual([torrent.hash])
  })

  it('forwards remove events', async () => {
    const torrent = createTorrent(1)

    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [torrent],
        page: 1,
      },
    })

    await wrapper.get('[aria-label="Remove Torrent 1"]').trigger('click')

    expect(wrapper.emitted('remove')?.[0]).toEqual([torrent.hash])
  })

  it('disables actions when the list is disabled', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: createTorrents(1),
        page: 1,
        disabled: true,
      },
    })

    expect(wrapper.get('[aria-label="Stop Torrent 1"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[aria-label="Remove Torrent 1"]').attributes('disabled')).toBeDefined()
  })

  it('passes pending actions to the matching torrent', () => {
    const torrents = createTorrents(2)

    const wrapper = mount(MmTorrentList, {
      props: {
        torrents,
        page: 1,
        pendingAction: {
          hash: torrents[0].hash,
          action: 'stop',
        },
      },
    })

    expect(wrapper.get('[aria-label="Stop Torrent 1"]').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[aria-label="Stop Torrent 2"]').attributes('aria-busy')).toBeUndefined()
  })
})
