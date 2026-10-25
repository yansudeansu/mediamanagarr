import { getJellyfinUserSelection } from '../../utils/jellyfin-storage'
import { getServiceConfig } from '../../utils/service-storage'
import { updateJellyfinBadge } from './jellyfin-badge'
import { scanJellyfinArrivals } from './jellyfin-notifications'

export const JELLYFIN_SCAN_ALARM = 'mediamanagarr-jellyfin-scan'

const SCAN_INTERVAL_MINUTES = 15

async function hasConfiguredJellyfin(): Promise<boolean> {
  const config = await getServiceConfig('jellyfin')

  if (!config) {
    return false
  }

  const userId = await getJellyfinUserSelection(config.url)

  if (!userId) {
    return false
  }

  const origin = new URL(config.url).origin

  return chrome.permissions.contains({
    origins: [`${origin}/*`],
  })
}

export async function refreshJellyfinNotifications(): Promise<void> {
  if (!(await hasConfiguredJellyfin())) {
    await updateJellyfinBadge(0)
    return
  }

  const result = await scanJellyfinArrivals()

  await updateJellyfinBadge(result.unreadCount)
}

export async function initializeJellyfinScanner(): Promise<void> {
  await chrome.alarms.create(JELLYFIN_SCAN_ALARM, {
    periodInMinutes: SCAN_INTERVAL_MINUTES,
  })

  try {
    await refreshJellyfinNotifications()
  } catch (error) {
    console.warn('MediaManagarr: Jellyfin scan failed:', error)
  }
}

export async function handleJellyfinScanAlarm(alarm: chrome.alarms.Alarm): Promise<void> {
  if (alarm.name !== JELLYFIN_SCAN_ALARM) {
    return
  }

  try {
    await refreshJellyfinNotifications()
  } catch (error) {
    console.warn('MediaManagarr: Jellyfin scan failed:', error)
  }
}
