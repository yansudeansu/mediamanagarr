import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ServiceConfig } from '../../types/service'
import { fetchCalendarImage } from './calendar-images'

const config: ServiceConfig = {
  url: 'http://localhost:8989',
  apiKey: 'secret-api-key',
}

function metadataResponse(images: unknown[]): Response {
  return new Response(JSON.stringify({ images }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

function imageResponse(bytes: number[], contentType = 'image/jpeg'): Response {
  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      'Content-Type': contentType,
    },
  })
}

describe('fetchCalendarImage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('rejects invalid media IDs', async () => {
    await expect(fetchCalendarImage(config, 'sonarr', 0)).rejects.toThrow(
      'Invalid calendar media ID.',
    )
  })

  it('returns null when media is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 404,
        }),
      ),
    )

    await expect(fetchCalendarImage(config, 'sonarr', 101)).resolves.toBeNull()
  })

  it('returns null when no poster exists', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(metadataResponse([])))

    await expect(fetchCalendarImage(config, 'sonarr', 101)).resolves.toBeNull()
  })

  it('loads an authenticated Sonarr poster', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        metadataResponse([
          {
            coverType: 'poster',
            url: '/MediaCover/101/poster.jpg',
          },
        ]),
      )
      .mockResolvedValueOnce(imageResponse([1, 2, 3]))

    vi.stubGlobal('fetch', fetchMock)

    const image = await fetchCalendarImage(config, 'sonarr', 101)

    expect(typeof image).toBe('string')
    expect(image).toMatch(/^data:image\/jpeg;base64,/)
    expect(image).toBe('data:image/jpeg;base64,AQID')

    expect(fetchMock).toHaveBeenCalledTimes(2)

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v3/series/101')
    expect(fetchMock.mock.calls[1]?.[0]).toContain('/MediaCover/101/poster.jpg')

    expect(fetchMock.mock.calls[1]?.[1]?.headers).toMatchObject({
      'X-Api-Key': 'secret-api-key',
    })
  })

  it('loads Radarr movie metadata', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 404,
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await fetchCalendarImage(config, 'radarr', 201)

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v3/movie/201')
  })

  it('rejects poster URLs from other hosts', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      metadataResponse([
        {
          coverType: 'poster',
          url: 'https://example.com/MediaCover/101/poster.jpg',
        },
      ]),
    )

    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchCalendarImage(config, 'sonarr', 101)).rejects.toThrow(
      'Poster URL does not belong to the configured server.',
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('rejects unexpected poster paths', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      metadataResponse([
        {
          coverType: 'poster',
          url: '/api/v3/system/status',
        },
      ]),
    )

    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchCalendarImage(config, 'sonarr', 101)).rejects.toThrow(
      'Unexpected poster image path.',
    )
  })

  it('returns null for unsupported image formats', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        metadataResponse([
          {
            coverType: 'poster',
            url: '/MediaCover/101/poster.jpg',
          },
        ]),
      )
      .mockResolvedValueOnce(
        new Response('<svg></svg>', {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml',
          },
        }),
      )

    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchCalendarImage(config, 'sonarr', 101)).resolves.toBeNull()
  })

  it('loads Sonarr series metadata using the supplied series ID', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 404,
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await fetchCalendarImage(config, 'sonarr', 42)

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v3/series/42')
  })

  it('loads Radarr movie metadata using the supplied movie ID', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 404,
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await fetchCalendarImage(config, 'radarr', 201)

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v3/movie/201')
  })
})
