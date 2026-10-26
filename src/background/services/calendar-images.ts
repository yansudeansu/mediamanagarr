import type { CalendarServiceId } from '../../types/calendar'
import type { ServiceConfig } from '../../types/service'
import { buildServiceApiUrl } from './connection'

const IMAGE_TIMEOUT_MS = 10_000
const MAX_IMAGE_BYTES = 2 * 1024 * 1024

interface MediaImage {
  coverType?: unknown
  url?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function getPosterPath(data: unknown): string | null {
  if (!isRecord(data) || !Array.isArray(data.images)) {
    return null
  }

  const poster = data.images.find(
    (image): image is MediaImage => isRecord(image) && image.coverType === 'poster',
  )

  if (!poster || typeof poster.url !== 'string') {
    return null
  }

  return poster.url.trim() || null
}

function validatePosterUrl(config: ServiceConfig, value: string): string {
  const server = new URL(config.url)
  const poster = new URL(value, server)

  if (poster.origin !== server.origin) {
    throw new Error('Poster URL does not belong to the configured server.')
  }

  if (poster.protocol !== 'http:' && poster.protocol !== 'https:') {
    throw new Error('Unsupported poster URL protocol.')
  }

  if (poster.username || poster.password) {
    throw new Error('Poster URL contains unexpected credentials.')
  }

  if (!poster.pathname.includes('/MediaCover/')) {
    throw new Error('Unexpected poster image path.')
  }

  return poster.toString()
}

async function fetchWithTimeout(url: string, apiKey: string, accept: string): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS)

  try {
    return await fetch(url, {
      method: 'GET',
      headers: {
        Accept: accept,
        'X-Api-Key': apiKey,
      },
      signal: controller.signal,
      redirect: 'error',
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function loadMedia(
  config: ServiceConfig,
  service: CalendarServiceId,
  id: number,
): Promise<unknown> {
  const endpoint = service === 'sonarr' ? 'series' : 'movie'

  const response = await fetchWithTimeout(
    buildServiceApiUrl(config.url, `/api/v3/${endpoint}/${id}`),
    config.apiKey,
    'application/json',
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Unable to load ${service} poster metadata: HTTP ${response.status}.`)
  }

  return response.json()
}

async function loadPoster(config: ServiceConfig, posterPath: string): Promise<string | null> {
  const url = validatePosterUrl(config, posterPath)

  const response = await fetchWithTimeout(url, config.apiKey, 'image/*')

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Unable to load calendar poster: HTTP ${response.status}.`)
  }

  const contentLength = Number(response.headers.get('content-length'))

  if (contentLength > MAX_IMAGE_BYTES) {
    throw new Error('Calendar poster exceeds the maximum image size.')
  }

  const blob = await response.blob()

  if (blob.size > MAX_IMAGE_BYTES) {
    throw new Error('Calendar poster exceeds the maximum image size.')
  }

  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(blob.type)) {
    return null
  }

  const bytes = new Uint8Array(await blob.arrayBuffer())

  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return `data:${blob.type};base64,${btoa(binary)}`
}

export async function fetchCalendarImage(
  config: ServiceConfig,
  service: CalendarServiceId,
  mediaId: number,
): Promise<string | null> {
  if (!Number.isSafeInteger(mediaId) || mediaId < 1) {
    throw new Error('Invalid calendar media ID.')
  }

  try {
    const media = await loadMedia(config, service, mediaId)

    if (!media) {
      return null
    }

    const posterPath = getPosterPath(media)

    if (!posterPath) {
      return null
    }

    return await loadPoster(config, posterPath)
  } catch (error) {
    if (
      error !== null &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new Error('Loading calendar poster timed out.')
    }

    if (error instanceof TypeError) {
      throw new Error(`Unable to reach ${service === 'sonarr' ? 'Sonarr' : 'Radarr'}.`)
    }

    throw error
  }
}
