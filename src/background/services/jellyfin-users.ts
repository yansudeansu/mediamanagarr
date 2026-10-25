import type { JellyfinUser } from '../../types/jellyfin'
import type { ServiceConfig } from '../../types/service'
import { buildServiceApiUrl } from './connection'

const JELLYFIN_TIMEOUT_MS = 15_000

interface JellyfinApiUser {
  Id?: unknown
  Name?: unknown
}

export async function fetchJellyfinUsers(config: ServiceConfig): Promise<JellyfinUser[]> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), JELLYFIN_TIMEOUT_MS)

  try {
    const response = await fetch(buildServiceApiUrl(config.url, '/Users'), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `MediaBrowser Client="MediaManagarr", Device="Browser Extension", DeviceId="mediamanagarr", Version="0.1.0", Token="${config.apiKey}"`,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Jellyfin did not allow access to the user list.')
      }

      throw new Error(`Unable to load Jellyfin users: HTTP ${response.status}.`)
    }

    const data: unknown = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Jellyfin returned an invalid user list.')
    }

    return data.map((item: JellyfinApiUser) => {
      if (
        item === null ||
        typeof item !== 'object' ||
        typeof item.Id !== 'string' ||
        !item.Id ||
        typeof item.Name !== 'string'
      ) {
        throw new Error('Jellyfin returned an invalid user list.')
      }

      return {
        id: item.Id,
        name: item.Name,
      }
    })
  } catch (error) {
    if (
      error !== null &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new Error('Loading Jellyfin users timed out.')
    }

    if (error instanceof TypeError) {
      throw new Error('Unable to reach Jellyfin.')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while loading Jellyfin users.')
  } finally {
    clearTimeout(timeout)
  }
}
