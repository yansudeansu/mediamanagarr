import { SERVICES, isServiceConfigured } from '../../services/registry'
import type { ServiceConfig, ServiceHealth, ServiceId } from '../../types/service'
import { getHostPermission } from '../../utils/service-config'
import {
  clearServiceHealth,
  getServiceHealth,
  saveServiceHealth,
} from '../../utils/service-health-storage'
import { getServiceConfig, getServiceConfigs } from '../../utils/service-storage'
import { testServiceConnection } from './connection'

export const SERVICE_HEALTH_ALARM = 'mediamanagarr-service-health'

const HEALTH_INTERVAL_MINUTES = 15
const HEALTH_INTERVAL_MS = HEALTH_INTERVAL_MINUTES * 60_000

interface PendingCheck {
  generation: number
  promise: Promise<ServiceHealth | undefined>
}

const pendingChecks = new Map<ServiceId, PendingCheck>()
const generations = new Map<ServiceId, number>()
const pendingOperations = new Map<ServiceId, Promise<void>>()

function getGeneration(serviceId: ServiceId): number {
  return generations.get(serviceId) ?? 0
}

function isSameConfig(first: ServiceConfig, second: ServiceConfig): boolean {
  return first.url === second.url && first.apiKey === second.apiKey
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected connection error occurred.'
}

function isRecentlyChecked(health: ServiceHealth | undefined): boolean {
  if (!health?.lastCheckedAt) {
    return false
  }

  const checkedAt = Date.parse(health.lastCheckedAt)
  const now = Date.now()

  return Number.isFinite(checkedAt) && checkedAt <= now && now - checkedAt < HEALTH_INTERVAL_MS
}

/**
 * Serializes health operations for an individual service.
 *
 * Operations for different services remain independent.
 */
function queueServiceOperation<T>(serviceId: ServiceId, operation: () => Promise<T>): Promise<T> {
  const previous = pendingOperations.get(serviceId) ?? Promise.resolve()

  const result = previous.then(operation)

  const settled = result.then(
    () => undefined,
    () => undefined,
  )

  pendingOperations.set(serviceId, settled)

  void settled.then(() => {
    if (pendingOperations.get(serviceId) === settled) {
      pendingOperations.delete(serviceId)
    }
  })

  return result
}

/**
 * Invalidates previously recorded health and any checks already in progress.
 *
 * Call this when a saved configuration is removed or replaced.
 */
export function invalidateServiceHealth(serviceId: ServiceId): Promise<void> {
  generations.set(serviceId, getGeneration(serviceId) + 1)
  pendingChecks.delete(serviceId)

  return queueServiceOperation(serviceId, async () => {
    await clearServiceHealth(serviceId)
  })
}

/**
 * Records health only if the check still belongs to the current configuration.
 */
async function publishServiceHealth(
  serviceId: ServiceId,
  config: ServiceConfig,
  generation: number,
  health: ServiceHealth,
): Promise<ServiceHealth | undefined> {
  return queueServiceOperation(serviceId, async () => {
    if (generation !== getGeneration(serviceId)) {
      return undefined
    }

    const currentConfig = await getServiceConfig(serviceId)

    if (
      !currentConfig ||
      !isServiceConfigured(serviceId, currentConfig) ||
      !isSameConfig(config, currentConfig)
    ) {
      return undefined
    }

    const allowed = await chrome.permissions.contains({
      origins: [getHostPermission(currentConfig.url)],
    })

    if (!allowed || generation !== getGeneration(serviceId)) {
      return undefined
    }

    await saveServiceHealth(serviceId, health)

    return health
  })
}

async function checkServiceHealthInternal(
  serviceId: ServiceId,
  force: boolean,
  generation: number,
): Promise<ServiceHealth | undefined> {
  const config = await getServiceConfig(serviceId)

  if (generation !== getGeneration(serviceId)) {
    return undefined
  }

  if (!config || !isServiceConfigured(serviceId, config)) {
    await invalidateServiceHealth(serviceId)
    return undefined
  }

  const allowed = await chrome.permissions.contains({
    origins: [getHostPermission(config.url)],
  })

  if (generation !== getGeneration(serviceId)) {
    return undefined
  }

  if (!allowed) {
    await invalidateServiceHealth(serviceId)
    return undefined
  }

  const previous = await getServiceHealth(serviceId)

  if (generation !== getGeneration(serviceId)) {
    return undefined
  }

  if (!force && isRecentlyChecked(previous)) {
    return previous
  }

  let result: ServiceHealth

  try {
    await testServiceConnection(serviceId, config)

    result = {
      status: 'connected',
      lastCheckedAt: new Date().toISOString(),
    }
  } catch (error) {
    result = {
      status: 'failed',
      lastCheckedAt: new Date().toISOString(),
      error: errorMessage(error),
    }
  }

  if (generation !== getGeneration(serviceId)) {
    return undefined
  }

  return publishServiceHealth(serviceId, config, generation, result)
}

/**
 * Checks a configured service's health.
 *
 * Concurrent checks for the same generation share one promise.
 * An invalidated check cannot block a new check.
 */
export function checkServiceHealth(
  serviceId: ServiceId,
  force = false,
): Promise<ServiceHealth | undefined> {
  const generation = getGeneration(serviceId)
  const pending = pendingChecks.get(serviceId)

  if (pending && pending.generation === generation) {
    return pending.promise
  }

  const promise = checkServiceHealthInternal(serviceId, force, generation)

  pendingChecks.set(serviceId, {
    generation,
    promise,
  })

  void promise
    .finally(() => {
      if (pendingChecks.get(serviceId)?.promise === promise) {
        pendingChecks.delete(serviceId)
      }
    })
    .catch(() => {
      // The original promise carries the error to its caller.
    })

  return promise
}

/**
 * Checks configured services without overlapping checks for each service.
 */
export async function checkConfiguredServiceHealth(): Promise<void> {
  const configs = await getServiceConfigs()

  await Promise.all(
    SERVICES.filter((serviceId) => {
      const config = configs[serviceId]

      return config !== undefined && isServiceConfigured(serviceId, config)
    }).map(async (serviceId) => {
      try {
        await checkServiceHealth(serviceId)
      } catch (error) {
        console.warn(`MediaManagarr: Health check failed for ${serviceId}:`, error)
      }
    }),
  )
}

export async function initializeServiceHealthMonitor(): Promise<void> {
  await chrome.alarms.create(SERVICE_HEALTH_ALARM, {
    periodInMinutes: HEALTH_INTERVAL_MINUTES,
  })
}

export async function handleServiceHealthAlarm(alarm: chrome.alarms.Alarm): Promise<void> {
  if (alarm.name !== SERVICE_HEALTH_ALARM) {
    return
  }

  await checkConfiguredServiceHealth()
}
