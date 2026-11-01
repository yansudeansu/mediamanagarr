import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getWorkspacePreferences, saveWorkspacePreferences } from './workspace-storage'

describe('workspace-storage', () => {
  let stored: Record<string, unknown>

  const get = vi.fn(async (key: string) => ({
    [key]: stored[key],
  }))

  const set = vi.fn(async (items: Record<string, unknown>) => {
    Object.assign(stored, items)
  })

  beforeEach(() => {
    stored = {}

    get.mockClear()
    set.mockClear()

    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get,
          set,
        },
      },
    })
  })

  it('defaults to popup when no preferences exist', async () => {
    expect(await getWorkspacePreferences()).toEqual({
      defaultMode: 'popup',
    })
  })

  it('saves and retrieves the sidebar preference', async () => {
    await saveWorkspacePreferences({
      defaultMode: 'sidebar',
    })

    expect(await getWorkspacePreferences()).toEqual({
      defaultMode: 'sidebar',
    })
  })

  it('saves and retrieves the detached preference', async () => {
    await saveWorkspacePreferences({
      defaultMode: 'detached',
    })

    expect(await getWorkspacePreferences()).toEqual({
      defaultMode: 'detached',
    })
  })

  it('overwrites an existing preference', async () => {
    await saveWorkspacePreferences({
      defaultMode: 'sidebar',
    })

    await saveWorkspacePreferences({
      defaultMode: 'popup',
    })

    expect(await getWorkspacePreferences()).toEqual({
      defaultMode: 'popup',
    })
  })

  it('uses a dedicated storage key', async () => {
    await saveWorkspacePreferences({
      defaultMode: 'sidebar',
    })

    expect(set).toHaveBeenCalledWith({
      mediaManagarrWorkspacePreferences: {
        defaultMode: 'sidebar',
      },
    })
  })

  it('falls back to popup when stored preferences are null', async () => {
    stored.mediaManagarrWorkspacePreferences = null

    expect(await getWorkspacePreferences()).toEqual({
      defaultMode: 'popup',
    })
  })

  it('falls back to popup when stored preferences are not an object', async () => {
    stored.mediaManagarrWorkspacePreferences = 'sidebar'

    expect(await getWorkspacePreferences()).toEqual({
      defaultMode: 'popup',
    })
  })

  it('falls back to popup when the stored mode is missing', async () => {
    stored.mediaManagarrWorkspacePreferences = {}

    expect(await getWorkspacePreferences()).toEqual({
      defaultMode: 'popup',
    })
  })

  it('falls back to popup when the stored mode is invalid', async () => {
    stored.mediaManagarrWorkspacePreferences = {
      defaultMode: 'fullscreen',
    }

    expect(await getWorkspacePreferences()).toEqual({
      defaultMode: 'popup',
    })
  })

  it('rejects invalid workspace modes when saving', async () => {
    await expect(
      saveWorkspacePreferences({
        defaultMode: 'fullscreen' as 'popup',
      }),
    ).rejects.toThrow('Invalid default workspace mode.')

    expect(set).not.toHaveBeenCalled()
  })

  it('propagates errors when reading storage fails', async () => {
    get.mockRejectedValueOnce(new Error('Storage read failed.'))

    await expect(getWorkspacePreferences()).rejects.toThrow('Storage read failed.')
  })

  it('propagates errors when saving storage fails', async () => {
    set.mockRejectedValueOnce(new Error('Storage write failed.'))

    await expect(
      saveWorkspacePreferences({
        defaultMode: 'sidebar',
      }),
    ).rejects.toThrow('Storage write failed.')
  })

  it('throws when browser storage is unavailable', async () => {
    vi.stubGlobal('chrome', undefined)

    await expect(getWorkspacePreferences()).rejects.toThrow(
      'Browser extension storage is unavailable.',
    )

    await expect(
      saveWorkspacePreferences({
        defaultMode: 'sidebar',
      }),
    ).rejects.toThrow('Browser extension storage is unavailable.')
  })
})
