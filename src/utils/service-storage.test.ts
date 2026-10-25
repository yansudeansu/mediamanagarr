import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getSafeServiceConfigs,
  getServiceConfig,
  getServiceConfigs,
  removeServiceConfig,
  saveServiceConfig,
} from './service-storage'

describe('service-storage', () => {
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

  it('returns an empty object when no configurations exist', async () => {
    expect(await getServiceConfigs()).toEqual({})
  })

  it('saves a service configuration', async () => {
    const config = {
      url: 'https://jellyfin.example.com',
      apiKey: 'jellyfin-secret',
    }

    await saveServiceConfig('jellyfin', config)

    expect(await getServiceConfig('jellyfin')).toEqual(config)
  })

  it('preserves other services when saving a configuration', async () => {
    await saveServiceConfig('jellyfin', {
      url: 'https://jellyfin.example.com',
      apiKey: 'jellyfin-secret',
    })

    await saveServiceConfig('sonarr', {
      url: 'http://localhost:8989',
      apiKey: 'sonarr-secret',
    })

    expect(await getServiceConfigs()).toEqual({
      jellyfin: {
        url: 'https://jellyfin.example.com',
        apiKey: 'jellyfin-secret',
      },
      sonarr: {
        url: 'http://localhost:8989',
        apiKey: 'sonarr-secret',
      },
    })
  })

  it('overwrites an existing service configuration', async () => {
    await saveServiceConfig('radarr', {
      url: 'http://localhost:7878',
      apiKey: 'old-key',
    })

    await saveServiceConfig('radarr', {
      url: 'https://radarr.example.com',
      apiKey: 'new-key',
    })

    expect(await getServiceConfig('radarr')).toEqual({
      url: 'https://radarr.example.com',
      apiKey: 'new-key',
    })
  })

  it('returns undefined for an unconfigured service', async () => {
    expect(await getServiceConfig('seerr')).toBeUndefined()
  })

  it('returns safe configurations without API keys', async () => {
    await saveServiceConfig('jellyfin', {
      url: 'https://jellyfin.example.com',
      apiKey: 'super-secret',
    })

    const safeConfigs = await getSafeServiceConfigs()

    expect(safeConfigs).toEqual({
      jellyfin: {
        url: 'https://jellyfin.example.com',
        configured: true,
      },
    })

    expect(JSON.stringify(safeConfigs)).not.toContain('super-secret')
    expect(JSON.stringify(safeConfigs)).not.toContain('apiKey')
  })

  it('returns safe configurations for multiple services', async () => {
    await saveServiceConfig('jellyfin', {
      url: 'https://jellyfin.example.com',
      apiKey: 'jellyfin-secret',
    })

    await saveServiceConfig('qbittorrent', {
      url: 'http://localhost:8080',
      apiKey: 'qbit-secret',
    })

    expect(await getSafeServiceConfigs()).toEqual({
      jellyfin: {
        url: 'https://jellyfin.example.com',
        configured: true,
      },
      qbittorrent: {
        url: 'http://localhost:8080',
        configured: true,
      },
    })
  })

  it('removes only the selected service configuration', async () => {
    await saveServiceConfig('jellyfin', {
      url: 'https://jellyfin.example.com',
      apiKey: 'jellyfin-secret',
    })

    await saveServiceConfig('sonarr', {
      url: 'http://localhost:8989',
      apiKey: 'sonarr-secret',
    })

    await removeServiceConfig('jellyfin')

    expect(await getServiceConfig('jellyfin')).toBeUndefined()

    expect(await getServiceConfig('sonarr')).toEqual({
      url: 'http://localhost:8989',
      apiKey: 'sonarr-secret',
    })
  })

  it('removing a missing service is harmless', async () => {
    await removeServiceConfig('seerr')

    expect(await getServiceConfigs()).toEqual({})
  })

  it('throws when browser storage is unavailable', async () => {
    vi.stubGlobal('chrome', undefined)

    await expect(getServiceConfigs()).rejects.toThrow('Browser extension storage is unavailable.')
  })
})
