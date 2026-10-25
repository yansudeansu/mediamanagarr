import type {
  BackgroundMessage,
  ConnectServiceResponse,
  GetJellyfinUsersResponse,
  GetServiceConfigsResponse,
  RemoveServiceResponse,
  SetJellyfinUserResponse,
} from '../types/messages'
import { SERVICES, type ServiceConfig, type ServiceId } from '../types/service'
import { testServiceConnection } from './services/connection'
import { fetchJellyfinUsers } from './services/jellyfin-users'
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

function isServiceId(value: unknown): value is ServiceId {
  return typeof value === 'string' && SERVICES.some((service) => service === value)
}

function isConnectMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'CONNECT_SERVICE' }> {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const message = value as Record<string, unknown>
  const config = message.config

  if (config === null || typeof config !== 'object') {
    return false
  }

  const input = config as Record<string, unknown>

  return (
    message.type === 'CONNECT_SERVICE' &&
    isServiceId(message.serviceId) &&
    typeof input.url === 'string' &&
    typeof input.apiKey === 'string'
  )
}

function isRemoveMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'REMOVE_SERVICE' }> {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const message = value as Record<string, unknown>

  return message.type === 'REMOVE_SERVICE' && isServiceId(message.serviceId)
}

function isSetJellyfinUserMessage(
  value: unknown,
): value is Extract<BackgroundMessage, { type: 'SET_JELLYFIN_USER' }> {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const message = value as Record<string, unknown>

  return (
    message.type === 'SET_JELLYFIN_USER' &&
    typeof message.userId === 'string' &&
    message.userId.trim().length > 0
  )
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.'
}

async function getConfiguredJellyfin(): Promise<ServiceConfig> {
  const config = await getServiceConfig('jellyfin')

  if (!config) {
    throw new Error('Configure Jellyfin before selecting a user.')
  }

  const permission = getHostPermission(config.url)
  const allowed = await chrome.permissions.contains({
    origins: [permission],
  })

  if (!allowed) {
    throw new Error('Jellyfin server access has not been granted.')
  }

  return config
}

export async function handleBackgroundMessage(message: unknown): Promise<MessageResponse> {
  try {
    if (message !== null && typeof message === 'object' && 'type' in message) {
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
