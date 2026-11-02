import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmTorrentList from './MmTorrentList.vue'
import type { TorrentCardData } from '../../molecules/MmTorrentCard/MmTorrentCard.vue'
import { mmTorrentListSelectors } from '../../../test/selectors/organisms/mmTorrentList.selectors'
import { mmTorrentCardSelectors } from '../../../test/selectors/molecules/mmTorrentCard.selectors'
import { mmPaginationSelectors } from '../../../test/selectors/molecules/mmPagination.selectors'

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

type ListProps = Partial<InstanceType<typeof MmTorrentList>['$props']>

let wrapper: VueWrapper

const query = (selector: string) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^section\.torrent-list /, ''))
}

const list = mmTorrentListSelectors(query)
const card = mmTorrentCardSelectors(query)
const pagination = mmPaginationSelectors(query)

function createWrapper(props: ListProps = {}) {
  wrapper = mount(MmTorrentList, {
    props: { torrents: createTorrents(1), page: 1, ...props },
  })
  return wrapper
}

describe('MmTorrentList', () => {
  it('renders an accessible torrent list section', () => {
    createWrapper()

    expect(list.labelled('Torrent downloads').exists()).toBe(true)
  })

  it('renders torrent cards', () => {
    createWrapper({ torrents: createTorrents(3) })

    expect(wrapper.findAll('.torrent-card')).toHaveLength(3)
    expect(list.cards().exists()).toBe(true)
  })

  it('uses semantic list markup', () => {
    createWrapper({ torrents: createTorrents(3) })

    expect(wrapper.findAll('ul > li')).toHaveLength(3)
    expect(list.items().exists()).toBe(true)
  })

  it('shows an empty state when no torrents exist', () => {
    createWrapper({ torrents: [] })

    expect(list.emptyTitle().text()).toBe('No torrents found')
    expect(list.emptyDescription().text()).toBe('Torrents added to qBittorrent will appear here.')
    expect(list.cards().exists()).toBe(false)
  })

  it('does not show pagination when the list is empty', () => {
    createWrapper({ torrents: [] })

    expect(list.pagination().exists()).toBe(false)
  })

  it('shows ten torrents per page by default', () => {
    createWrapper({ torrents: createTorrents(15) })

    expect(wrapper.findAll('.torrent-card')).toHaveLength(10)
    expect(list.name(0).text()).toBe('Torrent 1')
    expect(list.name(9).text()).toBe('Torrent 10')
    expect(list.get().text()).not.toContain('Torrent 11')
  })

  it('shows the correct torrents on the second page', () => {
    createWrapper({ torrents: createTorrents(15), page: 2 })

    expect(wrapper.findAll('.torrent-card__name').map((element) => element.text())).toEqual([
      'Torrent 11',
      'Torrent 12',
      'Torrent 13',
      'Torrent 14',
      'Torrent 15',
    ])
  })

  it('supports a custom page size', () => {
    createWrapper({ torrents: createTorrents(8), pageSize: 3 })

    expect(wrapper.findAll('.torrent-card')).toHaveLength(3)
  })

  it('falls back to the default page size when invalid', () => {
    createWrapper({ torrents: createTorrents(15), pageSize: 0 })

    expect(wrapper.findAll('.torrent-card')).toHaveLength(10)
  })

  it('emits page changes from pagination', async () => {
    createWrapper({ torrents: createTorrents(15) })

    await pagination.next().trigger('click')

    expect(wrapper.emitted('update:page')?.[0]).toEqual([2])
  })

  it('corrects the page when torrents are removed', async () => {
    createWrapper({ torrents: createTorrents(15), page: 2 })

    await wrapper.setProps({ torrents: createTorrents(8) })

    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    expect(wrapper.findAll('.torrent-card')).toHaveLength(8)
  })

  it('renders the supplied torrent display data', () => {
    createWrapper()

    expect(card.status().text()).toBe('Downloading')
    expect(card.percentage().text()).toBe('50.0%')
    expect(card.size().text()).toBe('512 MiB / 1.0 GiB')
    expect(list.progressbar(0).attributes('aria-valuenow')).toBe('50')
    expect(list.get().text()).toContain('1.0 MiB/s')
    expect(list.get().text()).toContain('512 KiB/s')
    expect(list.get().text()).toContain('ETA: 1h 0m')
  })

  it('renders the downloading status variant', () => {
    createWrapper()

    expect(card.statusVariant('downloading').exists()).toBe(true)
  })

  it('renders the seeding status variant', () => {
    createWrapper({
      torrents: [{ ...createTorrent(1), statusLabel: 'Seeding', statusVariant: 'seeding' }],
    })

    expect(card.statusVariant('seeding').exists()).toBe(true)
  })

  it('renders the stopped status variant', () => {
    createWrapper({
      torrents: [
        {
          ...createTorrent(1),
          statusLabel: 'Stopped',
          statusVariant: 'stopped',
          primaryActionLabel: 'Start',
        },
      ],
    })

    expect(card.statusVariant('stopped').exists()).toBe(true)
  })

  it('renders the error status variant', () => {
    createWrapper({
      torrents: [{ ...createTorrent(1), statusLabel: 'Error', statusVariant: 'error' }],
    })

    expect(card.statusVariant('error').exists()).toBe(true)
  })

  it('renders the neutral status variant', () => {
    createWrapper({
      torrents: [{ ...createTorrent(1), statusLabel: 'Stalled', statusVariant: 'neutral' }],
    })

    expect(card.statusVariant('neutral').exists()).toBe(true)
  })

  it('passes progress values through to the card', () => {
    createWrapper({
      torrents: [{ ...createTorrent(1), progress: 0, progressLabel: '0.0%' }],
    })

    expect(list.progressbar(0).attributes('aria-valuenow')).toBe('0')
    expect(card.percentage().text()).toBe('0.0%')
  })

  it('renders 100 percent progress', () => {
    createWrapper({
      torrents: [{ ...createTorrent(1), progress: 100, progressLabel: '100.0%' }],
    })

    expect(list.progressbar(0).attributes('aria-valuenow')).toBe('100')
    expect(card.percentage().text()).toBe('100.0%')
  })

  it('forwards a primary action for a start-labelled torrent', async () => {
    const torrent: TorrentCardData = {
      ...createTorrent(1),
      statusLabel: 'Stopped',
      statusVariant: 'stopped',
      primaryActionLabel: 'Start',
    }
    createWrapper({ torrents: [torrent] })

    await card.primaryLabelled('Start Torrent 1').trigger('click')

    expect(wrapper.emitted('primaryAction')?.[0]).toEqual([torrent.id])
  })

  it('forwards a primary action for another start-labelled torrent', async () => {
    const torrent: TorrentCardData = {
      ...createTorrent(1),
      statusLabel: 'Paused',
      statusVariant: 'stopped',
      primaryActionLabel: 'Start',
    }
    createWrapper({ torrents: [torrent] })

    await card.primaryLabelled('Start Torrent 1').trigger('click')

    expect(wrapper.emitted('primaryAction')?.[0]).toEqual([torrent.id])
  })

  it('forwards a primary action for a stop-labelled torrent', async () => {
    const torrent = createTorrent(1)
    createWrapper({ torrents: [torrent] })

    await card.primaryLabelled('Stop Torrent 1').trigger('click')

    expect(wrapper.emitted('primaryAction')?.[0]).toEqual([torrent.id])
  })

  it('forwards remove events', async () => {
    const torrent = createTorrent(1)
    createWrapper({ torrents: [torrent] })

    await card.removeLabelled('Remove Torrent 1').trigger('click')

    expect(wrapper.emitted('remove')?.[0]).toEqual([torrent.id])
  })

  it('disables actions when the list is disabled', async () => {
    createWrapper({ disabled: true })

    const stopButton = card.primaryLabelled('Stop Torrent 1')
    const removeButton = card.removeLabelled('Remove Torrent 1')

    expect(stopButton.attributes('disabled')).toBeDefined()
    expect(removeButton.attributes('disabled')).toBeDefined()

    await stopButton.trigger('click')
    await removeButton.trigger('click')

    expect(wrapper.emitted('primaryAction')).toBeUndefined()
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('marks only the pending primary action as busy', () => {
    const torrents = createTorrents(2)
    createWrapper({
      torrents,
      pendingAction: { id: torrents[0]!.id, action: 'primary' },
    })

    expect(card.primaryLabelled('Stop Torrent 1').attributes('aria-busy')).toBe('true')
    expect(card.primaryLabelled('Stop Torrent 2').attributes('aria-busy')).toBeUndefined()
  })

  it('marks a pending start-labelled primary action as busy', () => {
    const torrent = { ...createTorrent(1), primaryActionLabel: 'Start' }
    createWrapper({
      torrents: [torrent],
      pendingAction: { id: torrent.id, action: 'primary' },
    })

    expect(card.primaryLabelled('Start Torrent 1').attributes('aria-busy')).toBe('true')
  })

  it('marks a pending remove action as busy', () => {
    const torrent = createTorrent(1)
    createWrapper({
      torrents: [torrent],
      pendingAction: { id: torrent.id, action: 'remove' },
    })

    expect(card.removeLabelled('Remove Torrent 1').attributes('aria-busy')).toBe('true')
    expect(card.primaryLabelled('Stop Torrent 1').attributes('aria-busy')).toBeUndefined()
  })

  it('does not emit actions for a pending torrent', async () => {
    const torrent = createTorrent(1)
    createWrapper({
      torrents: [torrent],
      pendingAction: { id: torrent.id, action: 'primary' },
    })

    await card.removeLabelled('Remove Torrent 1').trigger('click')

    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('updates card display data when props change', async () => {
    const torrent = createTorrent(1)
    createWrapper({ torrents: [torrent] })

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

    expect(card.status().text()).toBe('Stopped')
    expect(card.primaryLabelled('Start Torrent 1').exists()).toBe(true)
  })
})
