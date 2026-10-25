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
  })

  it('rejects invalid credentials', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
    })

    await expect(
      testServiceConnection('sonarr', {
        url: 'http://localhost:8989',
        apiKey: 'invalid',
      }),
    ).rejects.toThrow('Authentication failed. Check your API key.')
  })

  it('rejects forbidden responses', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
    })

    await expect(
      testServiceConnection('radarr', {
        url: 'http://localhost:7878',
        apiKey: 'invalid',
      }),
    ).rejects.toThrow('Authentication failed. Check your API key.')
  })

  it('reports missing endpoints', async () => {
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
  })

  it('reports unexpected HTTP errors', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
    })

    await expect(
      testServiceConnection('jellyfin', {
        url: 'http://localhost:8096',
        apiKey: 'key',
      }),
    ).rejects.toThrow('Connection failed: server returned HTTP 500.')
  })

  it('reports network failures', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(
      testServiceConnection('jellyfin', {
        url: 'http://localhost:8096',
        apiKey: 'key',
      }),
    ).rejects.toThrow('Unable to reach the server. Check its address and availability.')
  })

  it('reports request timeouts', async () => {
    fetchMock.mockImplementation(
      (_url: string, options: RequestInit) =>
        new Promise((_resolve, reject) => {
          options.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
    )

    vi.useFakeTimers()

    const connection = testServiceConnection('sonarr', {
      url: 'http://localhost:8989',
      apiKey: 'key',
    })

    const assertion = expect(connection).rejects.toThrow(
      'Connection timed out. Check the server address.',
    )

    await vi.advanceTimersByTimeAsync(10_000)

    await assertion
  })

  it('uses a longer timeout for Jellyfin', async () => {
    fetchMock.mockImplementation(
      (_url: string, options: RequestInit) =>
        new Promise((_resolve, reject) => {
          options.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
    )

    vi.useFakeTimers()

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

    await assertion
  })
})
