const WORKSPACE_WINDOW_KEY = 'detachedWorkspaceWindowId'

const WORKSPACE_WIDTH = 900
const WORKSPACE_HEIGHT = 700

let pendingOpen: Promise<number> | null = null

async function getSavedWindowId(): Promise<number | null> {
  const result = await chrome.storage.session.get(WORKSPACE_WINDOW_KEY)
  const value: unknown = result[WORKSPACE_WINDOW_KEY]

  return typeof value === 'number' && Number.isSafeInteger(value) ? value : null
}

async function saveWindowId(windowId: number): Promise<void> {
  await chrome.storage.session.set({
    [WORKSPACE_WINDOW_KEY]: windowId,
  })
}

async function clearWindowId(): Promise<void> {
  await chrome.storage.session.remove(WORKSPACE_WINDOW_KEY)
}

async function findExistingWindow(): Promise<number | null> {
  const windowId = await getSavedWindowId()

  if (windowId === null) {
    return null
  }

  try {
    const window = await chrome.windows.get(windowId)

    if (window.type === 'popup') {
      return windowId
    }
  } catch {
    // The window may have been closed since we last saved its ID.
  }

  await clearWindowId()

  return null
}

async function createOrFocusWorkspace(): Promise<number> {
  const existingWindowId = await findExistingWindow()

  if (existingWindowId !== null) {
    await chrome.windows.update(existingWindowId, {
      focused: true,
    })

    return existingWindowId
  }

  const window = await chrome.windows.create({
    url: chrome.runtime.getURL('index.html?workspace=detached'),
    type: 'popup',
    width: WORKSPACE_WIDTH,
    height: WORKSPACE_HEIGHT,
    focused: true,
  })

  if (window?.id === undefined) {
    throw new Error('Unable to create the detached workspace window.')
  }

  await saveWindowId(window.id)

  return window.id
}

export function openDetachedWorkspace(): Promise<number> {
  if (pendingOpen) {
    return pendingOpen
  }

  const operation = createOrFocusWorkspace()

  pendingOpen = operation

  void operation
    .finally(() => {
      if (pendingOpen === operation) {
        pendingOpen = null
      }
    })
    .catch(() => {
      // The original promise remains responsible for reporting errors.
    })

  return operation
}
