import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handleBackgroundMessage } from './messages'
import {
  getSafeServiceConfigs,
  getServiceConfig,
  removeServiceConfig,
  saveServiceConfig,
} from '../utils/service-storage'
import { testServiceConnection } from './services/connection'
import { fetchJellyfinUsers } from './services/jellyfin-users'
import { refreshJellyfinNotifications } from './services/jellyfin-scanner'
import { fetchSeerrRequests } from './services/seerr-requests'
import { loadCalendar } from './services/calendar'
import {
  clearJellyfinUserSelection,
  getJellyfinUserSelection,
  saveJellyfinUserSelection,
} from '../utils/jellyfin-storage'
import type { ServiceConfig } from '../types/service'
import type { SeerrRequestsPage } from '../types/seerr'
import {
  deleteQBittorrentTorrent,
  fetchQBittorrentSnapshot,
  startQBittorrentTorrent,
  stopQBittorrentTorrent,
} from './services/qbittorrent'

vi.mock('../utils/service-storage', () => ({
  getSafeServiceConfigs: vi.fn(),
  getServiceConfig: vi.fn(),
  removeServiceConfig: vi.fn(),
  saveServiceConfig: vi.fn(),
}))

vi.mock('./services/connection', () => ({
  testServiceConnection: vi.fn(),
}))

vi.mock('./services/jellyfin-users', () => ({
  fetchJellyfinUsers: vi.fn(),
}))

vi.mock('./services/jellyfin-scanner', () => ({
  refreshJellyfinNotifications: vi.fn(),
}))

vi.mock('./services/seerr-requests', () => ({
  fetchSeerrRequests: vi.fn(),
}))

vi.mock('./services/calendar', () => ({
  loadCalendar: vi.fn(),
}))

vi.mock('../utils/jellyfin-storage', () => ({
  clearJellyfinUserSelection: vi.fn(),
  getJellyfinUserSelection: vi.fn(),
  saveJellyfinUserSelection: vi.fn(),
}))

vi.mock('./services/qbittorrent', () => ({
  deleteQBittorrentTorrent: vi.fn(),
  fetchQBittorrentSnapshot: vi.fn(),
  startQBittorrentTorrent: vi.fn(),
  stopQBittorrentTorrent: vi.fn(),
}))

const jellyfinConfig: ServiceConfig = {
  url: 'https://jellyfin.example.com',
  apiKey: 'saved-key',
}

const jellyfinUsers = [
  { id: 'user-1', name: 'Alice' },
  { id: 'user-2', name: 'Bob' },
]

const seerrConfig: ServiceConfig = {
  url: 'https://seerr.example.com/seerr',
  apiKey: 'seerr-test-key',
}

const seerrRequestsPage: SeerrRequestsPage = {
  items: [
    {
      id: 42,
      type: 'movie',
      title: 'Example Movie',
      status: 'Approved',
      mediaStatus: 'Available',
      requestedBy: 'Alice',
      createdAt: '2026-10-20T12:00:00.000Z',
      posterPath: '/poster.jpg',
    },
  ],
  total: 1,
}

