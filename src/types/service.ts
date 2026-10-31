export type ServiceId = 'jellyfin' | 'seerr' | 'sonarr' | 'radarr' | 'qbittorrent'

export type ServiceCategory =
  'media-server' | 'request-manager' | 'media-automation' | 'download-client'

export type ServiceCapability = 'requests' | 'up-next' | 'calendar' | 'downloads'

export type ServiceIcon = 'jellyfin' | 'seerr' | 'sonarr' | 'radarr' | 'qbittorrent'

/**
 * Presentation state used by existing service UI components.
 *
 * Configuration and connection health are tracked separately.
 * This type remains available for components that display a combined status.
 */
export type ServiceState = 'not-configured' | 'configured' | 'connected' | 'failed'

/**
 * The outcome of the most recent service health check.
 *
 * An unknown status means the service has not been checked yet.
 * It does not indicate a connection failure.
 */
export type ServiceHealthStatus = 'unknown' | 'connected' | 'failed'

/**
 * Connection health is independent of saved service configuration.
 *
 * lastCheckedAt is an ISO 8601 timestamp, or null if no check has completed.
 * error contains a user-facing message when the latest check failed.
 */
export interface ServiceHealth {
  status: ServiceHealthStatus
  lastCheckedAt: string | null
  error?: string
}

/**
 * Health entries are optional because not every service has been configured
 * or checked.
 */
export type ServiceHealthStates = Partial<Record<ServiceId, ServiceHealth>>

export interface ServiceInfo {
  id: ServiceId
  name: string
  description: string
}

export interface ServiceDefinition extends ServiceInfo {
  category: ServiceCategory
  icon: ServiceIcon
  capabilities: readonly ServiceCapability[]
  configuration: {
    requiresUrl: boolean
    requiresApiKey: boolean
  }
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
