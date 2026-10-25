import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { updateJellyfinBadge } from './jellyfin-badge'

const setBadgeText = vi.fn()
const setIcon = vi.fn()
const setTitle = vi.fn()

describe('updateJellyfinBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    setBadgeText.mockResolvedValue(undefined)
    setIcon.mockResolvedValue(undefined)
    setTitle.mockResolvedValue(undefined)

    vi.stubGlobal('chrome', {
      action: {
        setBadgeText,
        setIcon,
        setTitle,
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('restores the default icon when there are no unread arrivals', async () => {
    await updateJellyfinBadge(0)

    expect(setBadgeText).toHaveBeenCalledWith({ text: '' })

    expect(setIcon).toHaveBeenCalledWith({
      path: {
        16: 'icons/icon-16.png',
        32: 'icons/icon-32.png',
        48: 'icons/icon-48.png',
        128: 'icons/icon-128.png',
      },
    })

    expect(setTitle).toHaveBeenCalledWith({
      title: 'MediaManagarr',
    })
  })

  it('shows the notification icon for one unread arrival', async () => {
    await updateJellyfinBadge(1)

    expect(setIcon).toHaveBeenCalledWith({
      path: {
        16: 'icons/notification-16.png',
        32: 'icons/notification-32.png',
        48: 'icons/notification-48.png',
        128: 'icons/notification-128.png',
      },
    })

    expect(setTitle).toHaveBeenCalledWith({
      title: 'MediaManagarr · 1 new item',
    })
  })

  it('shows the correct tooltip for multiple unread arrivals', async () => {
    await updateJellyfinBadge(7)

    expect(setTitle).toHaveBeenCalledWith({
      title: 'MediaManagarr · 7 new items',
    })
  })

  it('does not display a numbered badge', async () => {
    await updateJellyfinBadge(42)

    expect(setBadgeText).toHaveBeenCalledWith({ text: '' })
  })

  it('treats negative counts as zero', async () => {
    await updateJellyfinBadge(-5)

    expect(setTitle).toHaveBeenCalledWith({
      title: 'MediaManagarr',
    })

    expect(setIcon).toHaveBeenCalledWith({
      path: expect.objectContaining({
        16: 'icons/icon-16.png',
      }),
    })
  })

  it('truncates fractional counts', async () => {
    await updateJellyfinBadge(2.9)

    expect(setTitle).toHaveBeenCalledWith({
      title: 'MediaManagarr · 2 new items',
    })
  })

  it('propagates browser action failures', async () => {
    setIcon.mockRejectedValueOnce(new Error('Icon update failed'))

    await expect(updateJellyfinBadge(1)).rejects.toThrow('Icon update failed')
  })
})
