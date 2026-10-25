import type { SafeServiceConfigs, ServiceConnectionInput, ServiceId } from './service'

export interface GetServiceConfigsMessage {
  type: 'GET_SERVICE_CONFIGS'
}

export interface ConnectServiceMessage {
  type: 'CONNECT_SERVICE'
  serviceId: ServiceId
  config: ServiceConnectionInput
}

export type BackgroundMessage = GetServiceConfigsMessage | ConnectServiceMessage

export interface GetServiceConfigsSuccess {
  success: true
  configs: SafeServiceConfigs
}

export interface ConnectServiceSuccess {
  success: true
  serviceId: ServiceId
}

export interface BackgroundMessageFailure {
  success: false
  error: string
}

export type GetServiceConfigsResponse = GetServiceConfigsSuccess | BackgroundMessageFailure

export type ConnectServiceResponse = ConnectServiceSuccess | BackgroundMessageFailure

export type BackgroundResponse<T extends BackgroundMessage> = T extends GetServiceConfigsMessage
  ? GetServiceConfigsResponse
  : T extends ConnectServiceMessage
    ? ConnectServiceResponse
    : never
