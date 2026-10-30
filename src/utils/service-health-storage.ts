import type { ServiceHealth, ServiceHealthStates, ServiceId } from '../types/service'

const STORAGE_KEY = 'mediaManagarrServiceHealth'

interface StoredServiceHealth {
  [STORAGE_KEY]?: ServiceHealthStates
}

let pendingWrite: Promise<void> = Promise.resolve()

function getStorage() {
  if (typeof chrome === 'undefined' || !chrome.storage?.session) {
    throw new Error('Browser extension session storage is unavailable.')
  }

  return chrome.storage.session
}

function queueWrite(operation: () => Promise<void>): Promise<void> {
  const write = pendingWrite.then(operation)

  pendingWrite = write.catch(() => {
    // A failed write must not prevent later operations.
  })

  return write
}

export async function getServiceHealthStates(): Promise<ServiceHealthStates> {
  const result = (await getStorage().get(STORAGE_KEY)) as StoredServiceHealth

  return result[STORAGE_KEY] ?? {}
}

export async function getServiceHealth(serviceId: ServiceId): Promise<ServiceHealth | undefined> {
  const states = await getServiceHealthStates()

  return states[serviceId]
}

export function saveServiceHealth(serviceId: ServiceId, health: ServiceHealth): Promise<void> {
  return queueWrite(async () => {
    const states = await getServiceHealthStates()

    await getStorage().set({
      [STORAGE_KEY]: {
        ...states,
        [serviceId]: health,
      },
    })
  })
}

export function clearServiceHealth(serviceId: ServiceId): Promise<void> {
  return queueWrite(async () => {
    const states = await getServiceHealthStates()

    if (!(serviceId in states)) {
      return
    }

    const updatedStates = { ...states }
    delete updatedStates[serviceId]

    await getStorage().set({
      [STORAGE_KEY]: updatedStates,
    })
  })
}
