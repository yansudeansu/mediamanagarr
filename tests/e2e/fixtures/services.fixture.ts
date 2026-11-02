import type { ServiceConfig, ServiceConfigs, ServiceId } from '../../../src/types/service'

const urls: Record<ServiceId, string> = {
  jellyfin: 'https://jellyfin.example.test',
  seerr: 'https://seerr.example.test',
  sonarr: 'https://sonarr.example.test',
  radarr: 'https://radarr.example.test',
  qbittorrent: 'https://qbittorrent.example.test',
}

export function serviceConfig(serviceId: ServiceId): ServiceConfig {
  return {
    url: urls[serviceId],
    apiKey: `e2e-${serviceId}-api-key`,
  }
}

export function configuredServices(...serviceIds: ServiceId[]): ServiceConfigs {
  return Object.fromEntries(
    serviceIds.map((serviceId) => [serviceId, serviceConfig(serviceId)]),
  ) as ServiceConfigs
}

export const allServices = configuredServices(
  'jellyfin',
  'seerr',
  'sonarr',
  'radarr',
  'qbittorrent',
)
