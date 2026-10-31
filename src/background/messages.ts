import type {
  BackgroundMessage,
  ClearJellyfinNotificationsResponse,
  ConnectServiceResponse,
  GetCalendarImageResponse,
  GetCalendarResponse,
  GetJellyfinArrivalsResponse,
  GetJellyfinImageResponse,
  GetJellyfinUsersResponse,
  GetQBittorrentDownloadsResponse,
  GetSeerrRequestsResponse,
  GetServiceConfigsResponse,
  GetServiceHealthResponse,
  OpenDetachedWorkspaceResponse,
  QBittorrentTorrentActionResponse,
  RemoveServiceResponse,
  SetJellyfinArrivalUnreadResponse,
  SetJellyfinUserResponse,
  TestServiceConnectionResponse,
} from '../types/messages'
import { SEERR_REQUEST_FILTERS, type SeerrRequestsQuery } from '../types/seerr'
import { isServiceId } from '../services/registry'
import type { ServiceConfig, ServiceId } from '../types/service'
import { parseCalendarDateKey } from '../utils/calendar-date'
import { getHostPermission, resolveServiceConfig } from '../utils/service-config'
import {
  clearJellyfinUserSelection,
  getJellyfinUserSelection,
  saveJellyfinUserSelection,
} from '../utils/jellyfin-storage'
import { getServiceHealthStates } from '../utils/service-health-storage'
import {
  getSafeServiceConfigs,
  getServiceConfig,
  removeServiceConfig,
  saveServiceConfig,
} from '../utils/service-storage'
import { fetchCalendarImage } from './services/calendar-images'
import { loadCalendar } from './services/calendar'
import { testServiceConnection } from './services/connection'
import { checkServiceHealth, invalidateServiceHealth } from './services/service-health'
import { updateJellyfinBadge } from './services/jellyfin-badge'
import { fetchJellyfinImage } from './services/jellyfin-images'
import {
  clearJellyfinNotifications,
  loadJellyfinArrivalsPage,
  setJellyfinArrivalUnread,
} from './services/jellyfin-notifications'
import { refreshJellyfinNotifications } from './services/jellyfin-scanner'
import { fetchJellyfinUsers } from './services/jellyfin-users'
import {
  deleteQBittorrentTorrent,
  fetchQBittorrentSnapshot,
  startQBittorrentTorrent,
  stopQBittorrentTorrent,
} from './services/qbittorrent'
import { fetchSeerrRequests } from './services/seerr-requests'
import { openDetachedWorkspace } from './services/workspace-window'

type MessageResponse =
  | ConnectServiceResponse
  | TestServiceConnectionResponse
  | GetServiceConfigsResponse
  | GetServiceHealthResponse
  | RemoveServiceResponse
  | GetJellyfinUsersResponse
  | SetJellyfinUserResponse
  | GetJellyfinArrivalsResponse
  | GetJellyfinImageResponse
  | GetCalendarImageResponse
  | SetJellyfinArrivalUnreadResponse
  | ClearJellyfinNotificationsResponse
  | GetSeerrRequestsResponse
  | GetCalendarResponse
  | GetQBittorrentDownloadsResponse
  | QBittorrentTorrentActionResponse
  | OpenDetachedWorkspaceResponse

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isConnectMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'CONNECT_SERVICE' }> {
  if (!isRecord(value) || !isRecord(value.config)) {
    return false
  }

  return (
    value.type === 'CONNECT_SERVICE' &&
    isServiceId(value.serviceId) &&
    typeof value.config.url === 'string' &&
    typeof value.config.apiKey === 'string'
  )
}

function isRemoveMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'REMOVE_SERVICE' }> {
  return isRecord(value) && value.type === 'REMOVE_SERVICE' && isServiceId(value.serviceId)
}

function isTestServiceConnectionMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'TEST_SERVICE_CONNECTION' }> {
  return isRecord(value) && value.type === 'TEST_SERVICE_CONNECTION' && isServiceId(value.serviceId)
}

function isSetJellyfinUserMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'SET_JELLYFIN_USER' }> {
  return (
    isRecord(value) &&
    value.type === 'SET_JELLYFIN_USER' &&
    typeof value.userId === 'string' &&
    value.userId.trim().length > 0
  )
}

function isJellyfinArrivalsMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'GET_JELLYFIN_ARRIVALS' }> {
  if (!isRecord(value) || value.type !== 'GET_JELLYFIN_ARRIVALS') {
    return false
  }

  const { page, pageSize, filter } = value

  if (page !== undefined && (typeof page !== 'number' || !Number.isSafeInteger(page) || page < 1)) {
    return false
  }

  if (
    pageSize !== undefined &&
    (typeof pageSize !== 'number' ||
      !Number.isSafeInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 100)
  ) {
    return false
  }

  if (filter !== undefined && filter !== 'all' && filter !== 'new') {
    return false
  }

  const normalizedPage = page ?? 1
  const normalizedPageSize = pageSize ?? 10

  return Number.isSafeInteger((normalizedPage - 1) * normalizedPageSize)
}

function isJellyfinImageMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'GET_JELLYFIN_IMAGE' }> {
  return (
    isRecord(value) &&
    value.type === 'GET_JELLYFIN_IMAGE' &&
    typeof value.itemId === 'string' &&
    value.itemId.trim().length > 0 &&
    (value.imageTag === null || typeof value.imageTag === 'string')
  )
}

function isCalendarImageMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'GET_CALENDAR_IMAGE' }> {
  return (
    isRecord(value) &&
    value.type === 'GET_CALENDAR_IMAGE' &&
    (value.service === 'sonarr' || value.service === 'radarr') &&
    typeof value.mediaId === 'number' &&
    Number.isSafeInteger(value.mediaId) &&
    value.mediaId > 0
  )
}

function isSetJellyfinArrivalUnreadMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'SET_JELLYFIN_ARRIVAL_UNREAD' }> {
  return (
    isRecord(value) &&
    value.type === 'SET_JELLYFIN_ARRIVAL_UNREAD' &&
    typeof value.itemId === 'string' &&
    value.itemId.trim().length > 0 &&
    typeof value.unread === 'boolean'
  )
}

function isSeerrRequestsMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'GET_SEERR_REQUESTS' }> {
  if (!isRecord(value) || value.type !== 'GET_SEERR_REQUESTS') {
    return false
  }

  const { page, pageSize, filter } = value

  if (page !== undefined && (typeof page !== 'number' || !Number.isSafeInteger(page) || page < 1)) {
    return false
  }

  if (
    pageSize !== undefined &&
    (typeof pageSize !== 'number' ||
      !Number.isSafeInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 100)
  ) {
    return false
  }

  if (
    filter !== undefined &&
    (typeof filter !== 'string' || !SEERR_REQUEST_FILTERS.some((candidate) => candidate === filter))
  ) {
    return false
  }

  const normalizedPage = page ?? 1
  const normalizedPageSize = pageSize ?? 10

  return Number.isSafeInteger((normalizedPage - 1) * normalizedPageSize)
}

function isCalendarMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'GET_CALENDAR' }> {
  if (
    !isRecord(value) ||
    value.type !== 'GET_CALENDAR' ||
    typeof value.start !== 'string' ||
    typeof value.end !== 'string'
  ) {
    return false
  }

  const start = parseCalendarDateKey(value.start)
  const end = parseCalendarDateKey(value.end)

  return start !== null && end !== null && start.getTime() < end.getTime()
}

function isTorrentHash(value: unknown): value is string {
  return typeof value === 'string' && /^[a-fA-F0-9]{40}$/.test(value)
}

function isTorrentActionMessage(
  value: unknown,
  type: 'START_QBITTORRENT_TORRENT' | 'STOP_QBITTORRENT_TORRENT',
): value is Extract<BackgroundMessage, { type: typeof type }> {
  return isRecord(value) && value.type === type && isTorrentHash(value.hash)
}

function isDeleteTorrentMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'DELETE_QBITTORRENT_TORRENT' }> {
  return (
    isRecord(value) &&
    value.type === 'DELETE_QBITTORRENT_TORRENT' &&
    isTorrentHash(value.hash) &&
    typeof value.deleteFiles === 'boolean'
  )
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.'
}

async function getConfiguredService(
  serviceId: ServiceId,
  missingConfigMessage: string,
  missingPermissionMessage: string,
): Promise<ServiceConfig> {
  const config = await getServiceConfig(serviceId)

  if (!config) {
    throw new Error(missingConfigMessage)
  }

  const permission = getHostPermission(config.url)

  const allowed = await chrome.permissions.contains({
    origins: [permission],
  })

  if (!allowed) {
    throw new Error(missingPermissionMessage)
  }

  return config
}

async function getConfiguredJellyfin(): Promise<ServiceConfig> {
  return getConfiguredService(
    'jellyfin',
    'Configure Jellyfin before selecting a user.',
    'Jellyfin server access has not been granted.',
  )
}

async function getConfiguredSeerr(): Promise<ServiceConfig> {
  return getConfiguredService(
    'seerr',
    'Configure Seerr before viewing requests.',
    'Seerr server access has not been granted.',
  )
}

