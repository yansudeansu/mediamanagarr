import {
  SERVICES,
  type SafeServiceConfigs,
  type ServiceConfig,
  type ServiceConfigs,
  type ServiceId,
} from '../types/service'

const STORAGE_KEY = 'mediaManagarrServices'

interface StoredServices {
  [STORAGE_KEY]?: ServiceConfigs
}

function getStorage() {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    throw new Error('Browser extension storage is unavailable.')
  }

  return chrome.storage.local
}

export async function getServiceConfigs(): Promise<ServiceConfigs> {
  const result = (await getStorage().get(STORAGE_KEY)) as StoredServices

  return result[STORAGE_KEY] ?? {}
}

export async function getServiceConfig(serviceId: ServiceId): Promise<ServiceConfig | undefined> {
  const configs = await getServiceConfigs()

  return configs[serviceId]
}

export async function getSafeServiceConfigs(): Promise<SafeServiceConfigs> {
  const configs = await getServiceConfigs()
  const safeConfigs: SafeServiceConfigs = {}

  for (const serviceId of SERVICES) {
    const config = configs[serviceId]

    if (!config) continue

    safeConfigs[serviceId] = {
      url: config.url,
      configured: true,
    }
  }

  return safeConfigs
}

export async function saveServiceConfig(
  serviceId: ServiceId,
  config: ServiceConfig,
): Promise<void> {
  const configs = await getServiceConfigs()

  await getStorage().set({
    [STORAGE_KEY]: {
      ...configs,
      [serviceId]: config,
    },
  })
}

export async function removeServiceConfig(serviceId: ServiceId): Promise<void> {
  const configs = await getServiceConfigs()

  delete configs[serviceId]

  await getStorage().set({
    [STORAGE_KEY]: configs,
  })
}
