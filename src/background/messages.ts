import type {
  BackgroundMessage,
  ConnectServiceResponse,
  GetJellyfinUsersResponse,
  GetSeerrRequestsResponse,
  GetServiceConfigsResponse,
  RemoveServiceResponse,
  SetJellyfinUserResponse,
} from '../types/messages'
import { SEERR_REQUEST_FILTERS, type SeerrRequestsQuery } from '../types/seerr'
import { SERVICES, type ServiceConfig, type ServiceId } from '../types/service'
import { testServiceConnection } from './services/connection'
import { fetchJellyfinUsers } from './services/jellyfin-users'
import { fetchSeerrRequests } from './services/seerr-requests'
import { getHostPermission, resolveServiceConfig } from '../utils/service-config'
import {
  getSafeServiceConfigs,
  getServiceConfig,
  removeServiceConfig,
  saveServiceConfig,
} from '../utils/service-storage'
import {
  clearJellyfinUserSelection,
  getJellyfinUserSelection,
  saveJellyfinUserSelection,
} from '../utils/jellyfin-storage'

type MessageResponse =
  | ConnectServiceResponse
  | GetServiceConfigsResponse
  | RemoveServiceResponse
  | GetJellyfinUsersResponse
  | SetJellyfinUserResponse
  | GetSeerrRequestsResponse

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isServiceId(value: unknown): value is ServiceId {
  return typeof value === 'string' && SERVICES.some((service) => service === value)
}

function isConnectMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'CONNECT_SERVICE' }> {
  if (!isRecord(value) || !isRecord(value.config)) {
    return false
  }

  return (
    value.type === 'CONNECT_SERVICE' &&
    isServiceId(value.serviceId) &&
    typeof value.config.url === 'string' &&
    typeof value.config.apiKey === 'string'
  )
}

function isRemoveMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'REMOVE_SERVICE' }> {
  return isRecord(value) && value.type === 'REMOVE_SERVICE' && isServiceId(value.serviceId)
}

function isSetJellyfinUserMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'SET_JELLYFIN_USER' }> {
  return (
    isRecord(value) &&
    value.type === 'SET_JELLYFIN_USER' &&
    typeof value.userId === 'string' &&
    value.userId.trim().length > 0
  )
}

function isSeerrRequestsMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'GET_SEERR_REQUESTS' }> {
  if (!isRecord(value) || value.type !== 'GET_SEERR_REQUESTS') {
    return false
  }

  const { page, pageSize, filter } = value

  if (page !== undefined && (typeof page !== 'number' || !Number.isSafeInteger(page) || page < 1)) {
    return false
  }

  if (
    pageSize !== undefined &&
    (typeof pageSize !== 'number' ||
      !Number.isSafeInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 100)
  ) {
    return false
  }

  if (
    filter !== undefined &&
    (typeof filter !== 'string' || !SEERR_REQUEST_FILTERS.some((candidate) => candidate === filter))
  ) {
    return false
  }

  const normalizedPage = page ?? 1
  const normalizedPageSize = pageSize ?? 10

  return Number.isSafeInteger((normalizedPage - 1) * normalizedPageSize)
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.'
}

async function getConfiguredService(
  serviceId: ServiceId,
  missingConfigMessage: string,
  missingPermissionMessage: string,
): Promise<ServiceConfig> {
  const config = await getServiceConfig(serviceId)

  if (!config) {
    throw new Error(missingConfigMessage)
  }

  const permission = getHostPermission(config.url)

  const allowed = await chrome.permissions.contains({
    origins: [permission],
  })

  if (!allowed) {
    throw new Error(missingPermissionMessage)
  }

  return config
}

async function getConfiguredJellyfin(): Promise<ServiceConfig> {
  return getConfiguredService(
    'jellyfin',
    'Configure Jellyfin before selecting a user.',
    'Jellyfin server access has not been granted.',
  )
}

async function getConfiguredSeerr(): Promise<ServiceConfig> {
  return getConfiguredService(
    'seerr',
    'Configure Seerr before viewing requests.',
    'Seerr server access has not been granted.',
  )
}

export async function handleBackgroundMessage(message: unknown): Promise<MessageResponse> {
  try {
    if (isRecord(message)) {
      if (message.type === 'GET_SERVICE_CONFIGS') {
        return {
          success: true,
          configs: await getSafeServiceConfigs(),
        }
      }

      if (message.type === 'REMOVE_SERVICE') {
        if (!isRemoveMessage(message)) {
          return {
            success: false,
            error: 'Invalid background message.',
          }
        }

        if (message.serviceId === 'jellyfin') {
          await clearJellyfinUserSelection()
        }

        await removeServiceConfig(message.serviceId)

        return {
          success: true,
          serviceId: message.serviceId,
        }
      }

      if (message.type === 'GET_JELLYFIN_USERS') {
        const config = await getConfiguredJellyfin()
        const users = await fetchJellyfinUsers(config)
        const selectedUserId = await getJellyfinUserSelection(config.url)

        return {
          success: true,
          users,
          selectedUserId: users.some((user) => user.id === selectedUserId) ? selectedUserId : '',
        }
      }

      if (message.type === 'SET_JELLYFIN_USER') {
        if (!isSetJellyfinUserMessage(message)) {
          return {
            success: false,
            error: 'Invalid background message.',
          }
        }

        const config = await getConfiguredJellyfin()
        const users = await fetchJellyfinUsers(config)
        const userId = message.userId.trim()

        if (!users.some((user) => user.id === userId)) {
          throw new Error('Selected Jellyfin user was not found.')
        }

        await saveJellyfinUserSelection(config.url, userId)

        return {
          success: true,
          userId,
        }
      }

      if (message.type === 'GET_SEERR_REQUESTS') {
        if (!isSeerrRequestsMessage(message)) {
          return {
            success: false,
            error: 'Invalid background message.',
          }
        }

        const config = await getConfiguredSeerr()

        const query: SeerrRequestsQuery = {
          page: message.page,
          pageSize: message.pageSize,
          filter: message.filter,
        }

        const requests = await fetchSeerrRequests(config, query)

        return {
          success: true,
          requests,
        }
      }
    }

    if (!isConnectMessage(message)) {
      return {
        success: false,
        error: 'Invalid background message.',
      }
    }

    const existing = await getServiceConfig(message.serviceId)
    const config = resolveServiceConfig(message.config, existing)
    const permission = getHostPermission(config.url)

    const allowed = await chrome.permissions.contains({
      origins: [permission],
    })

    if (!allowed) {
      return {
        success: false,
        error: 'Server access has not been granted. Please allow access and try again.',
      }
    }

    await testServiceConnection(message.serviceId, config)
    await saveServiceConfig(message.serviceId, config)

    return {
      success: true,
      serviceId: message.serviceId,
    }
  } catch (error) {
    return {
      success: false,
      error: errorMessage(error),
    }
  }
}
