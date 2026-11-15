import { getWorkspacePreferences } from '../utils/workspace-storage'
import { toggleWorkspaceSidebar } from '../utils/workspace-sidebar'
import { openDetachedWorkspace } from './services/workspace-window'
import { isWorkspaceMode, type WorkspaceMode } from '../types/workspace'

const POPUP_PATH = 'index.html'
const STORAGE_KEY = 'mediaManagarrWorkspacePreferences'

let currentMode: WorkspaceMode | null = null
let initialized = false
let preferenceVersion = 0
let initializationPromise: Promise<void> | null = null

function getFirefoxSidebar() {
  const browserGlobal = globalThis as typeof globalThis & {
    browser?: {
      sidebarAction?: {
        open?: () => Promise<void>
      }
    }
  }

  return browserGlobal.browser?.sidebarAction
}

function hasSidebarSupport(): boolean {
  if (typeof getFirefoxSidebar()?.open === 'function') {
    return true
  }

  if (import.meta.env.VITE_BROWSER_TARGET !== 'firefox') {
    return typeof chrome !== 'undefined' && typeof chrome.sidePanel?.open === 'function'
  }

  return false
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

  // Invalidate any preference read still in progress.
  ++preferenceVersion

  const stored: unknown = changes[STORAGE_KEY].newValue

  const mode: WorkspaceMode =
    typeof stored === 'object' &&
    stored !== null &&
    'defaultMode' in stored &&
    isWorkspaceMode(stored.defaultMode)
      ? stored.defaultMode
      : 'popup'

  void applyWorkspaceMode(mode).catch((error) => {
    console.error('MediaManagarr: Unable to update toolbar behavior:', error)
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
      return
    }

    if (currentMode === 'popup') {
      return
    }

    // Firefox/Zen first-click recovery:
    //
    // Firefox only dispatches action.onClicked when the action
    // does not have a popup configured.
    //
    // If this handler runs before preferences have loaded, the
    // browser's toolbar configuration already tells us that
    // this is a non-popup workspace.
    //
    // Prioritize the native Firefox sidebar and invoke it
    // immediately, without awaiting storage. This preserves
    // the user gesture needed by Firefox's sidebar API.
    if (typeof getFirefoxSidebar()?.open === 'function') {
      await toggleWorkspaceSidebar(windowId)
      return
    }

    console.warn('MediaManagarr: Workspace preference has not finished initializing.')
  } catch (error) {
    console.error('MediaManagarr: Unable to open preferred workspace:', error)
  }
}

export function initializeWorkspace(): Promise<void> {
  if (!initialized) {
    initialized = true

    // Register synchronously, before the first storage read.
    chrome.action.onClicked.addListener((tab) => {
      void handleWorkspaceActionClick(tab.windowId)
    })

    chrome.storage.onChanged.addListener(handleWorkspaceStorageChange)
  }

  if (!initializationPromise) {
    initializationPromise = refreshWorkspacePreference().finally(() => {
      initializationPromise = null
    })
  }

  return initializationPromise
}
