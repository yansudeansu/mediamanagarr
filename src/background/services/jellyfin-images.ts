import type { ServiceConfig } from '../../types/service'
import { buildServiceApiUrl } from './connection'

const IMAGE_TIMEOUT_MS = 10_000

export async function fetchJellyfinImage(
  config: ServiceConfig,
  itemId: string,
  imageTag: string | null,
): Promise<string | null> {
  if (!itemId.trim()) {
    throw new Error('Invalid Jellyfin image ID.')
  }

  const params = new URLSearchParams({
    maxWidth: '120',
    quality: '80',
  })

  if (imageTag) {
    params.set('tag', imageTag)
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS)

  try {
    const response = await fetch(
      buildServiceApiUrl(
        config.url,
        `/Items/${encodeURIComponent(itemId)}/Images/Primary?${params.toString()}`,
      ),
      {
        method: 'GET',
        headers: {
          Accept: 'image/*',
          Authorization: `MediaBrowser Client="MediaManagarr", Device="Browser Extension", DeviceId="mediamanagarr", Version="0.1.0", Token="${config.apiKey}"`,
        },
        signal: controller.signal,
      },
    )

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`Unable to load Jellyfin image: HTTP ${response.status}.`)
    }

    const blob = await response.blob()

    if (!blob.type.startsWith('image/')) {
      return null
    }

    const buffer = await blob.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    let binary = ''

    for (const byte of bytes) {
      binary += String.fromCharCode(byte)
    }

    return `data:${blob.type};base64,${btoa(binary)}`
  } catch (error) {
    if (
      error !== null &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new Error('Loading Jellyfin image timed out.', { cause: error })
    }

    if (error instanceof TypeError) {
      throw new Error('Unable to reach Jellyfin.', { cause: error })
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while loading Jellyfin image.', { cause: error })
  } finally {
    clearTimeout(timeout)
  }
}
