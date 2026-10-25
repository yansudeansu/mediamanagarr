import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchJellyfinUsers } from './jellyfin-users'

const config = {
  url: 'https://jellyfin.example.com',
  apiKey: 'test-api-key',
}

const users = [
  { Id: 'user-1', Name: 'Alice' },
  { Id: 'user-2', Name: 'Bob' },
]

function mockResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response
}

describe('fetchJellyfinUsers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse(users)))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('returns Jellyfin user IDs and names', async () => {
    await expect(fetchJellyfinUsers(config)).resolves.toEqual([
      { id: 'user-1', name: 'Alice' },
      { id: 'user-2', name: 'Bob' },
    ])
  })

  it('preserves the server base path', async () => {
    await fetchJellyfinUsers({
      ...config,
      url: 'https://example.com/jellyfin',
    })

    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/jellyfin/Users',
      expect.objectContaining({
        method: 'GET',
      }),
    )
  })

  it('sends the Jellyfin API key in the authorization header', async () => {
    await fetchJellyfinUsers(config)

    expect(fetch).toHaveBeenCalledWith(
      'https://jellyfin.example.com/Users',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
          Authorization: expect.stringContaining('Token="test-api-key"'),
        }),
      }),
    )
  })

  it.each([401, 403])('handles HTTP %i authentication errors', async (status) => {
    vi.mocked(fetch).mockResolvedValue(mockResponse({}, status))

    await expect(fetchJellyfinUsers(config)).rejects.toThrow(
      'Jellyfin did not allow access to the user list.',
    )
  })

  it('handles other HTTP errors', async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse({}, 500))

    await expect(fetchJellyfinUsers(config)).rejects.toThrow(
      'Unable to load Jellyfin users: HTTP 500.',
    )
  })

  it('rejects a response that is not an array', async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse({ Items: users }))

    await expect(fetchJellyfinUsers(config)).rejects.toThrow(
      'Jellyfin returned an invalid user list.',
    )
  })

  it.each([[{ Id: '', Name: 'Alice' }], [{ Id: 'user-1' }], [{ Id: 123, Name: 'Alice' }], [null]])(
    'rejects malformed user entries: %j',
    async (body) => {
      vi.mocked(fetch).mockResolvedValue(mockResponse(body))

      await expect(fetchJellyfinUsers(config)).rejects.toThrow(
        'Jellyfin returned an invalid user list.',
      )
    },
  )

  it('handles network errors', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(fetchJellyfinUsers(config)).rejects.toThrow('Unable to reach Jellyfin.')
  })

  it('handles request timeouts', async () => {
    vi.useFakeTimers()

    vi.mocked(fetch).mockImplementation(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
    )

    const promise = fetchJellyfinUsers(config)
    const assertion = expect(promise).rejects.toThrow('Loading Jellyfin users timed out.')

    await vi.advanceTimersByTimeAsync(15_000)
    await assertion
  })

  it('clears the timeout after a successful request', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

    await fetchJellyfinUsers(config)

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
