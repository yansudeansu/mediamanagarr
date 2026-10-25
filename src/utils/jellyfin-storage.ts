import type { JellyfinUserSelection } from '../types/jellyfin'

const STORAGE_KEY = 'mediaManagarrJellyfinUser'

interface StoredSelection {
  [STORAGE_KEY]?: JellyfinUserSelection
}

function getStorage() {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    throw new Error('Browser extension storage is unavailable.')
  }

  return chrome.storage.local
}

export async function getJellyfinUserSelection(serverUrl: string): Promise<string> {
  const result = (await getStorage().get(STORAGE_KEY)) as StoredSelection
  const selection = result[STORAGE_KEY]

  return selection?.serverUrl === serverUrl ? selection.userId : ''
}

export async function saveJellyfinUserSelection(serverUrl: string, userId: string): Promise<void> {
  await getStorage().set({
    [STORAGE_KEY]: {
      serverUrl,
      userId,
    } satisfies JellyfinUserSelection,
  })
}

export async function clearJellyfinUserSelection(): Promise<void> {
  await getStorage().remove(STORAGE_KEY)
}
