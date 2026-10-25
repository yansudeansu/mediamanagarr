export const SERVICES = ['jellyfin', 'seerr', 'sonarr', 'radarr', 'qbittorrent'] as const

export type ServiceId = (typeof SERVICES)[number]

export type ServiceState = 'not-configured' | 'configured' | 'connected' | 'failed'

export interface ServiceInfo {
  id: ServiceId
  name: string
  description: string
}

export const SERVICE_INFO: Record<ServiceId, ServiceInfo> = {
  jellyfin: {
    id: 'jellyfin',
    name: 'Jellyfin',
    description: 'Recently added movies and episodes',
  },
  seerr: {
    id: 'seerr',
    name: 'Seerr',
    description: 'Media requests',
  },
  sonarr: {
    id: 'sonarr',
    name: 'Sonarr',
    description: 'TV releases and downloads',
  },
  radarr: {
    id: 'radarr',
    name: 'Radarr',
    description: 'Movie releases and downloads',
  },
  qbittorrent: {
    id: 'qbittorrent',
    name: 'qBittorrent',
    description: 'Download progress and speeds',
  },
}

export interface ServiceConfig {
  url: string
  apiKey: string
}

export type ServiceConfigs = Partial<Record<ServiceId, ServiceConfig>>

export interface SafeServiceConfig {
  url: string
  configured: boolean
}

export type SafeServiceConfigs = Partial<Record<ServiceId, SafeServiceConfig>>

export interface ServiceConnectionInput {
  url: string
  apiKey: string
}
