import type {
  BackgroundMessage,
  ConnectServiceResponse,
  GetServiceConfigsResponse,
} from '../types/messages'
import { SERVICES, type ServiceId } from '../types/service'
import { testServiceConnection } from './services/connection'
import { getHostPermission, resolveServiceConfig } from '../utils/service-config'
import {
  getSafeServiceConfigs,
  getServiceConfig,
  saveServiceConfig,
} from '../utils/service-storage'

type MessageResponse = ConnectServiceResponse | GetServiceConfigsResponse

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

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.'
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
