import { describe, expect, it } from 'vitest'
import { getAvailableNavigationItems, NAVIGATION_FEATURES } from './features'
import type { SafeServiceConfigs } from '../types/service'

describe('navigation features', () => {
  it('defines the available navigation features in display order', () => {
    expect(NAVIGATION_FEATURES).toEqual([
      { id: 'requests', label: 'Requests', requiredCapability: 'requests' },
      { id: 'up-next', label: 'Up Next', requiredCapability: 'up-next' },
      { id: 'calendar', label: 'Calendar', requiredCapability: 'calendar' },
      { id: 'downloads', label: 'Downloads', requiredCapability: 'downloads' },
    ])
  })
})

describe('getAvailableNavigationItems', () => {
  it('returns no navigation items when no services are configured', () => {
    expect(getAvailableNavigationItems({})).toEqual([])
  })

  it.each([
    ['jellyfin', 'up-next', 'Up Next'],
    ['seerr', 'requests', 'Requests'],
    ['sonarr', 'calendar', 'Calendar'],
    ['radarr', 'calendar', 'Calendar'],
    ['qbittorrent', 'downloads', 'Downloads'],
  ] as const)(
    'shows the correct navigation item for %s',
    (serviceId, expectedId, expectedLabel) => {
      const configs: SafeServiceConfigs = {
        [serviceId]: {
          url: 'https://example.com',
          configured: true,
        },
      }

      expect(getAvailableNavigationItems(configs)).toEqual([
        { id: expectedId, label: expectedLabel },
      ])
    },
  )

  it('does not show navigation items for unconfigured services', () => {
    const configs: SafeServiceConfigs = {
      jellyfin: {
        url: '',
        configured: false,
      },
      seerr: {
        url: 'https://seerr.example.com',
        configured: true,
      },
    }

    expect(getAvailableNavigationItems(configs)).toEqual([{ id: 'requests', label: 'Requests' }])
  })

  it('shows shared capabilities only once', () => {
    const configs: SafeServiceConfigs = {
      sonarr: {
        url: 'https://sonarr.example.com',
        configured: true,
      },
      radarr: {
        url: 'https://radarr.example.com',
        configured: true,
      },
    }

    expect(getAvailableNavigationItems(configs)).toEqual([{ id: 'calendar', label: 'Calendar' }])
  })

  it('combines capabilities from multiple configured services in registry order', () => {
    const configs: SafeServiceConfigs = {
      qbittorrent: {
        url: 'https://qbittorrent.example.com',
        configured: true,
      },
      jellyfin: {
        url: 'https://jellyfin.example.com',
        configured: true,
      },
      seerr: {
        url: 'https://seerr.example.com',
        configured: true,
      },
      sonarr: {
        url: 'https://sonarr.example.com',
        configured: true,
      },
    }

    expect(getAvailableNavigationItems(configs)).toEqual([
      { id: 'requests', label: 'Requests' },
      { id: 'up-next', label: 'Up Next' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'downloads', label: 'Downloads' },
    ])
  })

  it('does not require connection health information', () => {
    const configs: SafeServiceConfigs = {
      jellyfin: {
        url: 'https://jellyfin.example.com',
        configured: true,
      },
    }

    expect(getAvailableNavigationItems(configs)).toEqual([{ id: 'up-next', label: 'Up Next' }])
  })

  it('ignores missing service configuration entries', () => {
    const configs: SafeServiceConfigs = {
      radarr: {
        url: 'https://radarr.example.com',
        configured: true,
      },
    }

    expect(getAvailableNavigationItems(configs)).toEqual([{ id: 'calendar', label: 'Calendar' }])
  })
})