describe('handleBackgroundMessage', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.stubGlobal('chrome', {
      permissions: {
        contains: vi.fn().mockResolvedValue(true),
      },
    })

    vi.mocked(getServiceConfig).mockResolvedValue(undefined)
    vi.mocked(fetchJellyfinUsers).mockResolvedValue(jellyfinUsers)
    vi.mocked(getJellyfinUserSelection).mockResolvedValue('')
  })

  it('returns safe service configurations', async () => {
    vi.mocked(getSafeServiceConfigs).mockResolvedValue({
      jellyfin: {
        url: 'https://jellyfin.example.com',
        configured: true,
      },
    })

    await expect(handleBackgroundMessage({ type: 'GET_SERVICE_CONFIGS' })).resolves.toEqual({
      success: true,
      configs: {
        jellyfin: {
          url: 'https://jellyfin.example.com',
          configured: true,
        },
      },
    })
  })

  it('rejects malformed messages', async () => {
    await expect(handleBackgroundMessage(null)).resolves.toEqual({
      success: false,
      error: 'Invalid background message.',
    })

    await expect(
      handleBackgroundMessage({
        type: 'CONNECT_SERVICE',
        serviceId: 'unknown',
        config: {
          url: 'https://example.com',
          apiKey: 'secret',
        },
      }),
    ).resolves.toEqual({
      success: false,
      error: 'Invalid background message.',
    })
  })

  it('tests and saves a valid connection', async () => {
    const result = await handleBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId: 'sonarr',
      config: {
        url: 'https://sonarr.example.com/',
        apiKey: 'test-key',
      },
    })

    expect(chrome.permissions.contains).toHaveBeenCalledWith({
      origins: ['https://sonarr.example.com/*'],
    })

    expect(testServiceConnection).toHaveBeenCalledWith('sonarr', {
      url: 'https://sonarr.example.com',
      apiKey: 'test-key',
    })

    expect(saveServiceConfig).toHaveBeenCalledWith('sonarr', {
      url: 'https://sonarr.example.com',
      apiKey: 'test-key',
    })

    expect(result).toEqual({
      success: true,
      serviceId: 'sonarr',
    })
  })

  it('does not test or save when host permission is missing', async () => {
    vi.stubGlobal('chrome', {
      permissions: {
        contains: vi.fn().mockResolvedValue(false),
      },
    })

    const result = await handleBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId: 'radarr',
      config: {
        url: 'https://radarr.example.com',
        apiKey: 'test-key',
      },
    })

    expect(result).toEqual({
      success: false,
      error: 'Server access has not been granted. Please allow access and try again.',
    })

    expect(testServiceConnection).not.toHaveBeenCalled()
    expect(saveServiceConfig).not.toHaveBeenCalled()
  })

  it('reuses the saved API key for the same URL', async () => {
    vi.mocked(getServiceConfig).mockResolvedValue(jellyfinConfig)

    await handleBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId: 'jellyfin',
      config: {
        url: 'https://jellyfin.example.com/',
        apiKey: '',
      },
    })

    expect(testServiceConnection).toHaveBeenCalledWith('jellyfin', jellyfinConfig)
    expect(refreshJellyfinNotifications).toHaveBeenCalledOnce()
  })

  it('does not save when the connection test fails', async () => {
    vi.mocked(testServiceConnection).mockRejectedValue(new Error('Authentication failed.'))

    const result = await handleBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId: 'seerr',
      config: {
        url: 'https://seerr.example.com',
        apiKey: 'wrong-key',
      },
    })

    expect(result).toEqual({
      success: false,
      error: 'Authentication failed.',
    })

    expect(saveServiceConfig).not.toHaveBeenCalled()
  })

  it('rejects an empty API key when no saved key is available', async () => {
    const result = await handleBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId: 'sonarr',
      config: {
        url: 'https://sonarr.example.com',
        apiKey: '',
      },
    })

    expect(result).toEqual({
      success: false,
      error: 'Enter an API key.',
    })

    expect(testServiceConnection).not.toHaveBeenCalled()
  })

  describe('qBittorrent messages', () => {
    const config: ServiceConfig = {
      url: 'https://downloads.example.com/qbittorrent',
      apiKey: 'qbittorrent-test-key',
    }

    const hash = 'a'.repeat(40)

    const snapshot = {
      torrents: [
        {
          hash,
          name: 'Example Torrent',
          progress: 0.5,
          state: 'downloading',
          downloadSpeed: 1024,
          uploadSpeed: 512,
          eta: 3600,
          size: 2048,
          downloaded: 1024,
        },
      ],
      downloadSpeed: 4096,
      uploadSpeed: 2048,
    }

    beforeEach(() => {
      vi.mocked(getServiceConfig).mockResolvedValue(config)
      vi.mocked(fetchQBittorrentSnapshot).mockResolvedValue(snapshot)
    })

    it('fetches downloads with a configured service', async () => {
      const result = await handleBackgroundMessage({
        type: 'GET_QBITTORRENT_DOWNLOADS',
      })

      expect(result).toEqual({
        success: true,
        downloads: snapshot,
      })

      expect(getServiceConfig).toHaveBeenCalledWith('qbittorrent')

      expect(chrome.permissions.contains).toHaveBeenCalledWith({
        origins: ['https://downloads.example.com/*'],
      })

      expect(fetchQBittorrentSnapshot).toHaveBeenCalledWith(config)
    })

    it('requires qBittorrent configuration', async () => {
      vi.mocked(getServiceConfig).mockResolvedValue(undefined)

      const result = await handleBackgroundMessage({
        type: 'GET_QBITTORRENT_DOWNLOADS',
      })

      expect(result).toEqual({
        success: false,
        error: 'Configure qBittorrent in Settings before viewing downloads.',
      })

      expect(fetchQBittorrentSnapshot).not.toHaveBeenCalled()
    })

    it('requires qBittorrent host permission', async () => {
      vi.stubGlobal('chrome', {
        permissions: {
          contains: vi.fn().mockResolvedValue(false),
        },
      })

      const result = await handleBackgroundMessage({
        type: 'GET_QBITTORRENT_DOWNLOADS',
      })

      expect(result).toEqual({
        success: false,
        error: 'qBittorrent server access has not been granted.',
      })

      expect(fetchQBittorrentSnapshot).not.toHaveBeenCalled()
    })

    it('starts a torrent', async () => {
      const result = await handleBackgroundMessage({
        type: 'START_QBITTORRENT_TORRENT',
        hash,
      })

      expect(startQBittorrentTorrent).toHaveBeenCalledWith(config, hash)

      expect(result).toEqual({
        success: true,
        completed: true,
      })
    })

    it('stops a torrent', async () => {
      const result = await handleBackgroundMessage({
        type: 'STOP_QBITTORRENT_TORRENT',
        hash,
      })

      expect(stopQBittorrentTorrent).toHaveBeenCalledWith(config, hash)

      expect(result).toEqual({
        success: true,
        completed: true,
      })
    })

    it('removes a torrent without deleting downloaded files', async () => {
      const result = await handleBackgroundMessage({
        type: 'DELETE_QBITTORRENT_TORRENT',
        hash,
        deleteFiles: false,
      })

      expect(deleteQBittorrentTorrent).toHaveBeenCalledWith(config, hash, false)

      expect(result).toEqual({
        success: true,
        completed: true,
      })
    })

    it('deletes downloaded files only when explicitly requested', async () => {
      const result = await handleBackgroundMessage({
        type: 'DELETE_QBITTORRENT_TORRENT',
        hash,
        deleteFiles: true,
      })

      expect(deleteQBittorrentTorrent).toHaveBeenCalledWith(config, hash, true)

      expect(result).toEqual({
        success: true,
        completed: true,
      })
    })

    it.each([
      { type: 'START_QBITTORRENT_TORRENT', hash: 'invalid' },
      { type: 'STOP_QBITTORRENT_TORRENT', hash: '' },
      { type: 'DELETE_QBITTORRENT_TORRENT', hash: 'invalid', deleteFiles: false },
      { type: 'DELETE_QBITTORRENT_TORRENT', hash, deleteFiles: 'true' },
      { type: 'DELETE_QBITTORRENT_TORRENT', hash },
    ])('rejects invalid torrent actions: %j', async (message) => {
      const result = await handleBackgroundMessage(message)

      expect(result).toEqual({
        success: false,
        error: 'Invalid background message.',
      })

      expect(startQBittorrentTorrent).not.toHaveBeenCalled()
      expect(stopQBittorrentTorrent).not.toHaveBeenCalled()
      expect(deleteQBittorrentTorrent).not.toHaveBeenCalled()
    })

    it('returns qBittorrent API failures as structured errors', async () => {
      vi.mocked(fetchQBittorrentSnapshot).mockRejectedValue(
        new Error('qBittorrent authentication failed. Check your API key.'),
      )

      const result = await handleBackgroundMessage({
        type: 'GET_QBITTORRENT_DOWNLOADS',
      })

      expect(result).toEqual({
        success: false,
        error: 'qBittorrent authentication failed. Check your API key.',
      })
    })

    it('does not expose the API key in download responses', async () => {
      const result = await handleBackgroundMessage({
        type: 'GET_QBITTORRENT_DOWNLOADS',
      })

      expect(JSON.stringify(result)).not.toContain(config.apiKey)
    })
  })

  describe('REMOVE_SERVICE', () => {
    it('removes a configured service', async () => {
      const result = await handleBackgroundMessage({
        type: 'REMOVE_SERVICE',
        serviceId: 'sonarr',
      })

      expect(removeServiceConfig).toHaveBeenCalledWith('sonarr')
      expect(clearJellyfinUserSelection).not.toHaveBeenCalled()

      expect(result).toEqual({
        success: true,
        serviceId: 'sonarr',
      })
    })

    it('clears the Jellyfin selection before removing Jellyfin', async () => {
      const result = await handleBackgroundMessage({
        type: 'REMOVE_SERVICE',
        serviceId: 'jellyfin',
      })

      expect(clearJellyfinUserSelection).toHaveBeenCalledOnce()
      expect(removeServiceConfig).toHaveBeenCalledWith('jellyfin')
      expect(refreshJellyfinNotifications).toHaveBeenCalledOnce()

      const clearCallOrder = vi.mocked(clearJellyfinUserSelection).mock.invocationCallOrder[0]
      const removeCallOrder = vi.mocked(removeServiceConfig).mock.invocationCallOrder[0]

      expect(clearCallOrder).toBeDefined()
      expect(removeCallOrder).toBeDefined()
      expect(clearCallOrder!).toBeLessThan(removeCallOrder!)

      expect(result).toEqual({
        success: true,
        serviceId: 'jellyfin',
      })
    })

    it('rejects an invalid service ID', async () => {
      const result = await handleBackgroundMessage({
        type: 'REMOVE_SERVICE',
        serviceId: 'unknown',
      })

      expect(result).toEqual({
        success: false,
        error: 'Invalid background message.',
      })

      expect(removeServiceConfig).not.toHaveBeenCalled()
      expect(clearJellyfinUserSelection).not.toHaveBeenCalled()
    })

    it('preserves the configuration if clearing the Jellyfin selection fails', async () => {
      vi.mocked(clearJellyfinUserSelection).mockRejectedValue(
        new Error('Unable to clear Jellyfin selection.'),
      )

      const result = await handleBackgroundMessage({
        type: 'REMOVE_SERVICE',
        serviceId: 'jellyfin',
      })

      expect(result).toEqual({
        success: false,
        error: 'Unable to clear Jellyfin selection.',
      })

      expect(removeServiceConfig).not.toHaveBeenCalled()
    })

    it('reports a storage error when removal fails', async () => {
      vi.mocked(removeServiceConfig).mockRejectedValue(new Error('Unable to remove service.'))

      const result = await handleBackgroundMessage({
        type: 'REMOVE_SERVICE',
        serviceId: 'sonarr',
      })

      expect(result).toEqual({
        success: false,
        error: 'Unable to remove service.',
      })

      expect(removeServiceConfig).toHaveBeenCalledWith('sonarr')
    })
  })

  describe('GET_JELLYFIN_USERS', () => {
    it('returns available users and the saved selection', async () => {
      vi.mocked(getServiceConfig).mockResolvedValue(jellyfinConfig)
      vi.mocked(getJellyfinUserSelection).mockResolvedValue('user-2')

      const result = await handleBackgroundMessage({
        type: 'GET_JELLYFIN_USERS',
      })

      expect(fetchJellyfinUsers).toHaveBeenCalledWith(jellyfinConfig)
      expect(getJellyfinUserSelection).toHaveBeenCalledWith(jellyfinConfig.url)

      expect(result).toEqual({
        success: true,
        users: jellyfinUsers,
        selectedUserId: 'user-2',
      })
    })

    it('returns an empty selection if the saved user is no longer available', async () => {
      vi.mocked(getServiceConfig).mockResolvedValue(jellyfinConfig)
      vi.mocked(getJellyfinUserSelection).mockResolvedValue('deleted-user')

      await expect(
        handleBackgroundMessage({
          type: 'GET_JELLYFIN_USERS',
        }),
      ).resolves.toEqual({
        success: true,
        users: jellyfinUsers,
        selectedUserId: '',
      })
    })

    it('requires Jellyfin to be configured', async () => {
      await expect(
        handleBackgroundMessage({
          type: 'GET_JELLYFIN_USERS',
        }),
      ).resolves.toEqual({
        success: false,
        error: 'Configure Jellyfin before selecting a user.',
      })

      expect(fetchJellyfinUsers).not.toHaveBeenCalled()
    })

    it('requires Jellyfin host permission', async () => {
      vi.mocked(getServiceConfig).mockResolvedValue(jellyfinConfig)

      vi.stubGlobal('chrome', {
        permissions: {
          contains: vi.fn().mockResolvedValue(false),
        },
      })

      await expect(
        handleBackgroundMessage({
          type: 'GET_JELLYFIN_USERS',
        }),
      ).resolves.toEqual({
        success: false,
        error: 'Jellyfin server access has not been granted.',
      })

      expect(fetchJellyfinUsers).not.toHaveBeenCalled()
    })

    it('returns an error when Jellyfin user retrieval fails', async () => {
      vi.mocked(getServiceConfig).mockResolvedValue(jellyfinConfig)
      vi.mocked(fetchJellyfinUsers).mockRejectedValue(
        new Error('Jellyfin did not allow access to the user list.'),
      )

      await expect(
        handleBackgroundMessage({
          type: 'GET_JELLYFIN_USERS',
        }),
      ).resolves.toEqual({
        success: false,
        error: 'Jellyfin did not allow access to the user list.',
      })
    })
  })

  describe('SET_JELLYFIN_USER', () => {
    it('saves a valid selected user', async () => {
      vi.mocked(getServiceConfig).mockResolvedValue(jellyfinConfig)

      const result = await handleBackgroundMessage({
        type: 'SET_JELLYFIN_USER',
        userId: 'user-2',
      })

      expect(saveJellyfinUserSelection).toHaveBeenCalledWith(jellyfinConfig.url, 'user-2')
      expect(refreshJellyfinNotifications).toHaveBeenCalledOnce()

      expect(result).toEqual({
        success: true,
        userId: 'user-2',
      })
    })

    it('rejects an unknown user ID', async () => {
      vi.mocked(getServiceConfig).mockResolvedValue(jellyfinConfig)

      await expect(
        handleBackgroundMessage({
          type: 'SET_JELLYFIN_USER',
          userId: 'missing-user',
        }),
      ).resolves.toEqual({
        success: false,
        error: 'Selected Jellyfin user was not found.',
      })

      expect(saveJellyfinUserSelection).not.toHaveBeenCalled()
    })

    it('rejects an empty user ID', async () => {
      await expect(
        handleBackgroundMessage({
          type: 'SET_JELLYFIN_USER',
          userId: '   ',
        }),
      ).resolves.toEqual({
        success: false,
        error: 'Invalid background message.',
      })

      expect(saveJellyfinUserSelection).not.toHaveBeenCalled()
    })

    it('does not save when retrieving users fails', async () => {
      vi.mocked(getServiceConfig).mockResolvedValue(jellyfinConfig)
      vi.mocked(fetchJellyfinUsers).mockRejectedValue(new Error('Unable to reach Jellyfin.'))

      await expect(
        handleBackgroundMessage({
          type: 'SET_JELLYFIN_USER',
          userId: 'user-1',
        }),
      ).resolves.toEqual({
        success: false,
        error: 'Unable to reach Jellyfin.',
      })

      expect(saveJellyfinUserSelection).not.toHaveBeenCalled()
    })
  })

  describe('GET_SEERR_REQUESTS', () => {
    beforeEach(() => {
      vi.mocked(getServiceConfig).mockResolvedValue(seerrConfig)
      vi.mocked(fetchSeerrRequests).mockResolvedValue(seerrRequestsPage)
    })

    it('fetches Seerr requests with default query values', async () => {
      const result = await handleBackgroundMessage({
        type: 'GET_SEERR_REQUESTS',
      })

      expect(result).toEqual({
        success: true,
        requests: seerrRequestsPage,
      })

      expect(getServiceConfig).toHaveBeenCalledWith('seerr')

      expect(chrome.permissions.contains).toHaveBeenCalledWith({
        origins: ['https://seerr.example.com/*'],
      })

      expect(fetchSeerrRequests).toHaveBeenCalledWith(seerrConfig, {
        page: undefined,
        pageSize: undefined,
        filter: undefined,
      })
    })

    it('forwards pagination and filters to the Seerr API client', async () => {
      await handleBackgroundMessage({
        type: 'GET_SEERR_REQUESTS',
        page: 3,
        pageSize: 5,
        filter: 'pending',
      })

      expect(fetchSeerrRequests).toHaveBeenCalledWith(seerrConfig, {
        page: 3,
        pageSize: 5,
        filter: 'pending',
      })
    })

    it('accepts the Approved filter', async () => {
      await handleBackgroundMessage({
        type: 'GET_SEERR_REQUESTS',
        filter: 'approved',
      })

      expect(fetchSeerrRequests).toHaveBeenCalledWith(
        seerrConfig,
        expect.objectContaining({
          filter: 'approved',
        }),
      )
    })

    it('returns an error when Seerr is not configured', async () => {
      vi.mocked(getServiceConfig).mockResolvedValue(undefined)

      const result = await handleBackgroundMessage({
        type: 'GET_SEERR_REQUESTS',
      })

      expect(result).toEqual({
        success: false,
        error: 'Configure Seerr before viewing requests.',
      })

      expect(chrome.permissions.contains).not.toHaveBeenCalled()
      expect(fetchSeerrRequests).not.toHaveBeenCalled()
    })

    it('requires Seerr host permission', async () => {
      vi.stubGlobal('chrome', {
        permissions: {
          contains: vi.fn().mockResolvedValue(false),
        },
      })

      const result = await handleBackgroundMessage({
        type: 'GET_SEERR_REQUESTS',
      })

      expect(result).toEqual({
        success: false,
        error: 'Seerr server access has not been granted.',
      })

      expect(fetchSeerrRequests).not.toHaveBeenCalled()
    })

    it.each([
      { page: 0 },
      { page: -1 },
      { page: 1.5 },
      { page: '2' },
      { pageSize: 0 },
      { pageSize: 101 },
      { pageSize: 2.5 },
      { filter: 'declined' },
      { filter: 123 },
      { page: Number.MAX_SAFE_INTEGER, pageSize: 100 },
    ])('rejects invalid query input: %j', async (query) => {
      const result = await handleBackgroundMessage({
        type: 'GET_SEERR_REQUESTS',
        ...query,
      })

      expect(result).toEqual({
        success: false,
        error: 'Invalid background message.',
      })

      expect(getServiceConfig).not.toHaveBeenCalled()
      expect(fetchSeerrRequests).not.toHaveBeenCalled()
    })

    it('returns Seerr API errors as structured failures', async () => {
      vi.mocked(fetchSeerrRequests).mockRejectedValue(
        new Error('Seerr authentication failed. Check your API key.'),
      )

      const result = await handleBackgroundMessage({
        type: 'GET_SEERR_REQUESTS',
      })

      expect(result).toEqual({
        success: false,
        error: 'Seerr authentication failed. Check your API key.',
      })
    })

    it('handles unexpected non-Error failures', async () => {
      vi.mocked(fetchSeerrRequests).mockRejectedValue('unexpected failure')

      const result = await handleBackgroundMessage({
        type: 'GET_SEERR_REQUESTS',
      })

      expect(result).toEqual({
        success: false,
        error: 'An unexpected error occurred.',
      })
    })

    it('does not expose the Seerr API key in responses', async () => {
      const result = await handleBackgroundMessage({
        type: 'GET_SEERR_REQUESTS',
      })

      expect(JSON.stringify(result)).not.toContain(seerrConfig.apiKey)
    })
  })

  describe('GET_CALENDAR', () => {
    const calendarResult = {
      items: [
        {
          id: 'radarr-101',
          source: 'radarr' as const,
          type: 'movie' as const,
          title: 'Example Movie',
          subtitle: '2026',
          date: '2026-11-05',
          releaseType: 'digital' as const,
          posterUrl: null,
        },
      ],
      services: [
        {
          service: 'sonarr' as const,
          state: 'connected' as const,
        },
        {
          service: 'radarr' as const,
          state: 'connected' as const,
        },
      ],
    }

    beforeEach(() => {
      vi.mocked(loadCalendar).mockResolvedValue(calendarResult)
    })

    it('loads the calendar for a valid date range', async () => {
      const result = await handleBackgroundMessage({
        type: 'GET_CALENDAR',
        start: '2026-11-01',
        end: '2026-12-01',
      })

      expect(result).toEqual({
        success: true,
        calendar: calendarResult,
      })

      expect(loadCalendar).toHaveBeenCalledOnce()

      const [start, end] = vi.mocked(loadCalendar).mock.calls[0]

      expect(start.getFullYear()).toBe(2026)
      expect(start.getMonth()).toBe(10)
      expect(start.getDate()).toBe(1)

      expect(end.getFullYear()).toBe(2026)
      expect(end.getMonth()).toBe(11)
      expect(end.getDate()).toBe(1)
    })

    it.each([
      { start: 'invalid', end: '2026-12-01' },
      { start: '2026-02-30', end: '2026-12-01' },
      { start: '2026-11-01', end: 'invalid' },
      { start: '2026-11-01', end: '2026-11-01' },
      { start: '2026-12-01', end: '2026-11-01' },
      { start: '2026-11-01T00:00:00Z', end: '2026-12-01' },
      { start: 123, end: '2026-12-01' },
      { start: '2026-11-01' },
      { end: '2026-12-01' },
    ])('rejects invalid calendar date ranges: %j', async (query) => {
      const result = await handleBackgroundMessage({
        type: 'GET_CALENDAR',
        ...query,
      })

      expect(result).toEqual({
        success: false,
        error: 'Invalid background message.',
      })

      expect(loadCalendar).not.toHaveBeenCalled()
    })

    it('returns aggregator errors as structured failures', async () => {
      vi.mocked(loadCalendar).mockRejectedValue(new Error('Calendar unavailable.'))

      const result = await handleBackgroundMessage({
        type: 'GET_CALENDAR',
        start: '2026-11-01',
        end: '2026-12-01',
      })

      expect(result).toEqual({
        success: false,
        error: 'Calendar unavailable.',
      })
    })

    it('does not require both services to be configured', async () => {
      vi.mocked(loadCalendar).mockResolvedValue({
        items: [],
        services: [
          {
            service: 'sonarr',
            state: 'not-configured',
          },
          {
            service: 'radarr',
            state: 'not-configured',
          },
        ],
      })

      const result = await handleBackgroundMessage({
        type: 'GET_CALENDAR',
        start: '2026-11-01',
        end: '2026-12-01',
      })

      expect(result).toEqual({
        success: true,
        calendar: {
          items: [],
          services: [
            {
              service: 'sonarr',
              state: 'not-configured',
            },
            {
              service: 'radarr',
              state: 'not-configured',
            },
          ],
        },
      })
    })
  })
})
