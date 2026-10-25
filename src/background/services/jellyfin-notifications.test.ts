import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { JellyfinArrival } from '../../types/jellyfin'
import type { ServiceConfig } from '../../types/service'
import { getJellyfinUserSelection } from '../../utils/jellyfin-storage'
import { getServiceConfig } from '../../utils/service-storage'
import { fetchJellyfinArrivals } from './jellyfin-arrivals'
import {
  clearJellyfinNotifications,
  loadJellyfinArrivalsPage,
  scanJellyfinArrivals,
  setJellyfinArrivalUnread,
} from './jellyfin-notifications'

vi.mock('../../utils/jellyfin-storage', () => ({
  getJellyfinUserSelection: vi.fn(),
}))

vi.mock('../../utils/service-storage', () => ({
  getServiceConfig: vi.fn(),
}))

vi.mock('./jellyfin-arrivals', () => ({
  fetchJellyfinArrivals: vi.fn(),
}))

const config = {
  url: 'https://jellyfin.example.com',
  apiKey: 'test-api-key',
} as ServiceConfig

const STORAGE_KEY = 'mediaManagarrArrivals'

let storedValues: Record<string, unknown>

function arrival(id: string): JellyfinArrival {
  return {
    id,
    type: 'Movie',
    title: `Movie ${id}`,
    subtitle: '2026',
    dateAdded: '2026-01-01T12:00:00Z',
    imageId: id,
    imageTag: null,
    unread: false,
  }
}

function mockArrivals(...ids: string[]): void {
  vi.mocked(fetchJellyfinArrivals).mockResolvedValue({
    items: ids.map(arrival),
    total: ids.length,
  })
}

function getStoredState() {
  return storedValues[STORAGE_KEY] as {
    serverUrl: string
    userId: string
    state: {
      initialized: boolean
      knownIds: string[]
      unreadIds: string[]
    }
  }
}

