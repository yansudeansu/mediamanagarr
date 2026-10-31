import type { ServiceConfig, ServiceId } from '../../types/service'

const DEFAULT_TIMEOUT_MS = 10_000
const JELLYFIN_TIMEOUT_MS = 15_000

const MAX_RETRIES = 2
const RETRY_BASE_DELAY_MS = 250

interface ConnectionRequest {
  path: string
  headers: Record<string, string>
  timeoutMs?: number
}

class RetryableConnectionError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'RetryableConnectionError'
  }
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

function waitForRetry(attempt: number): Promise<void> {
  const delay = RETRY_BASE_DELAY_MS * 2 ** attempt

  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

async function attemptConnection(serviceId: ServiceId, config: ServiceConfig): Promise<void> {
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

      if (response.status === 429) {
        throw new Error('The service is receiving too many requests. Please try again later.')
      }

      if (response.status === 502 || response.status === 503 || response.status === 504) {
        throw new RetryableConnectionError(
          `The server is temporarily unavailable (HTTP ${response.status}). Please try again later.`,
        )
      }

      throw new Error(`Connection failed: server returned HTTP ${response.status}.`)
    }
  } catch (error) {
    // DOMException may originate from a different JavaScript realm in jsdom.
    if (
      error !== null &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new RetryableConnectionError('Connection timed out. Check the server address.', {
        cause: error,
      })
    }

    if (error instanceof TypeError) {
      throw new RetryableConnectionError(
        'Unable to reach the server. Check its address and availability.',
        { cause: error },
      )
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected connection error occurred.', { cause: error })
  } finally {
    clearTimeout(timeout)
  }
}

export async function testServiceConnection(
  serviceId: ServiceId,
  config: ServiceConfig,
): Promise<void> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      await attemptConnection(serviceId, config)
      return
    } catch (error) {
      if (!(error instanceof RetryableConnectionError) || attempt === MAX_RETRIES) {
        throw error
      }

      await waitForRetry(attempt)
    }
  }
}
