import { describe, expect, it } from 'vitest'
import {
  SERVICES,
  SERVICE_REGISTRY,
  getConfiguredServices,
  isServiceConfigured,
  isServiceId,
  serviceHasCapability,
} from './registry'

describe('service registry', () => {
  it('contains all supported services in the expected order', () => {
    expect(SERVICES).toEqual(['jellyfin', 'seerr', 'sonarr', 'radarr', 'qbittorrent'])
  })

  it('defines consistent metadata for every service', () => {
    for (const serviceId of SERVICES) {
      const service = SERVICE_REGISTRY[serviceId]

      expect(service.id).toBe(serviceId)
      expect(service.name).toBeTruthy()
      expect(service.description).toBeTruthy()
      expect(service.category).toBeTruthy()
      expect(service.icon).toBeTruthy()
      expect(service.capabilities.length).toBeGreaterThan(0)
    }
  })

  it('validates supported service identifiers', () => {
    expect(isServiceId('jellyfin')).toBe(true)
    expect(isServiceId('qbittorrent')).toBe(true)
    expect(isServiceId('plex')).toBe(false)
    expect(isServiceId('')).toBe(false)
    expect(isServiceId(null)).toBe(false)
    expect(isServiceId(123)).toBe(false)
  })

  it('checks supported capabilities', () => {
    expect(serviceHasCapability('jellyfin', 'up-next')).toBe(true)
    expect(serviceHasCapability('seerr', 'requests')).toBe(true)
    expect(serviceHasCapability('sonarr', 'calendar')).toBe(true)
    expect(serviceHasCapability('radarr', 'calendar')).toBe(true)
    expect(serviceHasCapability('qbittorrent', 'downloads')).toBe(true)

    expect(serviceHasCapability('jellyfin', 'downloads')).toBe(false)
    expect(serviceHasCapability('seerr', 'calendar')).toBe(false)
  })

  it('requires a configuration to exist', () => {
    expect(isServiceConfigured('jellyfin', undefined)).toBe(false)
  })

  it('requires non-empty configuration fields', () => {
    expect(
      isServiceConfigured('jellyfin', {
        url: '',
        apiKey: 'test-key',
      }),
    ).toBe(false)

    expect(
      isServiceConfigured('jellyfin', {
        url: 'https://jellyfin.example.com',
        apiKey: '   ',
      }),
    ).toBe(false)
  })

  it('recognizes a configured service', () => {
    expect(
      isServiceConfigured('jellyfin', {
        url: 'https://jellyfin.example.com',
        apiKey: 'test-key',
      }),
    ).toBe(true)
  })

  it('returns configured services in registry order', () => {
    expect(
      getConfiguredServices({
        radarr: {
          url: 'https://radarr.example.com',
          apiKey: 'radarr-key',
        },
        jellyfin: {
          url: 'https://jellyfin.example.com',
          apiKey: 'jellyfin-key',
        },
        seerr: {
          url: '',
          apiKey: 'seerr-key',
        },
      }),
    ).toEqual(['jellyfin', 'radarr'])
  })

  it('returns no configured services when configuration is empty', () => {
    expect(getConfiguredServices({})).toEqual([])
  })
})
