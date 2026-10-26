import type { QBittorrentSnapshot, QBittorrentTorrent } from '../../types/qbittorrent'
import type { ServiceConfig } from '../../types/service'
import { buildServiceApiUrl } from './connection'

interface QBittorrentApiTorrent {
  hash: string
  name: string
  progress: number
  state: string
  dlspeed: number
  upspeed: number
  eta: number
  size: number
  downloaded: number
}

interface QBittorrentTransferInfo {
  dl_info_speed?: number
  up_info_speed?: number
}

const REQUEST_TIMEOUT_MS = 10_000

function getErrorMessage(status: number): string {
  if (status === 401 || status === 403) {
    return 'qBittorrent authentication failed. Check your API key.'
  }

  if (status === 404) {
    return 'qBittorrent endpoint not found. Check your server URL.'
  }

  return `qBittorrent returned HTTP ${status}.`
}

async function apiFetch(
  config: ServiceConfig,
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(buildServiceApiUrl(config.url, path), {
      ...options,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        ...options.headers,
      },
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(getErrorMessage(response.status))
    }

    return response
  } catch (error) {
    if (
      error !== null &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new Error('qBittorrent request timed out.')
    }

    if (error instanceof TypeError) {
      throw new Error('Unable to reach qBittorrent. Check its address and availability.')
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}

async function apiGet<T>(config: ServiceConfig, path: string): Promise<T> {
  const response = await apiFetch(config, path)

  return (await response.json()) as T
}

async function apiPost(
  config: ServiceConfig,
  path: string,
  data: Record<string, string>,
): Promise<void> {
  await apiFetch(config, path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(data),
  })
}

export async function fetchQBittorrentSnapshot(
  config: ServiceConfig,
): Promise<QBittorrentSnapshot> {
  const [torrents, transfer] = await Promise.all([
    apiGet<QBittorrentApiTorrent[]>(
      config,
      '/api/v2/torrents/info?filter=all&sort=added_on&reverse=true',
    ),
    apiGet<QBittorrentTransferInfo>(config, '/api/v2/transfer/info'),
  ])

  return {
    torrents: torrents.map((torrent): QBittorrentTorrent => ({
      hash: torrent.hash,
      name: torrent.name,
      progress: torrent.progress,
      state: torrent.state,
      downloadSpeed: torrent.dlspeed,
      uploadSpeed: torrent.upspeed,
      eta: torrent.eta,
      size: torrent.size,
      downloaded: torrent.downloaded,
    })),
    downloadSpeed: transfer.dl_info_speed ?? 0,
    uploadSpeed: transfer.up_info_speed ?? 0,
  }
}

export async function startQBittorrentTorrent(config: ServiceConfig, hash: string): Promise<void> {
  await apiPost(config, '/api/v2/torrents/start', {
    hashes: hash,
  })
}

export async function stopQBittorrentTorrent(config: ServiceConfig, hash: string): Promise<void> {
  await apiPost(config, '/api/v2/torrents/stop', {
    hashes: hash,
  })
}

export async function deleteQBittorrentTorrent(
  config: ServiceConfig,
  hash: string,
  deleteFiles = false,
): Promise<void> {
  await apiPost(config, '/api/v2/torrents/delete', {
    hashes: hash,
    deleteFiles: String(deleteFiles),
  })
}
