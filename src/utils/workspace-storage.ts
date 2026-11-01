import {
  DEFAULT_WORKSPACE_PREFERENCES,
  isWorkspaceMode,
  type WorkspacePreferences,
} from '../types/workspace'

const STORAGE_KEY = 'mediaManagarrWorkspacePreferences'

interface StoredWorkspacePreferences {
  [STORAGE_KEY]?: unknown
}

function getStorage() {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    throw new Error('Browser extension storage is unavailable.')
  }

  return chrome.storage.local
}

export async function getWorkspacePreferences(): Promise<WorkspacePreferences> {
  const result = (await getStorage().get(STORAGE_KEY)) as StoredWorkspacePreferences
  const stored = result[STORAGE_KEY]

  if (
    typeof stored !== 'object' ||
    stored === null ||
    !('defaultMode' in stored) ||
    !isWorkspaceMode(stored.defaultMode)
  ) {
    return { ...DEFAULT_WORKSPACE_PREFERENCES }
  }

  return {
    defaultMode: stored.defaultMode,
  }
}

export async function saveWorkspacePreferences(preferences: WorkspacePreferences): Promise<void> {
  if (!isWorkspaceMode(preferences.defaultMode)) {
    throw new Error('Invalid default workspace mode.')
  }

  await getStorage().set({
    [STORAGE_KEY]: {
      defaultMode: preferences.defaultMode,
    },
  })
}
