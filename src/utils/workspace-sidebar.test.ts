import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  closeWorkspaceSidebar,
  openWorkspaceSidebar,
  toggleWorkspaceSidebar,
} from './workspace-sidebar'

describe('workspace-sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('browser', undefined)
    vi.stubGlobal('chrome', undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('Firefox and Zen', () => {
    it('opens the native sidebar using sidebarAction', async () => {
      const open = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('browser', {
        sidebarAction: { open },
      })

      await openWorkspaceSidebar()

      expect(open).toHaveBeenCalledOnce()
      expect(open).toHaveBeenCalledWith()
    })

    it('closes the native sidebar using sidebarAction', async () => {
      const close = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('browser', {
        sidebarAction: { close },
      })

      await closeWorkspaceSidebar()

      expect(close).toHaveBeenCalledOnce()
      expect(close).toHaveBeenCalledWith()
    })

    it('prefers the Firefox sidebar API when both browser APIs exist', async () => {
      const firefoxOpen = vi.fn().mockResolvedValue(undefined)
      const chromeOpen = vi.fn().mockResolvedValue(undefined)
      const getCurrent = vi.fn().mockResolvedValue({ id: 42 })

      vi.stubGlobal('browser', {
        sidebarAction: { open: firefoxOpen },
      })

      vi.stubGlobal('chrome', {
        windows: { getCurrent },
        sidePanel: { open: chromeOpen },
      })

      await openWorkspaceSidebar()

      expect(firefoxOpen).toHaveBeenCalledOnce()
      expect(getCurrent).not.toHaveBeenCalled()
      expect(chromeOpen).not.toHaveBeenCalled()
    })

    it('propagates errors from sidebarAction.open', async () => {
      const error = new Error('Sidebar could not be opened.')

      vi.stubGlobal('browser', {
        sidebarAction: {
          open: vi.fn().mockRejectedValue(error),
        },
      })

      await expect(openWorkspaceSidebar()).rejects.toThrow('Sidebar could not be opened.')
    })

    it('propagates errors from sidebarAction.close', async () => {
      const error = new Error('Sidebar could not be closed.')

      vi.stubGlobal('browser', {
        sidebarAction: {
          close: vi.fn().mockRejectedValue(error),
        },
      })

      await expect(closeWorkspaceSidebar()).rejects.toThrow('Sidebar could not be closed.')
    })

    it('uses the native toggle API when available', async () => {
      const toggle = vi.fn().mockResolvedValue(undefined)
      const open = vi.fn().mockResolvedValue(undefined)
      const close = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('browser', {
        sidebarAction: { open, close, toggle },
      })

      await toggleWorkspaceSidebar()

      expect(toggle).toHaveBeenCalledOnce()
      expect(toggle).toHaveBeenCalledWith()
      expect(open).not.toHaveBeenCalled()
      expect(close).not.toHaveBeenCalled()
    })

    it('uses the native toggle API on every toolbar action', async () => {
      const toggle = vi.fn().mockResolvedValue(undefined)
      const open = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('browser', {
        sidebarAction: { open, toggle },
      })

      await toggleWorkspaceSidebar()
      await toggleWorkspaceSidebar()
      await toggleWorkspaceSidebar()

      expect(toggle).toHaveBeenCalledTimes(3)
      expect(open).not.toHaveBeenCalled()
    })

    it('prefers the native Firefox toggle when Chromium APIs also exist', async () => {
      const toggle = vi.fn().mockResolvedValue(undefined)
      const chromeOpen = vi.fn().mockResolvedValue(undefined)
      const getCurrent = vi.fn().mockResolvedValue({ id: 42 })

      vi.stubGlobal('browser', {
        sidebarAction: {
          open: vi.fn(),
          toggle,
        },
      })

      vi.stubGlobal('chrome', {
        windows: { getCurrent },
        sidePanel: { open: chromeOpen },
      })

      await toggleWorkspaceSidebar(42)

      expect(toggle).toHaveBeenCalledOnce()
      expect(getCurrent).not.toHaveBeenCalled()
      expect(chromeOpen).not.toHaveBeenCalled()
    })

    it('falls back to opening when the native toggle API is unavailable', async () => {
      const open = vi.fn().mockResolvedValue(undefined)
      const close = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('browser', {
        sidebarAction: { open, close },
      })

      await toggleWorkspaceSidebar()

      expect(open).toHaveBeenCalledOnce()
      expect(close).not.toHaveBeenCalled()
    })

    it('does not use isOpen when the native toggle API is unavailable', async () => {
      const isOpen = vi.fn().mockResolvedValue(true)
      const open = vi.fn().mockResolvedValue(undefined)
      const close = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('browser', {
        sidebarAction: { isOpen, open, close },
      })

      await toggleWorkspaceSidebar()

      expect(isOpen).not.toHaveBeenCalled()
      expect(open).toHaveBeenCalledOnce()
      expect(close).not.toHaveBeenCalled()
    })

    it('propagates errors from the native toggle API', async () => {
      const error = new Error('Unable to toggle sidebar.')
      const open = vi.fn()

      vi.stubGlobal('browser', {
        sidebarAction: {
          open,
          toggle: vi.fn().mockRejectedValue(error),
        },
      })

      await expect(toggleWorkspaceSidebar()).rejects.toThrow('Unable to toggle sidebar.')

      expect(open).not.toHaveBeenCalled()
    })

    it('propagates errors when fallback opening fails', async () => {
      const error = new Error('Unable to open sidebar.')

      vi.stubGlobal('browser', {
        sidebarAction: {
          open: vi.fn().mockRejectedValue(error),
        },
      })

      await expect(toggleWorkspaceSidebar()).rejects.toThrow('Unable to open sidebar.')
    })
  })

  describe('Chromium', () => {
    it('opens the side panel in the current browser window', async () => {
      const getCurrent = vi.fn().mockResolvedValue({ id: 42 })
      const open = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('chrome', {
        windows: { getCurrent },
        sidePanel: { open },
      })

      await openWorkspaceSidebar()

      expect(getCurrent).toHaveBeenCalledOnce()
      expect(open).toHaveBeenCalledOnce()
      expect(open).toHaveBeenCalledWith({ windowId: 42 })
    })

    it('opens the side panel in the specified browser window', async () => {
      const getCurrent = vi.fn()
      const open = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('chrome', {
        windows: { getCurrent },
        sidePanel: { open },
      })

      await openWorkspaceSidebar(42)

      expect(getCurrent).not.toHaveBeenCalled()
      expect(open).toHaveBeenCalledWith({ windowId: 42 })
    })

    it('closes the side panel in the current browser window', async () => {
      const getCurrent = vi.fn().mockResolvedValue({ id: 42 })
      const close = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('chrome', {
        windows: { getCurrent },
        sidePanel: { close },
      })

      await closeWorkspaceSidebar()

      expect(close).toHaveBeenCalledOnce()
      expect(close).toHaveBeenCalledWith({ windowId: 42 })
    })

    it('throws when the current window has no ID', async () => {
      const getCurrent = vi.fn().mockResolvedValue({})
      const open = vi.fn()

      vi.stubGlobal('chrome', {
        windows: { getCurrent },
        sidePanel: { open },
      })

      await expect(openWorkspaceSidebar()).rejects.toThrow(
        'Unable to determine the current browser window.',
      )

      expect(open).not.toHaveBeenCalled()
    })

    it('propagates errors from sidePanel.open', async () => {
      const error = new Error('Side panel permission denied.')

      vi.stubGlobal('chrome', {
        windows: {
          getCurrent: vi.fn().mockResolvedValue({ id: 42 }),
        },
        sidePanel: {
          open: vi.fn().mockRejectedValue(error),
        },
      })

      await expect(openWorkspaceSidebar()).rejects.toThrow('Side panel permission denied.')
    })

    it('propagates errors when determining the current window fails', async () => {
      const error = new Error('Unable to access browser windows.')
      const open = vi.fn()

      vi.stubGlobal('chrome', {
        windows: {
          getCurrent: vi.fn().mockRejectedValue(error),
        },
        sidePanel: { open },
      })

      await expect(openWorkspaceSidebar()).rejects.toThrow('Unable to access browser windows.')

      expect(open).not.toHaveBeenCalled()
    })

    it('opens the side panel when native toggling is unavailable', async () => {
      const getCurrent = vi.fn().mockResolvedValue({ id: 42 })
      const open = vi.fn().mockResolvedValue(undefined)
      const close = vi.fn()

      vi.stubGlobal('chrome', {
        windows: { getCurrent },
        sidePanel: { open, close },
      })

      await toggleWorkspaceSidebar()

      expect(open).toHaveBeenCalledWith({ windowId: 42 })
      expect(close).not.toHaveBeenCalled()
    })

    it('uses the specified window when toggling falls back to opening', async () => {
      const getCurrent = vi.fn()
      const open = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('chrome', {
        windows: { getCurrent },
        sidePanel: { open },
      })

      await toggleWorkspaceSidebar(42)

      expect(getCurrent).not.toHaveBeenCalled()
      expect(open).toHaveBeenCalledWith({ windowId: 42 })
    })
  })

  describe('unsupported browsers', () => {
    it('throws when neither browser API is available', async () => {
      await expect(openWorkspaceSidebar()).rejects.toThrow(
        'Native sidebar support is unavailable in this browser.',
      )
    })

    it('throws when Firefox has no sidebarAction API', async () => {
      vi.stubGlobal('browser', {})

      await expect(openWorkspaceSidebar()).rejects.toThrow(
        'Native sidebar support is unavailable in this browser.',
      )
    })

    it('throws when Chromium has no sidePanel API', async () => {
      vi.stubGlobal('chrome', {
        windows: { getCurrent: vi.fn() },
      })

      await expect(openWorkspaceSidebar()).rejects.toThrow(
        'Native sidebar support is unavailable in this browser.',
      )
    })

    it('throws when the sidebar APIs exist but have no open method', async () => {
      vi.stubGlobal('browser', {
        sidebarAction: {},
      })

      vi.stubGlobal('chrome', {
        sidePanel: {},
      })

      await expect(openWorkspaceSidebar()).rejects.toThrow(
        'Native sidebar support is unavailable in this browser.',
      )
    })

    it('throws when closing is unsupported', async () => {
      await expect(closeWorkspaceSidebar()).rejects.toThrow(
        'Closing the sidebar programmatically is unavailable in this browser.',
      )
    })

    it('throws when toggling is unsupported', async () => {
      await expect(toggleWorkspaceSidebar()).rejects.toThrow(
        'Native sidebar support is unavailable in this browser.',
      )
    })
  })
})
