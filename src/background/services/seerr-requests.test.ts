import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ServiceConfig } from '../../types/service'
import type { SeerrRequestsQuery } from '../../types/seerr'
import { fetchSeerrRequests } from './seerr-requests'

const config: ServiceConfig = {
  url: 'https://seerr.example.com',
  apiKey: 'test-api-key',
}

type FetchMock = ReturnType<typeof vi.fn<typeof fetch>>

let fetchMock: FetchMock

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

interface RequestFixture {
  id: number
  status: number
  type: 'movie' | 'tv'
  createdAt: string
  requestedBy?: {
    displayName?: string
    username?: string
  }
  media?: {
    tmdbId?: number
    status?: number
    posterPath?: string | null
  }
}

function requestItem(overrides: Partial<RequestFixture> = {}): RequestFixture {
  return {
    id: 42,
    status: 1,
    type: 'movie',
    createdAt: '2026-10-20T12:00:00.000Z',
    requestedBy: {
      displayName: 'Alice',
      username: 'alice',
    },
    media: {
      tmdbId: 123,
      status: 3,
      posterPath: '/fallback.jpg',
    },
    ...overrides,
  }
}

function requestsResponse(results: unknown[], total = results.length): Record<string, unknown> {
  return {
    results,
    pageInfo: {
      results: total,
      pages: Math.ceil(total / 10),
      page: 1,
    },
  }
}

function mockFetchResponse(data: unknown, status = 200): void {
  fetchMock.mockResolvedValue(jsonResponse(data, status))
}

function getFetchUrl(callIndex = 0): string {
  const call = fetchMock.mock.calls[callIndex]

  if (!call) {
    throw new Error(`Expected fetch call ${callIndex + 1}.`)
  }

  return String(call[0])
}

function getFetchOptions(callIndex = 0): RequestInit {
  const call = fetchMock.mock.calls[callIndex]

  if (!call) {
    throw new Error(`Expected fetch call ${callIndex + 1}.`)
  }

  return call[1] ?? {}
}

function deferredResponse<T>() {
  let resolve!: (value: T) => void

  const promise = new Promise<T>((resolver) => {
    resolve = resolver
  })

  return { promise, resolve }
}

