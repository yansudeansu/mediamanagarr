import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ServiceConfig } from '../../types/service'
import {
  deleteQBittorrentTorrent,
  fetchQBittorrentSnapshot,
  startQBittorrentTorrent,
  stopQBittorrentTorrent,
} from './qbittorrent'

const config: ServiceConfig = {
  url: 'https://downloads.example.com/qbittorrent',
  apiKey: 'test-api-key',
}

const torrent = {
  hash: 'a'.repeat(40),
  name: 'Example Torrent',
  progress: 0.5,
  state: 'downloading',
  dlspeed: 1024,
  upspeed: 512,
  eta: 3600,
  size: 2048,
  downloaded: 1024,
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

describe('qBittorrent API', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches torrents and transfer statistics', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input)

      if (url.includes('/torrents/info')) {
        return jsonResponse([torrent])
      }

      return jsonResponse({
        dl_info_speed: 4096,
        up_info_speed: 2048,
      })
    })

    const snapshot = await fetchQBittorrentSnapshot(config)

    expect(snapshot).toEqual({
      torrents: [
        {
          hash: torrent.hash,
          name: torrent.name,
          progress: 0.5,
          state: 'downloading',
          downloadSpeed: 1024,
          uploadSpeed: 512,
          eta: 3600,
          size: 2048,
          downloaded: 1024,
        },
      ],
      downloadSpeed: 4096,
      uploadSpeed: 2048,
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://downloads.example.com/qbittorrent/api/v2/torrents/info?filter=all&sort=added_on&reverse=true',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-api-key',
        }),
        cache: 'no-store',
      }),
    )
  })

  it('defaults missing transfer speeds to zero', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      if (String(input).includes('/torrents/info')) {
        return jsonResponse([])
      }

      return jsonResponse({})
    })

    const snapshot = await fetchQBittorrentSnapshot(config)

    expect(snapshot.downloadSpeed).toBe(0)
    expect(snapshot.uploadSpeed).toBe(0)
  })

  it('starts a torrent using the API key', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null))

    await startQBittorrentTorrent(config, torrent.hash)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://downloads.example.com/qbittorrent/api/v2/torrents/start',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        body: new URLSearchParams({ hashes: torrent.hash }),
      }),
    )
  })

  it('stops a torrent', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null))

    await stopQBittorrentTorrent(config, torrent.hash)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://downloads.example.com/qbittorrent/api/v2/torrents/stop',
      expect.objectContaining({
        method: 'POST',
        body: new URLSearchParams({ hashes: torrent.hash }),
      }),
    )
  })

  it('keeps downloaded files by default when removing a torrent', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null))

    await deleteQBittorrentTorrent(config, torrent.hash)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://downloads.example.com/qbittorrent/api/v2/torrents/delete',
      expect.objectContaining({
        body: new URLSearchParams({
          hashes: torrent.hash,
          deleteFiles: 'false',
        }),
      }),
    )
  })

  it('deletes files only when explicitly requested', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null))

    await deleteQBittorrentTorrent(config, torrent.hash, true)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://downloads.example.com/qbittorrent/api/v2/torrents/delete',
      expect.objectContaining({
        body: new URLSearchParams({
          hashes: torrent.hash,
          deleteFiles: 'true',
        }),
      }),
    )
  })

  it('reports authentication failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 401 }))

    await expect(startQBittorrentTorrent(config, torrent.hash)).rejects.toThrow(
      'qBittorrent authentication failed. Check your API key.',
    )
  })

  it('reports missing endpoints', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 404 }))

    await expect(stopQBittorrentTorrent(config, torrent.hash)).rejects.toThrow(
      'qBittorrent endpoint not found. Check your server URL.',
    )
  })

  it('reports other HTTP failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))

    await expect(startQBittorrentTorrent(config, torrent.hash)).rejects.toThrow(
      'qBittorrent returned HTTP 500.',
    )
  })

  it('reports network failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(startQBittorrentTorrent(config, torrent.hash)).rejects.toThrow(
      'Unable to reach qBittorrent. Check its address and availability.',
    )
  })

  it('reports timeouts', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_input, options) => {
      return new Promise<Response>((_resolve, reject) => {
        options?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'))
        })
      })
    })

    vi.useFakeTimers()

    try {
      const request = startQBittorrentTorrent(config, torrent.hash)
      const assertion = expect(request).rejects.toThrow('qBittorrent request timed out.')

      await vi.advanceTimersByTimeAsync(10_000)
      await assertion
    } finally {
      vi.useRealTimers()
    }
  })
})
