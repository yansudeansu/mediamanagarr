import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getWorkspaceNavigationState,
  saveWorkspaceNavigationState,
  type WorkspaceNavigationState,
} from './workspace-state'

const storage = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
}))

vi.stubGlobal('chrome', {
  storage: {
    session: storage,
  },
})

describe('workspace-state', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    storage.get.mockResolvedValue({})
    storage.set.mockResolvedValue(undefined)
  })

  describe('getWorkspaceNavigationState', () => {
    it('returns the default state when nothing is saved', async () => {
      await expect(getWorkspaceNavigationState()).resolves.toEqual({
        activeView: 'requests',
        settingsOpen: false,
      })

      expect(storage.get).toHaveBeenCalledWith('workspaceNavigationState')
    })

    it.each<WorkspaceNavigationState>([
      { activeView: 'requests', settingsOpen: false },
      { activeView: 'up-next', settingsOpen: false },
      { activeView: 'calendar', settingsOpen: false },
      { activeView: 'downloads', settingsOpen: false },
      { activeView: 'calendar', settingsOpen: true },
    ])('restores valid navigation state: %j', async (state) => {
      storage.get.mockResolvedValue({
        workspaceNavigationState: state,
      })

      await expect(getWorkspaceNavigationState()).resolves.toEqual(state)
    })

    it.each([
      null,
      undefined,
      [],
      'calendar',
      42,
      {},
      { activeView: 'unknown', settingsOpen: false },
      { activeView: 'calendar' },
      { settingsOpen: true },
      { activeView: 'calendar', settingsOpen: 'true' },
      { activeView: null, settingsOpen: false },
    ])('uses defaults for invalid saved state: %j', async (value) => {
      storage.get.mockResolvedValue({
        workspaceNavigationState: value,
      })

      await expect(getWorkspaceNavigationState()).resolves.toEqual({
        activeView: 'requests',
        settingsOpen: false,
      })
    })

    it('propagates errors when reading storage fails', async () => {
      storage.get.mockRejectedValue(new Error('Storage unavailable'))

      await expect(getWorkspaceNavigationState()).rejects.toThrow('Storage unavailable')
    })
  })

  describe('saveWorkspaceNavigationState', () => {
    it('saves the selected view and settings state', async () => {
      const state: WorkspaceNavigationState = {
        activeView: 'calendar',
        settingsOpen: true,
      }

      await saveWorkspaceNavigationState(state)

      expect(storage.set).toHaveBeenCalledExactlyOnceWith({
        workspaceNavigationState: {
          activeView: 'calendar',
          settingsOpen: true,
        },
      })
    })

    it('propagates errors when writing storage fails', async () => {
      storage.set.mockRejectedValue(new Error('Storage unavailable'))

      await expect(
        saveWorkspaceNavigationState({
          activeView: 'downloads',
          settingsOpen: false,
        }),
      ).rejects.toThrow('Storage unavailable')
    })
  })
})