describe('Jellyfin notification tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    storedValues = {}

    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get: vi.fn(async (key: string) => ({
            [key]: storedValues[key],
          })),
          set: vi.fn(async (values: Record<string, unknown>) => {
            Object.assign(storedValues, values)
          }),
        },
      },
    })

    vi.mocked(getServiceConfig).mockResolvedValue(config)
    vi.mocked(getJellyfinUserSelection).mockResolvedValue('user-1')
  })

  it('initializes without flagging existing items as new', async () => {
    mockArrivals('movie-1', 'movie-2')

    const result = await scanJellyfinArrivals()

    expect(result.unreadCount).toBe(0)
    expect(result.items.every((item) => !item.unread)).toBe(true)

    expect(getStoredState()).toEqual({
      serverUrl: config.url,
      userId: 'user-1',
      state: {
        initialized: true,
        knownIds: ['movie-1', 'movie-2'],
        unreadIds: [],
      },
    })
  })

  it('detects newly added items after initialization', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-2', 'movie-1')
    const result = await scanJellyfinArrivals()

    expect(result.unreadCount).toBe(1)
    expect(result.items.find((item) => item.id === 'movie-2')?.unread).toBe(true)
    expect(result.items.find((item) => item.id === 'movie-1')?.unread).toBe(false)
    expect(getStoredState().state.unreadIds).toEqual(['movie-2'])
  })

  it('does not repeatedly notify about known items', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-2', 'movie-1')
    await scanJellyfinArrivals()
    const result = await scanJellyfinArrivals()

    expect(result.unreadCount).toBe(1)
    expect(getStoredState().state.unreadIds).toEqual(['movie-2'])
  })

  it('removes notifications for items no longer in the recent scan', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-2', 'movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-1')
    const result = await scanJellyfinArrivals()

    expect(result.unreadCount).toBe(0)
    expect(getStoredState().state.unreadIds).toEqual([])
  })

  it('dismisses an individual notification', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-2', 'movie-1')
    await scanJellyfinArrivals()

    const count = await setJellyfinArrivalUnread('movie-2', false)

    expect(count).toBe(0)
    expect(getStoredState().state.unreadIds).toEqual([])
  })

  it('manually flags an item as new', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    const count = await setJellyfinArrivalUnread('movie-1', true)

    expect(count).toBe(1)
    expect(getStoredState().state.unreadIds).toEqual(['movie-1'])
  })

  it('rejects actions for items outside the newest 50 arrivals', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    await expect(setJellyfinArrivalUnread('missing-item', true)).rejects.toThrow(
      'This item is no longer in your unwatched arrivals.',
    )
  })

  it('clears all notifications', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-2', 'movie-1')
    await scanJellyfinArrivals()

    const count = await clearJellyfinNotifications()

    expect(count).toBe(0)
    expect(getStoredState().state.unreadIds).toEqual([])
  })

  it('resets notification state when the selected Jellyfin user changes', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    vi.mocked(getJellyfinUserSelection).mockResolvedValue('user-2')

    mockArrivals('movie-2')
    const result = await scanJellyfinArrivals()

    expect(result.unreadCount).toBe(0)
    expect(getStoredState().userId).toBe('user-2')
    expect(getStoredState().state.knownIds).toEqual(['movie-2'])
  })

  it('uses a separate 50-item scan before fetching a requested All page', async () => {
    vi.mocked(fetchJellyfinArrivals)
      .mockResolvedValueOnce({
        items: [arrival('movie-1')],
        total: 50,
      })
      .mockResolvedValueOnce({
        items: [arrival('movie-20')],
        total: 50,
      })

    const result = await loadJellyfinArrivalsPage(2, 10, 'all')

    expect(fetchJellyfinArrivals).toHaveBeenNthCalledWith(1, config, 'user-1', {
      page: 1,
      pageSize: 50,
    })

    expect(fetchJellyfinArrivals).toHaveBeenNthCalledWith(2, config, 'user-1', {
      page: 2,
      pageSize: 10,
    })

    expect(result.total).toBe(50)
    expect(result.unreadCount).toBe(0)
  })

  it('defaults to All when no filter is supplied', async () => {
    mockArrivals('movie-1')

    await loadJellyfinArrivalsPage(1, 10)

    expect(fetchJellyfinArrivals).toHaveBeenCalledTimes(2)
    expect(fetchJellyfinArrivals).toHaveBeenLastCalledWith(config, 'user-1', {
      page: 1,
      pageSize: 10,
    })
  })

  it('preserves unread flags on paginated All items', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-2', 'movie-1')
    await scanJellyfinArrivals()

    const result = await loadJellyfinArrivalsPage(1, 10, 'all')

    expect(result.items.find((item) => item.id === 'movie-2')?.unread).toBe(true)
    expect(result.unreadCount).toBe(1)
  })

  it('filters New before paginating', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-3', 'movie-2', 'movie-1')
    await scanJellyfinArrivals()

    const result = await loadJellyfinArrivalsPage(1, 1, 'new')

    expect(result.items.map((item) => item.id)).toEqual(['movie-3'])
    expect(result.total).toBe(2)
    expect(result.unreadCount).toBe(2)
  })

  it('returns the second page of New arrivals independently of All', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-4', 'movie-3', 'movie-2', 'movie-1')
    await scanJellyfinArrivals()

    const result = await loadJellyfinArrivalsPage(2, 2, 'new')

    expect(result.items.map((item) => item.id)).toEqual(['movie-2'])
    expect(result.total).toBe(3)
    expect(result.unreadCount).toBe(3)
  })

  it('does not make a second Jellyfin request for New', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    vi.mocked(fetchJellyfinArrivals).mockClear()

    const result = await loadJellyfinArrivalsPage(1, 10, 'new')

    expect(fetchJellyfinArrivals).toHaveBeenCalledTimes(1)
    expect(fetchJellyfinArrivals).toHaveBeenCalledWith(config, 'user-1', {
      page: 1,
      pageSize: 50,
    })
    expect(result.total).toBe(0)
  })

  it('returns an empty New page when nothing is unread', async () => {
    mockArrivals('movie-1', 'movie-2')
    await scanJellyfinArrivals()

    const result = await loadJellyfinArrivalsPage(1, 10, 'new')

    expect(result.items).toEqual([])
    expect(result.total).toBe(0)
    expect(result.unreadCount).toBe(0)
  })

  it('removes dismissed arrivals from New pagination', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-3', 'movie-2', 'movie-1')
    await scanJellyfinArrivals()

    await setJellyfinArrivalUnread('movie-3', false)

    const result = await loadJellyfinArrivalsPage(1, 10, 'new')

    expect(result.items.map((item) => item.id)).toEqual(['movie-2'])
    expect(result.total).toBe(1)
    expect(result.unreadCount).toBe(1)
  })

  it('returns no New arrivals after clearing notifications', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-2', 'movie-1')
    await scanJellyfinArrivals()

    await clearJellyfinNotifications()

    const result = await loadJellyfinArrivalsPage(1, 10, 'new')

    expect(result.items).toEqual([])
    expect(result.total).toBe(0)
    expect(result.unreadCount).toBe(0)
  })

  it('keeps the global unread count independent of the New page size', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-4', 'movie-3', 'movie-2', 'movie-1')
    await scanJellyfinArrivals()

    const result = await loadJellyfinArrivalsPage(1, 1, 'new')

    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(3)
    expect(result.unreadCount).toBe(3)
  })

  it('rejects scans when Jellyfin is not configured', async () => {
    vi.mocked(getServiceConfig).mockResolvedValue(undefined)

    await expect(scanJellyfinArrivals()).rejects.toThrow('Jellyfin is not configured.')
  })

  it('rejects scans when no Jellyfin user is selected', async () => {
    vi.mocked(getJellyfinUserSelection).mockResolvedValue('')

    await expect(scanJellyfinArrivals()).rejects.toThrow('Select your Jellyfin user in Settings.')
  })

  it('does not overwrite notification state when a scan fails', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    const previousState = structuredClone(getStoredState())

    vi.mocked(fetchJellyfinArrivals).mockRejectedValue(new Error('Network unavailable'))

    await expect(scanJellyfinArrivals()).rejects.toThrow('Network unavailable')

    expect(getStoredState()).toEqual(previousState)
  })

  it('serializes concurrent scans so newly discovered items are not duplicated', async () => {
    mockArrivals('movie-1')
    await scanJellyfinArrivals()

    mockArrivals('movie-2', 'movie-1')

    const [first, second] = await Promise.all([scanJellyfinArrivals(), scanJellyfinArrivals()])

    expect(first.unreadCount).toBe(1)
    expect(second.unreadCount).toBe(1)
    expect(getStoredState().state.unreadIds).toEqual(['movie-2'])
  })
})
