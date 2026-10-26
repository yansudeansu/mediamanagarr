import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchSonarrCalendar } from './sonarr-calendar'
import type { ServiceConfig } from '../../types/service'

const config: ServiceConfig = {
  url: 'https://sonarr.example.com/sonarr',
  apiKey: 'sonarr-test-key',
}

const start = new Date('2026-11-01T00:00:00.000Z')
const end = new Date('2026-12-01T00:00:00.000Z')

const episodes = [
  {
    id: 101,
    seriesId: 10,
    title: 'The Beginning',
    seasonNumber: 2,
    episodeNumber: 3,
    airDateUtc: '2026-11-05T20:00:00Z',
    airDate: '2026-11-05',
    series: {
      title: 'Example Series',
      images: [
        {
          coverType: 'poster',
          remoteUrl: 'https://images.example.com/poster.jpg',
        },
      ],
    },
  },
  {
    id: 102,
    seriesId: 20,
    title: 'Another Episode',
    seasonNumber: 1,
    episodeNumber: 9,
    airDate: '2026-11-12',
    series: {
      title: 'Another Series',
    },
  },
]

function mockResponse(data: unknown, status = 200): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: vi.fn().mockResolvedValue(data),
    }),
  )
}

describe('fetchSonarrCalendar', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('requests the Sonarr calendar with authentication and series metadata', async () => {
    mockResponse(episodes)

    await fetchSonarrCalendar(config, start, end)

    expect(fetch).toHaveBeenCalledOnce()

    const [url, options] = vi.mocked(fetch).mock.calls[0]

    const parsedUrl = new URL(String(url))

    expect(parsedUrl.origin).toBe('https://sonarr.example.com')
    expect(parsedUrl.pathname).toBe('/sonarr/api/v3/calendar')
    expect(parsedUrl.searchParams.get('start')).toBe(start.toISOString())
    expect(parsedUrl.searchParams.get('end')).toBe(end.toISOString())
    expect(parsedUrl.searchParams.get('includeSeries')).toBe('true')
    expect(parsedUrl.searchParams.get('unmonitored')).toBe('false')

    expect(options).toEqual(
      expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Api-Key': 'sonarr-test-key',
        },
        signal: expect.any(AbortSignal),
      }),
    )
  })

  it('maps episodes into calendar items', async () => {
    mockResponse(episodes)

    const result = await fetchSonarrCalendar(config, start, end)

    expect(result).toEqual([
      {
        id: 'sonarr-101',
        source: 'sonarr',
        type: 'tv',
        title: 'Example Series',
        subtitle: 'S02E03 · The Beginning',
        date: '2026-11-05T20:00:00Z',
        releaseType: 'air',
        posterUrl: 'https://images.example.com/poster.jpg',
        posterMediaId: 10,
      },
      {
        id: 'sonarr-102',
        source: 'sonarr',
        type: 'tv',
        title: 'Another Series',
        subtitle: 'S01E09 · Another Episode',
        date: '2026-11-12',
        releaseType: 'air',
        posterUrl: null,
        posterMediaId: 20,
      },
    ])
  })

  it('uses the series ID rather than the episode ID for poster retrieval', async () => {
    mockResponse(episodes)

    const result = await fetchSonarrCalendar(config, start, end)

    expect(result[0].id).toBe('sonarr-101')
    expect(result[0].posterMediaId).toBe(10)
    expect(result[0].posterMediaId).not.toBe(101)

    expect(result[1].id).toBe('sonarr-102')
    expect(result[1].posterMediaId).toBe(20)
  })

  it('prefers the UTC air date over the date-only fallback', async () => {
    mockResponse(episodes)

    const result = await fetchSonarrCalendar(config, start, end)

    expect(result[0].date).toBe('2026-11-05T20:00:00Z')
  })

  it('uses the date-only fallback without shifting its calendar day', async () => {
    mockResponse([episodes[1]])

    const result = await fetchSonarrCalendar(config, start, end)

    expect(result[0].date).toBe('2026-11-12')
  })

  it('skips episodes without valid dates', async () => {
    mockResponse([
      {
        ...episodes[0],
        airDateUtc: 'invalid',
        airDate: '2026-02-30',
      },
      episodes[1],
    ])

    const result = await fetchSonarrCalendar(config, start, end)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('sonarr-102')
  })

  it('skips episodes with invalid IDs', async () => {
    mockResponse([{ ...episodes[0], id: 'invalid' }, { ...episodes[0], id: -1 }, episodes[1]])

    const result = await fetchSonarrCalendar(config, start, end)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('sonarr-102')
  })

  it('uses fallback labels for missing series and episode information', async () => {
    mockResponse([
      {
        id: 103,
        airDateUtc: '2026-11-20T12:00:00Z',
      },
    ])

    const result = await fetchSonarrCalendar(config, start, end)

    expect(result[0]).toEqual({
      id: 'sonarr-103',
      source: 'sonarr',
      type: 'tv',
      title: 'Unknown series',
      subtitle: 'S??E??',
      date: '2026-11-20T12:00:00Z',
      releaseType: 'air',
      posterUrl: null,
      posterMediaId: null,
    })
  })

  it('rejects invalid date ranges before making a request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchSonarrCalendar(config, end, start)).rejects.toThrow(
      'Invalid Sonarr calendar date range.',
    )

    await expect(fetchSonarrCalendar(config, start, start)).rejects.toThrow(
      'Invalid Sonarr calendar date range.',
    )

    await expect(fetchSonarrCalendar(config, new Date('invalid'), end)).rejects.toThrow(
      'Invalid Sonarr calendar date range.',
    )

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects malformed API responses', async () => {
    mockResponse({ items: episodes })

    await expect(fetchSonarrCalendar(config, start, end)).rejects.toThrow(
      'Sonarr returned an invalid calendar response.',
    )
  })

  it('reports authentication failures', async () => {
    mockResponse([], 401)

    await expect(fetchSonarrCalendar(config, start, end)).rejects.toThrow(
      'Sonarr authentication failed. Check your API key.',
    )
  })

  it('reports missing endpoints', async () => {
    mockResponse([], 404)

    await expect(fetchSonarrCalendar(config, start, end)).rejects.toThrow(
      'Sonarr calendar endpoint not found. Check the server URL.',
    )
  })

  it('reports other HTTP failures', async () => {
    mockResponse([], 500)

    await expect(fetchSonarrCalendar(config, start, end)).rejects.toThrow(
      'Unable to load Sonarr calendar: HTTP 500.',
    )
  })

  it('reports unreachable servers', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(fetchSonarrCalendar(config, start, end)).rejects.toThrow('Unable to reach Sonarr.')
  })

  it('reports aborted requests as timeouts', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(
        Object.assign(new Error('The operation was aborted.'), {
          name: 'AbortError',
        }),
      ),
    )

    await expect(fetchSonarrCalendar(config, start, end)).rejects.toThrow(
      'Loading Sonarr calendar timed out.',
    )
  })

  it('handles unexpected non-Error failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('unexpected failure'))

    await expect(fetchSonarrCalendar(config, start, end)).rejects.toThrow(
      'An unexpected error occurred while loading Sonarr calendar.',
    )
  })
})
