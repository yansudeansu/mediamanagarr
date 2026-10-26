import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadCalendar } from './calendar'
import { getServiceConfig } from '../../utils/service-storage'
import { fetchSonarrCalendar } from './sonarr-calendar'
import { fetchRadarrCalendar } from './radarr-calendar'
import type { CalendarItem } from '../../types/calendar'
import type { ServiceConfig } from '../../types/service'

vi.mock('../../utils/service-storage', () => ({
  getServiceConfig: vi.fn(),
}))

vi.mock('./sonarr-calendar', () => ({
  fetchSonarrCalendar: vi.fn(),
}))

vi.mock('./radarr-calendar', () => ({
  fetchRadarrCalendar: vi.fn(),
}))

const sonarrConfig: ServiceConfig = {
  url: 'https://sonarr.example.com/sonarr',
  apiKey: 'sonarr-key',
}

const radarrConfig: ServiceConfig = {
  url: 'https://radarr.example.com/radarr',
  apiKey: 'radarr-key',
}

const start = new Date('2026-11-01T00:00:00.000Z')
const end = new Date('2026-12-01T00:00:00.000Z')

const sonarrItem: CalendarItem = {
  id: 'sonarr-101',
  source: 'sonarr',
  type: 'tv',
  title: 'Example Series',
  subtitle: 'S01E03',
  date: '2026-11-15T20:00:00Z',
  releaseType: 'air',
  posterUrl: null,
}

const radarrItem: CalendarItem = {
  id: 'radarr-201',
  source: 'radarr',
  type: 'movie',
  title: 'Example Movie',
  subtitle: '2026',
  date: '2026-11-05',
  releaseType: 'digital',
  posterUrl: null,
}

describe('loadCalendar', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.stubGlobal('chrome', {
      permissions: {
        contains: vi.fn().mockResolvedValue(true),
      },
    })

    vi.mocked(getServiceConfig).mockImplementation(async (serviceId) => {
      if (serviceId === 'sonarr') {
        return sonarrConfig
      }

      if (serviceId === 'radarr') {
        return radarrConfig
      }

      return undefined
    })

    vi.mocked(fetchSonarrCalendar).mockResolvedValue([sonarrItem])
    vi.mocked(fetchRadarrCalendar).mockResolvedValue([radarrItem])
  })

  it('combines and sorts Sonarr and Radarr releases', async () => {
    const result = await loadCalendar(start, end)

    expect(result.items).toEqual([radarrItem, sonarrItem])

    expect(result.services).toEqual([
      {
        service: 'sonarr',
        state: 'connected',
      },
      {
        service: 'radarr',
        state: 'connected',
      },
    ])

    expect(fetchSonarrCalendar).toHaveBeenCalledWith(sonarrConfig, start, end)
    expect(fetchRadarrCalendar).toHaveBeenCalledWith(radarrConfig, start, end)
  })

  it('preserves reverse-proxy paths while checking host permissions', async () => {
    await loadCalendar(start, end)

    expect(chrome.permissions.contains).toHaveBeenCalledWith({
      origins: ['https://sonarr.example.com/*'],
    })

    expect(chrome.permissions.contains).toHaveBeenCalledWith({
      origins: ['https://radarr.example.com/*'],
    })
  })

  it('returns not-configured statuses when neither service is configured', async () => {
    vi.mocked(getServiceConfig).mockResolvedValue(undefined)

    const result = await loadCalendar(start, end)

    expect(result).toEqual({
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

    expect(fetchSonarrCalendar).not.toHaveBeenCalled()
    expect(fetchRadarrCalendar).not.toHaveBeenCalled()
    expect(chrome.permissions.contains).not.toHaveBeenCalled()
  })

  it('continues loading Radarr when Sonarr fails', async () => {
    vi.mocked(fetchSonarrCalendar).mockRejectedValue(new Error('Unable to reach Sonarr.'))

    const result = await loadCalendar(start, end)

    expect(result.items).toEqual([radarrItem])

    expect(result.services).toEqual([
      {
        service: 'sonarr',
        state: 'failed',
        error: 'Unable to reach Sonarr.',
      },
      {
        service: 'radarr',
        state: 'connected',
      },
    ])
  })

  it('continues loading Sonarr when Radarr fails', async () => {
    vi.mocked(fetchRadarrCalendar).mockRejectedValue(
      new Error('Radarr authentication failed. Check your API key.'),
    )

    const result = await loadCalendar(start, end)

    expect(result.items).toEqual([sonarrItem])

    expect(result.services).toEqual([
      {
        service: 'sonarr',
        state: 'connected',
      },
      {
        service: 'radarr',
        state: 'failed',
        error: 'Radarr authentication failed. Check your API key.',
      },
    ])
  })

  it('returns both failures when both services fail', async () => {
    vi.mocked(fetchSonarrCalendar).mockRejectedValue(new Error('Sonarr failed.'))
    vi.mocked(fetchRadarrCalendar).mockRejectedValue(new Error('Radarr failed.'))

    const result = await loadCalendar(start, end)

    expect(result.items).toEqual([])

    expect(result.services).toEqual([
      {
        service: 'sonarr',
        state: 'failed',
        error: 'Sonarr failed.',
      },
      {
        service: 'radarr',
        state: 'failed',
        error: 'Radarr failed.',
      },
    ])
  })

  it('reports missing Sonarr permission without blocking Radarr', async () => {
    vi.mocked(chrome.permissions.contains).mockImplementation(async ({ origins }) => {
      return origins?.[0] !== 'https://sonarr.example.com/*'
    })

    const result = await loadCalendar(start, end)

    expect(result.items).toEqual([radarrItem])

    expect(result.services).toEqual([
      {
        service: 'sonarr',
        state: 'failed',
        error: 'Sonarr server access has not been granted.',
      },
      {
        service: 'radarr',
        state: 'connected',
      },
    ])

    expect(fetchSonarrCalendar).not.toHaveBeenCalled()
    expect(fetchRadarrCalendar).toHaveBeenCalledOnce()
  })

  it('handles a configuration-storage error for one service independently', async () => {
    vi.mocked(getServiceConfig).mockImplementation(async (serviceId) => {
      if (serviceId === 'sonarr') {
        throw new Error('Unable to read Sonarr configuration.')
      }

      return radarrConfig
    })

    const result = await loadCalendar(start, end)

    expect(result.items).toEqual([radarrItem])

    expect(result.services).toEqual([
      {
        service: 'sonarr',
        state: 'failed',
        error: 'Unable to read Sonarr configuration.',
      },
      {
        service: 'radarr',
        state: 'connected',
      },
    ])
  })

  it('handles unexpected non-Error failures', async () => {
    vi.mocked(fetchSonarrCalendar).mockRejectedValue('unexpected failure')

    const result = await loadCalendar(start, end)

    expect(result.items).toEqual([radarrItem])
    expect(result.services[0]).toEqual({
      service: 'sonarr',
      state: 'failed',
      error: 'An unexpected error occurred.',
    })
  })

  it('rejects invalid date ranges before contacting services', async () => {
    await expect(loadCalendar(end, start)).rejects.toThrow('Invalid calendar date range.')

    await expect(loadCalendar(start, start)).rejects.toThrow('Invalid calendar date range.')

    await expect(loadCalendar(new Date('invalid'), end)).rejects.toThrow(
      'Invalid calendar date range.',
    )

    expect(getServiceConfig).not.toHaveBeenCalled()
    expect(fetchSonarrCalendar).not.toHaveBeenCalled()
    expect(fetchRadarrCalendar).not.toHaveBeenCalled()
  })
})
