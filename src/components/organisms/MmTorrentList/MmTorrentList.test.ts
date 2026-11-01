import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmTorrentList from './MmTorrentList.vue'
import type { TorrentCardData } from '../../molecules/MmTorrentCard/MmTorrentCard.vue'

function createTorrent(index: number): TorrentCardData {
  return {
    id: index.toString(16).padStart(40, '0'),
    name: `Torrent ${index}`,
    statusLabel: 'Downloading',
    statusVariant: 'downloading',
    progress: 50,
    progressLabel: '50.0%',
    sizeLabel: '512 MiB / 1.0 GiB',
    downloadSpeedLabel: '1.0 MiB/s',
    uploadSpeedLabel: '512 KiB/s',
    etaLabel: '1h 0m',
    primaryActionLabel: 'Stop',
  }
}

function createTorrents(count: number): TorrentCardData[] {
  return Array.from({ length: count }, (_, index) => createTorrent(index + 1))
}

describe('MmTorrentList', () => {
  it('renders an accessible torrent list section', () => {
    const wrapper = mount(MmTorrentList, {
      props: { torrents: createTorrents(1), page: 1 },
    })

    expect(wrapper.get('section').attributes('aria-label')).toBe('Torrent downloads')
  })

  it('renders torrent cards', () => {
    const wrapper = mount(MmTorrentList, {
      props: { torrents: createTorrents(3), page: 1 },
    })

    expect(wrapper.findAll('.torrent-card')).toHaveLength(3)
  })

  it('uses semantic list markup', () => {
    const wrapper = mount(MmTorrentList, {
      props: { torrents: createTorrents(3), page: 1 },
    })

    expect(wrapper.findAll('ul > li')).toHaveLength(3)
  })

  it('shows an empty state when no torrents exist', () => {
    const wrapper = mount(MmTorrentList, {
      props: { torrents: [], page: 1 },
    })

    expect(wrapper.text()).toContain('No torrents found')
    expect(wrapper.text()).toContain('Torrents added to qBittorrent will appear here.')
    expect(wrapper.find('.torrent-card').exists()).toBe(false)
  })

  it('does not show pagination when the list is empty', () => {
    const wrapper = mount(MmTorrentList, {
      props: { torrents: [], page: 1 },
    })

    expect(wrapper.find('.pagination').exists()).toBe(false)
  })

  it('shows ten torrents per page by default', () => {
    const wrapper = mount(MmTorrentList, {
      props: { torrents: createTorrents(15), page: 1 },
    })

    expect(wrapper.findAll('.torrent-card')).toHaveLength(10)
    expect(wrapper.text()).toContain('Torrent 1')
    expect(wrapper.text()).not.toContain('Torrent 11')
  })

  it('shows the correct torrents on the second page', () => {
    const wrapper = mount(MmTorrentList, {
      props: { torrents: createTorrents(15), page: 2 },
    })

    const names = wrapper.findAll('.torrent-card__name').map((element) => element.text())

    expect(names).toEqual(['Torrent 11', 'Torrent 12', 'Torrent 13', 'Torrent 14', 'Torrent 15'])
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
      props: { torrents: createTorrents(15), page: 1 },
    })

    await wrapper.get('[aria-label="Next page"]').trigger('click')

    expect(wrapper.emitted('update:page')?.[0]).toEqual([2])
  })

  it('corrects the page when torrents are removed', async () => {
    const wrapper = mount(MmTorrentList, {
      props: { torrents: createTorrents(15), page: 2 },
    })

    await wrapper.setProps({
      torrents: createTorrents(8),
    })

    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    expect(wrapper.findAll('.torrent-card')).toHaveLength(8)
  })

  it('renders the supplied torrent display data', () => {
    const wrapper = mount(MmTorrentList, {
      props: { torrents: createTorrents(1), page: 1 },
    })

    expect(wrapper.get('.torrent-card__status').text()).toBe('Downloading')
    expect(wrapper.get('.torrent-card__percentage').text()).toBe('50.0%')
    expect(wrapper.get('.torrent-card__size').text()).toBe('512 MiB / 1.0 GiB')
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('50')
    expect(wrapper.text()).toContain('1.0 MiB/s')
    expect(wrapper.text()).toContain('512 KiB/s')
    expect(wrapper.text()).toContain('ETA: 1h 0m')
  })

  it('renders the downloading status variant', () => {
    const wrapper = mount(MmTorrentList, {
      props: { torrents: createTorrents(1), page: 1 },
    })

    expect(wrapper.get('.torrent-card__status').classes()).toContain(
      'torrent-card__status--downloading',
    )
  })

  it('renders the seeding status variant', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [
          {
            ...createTorrent(1),
            statusLabel: 'Seeding',
            statusVariant: 'seeding',
          },
        ],
        page: 1,
      },
    })

    expect(wrapper.get('.torrent-card__status').classes()).toContain(
      'torrent-card__status--seeding',
    )
  })

  it('renders the stopped status variant', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [
          {
            ...createTorrent(1),
            statusLabel: 'Stopped',
            statusVariant: 'stopped',
            primaryActionLabel: 'Start',
          },
        ],
        page: 1,
      },
    })

    expect(wrapper.get('.torrent-card__status').classes()).toContain(
      'torrent-card__status--stopped',
    )
  })

  it('renders the error status variant', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [
          {
            ...createTorrent(1),
            statusLabel: 'Error',
            statusVariant: 'error',
          },
        ],
        page: 1,
      },
    })

    expect(wrapper.get('.torrent-card__status').classes()).toContain('torrent-card__status--error')
  })

  it('renders the neutral status variant', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [
          {
            ...createTorrent(1),
            statusLabel: 'Stalled',
            statusVariant: 'neutral',
          },
        ],
        page: 1,
      },
    })

    expect(wrapper.get('.torrent-card__status').classes()).toContain(
      'torrent-card__status--neutral',
    )
  })

  it('passes progress values through to the card', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [
          {
            ...createTorrent(1),
            progress: 0,
            progressLabel: '0.0%',
          },
        ],
        page: 1,
      },
    })

    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
    expect(wrapper.get('.torrent-card__percentage').text()).toBe('0.0%')
  })

  it('renders 100 percent progress', () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [
          {
            ...createTorrent(1),
            progress: 100,
            progressLabel: '100.0%',
          },
        ],
        page: 1,
      },
    })

    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
    expect(wrapper.get('.torrent-card__percentage').text()).toBe('100.0%')
  })

  it('forwards a primary action for a start-labelled torrent', async () => {
    const torrent = {
      ...createTorrent(1),
      statusLabel: 'Stopped',
      statusVariant: 'stopped' as const,
      primaryActionLabel: 'Start',
    }

    const wrapper = mount(MmTorrentList, {
      props: { torrents: [torrent], page: 1 },
    })

    await wrapper.get('[aria-label="Start Torrent 1"]').trigger('click')

    expect(wrapper.emitted('primaryAction')?.[0]).toEqual([torrent.id])
  })

  it('forwards a primary action for another start-labelled torrent', async () => {
    const torrent = {
      ...createTorrent(1),
      statusLabel: 'Paused',
      statusVariant: 'stopped' as const,
      primaryActionLabel: 'Start',
    }

    const wrapper = mount(MmTorrentList, {
      props: { torrents: [torrent], page: 1 },
    })

    await wrapper.get('[aria-label="Start Torrent 1"]').trigger('click')

    expect(wrapper.emitted('primaryAction')?.[0]).toEqual([torrent.id])
  })

  it('forwards a primary action for a stop-labelled torrent', async () => {
    const torrent = createTorrent(1)

    const wrapper = mount(MmTorrentList, {
      props: { torrents: [torrent], page: 1 },
    })

    await wrapper.get('[aria-label="Stop Torrent 1"]').trigger('click')

    expect(wrapper.emitted('primaryAction')?.[0]).toEqual([torrent.id])
  })

  it('forwards remove events', async () => {
    const torrent = createTorrent(1)

    const wrapper = mount(MmTorrentList, {
      props: { torrents: [torrent], page: 1 },
    })

    await wrapper.get('[aria-label="Remove Torrent 1"]').trigger('click')

    expect(wrapper.emitted('remove')?.[0]).toEqual([torrent.id])
  })

  it('disables actions when the list is disabled', async () => {
    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: createTorrents(1),
        page: 1,
        disabled: true,
      },
    })

    const stopButton = wrapper.get('[aria-label="Stop Torrent 1"]')
    const removeButton = wrapper.get('[aria-label="Remove Torrent 1"]')

    expect(stopButton.attributes('disabled')).toBeDefined()
    expect(removeButton.attributes('disabled')).toBeDefined()

    await stopButton.trigger('click')
    await removeButton.trigger('click')

    expect(wrapper.emitted('primaryAction')).toBeUndefined()
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('marks only the pending primary action as busy', () => {
    const torrents = createTorrents(2)

    const wrapper = mount(MmTorrentList, {
      props: {
        torrents,
        page: 1,
        pendingAction: {
          id: torrents[0]!.id,
          action: 'primary',
        },
      },
    })

    expect(wrapper.get('[aria-label="Stop Torrent 1"]').attributes('aria-busy')).toBe('true')

    expect(wrapper.get('[aria-label="Stop Torrent 2"]').attributes('aria-busy')).toBeUndefined()
  })

  it('marks a pending start-labelled primary action as busy', () => {
    const torrent = {
      ...createTorrent(1),
      primaryActionLabel: 'Start',
    }

    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [torrent],
        page: 1,
        pendingAction: {
          id: torrent.id,
          action: 'primary',
        },
      },
    })

    expect(wrapper.get('[aria-label="Start Torrent 1"]').attributes('aria-busy')).toBe('true')
  })

  it('marks a pending remove action as busy', () => {
    const torrent = createTorrent(1)

    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [torrent],
        page: 1,
        pendingAction: {
          id: torrent.id,
          action: 'remove',
        },
      },
    })

    expect(wrapper.get('[aria-label="Remove Torrent 1"]').attributes('aria-busy')).toBe('true')

    expect(wrapper.get('[aria-label="Stop Torrent 1"]').attributes('aria-busy')).toBeUndefined()
  })

  it('does not emit actions for a pending torrent', async () => {
    const torrent = createTorrent(1)

    const wrapper = mount(MmTorrentList, {
      props: {
        torrents: [torrent],
        page: 1,
        pendingAction: {
          id: torrent.id,
          action: 'primary',
        },
      },
    })

    await wrapper.get('[aria-label="Remove Torrent 1"]').trigger('click')

    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('updates card display data when props change', async () => {
    const torrent = createTorrent(1)

    const wrapper = mount(MmTorrentList, {
      props: { torrents: [torrent], page: 1 },
    })

    await wrapper.setProps({
      torrents: [
        {
          ...torrent,
          statusLabel: 'Stopped',
          statusVariant: 'stopped',
          primaryActionLabel: 'Start',
        },
      ],
    })

    expect(wrapper.get('.torrent-card__status').text()).toBe('Stopped')
    expect(wrapper.find('[aria-label="Start Torrent 1"]').exists()).toBe(true)
  })
})
