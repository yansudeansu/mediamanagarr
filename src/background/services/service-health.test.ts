import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ServiceConfig, ServiceHealth, ServiceId } from '../../types/service'
import { getHostPermission } from '../../utils/service-config'
import {
  clearServiceHealth,
  getServiceHealth,
  saveServiceHealth,
} from '../../utils/service-health-storage'
import { getServiceConfig, getServiceConfigs } from '../../utils/service-storage'
import { testServiceConnection } from './connection'
import {
  checkConfiguredServiceHealth,
  checkServiceHealth,
  handleServiceHealthAlarm,
  initializeServiceHealthMonitor,
  invalidateServiceHealth,
  SERVICE_HEALTH_ALARM,
} from './service-health'

vi.mock('../../utils/service-health-storage', () => ({
  clearServiceHealth: vi.fn(),
  getServiceHealth: vi.fn(),
  saveServiceHealth: vi.fn(),
}))

vi.mock('../../utils/service-storage', () => ({
  getServiceConfig: vi.fn(),
  getServiceConfigs: vi.fn(),
}))

vi.mock('./connection', () => ({
  testServiceConnection: vi.fn(),
}))

const sonarrConfig: ServiceConfig = {
  url: 'https://sonarr.example.com',
  apiKey: 'sonarr-key',
}

const radarrConfig: ServiceConfig = {
  url: 'https://radarr.example.com',
  apiKey: 'radarr-key',
}

const connected: ServiceHealth = {
  status: 'connected',
  lastCheckedAt: '2026-10-31T12:00:00.000Z',
}

const failed: ServiceHealth = {
  status: 'failed',
  lastCheckedAt: '2026-10-31T12:00:00.000Z',
  error: 'Unable to reach the server.',
}

const contains = vi.fn()
const createAlarm = vi.fn()

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

