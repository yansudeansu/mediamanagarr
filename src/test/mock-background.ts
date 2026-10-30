import type { BackgroundMessage, BackgroundResponse } from '../types/messages'
import type { CalendarItem, CalendarResult } from '../types/calendar'
import type { JellyfinArrival, JellyfinUser } from '../types/jellyfin'
import type { QBittorrentTorrent } from '../types/qbittorrent'
import type { SeerrRequest } from '../types/seerr'
import { SERVICES } from '../services/registry'
import type {
  SafeServiceConfigs,
  ServiceHealth,
  ServiceHealthStates,
  ServiceId,
} from '../types/service'

export type MockDownloadsScenario = 'populated' | 'empty' | 'error'
export type MockConnectionScenario = 'connected' | 'error'

export interface MockBackgroundOptions {
  downloads?: MockDownloadsScenario
  connections?: Partial<Record<ServiceId, MockConnectionScenario>>
}

export interface MockBackgroundAction {
  type: BackgroundMessage['type']
  serviceId?: ServiceId
  hash?: string
  deleteFiles?: boolean
}

function dateOffset(days: number): string {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + days)

  return date.toISOString()
}

function createRequests(): SeerrRequest[] {
  return Array.from({ length: 18 }, (_, index) => {
    const number = index + 1
    const isTv = index % 3 === 0

    const status: SeerrRequest['status'] =
      index % 5 === 0 ? 'Pending' : index % 7 === 0 ? 'Declined' : 'Approved'

    const mediaStatus: SeerrRequest['mediaStatus'] =
      status === 'Pending'
        ? 'Pending'
        : index % 4 === 0
          ? 'Available'
          : index % 3 === 0
            ? 'Partially Available'
            : 'Processing'

    return {
      id: number,
      type: isTv ? 'tv' : 'movie',
      title: isTv ? `TV Show ${number}` : `Movie ${number}`,
      status,
      mediaStatus,
      requestedBy: `Test User ${(index % 4) + 1}`,
      createdAt: dateOffset(-number),
      posterPath: null,
    }
  })
}

function createArrivals(): JellyfinArrival[] {
  return Array.from({ length: 15 }, (_, index) => {
    const number = index + 1
    const isEpisode = index % 3 === 1

    return {
      id: `arrival-${number}`,
      type: isEpisode ? 'Episode' : 'Movie',
      title: isEpisode ? `TV Show ${number}` : `Movie ${number}`,
      subtitle: isEpisode ? `Season 1 · Episode ${number}` : 'Movie · 2026',
      dateAdded: dateOffset(-Math.floor(index / 2)),
      imageId: `mock-image-${number}`,
      imageTag: null,
      unread: index % 3 !== 2,
    }
  })
}

function createCalendarItems(): CalendarItem[] {
  const releases: Array<{
    source: 'sonarr' | 'radarr'
    offset: number
    releaseType: CalendarItem['releaseType']
  }> = [
    { source: 'sonarr', offset: -3, releaseType: 'air' },
    { source: 'radarr', offset: -1, releaseType: 'digital' },
    { source: 'sonarr', offset: 0, releaseType: 'air' },
    { source: 'radarr', offset: 1, releaseType: 'digital' },
    { source: 'sonarr', offset: 3, releaseType: 'air' },
    { source: 'radarr', offset: 5, releaseType: 'physical' },
    { source: 'sonarr', offset: 8, releaseType: 'air' },
    { source: 'radarr', offset: 12, releaseType: 'digital' },
    { source: 'sonarr', offset: 16, releaseType: 'air' },
    { source: 'radarr', offset: 21, releaseType: 'digital' },
  ]

  return releases.map((release, index) => {
    const number = index + 1
    const isTv = release.source === 'sonarr'

    return {
      id: `calendar-${number}`,
      source: release.source,
      type: isTv ? 'tv' : 'movie',
      title: isTv ? `TV Show ${number}` : `Movie ${number}`,
      subtitle: isTv
        ? `S01E${String(number).padStart(2, '0')} · Episode ${number}`
        : release.releaseType === 'physical'
          ? 'Physical release'
          : 'Digital release',
      date: dateOffset(release.offset),
      releaseType: release.releaseType,
      posterUrl: null,
      posterMediaId: null,
    }
  })
}

