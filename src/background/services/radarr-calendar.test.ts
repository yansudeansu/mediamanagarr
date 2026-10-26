import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchRadarrCalendar } from './radarr-calendar'
import type { ServiceConfig } from '../../types/service'

const config: ServiceConfig = {
  url: 'https://radarr.example.com/radarr',
  apiKey: 'radarr-test-key',
}

const start = new Date('2026-11-01T00:00:00.000Z')
const end = new Date('2026-12-01T00:00:00.000Z')

const movies = [
  {
    id: 101,
    title: 'Example Movie',
    year: 2026,
    digitalRelease: '2026-11-05T00:00:00Z',
    physicalRelease: '2026-12-15T00:00:00Z',
    inCinemas: '2026-10-01T00:00:00Z',
    images: [
      {
        coverType: 'poster',
        remoteUrl: 'https://images.example.com/movie-poster.jpg',
      },
    ],
  },
  {
    id: 102,
    title: 'Physical Release Movie',
    year: 2025,
    digitalRelease: null,
    physicalRelease: '2026-11-12T00:00:00Z',
    images: [],
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

describe('fetchRadarrCalendar', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('requests the Radarr calendar with authentication', async () => {
    mockResponse(movies)

    await fetchRadarrCalendar(config, start, end)

    expect(fetch).toHaveBeenCalledOnce()

    const [url, options] = vi.mocked(fetch).mock.calls[0]
    const parsedUrl = new URL(String(url))

    expect(parsedUrl.origin).toBe('https://radarr.example.com')
    expect(parsedUrl.pathname).toBe('/radarr/api/v3/calendar')
    expect(parsedUrl.searchParams.get('start')).toBe(start.toISOString())
    expect(parsedUrl.searchParams.get('end')).toBe(end.toISOString())
    expect(parsedUrl.searchParams.get('unmonitored')).toBe('false')

    expect(options).toEqual(
      expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Api-Key': 'radarr-test-key',
        },
        signal: expect.any(AbortSignal),
      }),
    )
  })

  it('maps digital and physical releases into calendar items', async () => {
    mockResponse(movies)

    const result = await fetchRadarrCalendar(config, start, end)

    expect(result).toEqual([
      {
        id: 'radarr-101',
        source: 'radarr',
        type: 'movie',
        title: 'Example Movie',
        subtitle: '2026',
        date: '2026-11-05',
        releaseType: 'digital',
        posterUrl: 'https://images.example.com/movie-poster.jpg',
        posterMediaId: 101,
      },
      {
        id: 'radarr-102',
        source: 'radarr',
        type: 'movie',
        title: 'Physical Release Movie',
        subtitle: '2025',
        date: '2026-11-12',
        releaseType: 'physical',
        posterUrl: null,
        posterMediaId: 102,
      },
    ])
  })

  it('uses the movie ID for poster retrieval', async () => {
    mockResponse(movies)

    const result = await fetchRadarrCalendar(config, start, end)

    expect(result[0].posterMediaId).toBe(101)
    expect(result[1].posterMediaId).toBe(102)
  })

  it('prefers digital release over physical release', async () => {
    mockResponse(movies)

    const result = await fetchRadarrCalendar(config, start, end)

    expect(result[0].date).toBe('2026-11-05')
    expect(result[0].releaseType).toBe('digital')
  })

  it('falls back to physical release when digital release is invalid', async () => {
    mockResponse([
      {
        ...movies[0],
        digitalRelease: 'invalid',
        physicalRelease: '2026-11-18T00:00:00Z',
      },
    ])

    const result = await fetchRadarrCalendar(config, start, end)

    expect(result[0].date).toBe('2026-11-18')
    expect(result[0].releaseType).toBe('physical')
  })

  it('ignores theatrical-only movies', async () => {
    mockResponse([
      {
        id: 103,
        title: 'Theatrical Only',
        inCinemas: '2026-11-10T00:00:00Z',
      },
    ])

    const result = await fetchRadarrCalendar(config, start, end)

    expect(result).toEqual([])
  })

  it('skips movies without valid digital or physical dates', async () => {
    mockResponse([
      {
        ...movies[0],
        digitalRelease: '2026-02-30T00:00:00Z',
        physicalRelease: 'invalid',
      },
      movies[1],
    ])

    const result = await fetchRadarrCalendar(config, start, end)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('radarr-102')
  })

  it('skips movies with invalid IDs', async () => {
    mockResponse([{ ...movies[0], id: 'invalid' }, { ...movies[0], id: -1 }, movies[1]])

    const result = await fetchRadarrCalendar(config, start, end)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('radarr-102')
  })

  it('uses fallback labels when movie metadata is missing', async () => {
    mockResponse([
      {
        id: 104,
        digitalRelease: '2026-11-20',
      },
    ])

    const result = await fetchRadarrCalendar(config, start, end)

    expect(result[0]).toEqual({
      id: 'radarr-104',
      source: 'radarr',
      type: 'movie',
      title: 'Unknown movie',
      subtitle: 'Movie',
      date: '2026-11-20',
      releaseType: 'digital',
      posterUrl: null,
      posterMediaId: 104,
    })
  })

  it('rejects invalid date ranges before making a request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchRadarrCalendar(config, end, start)).rejects.toThrow(
      'Invalid Radarr calendar date range.',
    )

    await expect(fetchRadarrCalendar(config, start, start)).rejects.toThrow(
      'Invalid Radarr calendar date range.',
    )

    await expect(fetchRadarrCalendar(config, new Date('invalid'), end)).rejects.toThrow(
      'Invalid Radarr calendar date range.',
    )

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects malformed API responses', async () => {
    mockResponse({ movies })

    await expect(fetchRadarrCalendar(config, start, end)).rejects.toThrow(
      'Radarr returned an invalid calendar response.',
    )
  })

  it('reports authentication failures', async () => {
    mockResponse([], 401)

    await expect(fetchRadarrCalendar(config, start, end)).rejects.toThrow(
      'Radarr authentication failed. Check your API key.',
    )
  })

  it('reports missing endpoints', async () => {
    mockResponse([], 404)

    await expect(fetchRadarrCalendar(config, start, end)).rejects.toThrow(
      'Radarr calendar endpoint not found. Check the server URL.',
    )
  })

  it('reports other HTTP failures', async () => {
    mockResponse([], 500)

    await expect(fetchRadarrCalendar(config, start, end)).rejects.toThrow(
      'Unable to load Radarr calendar: HTTP 500.',
    )
  })

  it('reports unreachable servers', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(fetchRadarrCalendar(config, start, end)).rejects.toThrow('Unable to reach Radarr.')
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

    await expect(fetchRadarrCalendar(config, start, end)).rejects.toThrow(
      'Loading Radarr calendar timed out.',
    )
  })

  it('handles unexpected non-Error failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('unexpected failure'))

    await expect(fetchRadarrCalendar(config, start, end)).rejects.toThrow(
      'An unexpected error occurred while loading Radarr calendar.',
    )
  })
})