describe('service health monitor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()

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

    vi.mocked(getServiceConfig).mockImplementation(async (serviceId: ServiceId) => {
      if (serviceId === 'sonarr') return sonarrConfig
      if (serviceId === 'radarr') return radarrConfig
      return undefined
    })

    vi.mocked(getServiceConfigs).mockResolvedValue({
      sonarr: sonarrConfig,
      radarr: radarrConfig,
    })

    vi.mocked(getServiceHealth).mockResolvedValue(undefined)
    vi.mocked(clearServiceHealth).mockResolvedValue(undefined)
    vi.mocked(saveServiceHealth).mockResolvedValue(undefined)
    vi.mocked(testServiceConnection).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('creates the periodic health alarm', async () => {
    await initializeServiceHealthMonitor()

    expect(createAlarm).toHaveBeenCalledWith(SERVICE_HEALTH_ALARM, {
      periodInMinutes: 15,
    })
  })

  it('ignores unrelated alarms', async () => {
    await handleServiceHealthAlarm({
      name: 'some-other-alarm',
    } as chrome.alarms.Alarm)

    expect(getServiceConfigs).not.toHaveBeenCalled()
    expect(testServiceConnection).not.toHaveBeenCalled()
  })

  it('checks configured services when the health alarm fires', async () => {
    await handleServiceHealthAlarm({
      name: SERVICE_HEALTH_ALARM,
    } as chrome.alarms.Alarm)

    expect(testServiceConnection).toHaveBeenCalledWith('sonarr', sonarrConfig)
    expect(testServiceConnection).toHaveBeenCalledWith('radarr', radarrConfig)
    expect(testServiceConnection).toHaveBeenCalledTimes(2)
  })

  it('does not check services that are not configured', async () => {
    vi.mocked(getServiceConfigs).mockResolvedValue({
      sonarr: sonarrConfig,
    })

    await checkConfiguredServiceHealth()

    expect(testServiceConnection).toHaveBeenCalledOnce()
    expect(testServiceConnection).toHaveBeenCalledWith('sonarr', sonarrConfig)
  })

  it('clears health when a service has no saved configuration', async () => {
    vi.mocked(getServiceConfig).mockResolvedValue(undefined)

    await expect(checkServiceHealth('sonarr')).resolves.toBeUndefined()

    expect(clearServiceHealth).toHaveBeenCalledWith('sonarr')
    expect(testServiceConnection).not.toHaveBeenCalled()
  })

  it('does not contact services without host permission', async () => {
    contains.mockResolvedValue(false)

    await expect(checkServiceHealth('sonarr')).resolves.toBeUndefined()

    expect(clearServiceHealth).toHaveBeenCalledWith('sonarr')
    expect(testServiceConnection).not.toHaveBeenCalled()
  })

  it('checks the configured service host permission', async () => {
    await checkServiceHealth('sonarr')

    expect(contains).toHaveBeenCalledWith({
      origins: [getHostPermission(sonarrConfig.url)],
    })
  })

  it('stores a successful connection result', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-31T12:00:00.000Z'))

    const result = await checkServiceHealth('sonarr')

    expect(result).toEqual(connected)
    expect(saveServiceHealth).toHaveBeenCalledWith('sonarr', connected)
  })

  it('stores a failed connection result without removing configuration', async () => {
    vi.mocked(testServiceConnection).mockRejectedValue(new Error('Unable to reach the server.'))

    const result = await checkServiceHealth('sonarr')

    expect(result).toMatchObject({
      status: 'failed',
      error: 'Unable to reach the server.',
    })

    expect(saveServiceHealth).toHaveBeenCalledWith(
      'sonarr',
      expect.objectContaining({
        status: 'failed',
        error: 'Unable to reach the server.',
      }),
    )

    expect(clearServiceHealth).not.toHaveBeenCalled()
  })

  it('detects recovery after a previously failed check', async () => {
    vi.mocked(getServiceHealth).mockResolvedValue(failed)

    const result = await checkServiceHealth('sonarr', true)

    expect(result?.status).toBe('connected')

    expect(saveServiceHealth).toHaveBeenCalledWith(
      'sonarr',
      expect.objectContaining({
        status: 'connected',
      }),
    )
  })

  it('reuses recent health results during scheduled checks', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-31T12:05:00.000Z'))

    vi.mocked(getServiceHealth).mockResolvedValue(connected)

    const result = await checkServiceHealth('sonarr')

    expect(result).toEqual(connected)
    expect(testServiceConnection).not.toHaveBeenCalled()
    expect(saveServiceHealth).not.toHaveBeenCalled()
  })

  it('rechecks services when their previous health result is stale', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-31T12:16:00.000Z'))

    vi.mocked(getServiceHealth).mockResolvedValue(connected)

    await checkServiceHealth('sonarr')

    expect(testServiceConnection).toHaveBeenCalledOnce()
    expect(saveServiceHealth).toHaveBeenCalledOnce()
  })

  it('forces a new check even when the previous result is recent', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-31T12:05:00.000Z'))

    vi.mocked(getServiceHealth).mockResolvedValue(connected)

    await checkServiceHealth('sonarr', true)

    expect(testServiceConnection).toHaveBeenCalledOnce()
  })

  it('shares an in-flight check between concurrent callers', async () => {
    const pending = deferred<void>()

    vi.mocked(testServiceConnection).mockReturnValueOnce(pending.promise)

    const first = checkServiceHealth('sonarr')
    const second = checkServiceHealth('sonarr')

    expect(first).toBe(second)

    pending.resolve()

    await Promise.all([first, second])

    expect(testServiceConnection).toHaveBeenCalledOnce()
    expect(saveServiceHealth).toHaveBeenCalledOnce()
  })

  it('allows another check after the previous check completes', async () => {
    await checkServiceHealth('sonarr')
    await checkServiceHealth('sonarr', true)

    expect(testServiceConnection).toHaveBeenCalledTimes(2)
  })

  it('discards results when the configuration changes during a check', async () => {
    const pending = deferred<void>()

    vi.mocked(testServiceConnection).mockReturnValueOnce(pending.promise)

    const check = checkServiceHealth('sonarr')

    await vi.waitFor(() => {
      expect(testServiceConnection).toHaveBeenCalledOnce()
    })

    vi.mocked(getServiceConfig).mockResolvedValue({
      url: 'https://new-sonarr.example.com',
      apiKey: 'new-key',
    })

    pending.resolve()

    await expect(check).resolves.toBeUndefined()

    expect(saveServiceHealth).not.toHaveBeenCalled()
  })

  it('discards results when the configuration is removed during a check', async () => {
    const pending = deferred<void>()

    vi.mocked(testServiceConnection).mockReturnValueOnce(pending.promise)

    const check = checkServiceHealth('sonarr')

    await vi.waitFor(() => {
      expect(testServiceConnection).toHaveBeenCalledOnce()
    })

    vi.mocked(getServiceConfig).mockResolvedValue(undefined)

    pending.resolve()

    await expect(check).resolves.toBeUndefined()

    expect(saveServiceHealth).not.toHaveBeenCalled()
  })

  it('clears stored health when invalidated', async () => {
    await invalidateServiceHealth('sonarr')

    expect(clearServiceHealth).toHaveBeenCalledWith('sonarr')
    expect(testServiceConnection).not.toHaveBeenCalled()
  })

  it('discards an in-flight check after invalidation', async () => {
    const pending = deferred<void>()

    vi.mocked(testServiceConnection).mockReturnValueOnce(pending.promise)

    const check = checkServiceHealth('sonarr')

    await vi.waitFor(() => {
      expect(testServiceConnection).toHaveBeenCalledOnce()
    })

    await invalidateServiceHealth('sonarr')

    pending.resolve()

    await expect(check).resolves.toBeUndefined()

    expect(saveServiceHealth).not.toHaveBeenCalled()
    expect(clearServiceHealth).toHaveBeenCalledWith('sonarr')
  })

  it('allows a new check while an invalidated check is still running', async () => {
    const oldRequest = deferred<void>()

    vi.mocked(testServiceConnection)
      .mockReturnValueOnce(oldRequest.promise)
      .mockResolvedValueOnce(undefined)

    const oldCheck = checkServiceHealth('sonarr')

    await vi.waitFor(() => {
      expect(testServiceConnection).toHaveBeenCalledOnce()
    })

    await invalidateServiceHealth('sonarr')

    const newCheck = checkServiceHealth('sonarr')

    await expect(newCheck).resolves.toMatchObject({
      status: 'connected',
    })

    expect(testServiceConnection).toHaveBeenCalledTimes(2)

    oldRequest.resolve()

    await expect(oldCheck).resolves.toBeUndefined()

    expect(saveServiceHealth).toHaveBeenCalledOnce()
  })

  it('clears a pending health write after it finishes', async () => {
    const write = deferred<void>()

    vi.mocked(saveServiceHealth).mockReturnValueOnce(write.promise)

    const check = checkServiceHealth('sonarr')

    await vi.waitFor(() => {
      expect(saveServiceHealth).toHaveBeenCalledOnce()
    })

    const invalidation = invalidateServiceHealth('sonarr')

    expect(clearServiceHealth).not.toHaveBeenCalled()

    write.resolve()

    await Promise.all([check, invalidation])

    expect(clearServiceHealth).toHaveBeenCalledWith('sonarr')

    const writeOrder = vi.mocked(saveServiceHealth).mock.invocationCallOrder[0]
    const clearOrder = vi.mocked(clearServiceHealth).mock.invocationCallOrder[0]

    expect(writeOrder).toBeLessThan(clearOrder)
  })

  it('does not publish health when permission is revoked during a check', async () => {
    const pending = deferred<void>()

    vi.mocked(testServiceConnection).mockReturnValueOnce(pending.promise)

    const check = checkServiceHealth('sonarr')

    await vi.waitFor(() => {
      expect(testServiceConnection).toHaveBeenCalledOnce()
    })

    contains.mockResolvedValue(false)

    pending.resolve()

    await expect(check).resolves.toBeUndefined()

    expect(saveServiceHealth).not.toHaveBeenCalled()
  })

  it('checks different services independently', async () => {
    const sonarrRequest = deferred<void>()

    vi.mocked(testServiceConnection).mockImplementation((serviceId) => {
      if (serviceId === 'sonarr') {
        return sonarrRequest.promise
      }

      return Promise.resolve()
    })

    const sonarrCheck = checkServiceHealth('sonarr')
    const radarrCheck = checkServiceHealth('radarr')

    await expect(radarrCheck).resolves.toMatchObject({
      status: 'connected',
    })

    expect(testServiceConnection).toHaveBeenCalledWith('radarr', radarrConfig)

    sonarrRequest.resolve()

    await expect(sonarrCheck).resolves.toMatchObject({
      status: 'connected',
    })
  })

  it('continues checking other services when one check fails unexpectedly', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    vi.mocked(getServiceConfig).mockImplementation(async (serviceId: ServiceId) => {
      if (serviceId === 'sonarr') {
        throw new Error('Storage unavailable')
      }

      if (serviceId === 'radarr') {
        return radarrConfig
      }

      return undefined
    })

    await expect(checkConfiguredServiceHealth()).resolves.toBeUndefined()

    expect(testServiceConnection).toHaveBeenCalledWith('radarr', radarrConfig)

    expect(warn).toHaveBeenCalledWith(
      'MediaManagarr: Health check failed for sonarr:',
      expect.any(Error),
    )
  })
})
