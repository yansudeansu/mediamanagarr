import type {
  ServiceCapability,
  ServiceConfig,
  ServiceConfigs,
  ServiceDefinition,
  ServiceId,
} from '../types/service'

export const SERVICE_REGISTRY = {
  jellyfin: {
    id: 'jellyfin',
    name: 'Jellyfin',
    description: 'Recently added movies and episodes',
    category: 'media-server',
    icon: 'jellyfin',
    capabilities: ['up-next'],
    configuration: {
      requiresUrl: true,
      requiresApiKey: true,
    },
  },
  seerr: {
    id: 'seerr',
    name: 'Seerr',
    description: 'Media requests',
    category: 'request-manager',
    icon: 'seerr',
    capabilities: ['requests'],
    configuration: {
      requiresUrl: true,
      requiresApiKey: true,
    },
  },
  sonarr: {
    id: 'sonarr',
    name: 'Sonarr',
    description: 'TV releases and downloads',
    category: 'media-automation',
    icon: 'sonarr',
    capabilities: ['calendar'],
    configuration: {
      requiresUrl: true,
      requiresApiKey: true,
    },
  },
  radarr: {
    id: 'radarr',
    name: 'Radarr',
    description: 'Movie releases and downloads',
    category: 'media-automation',
    icon: 'radarr',
    capabilities: ['calendar'],
    configuration: {
      requiresUrl: true,
      requiresApiKey: true,
    },
  },
  qbittorrent: {
    id: 'qbittorrent',
    name: 'qBittorrent',
    description: 'Download progress and speeds',
    category: 'download-client',
    icon: 'qbittorrent',
    capabilities: ['downloads'],
    configuration: {
      requiresUrl: true,
      requiresApiKey: true,
    },
  },
} as const satisfies Record<ServiceId, ServiceDefinition>

export const SERVICES: readonly ServiceId[] = Object.keys(SERVICE_REGISTRY) as ServiceId[]

export function isServiceId(value: unknown): value is ServiceId {
  return typeof value === 'string' && Object.hasOwn(SERVICE_REGISTRY, value)
}

export function serviceHasCapability(serviceId: ServiceId, capability: ServiceCapability): boolean {
  return (SERVICE_REGISTRY[serviceId].capabilities as readonly ServiceCapability[]).includes(
    capability,
  )
}

export function isServiceConfigured(
  serviceId: ServiceId,
  config: ServiceConfig | undefined,
): boolean {
  if (!config) {
    return false
  }

  const { requiresUrl, requiresApiKey } = SERVICE_REGISTRY[serviceId].configuration

  return (
    (!requiresUrl || config.url.trim().length > 0) &&
    (!requiresApiKey || config.apiKey.trim().length > 0)
  )
}

export function getConfiguredServices(configs: ServiceConfigs): ServiceId[] {
  return SERVICES.filter((serviceId) => isServiceConfigured(serviceId, configs[serviceId]))
}
