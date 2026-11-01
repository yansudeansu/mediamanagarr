import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getWorkspacePreferences } from '../utils/workspace-storage'
import { openDetachedWorkspace } from './services/workspace-window'
import { toggleWorkspaceSidebar } from '../utils/workspace-sidebar'

vi.mock('../utils/workspace-storage', () => ({
  getWorkspacePreferences: vi.fn(),
}))

vi.mock('./services/workspace-window', () => ({
  openDetachedWorkspace: vi.fn(),
}))

vi.mock('../utils/workspace-sidebar', () => ({
  toggleWorkspaceSidebar: vi.fn(),
}))

describe('background workspace', () => {
  const setPopup = vi.fn(async () => {})
  const addClickListener = vi.fn()
  const addStorageListener = vi.fn()
  const sidePanelOpen = vi.fn(async () => {})

  let initializeWorkspace: typeof import('./workspace').initializeWorkspace
  let handleWorkspaceActionClick: typeof import('./workspace').handleWorkspaceActionClick

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()

    vi.mocked(getWorkspacePreferences).mockResolvedValue({
      defaultMode: 'popup',
    })

    vi.mocked(openDetachedWorkspace).mockResolvedValue(123)
    vi.mocked(toggleWorkspaceSidebar).mockResolvedValue()

    vi.stubGlobal('browser', undefined)

    vi.stubGlobal('chrome', {
      action: {
        setPopup,
        onClicked: {
          addListener: addClickListener,
        },
      },
      sidePanel: {
        open: sidePanelOpen,
      },
      storage: {
        onChanged: {
          addListener: addStorageListener,
        },
      },
    })

    const workspace = await import('./workspace')

    initializeWorkspace = workspace.initializeWorkspace
    handleWorkspaceActionClick = workspace.handleWorkspaceActionClick
  })

  it('keeps the popup enabled by default', async () => {
    await initializeWorkspace()

    expect(setPopup).toHaveBeenCalledWith({
      popup: 'index.html',
    })
  })

  it('disables the popup for sidebar mode', async () => {
    vi.mocked(getWorkspacePreferences).mockResolvedValue({
      defaultMode: 'sidebar',
    })

    await initializeWorkspace()

    expect(setPopup).toHaveBeenCalledWith({
      popup: '',
    })
  })

  it('disables the popup for detached mode', async () => {
    vi.mocked(getWorkspacePreferences).mockResolvedValue({
      defaultMode: 'detached',
    })

    await initializeWorkspace()

    expect(setPopup).toHaveBeenCalledWith({
      popup: '',
    })
  })

  it('toggles the sidebar when sidebar mode is selected', async () => {
    vi.mocked(getWorkspacePreferences).mockResolvedValue({
      defaultMode: 'sidebar',
    })

    await initializeWorkspace()
    await handleWorkspaceActionClick()

    expect(toggleWorkspaceSidebar).toHaveBeenCalledExactlyOnceWith(undefined)
    expect(openDetachedWorkspace).not.toHaveBeenCalled()
  })

  it('forwards the window ID when toggling the sidebar', async () => {
    vi.mocked(getWorkspacePreferences).mockResolvedValue({
      defaultMode: 'sidebar',
    })

    await initializeWorkspace()
    await handleWorkspaceActionClick(42)

    expect(toggleWorkspaceSidebar).toHaveBeenCalledExactlyOnceWith(42)
    expect(openDetachedWorkspace).not.toHaveBeenCalled()
  })

  it('forwards the toolbar-click window ID to the sidebar utility', async () => {
    vi.mocked(getWorkspacePreferences).mockResolvedValue({
      defaultMode: 'sidebar',
    })

    await initializeWorkspace()

    expect(addClickListener).toHaveBeenCalledOnce()

    const listener = addClickListener.mock.calls[0]?.[0] as
      ((tab: { windowId?: number }) => void) | undefined

    expect(listener).toBeTypeOf('function')

    listener?.({ windowId: 123 })

    expect(toggleWorkspaceSidebar).toHaveBeenCalledExactlyOnceWith(123)
  })

  it('handles toolbar clicks without a window ID', async () => {
    vi.mocked(getWorkspacePreferences).mockResolvedValue({
      defaultMode: 'sidebar',
    })

    await initializeWorkspace()

    const listener = addClickListener.mock.calls[0]?.[0] as
      ((tab: { windowId?: number }) => void) | undefined

    listener?.({})

    expect(toggleWorkspaceSidebar).toHaveBeenCalledExactlyOnceWith(undefined)
  })

  it('opens or focuses the detached workspace when detached mode is selected', async () => {
    vi.mocked(getWorkspacePreferences).mockResolvedValue({
      defaultMode: 'detached',
    })

    await initializeWorkspace()
    await handleWorkspaceActionClick(42)

    expect(openDetachedWorkspace).toHaveBeenCalledOnce()
    expect(toggleWorkspaceSidebar).not.toHaveBeenCalled()
  })

  it('does not open another workspace when popup mode is selected', async () => {
    await initializeWorkspace()
    await handleWorkspaceActionClick()

    expect(toggleWorkspaceSidebar).not.toHaveBeenCalled()
    expect(openDetachedWorkspace).not.toHaveBeenCalled()
  })

  it('registers a toolbar click listener', async () => {
    await initializeWorkspace()

    expect(addClickListener).toHaveBeenCalledOnce()
  })

  it('registers a storage change listener', async () => {
    await initializeWorkspace()

    expect(addStorageListener).toHaveBeenCalledOnce()
  })

  it('does not register duplicate listeners when initialized again', async () => {
    await initializeWorkspace()
    await initializeWorkspace()

    expect(addClickListener).toHaveBeenCalledOnce()
    expect(addStorageListener).toHaveBeenCalledOnce()
  })

  it('does not require a storage read when handling a toolbar click', async () => {
    vi.mocked(getWorkspacePreferences).mockResolvedValue({
      defaultMode: 'sidebar',
    })

    await initializeWorkspace()

    vi.mocked(getWorkspacePreferences).mockClear()

    await handleWorkspaceActionClick(42)

    expect(getWorkspacePreferences).not.toHaveBeenCalled()
    expect(toggleWorkspaceSidebar).toHaveBeenCalledExactlyOnceWith(42)
  })

  it('falls back to popup when native sidebar support is unavailable', async () => {
    vi.stubGlobal('chrome', {
      action: {
        setPopup,
        onClicked: {
          addListener: addClickListener,
        },
      },
      storage: {
        onChanged: {
          addListener: addStorageListener,
        },
      },
    })

    vi.mocked(getWorkspacePreferences).mockResolvedValue({
      defaultMode: 'sidebar',
    })

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    try {
      await initializeWorkspace()

      expect(setPopup).toHaveBeenCalledWith({
        popup: 'index.html',
      })

      await handleWorkspaceActionClick(42)

      expect(toggleWorkspaceSidebar).not.toHaveBeenCalled()
      expect(openDetachedWorkspace).not.toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })

  it('handles sidebar toggle failures without throwing', async () => {
    vi.mocked(getWorkspacePreferences).mockResolvedValue({
      defaultMode: 'sidebar',
    })

    vi.mocked(toggleWorkspaceSidebar).mockRejectedValue(new Error('Unable to toggle sidebar.'))

    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      await initializeWorkspace()

      await expect(handleWorkspaceActionClick(42)).resolves.toBeUndefined()

      expect(toggleWorkspaceSidebar).toHaveBeenCalledExactlyOnceWith(42)
      expect(error).toHaveBeenCalledWith(
        'MediaManagarr: Unable to open preferred workspace:',
        expect.any(Error),
      )
    } finally {
      error.mockRestore()
    }
  })
})
