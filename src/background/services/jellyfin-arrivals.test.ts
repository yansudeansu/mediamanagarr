import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchJellyfinArrivals } from './jellyfin-arrivals'
import type { ServiceConfig } from '../../types/service'

const config = {
  url: 'https://jellyfin.example.com',
  apiKey: 'test-api-key',
} as ServiceConfig

function mockItemsResponse(items: unknown[], total = items.length, status = 200): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: vi.fn().mockResolvedValue({
        Items: items,
        TotalRecordCount: total,
      }),
    }),
  )
}

describe('fetchJellyfinArrivals', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches the selected user’s unwatched movies and episodes', async () => {
    mockItemsResponse([
      {
        Id: 'movie-1',
        Name: 'Example Movie',
        Type: 'Movie',
        DateCreated: '2026-01-10T12:00:00Z',
        ProductionYear: 2025,
        ImageTags: { Primary: 'movie-tag' },
        UserData: { Played: false },
      },
      {
        Id: 'episode-1',
        Name: 'Episode One',
        Type: 'Episode',
        DateCreated: '2026-01-11T12:00:00Z',
        SeriesName: 'Example Series',
        ParentIndexNumber: 2,
        IndexNumber: 3,
        SeriesId: 'series-1',
        UserData: { Played: false },
      },
    ])

    const result = await fetchJellyfinArrivals(config, 'user-1')

    expect(result).toEqual({
      items: [
        {
          id: 'movie-1',
          type: 'Movie',
          title: 'Example Movie',
          subtitle: '2025',
          dateAdded: '2026-01-10T12:00:00Z',
          imageId: 'movie-1',
          imageTag: 'movie-tag',
          unread: false,
        },
        {
          id: 'episode-1',
          type: 'Episode',
          title: 'Episode One',
          subtitle: 'Example Series · S02E03',
          dateAdded: '2026-01-11T12:00:00Z',
          imageId: 'series-1',
          imageTag: null,
          unread: false,
        },
      ],
      total: 2,
    })

    expect(fetch).toHaveBeenCalledOnce()

    const [url, options] = vi.mocked(fetch).mock.calls[0]!

    const requestUrl = new URL(String(url))

    expect(requestUrl.pathname).toBe('/Users/user-1/Items')
    expect(requestUrl.searchParams.get('Recursive')).toBe('true')
    expect(requestUrl.searchParams.get('IncludeItemTypes')).toBe('Movie,Episode')
    expect(requestUrl.searchParams.get('IsPlayed')).toBe('false')
    expect(requestUrl.searchParams.get('SortBy')).toBe('DateCreated')
    expect(requestUrl.searchParams.get('SortOrder')).toBe('Descending')
    expect(requestUrl.searchParams.get('StartIndex')).toBe('0')
    expect(requestUrl.searchParams.get('Limit')).toBe('10')
    expect(requestUrl.searchParams.get('Fields')).toBe('DateCreated')

    expect(options).toEqual(
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Accept: 'application/json',
          Authorization: expect.stringContaining('Token="test-api-key"'),
        }),
        signal: expect.any(AbortSignal),
      }),
    )
  })

  it('uses server-side pagination and preserves the total record count', async () => {
    mockItemsResponse([], 47)

    const result = await fetchJellyfinArrivals(config, 'user-1', {
      page: 3,
      pageSize: 10,
    })

    expect(result).toEqual({
      items: [],
      total: 47,
    })

    const [url] = vi.mocked(fetch).mock.calls[0]!
    const requestUrl = new URL(String(url))

    expect(requestUrl.searchParams.get('StartIndex')).toBe('20')
    expect(requestUrl.searchParams.get('Limit')).toBe('10')
  })

  it('encodes the selected Jellyfin user ID', async () => {
    mockItemsResponse([])

    await fetchJellyfinArrivals(config, 'user / special')

    const [url] = vi.mocked(fetch).mock.calls[0]!
    const requestUrl = new URL(String(url))

    expect(requestUrl.pathname).toBe('/Users/user%20%2F%20special/Items')
  })

  it('filters out played items, unsupported types, and malformed records', async () => {
    mockItemsResponse([
      {
        Id: 'movie-1',
        Name: 'Unwatched Movie',
        Type: 'Movie',
        UserData: { Played: false },
      },
      {
        Id: 'movie-2',
        Name: 'Watched Movie',
        Type: 'Movie',
        UserData: { Played: true },
      },
      {
        Id: 'album-1',
        Name: 'Music Album',
        Type: 'MusicAlbum',
        UserData: { Played: false },
      },
      {
        Id: '',
        Name: 'Invalid Movie',
        Type: 'Movie',
        UserData: { Played: false },
      },
      {
        Id: 'movie-3',
        Name: 'Missing User Data',
        Type: 'Movie',
      },
      null,
    ])

    const result = await fetchJellyfinArrivals(config, 'user-1')

    expect(result.items).toHaveLength(1)
    expect(result.items[0]?.id).toBe('movie-1')
  })

  it('provides fallbacks for missing episode and movie metadata', async () => {
    mockItemsResponse([
      {
        Id: 'episode-1',
        Name: 'Unknown Episode',
        Type: 'Episode',
        UserData: { Played: false },
      },
      {
        Id: 'movie-1',
        Name: 'Unknown Movie',
        Type: 'Movie',
        UserData: { Played: false },
      },
    ])

    const result = await fetchJellyfinArrivals(config, 'user-1')

    expect(result.items[0]).toEqual(
      expect.objectContaining({
        subtitle: 'Unknown series · S??E??',
        imageId: 'episode-1',
        imageTag: null,
        dateAdded: '',
      }),
    )

    expect(result.items[1]).toEqual(
      expect.objectContaining({
        subtitle: 'Movie',
        imageTag: null,
        dateAdded: '',
      }),
    )
  })

  it.each([
    { page: 0, pageSize: 10 },
    { page: -1, pageSize: 10 },
    { page: 1.5, pageSize: 10 },
    { page: 1, pageSize: 0 },
    { page: 1, pageSize: 101 },
    { page: 1, pageSize: Number.NaN },
    { page: Number.MAX_SAFE_INTEGER, pageSize: 100 },
  ])('rejects invalid pagination: %j', async (query) => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchJellyfinArrivals(config, 'user-1', query)).rejects.toThrow(
      'Invalid Jellyfin pagination parameters.',
    )

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('requires a selected Jellyfin user', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchJellyfinArrivals(config, '  ')).rejects.toThrow(
      'Select your Jellyfin user in Settings.',
    )

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects invalid Jellyfin item responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ Items: 'invalid' }),
      }),
    )

    await expect(fetchJellyfinArrivals(config, 'user-1')).rejects.toThrow(
      'Jellyfin returned an invalid items response.',
    )
  })

  it.each([null, -1, 1.5, '10'])('rejects invalid total record counts: %j', async (total) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          Items: [],
          TotalRecordCount: total,
        }),
      }),
    )

    await expect(fetchJellyfinArrivals(config, 'user-1')).rejects.toThrow(
      'Jellyfin returned an invalid item count.',
    )
  })

  it('falls back to the returned item count when the total is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          Items: [
            {
              Id: 'movie-1',
              Name: 'Example Movie',
              Type: 'Movie',
              UserData: { Played: false },
            },
          ],
        }),
      }),
    )

    const result = await fetchJellyfinArrivals(config, 'user-1')

    expect(result.total).toBe(1)
  })

  it.each([401, 403])('handles Jellyfin authentication errors (%i)', async (status) => {
    mockItemsResponse([], 0, status)

    await expect(fetchJellyfinArrivals(config, 'user-1')).rejects.toThrow(
      'Jellyfin did not allow access to the selected user.',
    )
  })

  it('handles other HTTP errors', async () => {
    mockItemsResponse([], 0, 500)

    await expect(fetchJellyfinArrivals(config, 'user-1')).rejects.toThrow(
      'Unable to load Jellyfin arrivals: HTTP 500.',
    )
  })

  it('handles network failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(fetchJellyfinArrivals(config, 'user-1')).rejects.toThrow(
      'Unable to reach Jellyfin.',
    )
  })

  it('handles request timeouts', async () => {
    const error = new Error('Request aborted')
    error.name = 'AbortError'

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error))

    await expect(fetchJellyfinArrivals(config, 'user-1')).rejects.toThrow(
      'Loading Jellyfin arrivals timed out.',
    )
  })
})
