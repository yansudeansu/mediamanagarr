import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildServiceApiUrl, testServiceConnection } from './connection'

describe('buildServiceApiUrl', () => {
  it('joins a root URL with an API path', () => {
    expect(buildServiceApiUrl('https://media.example.com', '/api/v1/status')).toBe(
      'https://media.example.com/api/v1/status',
    )
  })

  it('preserves reverse-proxy base paths', () => {
    expect(buildServiceApiUrl('https://media.example.com/seerr', '/api/v1/status')).toBe(
      'https://media.example.com/seerr/api/v1/status',
    )
  })

  it('preserves nested reverse-proxy paths', () => {
    expect(
      buildServiceApiUrl('https://media.example.com/apps/sonarr/', '/api/v3/system/status'),
    ).toBe('https://media.example.com/apps/sonarr/api/v3/system/status')
  })

  it('avoids duplicate slashes at the join', () => {
    expect(buildServiceApiUrl('http://localhost:8989///', '///api/v3/system/status')).toBe(
      'http://localhost:8989/api/v3/system/status',
    )
  })
})

describe('testServiceConnection', () => {
  const fetchMock = vi.fn()

  const sonarrConfig = {
    url: 'http://localhost:8989',
    apiKey: 'key',
  }

  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
    })

    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('tests Jellyfin with MediaBrowser authentication', async () => {
    await testServiceConnection('jellyfin', {
      url: 'http://localhost:8096',
      apiKey: 'jellyfin-secret',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8096/Library/MediaFolders',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Token="jellyfin-secret"'),
        }),
      }),
    )

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('tests Seerr with its API key header', async () => {
    await testServiceConnection('seerr', {
      url: 'https://media.example.com/seerr',
      apiKey: 'seerr-secret',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://media.example.com/seerr/api/v1/status',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Api-Key': 'seerr-secret',
        }),
      }),
    )

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('tests Sonarr with its API key header', async () => {
    await testServiceConnection('sonarr', {
      url: 'http://localhost:8989',
      apiKey: 'sonarr-secret',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8989/api/v3/system/status',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Api-Key': 'sonarr-secret',
        }),
      }),
    )

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('tests Radarr with its API key header', async () => {
    await testServiceConnection('radarr', {
      url: 'http://localhost:7878',
      apiKey: 'radarr-secret',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:7878/api/v3/system/status',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Api-Key': 'radarr-secret',
        }),
      }),
    )

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('tests qBittorrent with Bearer authentication', async () => {
    await testServiceConnection('qbittorrent', {
      url: 'http://localhost:8080',
      apiKey: 'qbit-secret',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v2/transfer/info',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer qbit-secret',
        }),
      }),
    )

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it.each([401, 403])('does not retry HTTP %i authentication failures', async (status) => {
    fetchMock.mockResolvedValue({
      ok: false,
      status,
    })

    await expect(testServiceConnection('sonarr', sonarrConfig)).rejects.toThrow(
      'Authentication failed. Check your API key.',
    )

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('does not retry missing endpoints', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
    })

    await expect(
      testServiceConnection('seerr', {
        url: 'https://media.example.com/wrong-path',
        apiKey: 'key',
      }),
    ).rejects.toThrow('Service endpoint not found. Check the server URL and base path.')

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('does not retry rate-limited requests', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 429,
    })

    await expect(testServiceConnection('sonarr', sonarrConfig)).rejects.toThrow(
      'The service is receiving too many requests. Please try again later.',
    )

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('does not retry HTTP 500 errors', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
    })

    await expect(testServiceConnection('sonarr', sonarrConfig)).rejects.toThrow(
      'Connection failed: server returned HTTP 500.',
    )

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it.each([502, 503, 504])(
    'retries HTTP %i outages and reports failure after three attempts',
    async (status) => {
      vi.useFakeTimers()

      fetchMock.mockResolvedValue({
        ok: false,
        status,
      })

      const connection = testServiceConnection('sonarr', sonarrConfig)

      const assertion = expect(connection).rejects.toThrow(
        `The server is temporarily unavailable (HTTP ${status}). Please try again later.`,
      )

      expect(fetchMock).toHaveBeenCalledOnce()

      await vi.advanceTimersByTimeAsync(250)
      expect(fetchMock).toHaveBeenCalledTimes(2)

      await vi.advanceTimersByTimeAsync(500)
      expect(fetchMock).toHaveBeenCalledTimes(3)

      await assertion
    },
  )

  it('recovers when a temporary outage resolves on the second attempt', async () => {
    vi.useFakeTimers()

    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

    const connection = testServiceConnection('sonarr', sonarrConfig)

    expect(fetchMock).toHaveBeenCalledOnce()

    await vi.advanceTimersByTimeAsync(249)
    expect(fetchMock).toHaveBeenCalledOnce()

    await vi.advanceTimersByTimeAsync(1)

    await expect(connection).resolves.toBeUndefined()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('recovers when a temporary outage resolves on the third attempt', async () => {
    vi.useFakeTimers()

    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 502,
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 504,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

    const connection = testServiceConnection('sonarr', sonarrConfig)

    expect(fetchMock).toHaveBeenCalledOnce()

    await vi.advanceTimersByTimeAsync(250)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(499)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(1)

    await expect(connection).resolves.toBeUndefined()
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('does not retry after a successful first attempt', async () => {
    await expect(testServiceConnection('sonarr', sonarrConfig)).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('retries transient network failures and recovers', async () => {
    vi.useFakeTimers()

    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValueOnce({
      ok: true,
      status: 200,
    })

    const connection = testServiceConnection('sonarr', sonarrConfig)

    await vi.advanceTimersByTimeAsync(250)

    await expect(connection).resolves.toBeUndefined()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('reports network failures after exhausting retries', async () => {
    vi.useFakeTimers()

    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    const connection = testServiceConnection('sonarr', sonarrConfig)

    const assertion = expect(connection).rejects.toThrow(
      'Unable to reach the server. Check its address and availability.',
    )

    await vi.advanceTimersByTimeAsync(750)

    await assertion
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('does not retry unexpected errors', async () => {
    fetchMock.mockRejectedValue(new Error('Unexpected failure'))

    await expect(testServiceConnection('sonarr', sonarrConfig)).rejects.toThrow(
      'Unexpected failure',
    )

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('does not retry unexpected non-error values', async () => {
    fetchMock.mockRejectedValue('unexpected')

    await expect(testServiceConnection('sonarr', sonarrConfig)).rejects.toThrow(
      'An unexpected connection error occurred.',
    )

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('retries timed-out requests and stops after three attempts', async () => {
    vi.useFakeTimers()

    fetchMock.mockImplementation(
      (_url: string, options: RequestInit) =>
        new Promise((_resolve, reject) => {
          options.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
    )

    const connection = testServiceConnection('sonarr', sonarrConfig)

    const assertion = expect(connection).rejects.toThrow(
      'Connection timed out. Check the server address.',
    )

    expect(fetchMock).toHaveBeenCalledOnce()

    await vi.advanceTimersByTimeAsync(10_000)
    expect(fetchMock).toHaveBeenCalledOnce()

    await vi.advanceTimersByTimeAsync(250)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(10_000)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(500)
    expect(fetchMock).toHaveBeenCalledTimes(3)

    await vi.advanceTimersByTimeAsync(10_000)

    await assertion
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('uses a fresh AbortController for each retry', async () => {
    vi.useFakeTimers()

    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

    const connection = testServiceConnection('sonarr', sonarrConfig)

    const firstSignal = (fetchMock.mock.calls[0]?.[1] as RequestInit | undefined)?.signal

    await vi.advanceTimersByTimeAsync(250)
    await connection

    const secondSignal = (fetchMock.mock.calls[1]?.[1] as RequestInit | undefined)?.signal

    expect(firstSignal).toBeDefined()
    expect(secondSignal).toBeDefined()
    expect(firstSignal).not.toBe(secondSignal)
  })

  it('uses a longer timeout for Jellyfin on every attempt', async () => {
    vi.useFakeTimers()

    fetchMock.mockImplementation(
      (_url: string, options: RequestInit) =>
        new Promise((_resolve, reject) => {
          options.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
    )

    const connection = testServiceConnection('jellyfin', {
      url: 'http://localhost:8096',
      apiKey: 'key',
    })

    const assertion = expect(connection).rejects.toThrow(
      'Connection timed out. Check the server address.',
    )

    await vi.advanceTimersByTimeAsync(10_000)
    expect(fetchMock).toHaveBeenCalledOnce()

    await vi.advanceTimersByTimeAsync(5_000)
    expect(fetchMock).toHaveBeenCalledOnce()

    await vi.advanceTimersByTimeAsync(250)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(15_000)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(500)
    expect(fetchMock).toHaveBeenCalledTimes(3)

    await vi.advanceTimersByTimeAsync(15_000)

    await assertion
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})
