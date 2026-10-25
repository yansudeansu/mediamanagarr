import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ServiceConfig } from '../../types/service'
import { getJellyfinUserSelection } from '../../utils/jellyfin-storage'
import { getServiceConfig } from '../../utils/service-storage'
import { updateJellyfinBadge } from './jellyfin-badge'
import { scanJellyfinArrivals } from './jellyfin-notifications'
import {
  handleJellyfinScanAlarm,
  initializeJellyfinScanner,
  JELLYFIN_SCAN_ALARM,
  refreshJellyfinNotifications,
} from './jellyfin-scanner'

vi.mock('../../utils/jellyfin-storage', () => ({
  getJellyfinUserSelection: vi.fn(),
}))

vi.mock('../../utils/service-storage', () => ({
  getServiceConfig: vi.fn(),
}))

vi.mock('./jellyfin-badge', () => ({
  updateJellyfinBadge: vi.fn(),
}))

vi.mock('./jellyfin-notifications', () => ({
  scanJellyfinArrivals: vi.fn(),
}))

const config = {
  url: 'https://jellyfin.example.com',
  apiKey: 'test-api-key',
} as ServiceConfig

const contains = vi.fn()
const createAlarm = vi.fn()

describe('Jellyfin background scanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    contains.mockResolvedValue(true)
    createAlarm.mockResolvedValue(undefined)

    vi.stubGlobal('chrome', {
      permissions: {
        contains,
      },
      alarms: {
        create: createAlarm,
      },
    })

    vi.mocked(getServiceConfig).mockResolvedValue(config)
    vi.mocked(getJellyfinUserSelection).mockResolvedValue('user-1')

    vi.mocked(scanJellyfinArrivals).mockResolvedValue({
      items: [],
      total: 0,
      unreadCount: 3,
    })

    vi.mocked(updateJellyfinBadge).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('scans configured Jellyfin and updates the toolbar icon', async () => {
    await refreshJellyfinNotifications()

    expect(getServiceConfig).toHaveBeenCalledWith('jellyfin')
    expect(getJellyfinUserSelection).toHaveBeenCalledWith(config.url)

    expect(contains).toHaveBeenCalledWith({
      origins: ['https://jellyfin.example.com/*'],
    })

    expect(scanJellyfinArrivals).toHaveBeenCalledOnce()
    expect(updateJellyfinBadge).toHaveBeenCalledWith(3)
  })

  it('resets the icon when Jellyfin is not configured', async () => {
    vi.mocked(getServiceConfig).mockResolvedValue(undefined)

    await refreshJellyfinNotifications()

    expect(scanJellyfinArrivals).not.toHaveBeenCalled()
    expect(updateJellyfinBadge).toHaveBeenCalledWith(0)
  })

  it('resets the icon when no Jellyfin user is selected', async () => {
    vi.mocked(getJellyfinUserSelection).mockResolvedValue('')

    await refreshJellyfinNotifications()

    expect(scanJellyfinArrivals).not.toHaveBeenCalled()
    expect(updateJellyfinBadge).toHaveBeenCalledWith(0)
  })

  it('resets the icon when host permission is missing', async () => {
    contains.mockResolvedValue(false)

    await refreshJellyfinNotifications()

    expect(scanJellyfinArrivals).not.toHaveBeenCalled()
    expect(updateJellyfinBadge).toHaveBeenCalledWith(0)
  })

  it('creates the periodic scan alarm', async () => {
    await initializeJellyfinScanner()

    expect(createAlarm).toHaveBeenCalledWith(JELLYFIN_SCAN_ALARM, {
      periodInMinutes: 15,
    })
  })

  it('performs an initial scan during initialization', async () => {
    await initializeJellyfinScanner()

    expect(scanJellyfinArrivals).toHaveBeenCalledOnce()
    expect(updateJellyfinBadge).toHaveBeenCalledWith(3)
  })

  it('does not reject initialization when a scan fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    vi.mocked(scanJellyfinArrivals).mockRejectedValueOnce(new Error('Jellyfin unavailable'))

    await expect(initializeJellyfinScanner()).resolves.toBeUndefined()

    expect(warn).toHaveBeenCalledWith('MediaManagarr: Jellyfin scan failed:', expect.any(Error))
  })

  it('scans when the Jellyfin alarm fires', async () => {
    await handleJellyfinScanAlarm({
      name: JELLYFIN_SCAN_ALARM,
    } as chrome.alarms.Alarm)

    expect(scanJellyfinArrivals).toHaveBeenCalledOnce()
    expect(updateJellyfinBadge).toHaveBeenCalledWith(3)
  })

  it('ignores unrelated alarms', async () => {
    await handleJellyfinScanAlarm({
      name: 'some-other-alarm',
    } as chrome.alarms.Alarm)

    expect(getServiceConfig).not.toHaveBeenCalled()
    expect(scanJellyfinArrivals).not.toHaveBeenCalled()
    expect(updateJellyfinBadge).not.toHaveBeenCalled()
  })

  it('does not reject an alarm handler when scanning fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    vi.mocked(scanJellyfinArrivals).mockRejectedValueOnce(new Error('Network unavailable'))

    await expect(
      handleJellyfinScanAlarm({
        name: JELLYFIN_SCAN_ALARM,
      } as chrome.alarms.Alarm),
    ).resolves.toBeUndefined()

    expect(warn).toHaveBeenCalledOnce()
  })
})
