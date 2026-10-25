import type { ServiceConfig, ServiceId } from '../../types/service'

const DEFAULT_TIMEOUT_MS = 10_000
const JELLYFIN_TIMEOUT_MS = 15_000

interface ConnectionRequest {
  path: string
  headers: Record<string, string>
  timeoutMs?: number
}

function getConnectionRequest(serviceId: ServiceId, apiKey: string): ConnectionRequest {
  switch (serviceId) {
    case 'jellyfin':
      return {
        path: '/Library/MediaFolders',
        headers: {
          Authorization: `MediaBrowser Client="MediaManagarr", Device="Browser Extension", DeviceId="mediamanagarr", Version="0.1.0", Token="${apiKey}"`,
        },
        timeoutMs: JELLYFIN_TIMEOUT_MS,
      }

    case 'seerr':
      return {
        path: '/api/v1/status',
        headers: {
          'X-Api-Key': apiKey,
        },
      }

    case 'sonarr':
    case 'radarr':
      return {
        path: '/api/v3/system/status',
        headers: {
          'X-Api-Key': apiKey,
        },
      }

    case 'qbittorrent':
      return {
        path: '/api/v2/transfer/info',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
  }
}

export function buildServiceApiUrl(serverUrl: string, apiPath: string): string {
  const base = serverUrl.replace(/\/+$/, '')
  const path = apiPath.replace(/^\/+/, '')

  return `${base}/${path}`
}

export async function testServiceConnection(
  serviceId: ServiceId,
  config: ServiceConfig,
): Promise<void> {
  const request = getConnectionRequest(serviceId, config.apiKey)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), request.timeoutMs ?? DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(buildServiceApiUrl(config.url, request.path), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...request.headers,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication failed. Check your API key.')
      }

      if (response.status === 404) {
        throw new Error('Service endpoint not found. Check the server URL and base path.')
      }

      throw new Error(`Connection failed: server returned HTTP ${response.status}.`)
    }
  } catch (error) {
    // DOMException may originate from a different JavaScript realm in jsdom.
    // Checking its name avoids relying on instanceof Error.
    if (
      error !== null &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new Error('Connection timed out. Check the server address.')
    }

    if (error instanceof TypeError) {
      throw new Error('Unable to reach the server. Check its address and availability.')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected connection error occurred.')
  } finally {
    clearTimeout(timeout)
  }
}
