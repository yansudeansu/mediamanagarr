import { normalizeServerUrl } from './service-config'

/**
 * Build a Jellyfin Web link to a specific media item's details.
 *
 * Returns null when the server URL or item ID is invalid.
 * Does not include credentials, API keys, or playback commands.
 */
export function getJellyfinMediaUrl(
  serverUrl: string | null | undefined,
  itemId: string | null | undefined,
): string | null {
  if (!serverUrl || !itemId) {
    return null
  }

  const id = itemId.trim()

  // Jellyfin item IDs are GUIDs represented as 32 hex characters.
  if (!/^[a-fA-F0-9]{32}$/.test(id)) {
    return null
  }

  try {
    const baseUrl = normalizeServerUrl(serverUrl)

    return `${baseUrl}/web/#/details?id=${encodeURIComponent(id)}`
  } catch {
    return null
  }
}
