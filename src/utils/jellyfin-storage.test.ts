import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearJellyfinUserSelection,
  getJellyfinUserSelection,
  saveJellyfinUserSelection,
} from './jellyfin-storage'

const STORAGE_KEY = 'mediaManagarrJellyfinUser'

let storedData: Record<string, unknown>

describe('Jellyfin user storage', () => {
  beforeEach(() => {
    storedData = {}

    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get: vi.fn(async (key: string) => ({
            [key]: storedData[key],
          })),

          set: vi.fn(async (items: Record<string, unknown>) => {
            Object.assign(storedData, items)
          }),

          remove: vi.fn(async (key: string) => {
            delete storedData[key]
          }),
        },
      },
    })
  })

  it('returns an empty selection when none is saved', async () => {
    await expect(getJellyfinUserSelection('https://jellyfin.example.com')).resolves.toBe('')
  })

  it('saves and restores a selected user', async () => {
    await saveJellyfinUserSelection('https://jellyfin.example.com', 'user-1')

    await expect(getJellyfinUserSelection('https://jellyfin.example.com')).resolves.toBe('user-1')

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      [STORAGE_KEY]: {
        serverUrl: 'https://jellyfin.example.com',
        userId: 'user-1',
      },
    })
  })

  it('does not reuse a selection for a different server', async () => {
    await saveJellyfinUserSelection('https://jellyfin.example.com', 'user-1')

    await expect(getJellyfinUserSelection('https://other.example.com')).resolves.toBe('')
  })

  it('clears the saved selection', async () => {
    await saveJellyfinUserSelection('https://jellyfin.example.com', 'user-1')
    await clearJellyfinUserSelection()

    await expect(getJellyfinUserSelection('https://jellyfin.example.com')).resolves.toBe('')

    expect(chrome.storage.local.remove).toHaveBeenCalledWith(STORAGE_KEY)
  })

  it('throws when extension storage is unavailable', async () => {
    vi.stubGlobal('chrome', undefined)

    await expect(getJellyfinUserSelection('https://jellyfin.example.com')).rejects.toThrow(
      'Browser extension storage is unavailable.',
    )
  })
})
