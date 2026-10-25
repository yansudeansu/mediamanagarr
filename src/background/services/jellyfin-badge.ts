const ICON_SIZES = [16, 32, 48, 128] as const

function getIconPaths(notification: boolean): Record<number, string> {
  const prefix = notification ? 'notification-' : 'icon-'

  return Object.fromEntries(ICON_SIZES.map((size) => [size, `icons/${prefix}${size}.png`]))
}

export async function updateJellyfinBadge(unreadCount: number): Promise<void> {
  const count = Math.max(0, Math.trunc(unreadCount))

  await chrome.action.setBadgeText({ text: '' })

  await chrome.action.setIcon({
    path: getIconPaths(count > 0),
  })

  await chrome.action.setTitle({
    title:
      count === 0
        ? 'MediaManagarr'
        : `MediaManagarr · ${count} new ${count === 1 ? 'item' : 'items'}`,
  })
}
