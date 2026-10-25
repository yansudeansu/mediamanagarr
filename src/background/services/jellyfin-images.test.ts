import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchJellyfinImage } from './jellyfin-images'
import type { ServiceConfig } from '../../types/service'

const config = {
  url: 'https://jellyfin.example.com',
  apiKey: 'test-api-key',
} as ServiceConfig

function mockImageResponse(blob: Blob, status = 200): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      blob: vi.fn().mockResolvedValue(blob),
    }),
  )
}

describe('fetchJellyfinImage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches and converts a Jellyfin image to a data URL', async () => {
    const imageBytes = new Uint8Array([137, 80, 78, 71])

    mockImageResponse(new Blob([imageBytes], { type: 'image/png' }))

    const result = await fetchJellyfinImage(config, 'movie-1', 'image-tag')

    expect(result).toBe('data:image/png;base64,iVBORw==')
    expect(fetch).toHaveBeenCalledOnce()

    const [url, options] = vi.mocked(fetch).mock.calls[0]!
    const requestUrl = new URL(String(url))

    expect(requestUrl.pathname).toBe('/Items/movie-1/Images/Primary')
    expect(requestUrl.searchParams.get('maxWidth')).toBe('120')
    expect(requestUrl.searchParams.get('quality')).toBe('80')
    expect(requestUrl.searchParams.get('tag')).toBe('image-tag')

    expect(options).toEqual(
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Accept: 'image/*',
          Authorization: expect.stringContaining('Token="test-api-key"'),
        }),
        signal: expect.any(AbortSignal),
      }),
    )
  })

  it('encodes item IDs and omits the tag when unavailable', async () => {
    mockImageResponse(new Blob([new Uint8Array([1])], { type: 'image/jpeg' }))

    await fetchJellyfinImage(config, 'movie / special', null)

    const [url] = vi.mocked(fetch).mock.calls[0]!
    const requestUrl = new URL(String(url))

    expect(requestUrl.pathname).toBe('/Items/movie%20%2F%20special/Images/Primary')
    expect(requestUrl.searchParams.has('tag')).toBe(false)
  })

  it('returns null when Jellyfin has no artwork', async () => {
    mockImageResponse(new Blob(), 404)

    await expect(fetchJellyfinImage(config, 'movie-1', null)).resolves.toBeNull()
  })

  it('returns null when the response is not an image', async () => {
    mockImageResponse(new Blob(['not an image'], { type: 'text/plain' }))

    await expect(fetchJellyfinImage(config, 'movie-1', null)).resolves.toBeNull()
  })

  it('rejects an empty item ID before making a request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchJellyfinImage(config, '  ', null)).rejects.toThrow(
      'Invalid Jellyfin image ID.',
    )

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([401, 403, 500])('handles HTTP errors (%i)', async (status) => {
    mockImageResponse(new Blob(), status)

    await expect(fetchJellyfinImage(config, 'movie-1', null)).rejects.toThrow(
      `Unable to load Jellyfin image: HTTP ${status}.`,
    )
  })

  it('handles network failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(fetchJellyfinImage(config, 'movie-1', null)).rejects.toThrow(
      'Unable to reach Jellyfin.',
    )
  })

  it('handles request timeouts', async () => {
    const error = new Error('Request aborted')
    error.name = 'AbortError'

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error))

    await expect(fetchJellyfinImage(config, 'movie-1', null)).rejects.toThrow(
      'Loading Jellyfin image timed out.',
    )
  })
})
