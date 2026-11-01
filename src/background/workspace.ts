import { getWorkspacePreferences } from '../utils/workspace-storage'
import { toggleWorkspaceSidebar } from '../utils/workspace-sidebar'
import { openDetachedWorkspace } from './services/workspace-window'
import { isWorkspaceMode, type WorkspaceMode } from '../types/workspace'

const POPUP_PATH = 'index.html'
const STORAGE_KEY = 'mediaManagarrWorkspacePreferences'

let currentMode: WorkspaceMode = 'popup'
let initialized = false
let preferenceVersion = 0

function hasSidebarSupport(): boolean {
  const browserGlobal = globalThis as typeof globalThis & {
    browser?: {
      sidebarAction?: {
        open?: () => Promise<void>
      }
    }
  }

  return (
    typeof browserGlobal.browser?.sidebarAction?.open === 'function' ||
    (typeof chrome !== 'undefined' && typeof chrome.sidePanel?.open === 'function')
  )
}

function getSupportedMode(mode: WorkspaceMode): WorkspaceMode {
  if (mode === 'sidebar' && !hasSidebarSupport()) {
    console.warn(
      'MediaManagarr: Native sidebar opening is unavailable. Falling back to popup mode.',
    )

    return 'popup'
  }

  return mode
}

async function applyWorkspaceMode(mode: WorkspaceMode): Promise<void> {
  const supportedMode = getSupportedMode(mode)

  await chrome.action.setPopup({
    popup: supportedMode === 'popup' ? POPUP_PATH : '',
  })

  currentMode = supportedMode
}

async function refreshWorkspacePreference(): Promise<void> {
  const version = ++preferenceVersion

  try {
    const preferences = await getWorkspacePreferences()

    if (version !== preferenceVersion) {
      return
    }

    await applyWorkspaceMode(preferences.defaultMode)
  } catch (error) {
    console.warn('MediaManagarr: Unable to apply workspace preference:', error)

    if (version === preferenceVersion) {
      try {
        await applyWorkspaceMode('popup')
      } catch (fallbackError) {
        console.error('MediaManagarr: Unable to restore the toolbar popup:', fallbackError)
      }
    }
  }
}

function handleWorkspaceStorageChange(
  changes: Record<string, chrome.storage.StorageChange>,
  areaName: string,
): void {
  if (areaName !== 'local' || !changes[STORAGE_KEY]) {
    return
  }

  const stored: unknown = changes[STORAGE_KEY].newValue

  if (
    typeof stored === 'object' &&
    stored !== null &&
    'defaultMode' in stored &&
    isWorkspaceMode(stored.defaultMode)
  ) {
    void applyWorkspaceMode(stored.defaultMode).catch((error) => {
      console.error('MediaManagarr: Unable to update toolbar behavior:', error)
    })

    return
  }

  void applyWorkspaceMode('popup').catch((error) => {
    console.error('MediaManagarr: Unable to restore the toolbar popup:', error)
  })
}

export async function handleWorkspaceActionClick(windowId?: number): Promise<void> {
  try {
    if (currentMode === 'sidebar') {
      await toggleWorkspaceSidebar(windowId)
      return
    }

    if (currentMode === 'detached') {
      await openDetachedWorkspace()
    }
  } catch (error) {
    console.error('MediaManagarr: Unable to open preferred workspace:', error)
  }
}

export async function initializeWorkspace(): Promise<void> {
  if (!initialized) {
    initialized = true

    chrome.action.onClicked.addListener((tab) => {
      void handleWorkspaceActionClick(tab.windowId)
    })

    chrome.storage.onChanged.addListener(handleWorkspaceStorageChange)
  }

  await refreshWorkspacePreference()
}