async function getConfiguredQBittorrent(): Promise<ServiceConfig> {
  return getConfiguredService(
    'qbittorrent',
    'Configure qBittorrent in Settings before viewing downloads.',
    'qBittorrent server access has not been granted.',
  )
}

async function refreshJellyfinAfterSettingsChange(): Promise<void> {
  try {
    await refreshJellyfinNotifications()
  } catch (error) {
    console.warn('MediaManagarr: Unable to refresh Jellyfin notifications:', error)
  }
}

async function updateJellyfinBadgeSafely(unreadCount: number): Promise<void> {
  try {
    await updateJellyfinBadge(unreadCount)
  } catch (error) {
    console.warn('MediaManagarr: Unable to update Jellyfin badge:', error)
  }
}

async function refreshHealthAfterConnection(serviceId: ServiceId): Promise<void> {
  try {
    await checkServiceHealth(serviceId, true)
  } catch (error) {
    console.warn(`MediaManagarr: Unable to refresh health for ${serviceId}:`, error)
  }
}

export async function handleBackgroundMessage(message: unknown): Promise<MessageResponse> {
  try {
    if (isRecord(message)) {
      if (message.type === 'OPEN_DETACHED_WORKSPACE') {
        const windowId = await openDetachedWorkspace()

        return {
          success: true,
          windowId,
        }
      }

      if (message.type === 'GET_SERVICE_CONFIGS') {
        return {
          success: true,
          configs: await getSafeServiceConfigs(),
        }
      }

      if (message.type === 'GET_SERVICE_HEALTH') {
        return {
          success: true,
          health: await getServiceHealthStates(),
        }
      }

      if (message.type === 'TEST_SERVICE_CONNECTION') {
        if (!isTestServiceConnectionMessage(message)) {
          return { success: false, error: 'Invalid background message.' }
        }

        await getConfiguredService(
          message.serviceId,
          `Configure ${message.serviceId} before testing its connection.`,
          `${message.serviceId} server access has not been granted.`,
        )

        const health = await checkServiceHealth(message.serviceId, true)

        if (!health) {
          return {
            success: false,
            error: 'The service configuration or server permission changed during the test.',
          }
        }

        if (health.status === 'failed') {
          return {
            success: false,
            error: health.error ?? 'Unable to connect to the service.',
          }
        }

        return {
          success: true,
          serviceId: message.serviceId,
        }
      }

      if (message.type === 'REMOVE_SERVICE') {
        if (!isRemoveMessage(message)) {
          return { success: false, error: 'Invalid background message.' }
        }

        if (message.serviceId === 'jellyfin') {
          await clearJellyfinUserSelection()
        }

        await removeServiceConfig(message.serviceId)
        await invalidateServiceHealth(message.serviceId)

        if (message.serviceId === 'jellyfin') {
          await refreshJellyfinAfterSettingsChange()
        }

        return { success: true, serviceId: message.serviceId }
      }

      if (message.type === 'GET_JELLYFIN_USERS') {
        const config = await getConfiguredJellyfin()
        const users = await fetchJellyfinUsers(config)
        const selectedUserId = await getJellyfinUserSelection(config.url)

        return {
          success: true,
          users,
          selectedUserId: users.some((user) => user.id === selectedUserId) ? selectedUserId : '',
        }
      }

      if (message.type === 'SET_JELLYFIN_USER') {
        if (!isSetJellyfinUserMessage(message)) {
          return { success: false, error: 'Invalid background message.' }
        }

        const config = await getConfiguredJellyfin()
        const users = await fetchJellyfinUsers(config)
        const userId = message.userId.trim()

        if (!users.some((user) => user.id === userId)) {
          throw new Error('Selected Jellyfin user was not found.')
        }

        await saveJellyfinUserSelection(config.url, userId)
        await refreshJellyfinAfterSettingsChange()

        return { success: true, userId }
      }

      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        if (!isJellyfinArrivalsMessage(message)) {
          return { success: false, error: 'Invalid background message.' }
        }

        await getConfiguredJellyfin()

        const result = await loadJellyfinArrivalsPage(
          message.page ?? 1,
          message.pageSize ?? 10,
          message.filter ?? 'all',
        )

        await updateJellyfinBadgeSafely(result.unreadCount)

        return {
          success: true,
          arrivals: {
            items: result.items,
            total: result.total,
          },
          unreadCount: result.unreadCount,
        }
      }

      if (message.type === 'GET_JELLYFIN_IMAGE') {
        if (!isJellyfinImageMessage(message)) {
          return { success: false, error: 'Invalid background message.' }
        }

        const config = await getConfiguredJellyfin()
        const image = await fetchJellyfinImage(config, message.itemId, message.imageTag)

        return { success: true, image }
      }

      if (message.type === 'GET_CALENDAR_IMAGE') {
        if (!isCalendarImageMessage(message)) {
          return { success: false, error: 'Invalid background message.' }
        }

        const config = await getConfiguredService(
          message.service,
          `Configure ${message.service} before loading posters.`,
          `${message.service} server access has not been granted.`,
        )

        const image = await fetchCalendarImage(config, message.service, message.mediaId)

        return { success: true, image }
      }

      if (message.type === 'SET_JELLYFIN_ARRIVAL_UNREAD') {
        if (!isSetJellyfinArrivalUnreadMessage(message)) {
          return { success: false, error: 'Invalid background message.' }
        }

        await getConfiguredJellyfin()
        const unreadCount = await setJellyfinArrivalUnread(message.itemId, message.unread)

        await updateJellyfinBadgeSafely(unreadCount)

        return { success: true, unreadCount }
      }

      if (message.type === 'CLEAR_JELLYFIN_NOTIFICATIONS') {
        await getConfiguredJellyfin()
        const unreadCount = await clearJellyfinNotifications()

        await updateJellyfinBadgeSafely(unreadCount)

        return { success: true, unreadCount }
      }

      if (message.type === 'GET_SEERR_REQUESTS') {
        if (!isSeerrRequestsMessage(message)) {
          return { success: false, error: 'Invalid background message.' }
        }

        const config = await getConfiguredSeerr()

        const query: SeerrRequestsQuery = {
          page: message.page,
          pageSize: message.pageSize,
          filter: message.filter,
        }

        const requests = await fetchSeerrRequests(config, query)

        return { success: true, requests }
      }

      if (message.type === 'GET_CALENDAR') {
        if (!isCalendarMessage(message)) {
          return { success: false, error: 'Invalid background message.' }
        }

        const start = parseCalendarDateKey(message.start)
        const end = parseCalendarDateKey(message.end)

        if (!start || !end) {
          return { success: false, error: 'Invalid background message.' }
        }

        const calendar = await loadCalendar(start, end)

        return { success: true, calendar }
      }

      if (message.type === 'GET_QBITTORRENT_DOWNLOADS') {
        const config = await getConfiguredQBittorrent()
        const downloads = await fetchQBittorrentSnapshot(config)

        return { success: true, downloads }
      }

      if (message.type === 'START_QBITTORRENT_TORRENT') {
        if (!isTorrentActionMessage(message, 'START_QBITTORRENT_TORRENT')) {
          return { success: false, error: 'Invalid background message.' }
        }

        const config = await getConfiguredQBittorrent()

        await startQBittorrentTorrent(config, message.hash)

        return { success: true, completed: true }
      }

      if (message.type === 'STOP_QBITTORRENT_TORRENT') {
        if (!isTorrentActionMessage(message, 'STOP_QBITTORRENT_TORRENT')) {
          return { success: false, error: 'Invalid background message.' }
        }

        const config = await getConfiguredQBittorrent()

        await stopQBittorrentTorrent(config, message.hash)

        return { success: true, completed: true }
      }

      if (message.type === 'DELETE_QBITTORRENT_TORRENT') {
        if (!isDeleteTorrentMessage(message)) {
          return { success: false, error: 'Invalid background message.' }
        }

        const config = await getConfiguredQBittorrent()

        await deleteQBittorrentTorrent(config, message.hash, message.deleteFiles)

        return { success: true, completed: true }
      }
    }

    if (!isConnectMessage(message)) {
      return { success: false, error: 'Invalid background message.' }
    }

    const existing = await getServiceConfig(message.serviceId)
    const config = resolveServiceConfig(message.config, existing)
    const permission = getHostPermission(config.url)

    const allowed = await chrome.permissions.contains({
      origins: [permission],
    })

    if (!allowed) {
      return {
        success: false,
        error: 'Server access has not been granted. Please allow access and try again.',
      }
    }

    await testServiceConnection(message.serviceId, config)
    await saveServiceConfig(message.serviceId, config)

    await invalidateServiceHealth(message.serviceId)
    await refreshHealthAfterConnection(message.serviceId)

    if (message.serviceId === 'jellyfin') {
      await refreshJellyfinAfterSettingsChange()
    }

    return { success: true, serviceId: message.serviceId }
  } catch (error) {
    return { success: false, error: errorMessage(error) }
  }
}