describe('fetchSeerrRequests', () => {
  beforeEach(() => {
    fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('fetches the first page with default pagination and the All filter', async () => {
    mockFetchResponse(requestsResponse([]))

    const result = await fetchSeerrRequests(config)

    expect(result).toEqual({
      items: [],
      total: 0,
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(getFetchUrl()).toBe('https://seerr.example.com/api/v1/request?take=10&skip=0&sort=added')

    expect(getFetchOptions()).toEqual(
      expect.objectContaining({
        method: 'GET',
        headers: {
          'X-Api-Key': 'test-api-key',
          Accept: 'application/json',
        },
        signal: expect.any(AbortSignal),
      }),
    )
  })

  it('applies pagination and the Pending filter', async () => {
    mockFetchResponse(requestsResponse([], 25))

    const result = await fetchSeerrRequests(config, {
      page: 3,
      pageSize: 5,
      filter: 'pending',
    })

    expect(result.total).toBe(25)

    expect(getFetchUrl()).toBe(
      'https://seerr.example.com/api/v1/request?take=5&skip=10&sort=added&filter=pending',
    )
  })

  it('applies the Approved filter', async () => {
    mockFetchResponse(requestsResponse([]))

    await fetchSeerrRequests(config, {
      filter: 'approved',
    })

    expect(new URL(getFetchUrl()).searchParams.get('filter')).toBe('approved')
  })

  it('does not add a filter parameter for All requests', async () => {
    mockFetchResponse(requestsResponse([]))

    await fetchSeerrRequests(config, {
      filter: 'all',
    })

    expect(new URL(getFetchUrl()).searchParams.has('filter')).toBe(false)
  })

  it('preserves reverse-proxy paths', async () => {
    mockFetchResponse(requestsResponse([]))

    await fetchSeerrRequests({
      ...config,
      url: 'https://example.com/seerr/',
    })

    expect(getFetchUrl()).toBe('https://example.com/seerr/api/v1/request?take=10&skip=0&sort=added')
  })

  it.each([
    { page: 0 },
    { page: -1 },
    { page: 1.5 },
    { pageSize: 0 },
    { pageSize: 101 },
    { pageSize: -5 },
    { pageSize: 2.5 },
    { filter: 'declined' },
  ])('rejects invalid query parameters: %j', async (query) => {
    await expect(fetchSeerrRequests(config, query as SeerrRequestsQuery)).rejects.toThrow()

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('normalizes a movie request with metadata', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(requestsResponse([requestItem()], 12)))
      .mockResolvedValueOnce(
        jsonResponse({
          title: 'Example Movie',
          posterPath: '/movie-poster.jpg',
        }),
      )

    const result = await fetchSeerrRequests(config)

    expect(result).toEqual({
      items: [
        {
          id: 42,
          type: 'movie',
          title: 'Example Movie',
          status: 'Pending',
          mediaStatus: 'Processing',
          requestedBy: 'Alice',
          createdAt: '2026-10-20T12:00:00.000Z',
          posterPath: '/movie-poster.jpg',
        },
      ],
      total: 12,
    })

    expect(getFetchUrl(1)).toBe('https://seerr.example.com/api/v1/movie/123')
  })

  it('normalizes a TV request using its metadata name', async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse(
          requestsResponse([
            requestItem({
              id: 7,
              type: 'tv',
              status: 2,
              media: {
                tmdbId: 456,
                status: 5,
                posterPath: null,
              },
              requestedBy: {
                username: 'bob',
              },
            }),
          ]),
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          name: 'Example Series',
          posterPath: '/series.jpg',
        }),
      )

    const result = await fetchSeerrRequests(config)

    expect(result.items[0]).toEqual({
      id: 7,
      type: 'tv',
      title: 'Example Series',
      status: 'Approved',
      mediaStatus: 'Available',
      requestedBy: 'bob',
      createdAt: '2026-10-20T12:00:00.000Z',
      posterPath: '/series.jpg',
    })

    expect(getFetchUrl(1)).toBe('https://seerr.example.com/api/v1/tv/456')
  })

  it('keeps a request visible when metadata fetching fails', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(requestsResponse([requestItem()])))
      .mockRejectedValueOnce(new TypeError('Network error'))

    const result = await fetchSeerrRequests(config)

    expect(result.items[0]).toEqual({
      id: 42,
      type: 'movie',
      title: 'Movie #42',
      status: 'Pending',
      mediaStatus: 'Processing',
      requestedBy: 'Alice',
      createdAt: '2026-10-20T12:00:00.000Z',
      posterPath: '/fallback.jpg',
    })
  })

  it('keeps the fallback title when metadata is malformed', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(requestsResponse([requestItem()])))
      .mockResolvedValueOnce(
        jsonResponse({
          title: 123,
          posterPath: false,
        }),
      )

    const result = await fetchSeerrRequests(config)

    expect(result.items[0]).toEqual(
      expect.objectContaining({
        title: 'Movie #42',
        posterPath: '/fallback.jpg',
      }),
    )
  })

  it('does not fetch metadata when no TMDB ID exists', async () => {
    mockFetchResponse(
      requestsResponse([
        requestItem({
          media: {
            status: 4,
            posterPath: '/partial.jpg',
          },
          requestedBy: {},
        }),
      ]),
    )

    const result = await fetchSeerrRequests(config)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(result.items[0]).toEqual(
      expect.objectContaining({
        title: 'Movie #42',
        mediaStatus: 'Partially Available',
        requestedBy: 'Unknown user',
        posterPath: '/partial.jpg',
      }),
    )
  })

  it('uses a TV fallback title when metadata is unavailable', async () => {
    mockFetchResponse(
      requestsResponse([
        requestItem({
          id: 17,
          type: 'tv',
          media: {
            status: 2,
          },
        }),
      ]),
    )

    const result = await fetchSeerrRequests(config)

    expect(result.items[0]?.title).toBe('TV Show #17')
  })

  it('maps declined and unknown statuses', async () => {
    mockFetchResponse(
      requestsResponse([
        requestItem({
          id: 1,
          status: 3,
          media: { status: 2 },
        }),
        requestItem({
          id: 2,
          status: 999,
          media: { status: 999 },
        }),
      ]),
    )

    const result = await fetchSeerrRequests(config)

    expect(result.items[0]).toEqual(
      expect.objectContaining({
        status: 'Declined',
        mediaStatus: 'Pending',
      }),
    )

    expect(result.items[1]).toEqual(
      expect.objectContaining({
        status: 'Unknown',
        mediaStatus: 'Unknown',
      }),
    )
  })

  it('returns the item count when pagination information is missing', async () => {
    mockFetchResponse({
      results: [
        requestItem({
          media: {},
        }),
      ],
    })

    const result = await fetchSeerrRequests(config)

    expect(result.total).toBe(1)
  })

  it('rejects an invalid requests response', async () => {
    mockFetchResponse({
      unexpected: true,
    })

    await expect(fetchSeerrRequests(config)).rejects.toThrow(
      'Seerr returned an invalid requests response.',
    )
  })

  it('rejects malformed request items', async () => {
    mockFetchResponse(
      requestsResponse([
        {
          id: 'invalid',
          status: 1,
          type: 'movie',
          createdAt: '2026-10-20',
        },
      ]),
    )

    await expect(fetchSeerrRequests(config)).rejects.toThrow(
      'Seerr returned an invalid request item.',
    )
  })

  it('rejects invalid pagination information', async () => {
    mockFetchResponse({
      results: [],
      pageInfo: {
        results: -1,
      },
    })

    await expect(fetchSeerrRequests(config)).rejects.toThrow(
      'Seerr returned invalid pagination information.',
    )
  })

  it.each([401, 403])('reports authentication failures for HTTP %i', async (status) => {
    mockFetchResponse({}, status)

    await expect(fetchSeerrRequests(config)).rejects.toThrow(
      'Seerr authentication failed. Check your API key.',
    )
  })

  it('reports missing endpoints', async () => {
    mockFetchResponse({}, 404)

    await expect(fetchSeerrRequests(config)).rejects.toThrow(
      'Seerr endpoint not found. Check the server URL and base path.',
    )
  })

  it('reports server errors', async () => {
    mockFetchResponse({}, 500)

    await expect(fetchSeerrRequests(config)).rejects.toThrow('Seerr returned HTTP 500.')
  })

  it('reports network failures', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(fetchSeerrRequests(config)).rejects.toThrow(
      'Unable to reach Seerr. Check the server address and availability.',
    )
  })

  it('reports invalid JSON', async () => {
    fetchMock.mockResolvedValue(
      new Response('not-json', {
        status: 200,
      }),
    )

    await expect(fetchSeerrRequests(config)).rejects.toThrow('Seerr returned invalid JSON.')
  })

  it('reports request timeouts', async () => {
    fetchMock.mockImplementation(
      async (_input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        return new Promise<Response>((_resolve, reject) => {
          const signal = init?.signal

          if (!signal) {
            reject(new Error('Expected an abort signal.'))
            return
          }

          signal.addEventListener(
            'abort',
            () => {
              reject(new DOMException('The operation was aborted.', 'AbortError'))
            },
            { once: true },
          )
        })
      },
    )

    vi.useFakeTimers()

    const resultPromise = fetchSeerrRequests(config)
    const assertion = expect(resultPromise).rejects.toThrow('Seerr request timed out.')

    await vi.advanceTimersByTimeAsync(10_000)

    await assertion
  })

  it('limits concurrent metadata lookups to three', async () => {
    let activeLookups = 0
    let maximumActiveLookups = 0

    const pendingLookups: Array<ReturnType<typeof deferredResponse<Response>>> = []

    fetchMock.mockImplementation(async (input: RequestInfo | URL): Promise<Response> => {
      const url = String(input)

      if (url.includes('/api/v1/request?')) {
        return jsonResponse(
          requestsResponse(
            Array.from({ length: 6 }, (_, index) =>
              requestItem({
                id: index + 1,
                media: {
                  tmdbId: index + 100,
                  status: 2,
                },
              }),
            ),
          ),
        )
      }

      activeLookups += 1
      maximumActiveLookups = Math.max(maximumActiveLookups, activeLookups)

      const pending = deferredResponse<Response>()
      pendingLookups.push(pending)

      return pending.promise.then((response) => {
        activeLookups -= 1
        return response
      })
    })

    const resultPromise = fetchSeerrRequests(config)

    await vi.waitFor(() => {
      expect(pendingLookups).toHaveLength(3)
    })

    expect(activeLookups).toBe(3)

    for (let index = 0; index < 6; index += 1) {
      await vi.waitFor(() => {
        expect(pendingLookups.length).toBeGreaterThan(index)
      })

      pendingLookups[index]!.resolve(
        jsonResponse({
          title: `Movie ${index + 1}`,
        }),
      )
    }

    const result = await resultPromise

    expect(result.items).toHaveLength(6)
    expect(maximumActiveLookups).toBe(3)
    expect(activeLookups).toBe(0)
  })
})