function createTorrent(
  character: string,
  name: string,
  state: string,
  progress: number,
): QBittorrentTorrent {
  const size = 4 * 1024 ** 3

  return {
    hash: character.repeat(40),
    name,
    state,
    progress,
    downloadSpeed: state === 'downloading' ? 2 * 1024 ** 2 : 0,
    uploadSpeed: state === 'uploading' ? 256 * 1024 : 0,
    eta: state === 'downloading' ? 1800 : -1,
    size,
    downloaded: Math.floor(size * progress),
  }
}

function createTorrents(): QBittorrentTorrent[] {
  return [
    createTorrent('a', 'Movie 1 (2026) 1080p', 'downloading', 0.48),
    createTorrent('b', 'TV Show 1 S01E01 1080p', 'stoppedDL', 0.72),
    createTorrent('c', 'Movie 2 (2026) 2160p', 'uploading', 1),
    createTorrent('d', 'Movie 3 (2026) 1080p', 'stalledDL', 0.18),
  ]
}

function paginate<T>(items: T[], page = 1, pageSize = 10): { items: T[]; total: number } {
  const safePage = Math.max(1, Math.floor(page))
  const safePageSize = Math.max(1, Math.floor(pageSize))
  const start = (safePage - 1) * safePageSize

  return {
    items: items.slice(start, start + safePageSize),
    total: items.length,
  }
}

