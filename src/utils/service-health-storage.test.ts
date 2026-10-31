import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ServiceHealth } from '../types/service'
import {
  clearServiceHealth,
  getServiceHealth,
  getServiceHealthStates,
  saveServiceHealth,
} from './service-health-storage'

describe('service-health-storage', () => {
  let stored: Record<string, unknown>

  const get = vi.fn(async (key: string) => ({
    [key]: stored[key],
  }))

  const set = vi.fn(async (items: Record<string, unknown>) => {
    Object.assign(stored, items)
  })

  const connected: ServiceHealth = {
    status: 'connected',
    lastCheckedAt: '2026-10-31T12:00:00.000Z',
  }

  const failed: ServiceHealth = {
    status: 'failed',
    lastCheckedAt: '2026-10-31T12:05:00.000Z',
    error: 'Unable to reach the server.',
  }

  beforeEach(() => {
    stored = {}

    get.mockClear()
    set.mockClear()

    vi.stubGlobal('chrome', {
      storage: {
        session: {
          get,
          set,
        },
      },
    })
  })

  it('returns an empty object when no health information exists', async () => {
    expect(await getServiceHealthStates()).toEqual({})
  })

  it('returns undefined for a service that has not been checked', async () => {
    expect(await getServiceHealth('seerr')).toBeUndefined()
  })

  it('saves a successful connection result', async () => {
    await saveServiceHealth('sonarr', connected)

    expect(await getServiceHealth('sonarr')).toEqual(connected)
  })

  it('saves a failed connection result with an error message', async () => {
    await saveServiceHealth('radarr', failed)

    expect(await getServiceHealth('radarr')).toEqual(failed)
  })

  it('preserves other services when saving health', async () => {
    await saveServiceHealth('sonarr', connected)
    await saveServiceHealth('radarr', failed)

    expect(await getServiceHealthStates()).toEqual({
      sonarr: connected,
      radarr: failed,
    })
  })

  it('overwrites the previous health result for the same service', async () => {
    await saveServiceHealth('sonarr', failed)
    await saveServiceHealth('sonarr', connected)

    expect(await getServiceHealth('sonarr')).toEqual(connected)
  })

  it('preserves concurrent updates for different services', async () => {
    await Promise.all([saveServiceHealth('sonarr', connected), saveServiceHealth('radarr', failed)])

    expect(await getServiceHealthStates()).toEqual({
      sonarr: connected,
      radarr: failed,
    })
  })

  it('removes only the selected service health', async () => {
    await saveServiceHealth('sonarr', connected)
    await saveServiceHealth('radarr', failed)

    await clearServiceHealth('sonarr')

    expect(await getServiceHealth('sonarr')).toBeUndefined()
    expect(await getServiceHealth('radarr')).toEqual(failed)
  })

  it('does not write when clearing a missing service', async () => {
    await clearServiceHealth('seerr')

    expect(set).not.toHaveBeenCalled()
  })

  it('handles concurrent saves and removals in call order', async () => {
    await saveServiceHealth('sonarr', failed)

    await Promise.all([
      clearServiceHealth('sonarr'),
      saveServiceHealth('sonarr', connected),
      saveServiceHealth('radarr', failed),
    ])

    expect(await getServiceHealthStates()).toEqual({
      sonarr: connected,
      radarr: failed,
    })
  })

  it('does not expose service credentials in stored health', async () => {
    await saveServiceHealth('sonarr', connected)

    expect(JSON.stringify(stored)).not.toContain('apiKey')
    expect(JSON.stringify(stored)).not.toContain('secret')
  })

  it('throws when session storage is unavailable', async () => {
    vi.stubGlobal('chrome', undefined)

    await expect(getServiceHealthStates()).rejects.toThrow(
      'Browser extension session storage is unavailable.',
    )
  })

  it('continues processing writes after a storage failure', async () => {
    set.mockRejectedValueOnce(new Error('Storage failure'))

    await expect(saveServiceHealth('sonarr', connected)).rejects.toThrow('Storage failure')

    await expect(saveServiceHealth('radarr', failed)).resolves.toBeUndefined()

    expect(await getServiceHealth('radarr')).toEqual(failed)
  })
})
