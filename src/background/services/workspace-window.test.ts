import { beforeEach, describe, expect, it, vi } from 'vitest'
import { openDetachedWorkspace } from './workspace-window'

const WINDOW_KEY = 'detachedWorkspaceWindowId'

const storage = new Map<string, unknown>()

const getWindow = vi.fn()
const createWindow = vi.fn()
const updateWindow = vi.fn()

beforeEach(() => {
  vi.resetAllMocks()
  storage.clear()

  vi.stubGlobal('chrome', {
    runtime: {
      getURL: vi.fn((path: string) => `chrome-extension://test/${path}`),
    },
    storage: {
      session: {
        get: vi.fn(async (key: string) => ({
          [key]: storage.get(key),
        })),
        set: vi.fn(async (values: Record<string, unknown>) => {
          for (const [key, value] of Object.entries(values)) {
            storage.set(key, value)
          }
        }),
        remove: vi.fn(async (key: string) => {
          storage.delete(key)
        }),
      },
    },
    windows: {
      get: getWindow,
      create: createWindow,
      update: updateWindow,
    },
  })

  createWindow.mockResolvedValue({
    id: 42,
    type: 'popup',
  })

  updateWindow.mockResolvedValue({
    id: 42,
    type: 'popup',
  })
})

describe('openDetachedWorkspace', () => {
  it('creates a detached workspace window', async () => {
    const windowId = await openDetachedWorkspace()

    expect(windowId).toBe(42)

    expect(createWindow).toHaveBeenCalledWith({
      url: 'chrome-extension://test/index.html?workspace=detached',
      type: 'popup',
      width: 780,
      height: 700,
      focused: true,
    })
  })

  it('remembers the created window ID', async () => {
    await openDetachedWorkspace()

    expect(storage.get(WINDOW_KEY)).toBe(42)
  })

  it('focuses an existing detached window', async () => {
    storage.set(WINDOW_KEY, 42)

    getWindow.mockResolvedValue({
      id: 42,
      type: 'popup',
    })

    const windowId = await openDetachedWorkspace()

    expect(windowId).toBe(42)
    expect(updateWindow).toHaveBeenCalledWith(42, {
      focused: true,
    })

    expect(createWindow).not.toHaveBeenCalled()
  })

  it('creates a new window when the saved window no longer exists', async () => {
    storage.set(WINDOW_KEY, 10)

    getWindow.mockRejectedValue(new Error('No window with id: 10'))

    const windowId = await openDetachedWorkspace()

    expect(windowId).toBe(42)
    expect(storage.get(WINDOW_KEY)).toBe(42)
    expect(createWindow).toHaveBeenCalledOnce()
  })

  it('creates a new window when the saved window is not a popup', async () => {
    storage.set(WINDOW_KEY, 10)

    getWindow.mockResolvedValue({
      id: 10,
      type: 'normal',
    })

    await openDetachedWorkspace()

    expect(createWindow).toHaveBeenCalledOnce()
    expect(storage.get(WINDOW_KEY)).toBe(42)
  })

  it('does not create duplicate windows for simultaneous requests', async () => {
    const [first, second, third] = await Promise.all([
      openDetachedWorkspace(),
      openDetachedWorkspace(),
      openDetachedWorkspace(),
    ])

    expect(first).toBe(42)
    expect(second).toBe(42)
    expect(third).toBe(42)

    expect(createWindow).toHaveBeenCalledOnce()
  })

  it('reports window creation failures', async () => {
    createWindow.mockRejectedValue(new Error('Unable to open window.'))

    await expect(openDetachedWorkspace()).rejects.toThrow('Unable to open window.')

    expect(storage.has(WINDOW_KEY)).toBe(false)
  })

  it('reports missing window IDs', async () => {
    createWindow.mockResolvedValue({})

    await expect(openDetachedWorkspace()).rejects.toThrow(
      'Unable to create the detached workspace window.',
    )
  })

  it('allows retrying after a failed creation', async () => {
    createWindow.mockRejectedValueOnce(new Error('Temporary failure.'))

    await expect(openDetachedWorkspace()).rejects.toThrow('Temporary failure.')

    const windowId = await openDetachedWorkspace()

    expect(windowId).toBe(42)
    expect(createWindow).toHaveBeenCalledTimes(2)
  })
})