export function createMockBackground(options: MockBackgroundOptions = {}) {
  const downloadsScenario = options.downloads ?? 'populated'
  const connectionScenarios = options.connections ?? {}

  const requests = createRequests()
  const calendarItems = createCalendarItems()

  let arrivals = createArrivals()
  let torrents = downloadsScenario === 'empty' ? [] : createTorrents()
  let selectedUserId = 'mock-user-1'

  const users: JellyfinUser[] = [
    { id: 'mock-user-1', name: 'Test User 1' },
    { id: 'mock-user-2', name: 'Test User 2' },
  ]

  const configs: SafeServiceConfigs = Object.fromEntries(
    SERVICES.map((serviceId) => [
      serviceId,
      {
        url: `https://${serviceId}.storybook.invalid`,
        configured: true,
      },
    ]),
  ) as SafeServiceConfigs

  const health: ServiceHealthStates = Object.fromEntries(
    SERVICES.map((serviceId) => [
      serviceId,
      connectionScenarios[serviceId] === 'error'
        ? {
            status: 'failed',
            lastCheckedAt: new Date().toISOString(),
            error: 'Storybook: Service is unavailable.',
          }
        : {
            status: 'connected',
            lastCheckedAt: new Date().toISOString(),
          },
    ]),
  ) as ServiceHealthStates

  const actions: MockBackgroundAction[] = []

  function unreadCount(): number {
    return arrivals.filter((arrival) => arrival.unread).length
  }

  function getDownloads() {
    return {
      success: true as const,
      downloads: {
        torrents: torrents.map((torrent) => ({ ...torrent })),
        downloadSpeed: torrents.reduce((sum, torrent) => sum + torrent.downloadSpeed, 0),
        uploadSpeed: torrents.reduce((sum, torrent) => sum + torrent.uploadSpeed, 0),
      },
    }
  }

  function setHealth(serviceId: ServiceId, status: ServiceHealth['status'], error?: string): void {
    health[serviceId] = {
      status,
      lastCheckedAt: new Date().toISOString(),
      ...(error ? { error } : {}),
    }
  }

  function handle(message: BackgroundMessage): BackgroundResponse<BackgroundMessage> {
    switch (message.type) {
      case 'OPEN_DETACHED_WORKSPACE':
        return {
          success: true,
          windowId: 42,
        }

      case 'GET_SERVICE_CONFIGS':
        return {
          success: true,
          configs: { ...configs },
        }

      case 'GET_SERVICE_HEALTH':
        return {
          success: true,
          health: Object.fromEntries(
            Object.entries(health).map(([serviceId, state]) => [
              serviceId,
              state ? { ...state } : undefined,
            ]),
          ) as ServiceHealthStates,
        }

      case 'CONNECT_SERVICE':
        configs[message.serviceId] = {
          url: message.config.url,
          configured: true,
        }

        setHealth(message.serviceId, 'connected')

        return {
          success: true,
          serviceId: message.serviceId,
        }

      case 'TEST_SERVICE_CONNECTION': {
        actions.push({
          type: message.type,
          serviceId: message.serviceId,
        })

        if (!configs[message.serviceId]?.configured) {
          return {
            success: false,
            error: `Configure ${message.serviceId} before testing its connection.`,
          }
        }

        if (connectionScenarios[message.serviceId] === 'error') {
          setHealth(message.serviceId, 'failed', 'Storybook: Service is unavailable.')

          return {
            success: false,
            error: 'Storybook: Service is unavailable.',
          }
        }

        setHealth(message.serviceId, 'connected')

        return {
          success: true,
          serviceId: message.serviceId,
        }
      }

      case 'REMOVE_SERVICE':
        delete configs[message.serviceId]
        delete health[message.serviceId]

        return {
          success: true,
          serviceId: message.serviceId,
        }

      case 'GET_JELLYFIN_USERS':
        return {
          success: true,
          users: [...users],
          selectedUserId,
        }

      case 'SET_JELLYFIN_USER':
        selectedUserId = message.userId

        return {
          success: true,
          userId: message.userId,
        }

      case 'GET_JELLYFIN_ARRIVALS': {
        const filtered =
          message.filter === 'new' ? arrivals.filter((arrival) => arrival.unread) : arrivals

        return {
          success: true,
          arrivals: paginate(filtered, message.page, message.pageSize),
          unreadCount: unreadCount(),
        }
      }

      case 'GET_JELLYFIN_IMAGE':
      case 'GET_CALENDAR_IMAGE':
        return {
          success: true,
          image: null,
        }

      case 'SET_JELLYFIN_ARRIVAL_UNREAD':
        arrivals = arrivals.map((arrival) =>
          arrival.id === message.itemId ? { ...arrival, unread: message.unread } : arrival,
        )

        return {
          success: true,
          unreadCount: unreadCount(),
        }

      case 'CLEAR_JELLYFIN_NOTIFICATIONS':
        arrivals = arrivals.map((arrival) => ({
          ...arrival,
          unread: false,
        }))

        return {
          success: true,
          unreadCount: 0,
        }

      case 'GET_SEERR_REQUESTS': {
        const filtered = requests.filter((request) => {
          if (message.filter === 'pending') {
            return request.status === 'Pending'
          }

          if (message.filter === 'approved') {
            return request.status === 'Approved'
          }

          return true
        })

        return {
          success: true,
          requests: paginate(filtered, message.page, message.pageSize),
        }
      }

      case 'GET_CALENDAR': {
        const start = new Date(message.start).getTime()
        const end = new Date(message.end).getTime()

        const calendar: CalendarResult = {
          items: calendarItems.filter((item) => {
            const date = new Date(item.date).getTime()

            return date >= start && date <= end
          }),
          services: [
            { service: 'sonarr', state: 'connected' },
            { service: 'radarr', state: 'connected' },
          ],
        }

        return {
          success: true,
          calendar,
        }
      }

      case 'GET_QBITTORRENT_DOWNLOADS':
        if (downloadsScenario === 'error') {
          return {
            success: false,
            error: 'Storybook: qBittorrent is unavailable.',
          }
        }

        return getDownloads()

      case 'START_QBITTORRENT_TORRENT':
        actions.push({
          type: message.type,
          hash: message.hash,
        })

        torrents = torrents.map((torrent) =>
          torrent.hash === message.hash
            ? {
                ...torrent,
                state: 'downloading',
                downloadSpeed: 2 * 1024 ** 2,
                uploadSpeed: 0,
                eta: 1800,
              }
            : torrent,
        )

        return {
          success: true,
          completed: true,
        }

      case 'STOP_QBITTORRENT_TORRENT':
        actions.push({
          type: message.type,
          hash: message.hash,
        })

        torrents = torrents.map((torrent) =>
          torrent.hash === message.hash
            ? {
                ...torrent,
                state: 'stoppedDL',
                downloadSpeed: 0,
                uploadSpeed: 0,
                eta: -1,
              }
            : torrent,
        )

        return {
          success: true,
          completed: true,
        }

      case 'DELETE_QBITTORRENT_TORRENT':
        actions.push({
          type: message.type,
          hash: message.hash,
          deleteFiles: message.deleteFiles,
        })

        torrents = torrents.filter((torrent) => torrent.hash !== message.hash)

        return {
          success: true,
          completed: true,
        }

      default: {
        const unhandledMessage: never = message
        throw new Error(`Unhandled background message: ${String(unhandledMessage)}`)
      }
    }
  }

  return {
    handle,
    actions,
    getTorrents: () => torrents.map((torrent) => ({ ...torrent })),
    getUnreadCount: unreadCount,
  }
}
