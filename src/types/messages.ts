import type { JellyfinUser } from './jellyfin'
import type { SafeServiceConfigs, ServiceConnectionInput, ServiceId } from './service'

export interface GetServiceConfigsMessage {
  type: 'GET_SERVICE_CONFIGS'
}

export interface ConnectServiceMessage {
  type: 'CONNECT_SERVICE'
  serviceId: ServiceId
  config: ServiceConnectionInput
}

export interface GetJellyfinUsersMessage {
  type: 'GET_JELLYFIN_USERS'
}

export interface SetJellyfinUserMessage {
  type: 'SET_JELLYFIN_USER'
  userId: string
}

export type BackgroundMessage =
  | GetServiceConfigsMessage
  | ConnectServiceMessage
  | GetJellyfinUsersMessage
  | SetJellyfinUserMessage

export interface GetServiceConfigsSuccess {
  success: true
  configs: SafeServiceConfigs
}

export interface ConnectServiceSuccess {
  success: true
  serviceId: ServiceId
}

export interface GetJellyfinUsersSuccess {
  success: true
  users: JellyfinUser[]
  selectedUserId: string
}

export interface SetJellyfinUserSuccess {
  success: true
  userId: string
}

export interface BackgroundMessageFailure {
  success: false
  error: string
}

export type GetServiceConfigsResponse = GetServiceConfigsSuccess | BackgroundMessageFailure

export type ConnectServiceResponse = ConnectServiceSuccess | BackgroundMessageFailure

export type GetJellyfinUsersResponse = GetJellyfinUsersSuccess | BackgroundMessageFailure

export type SetJellyfinUserResponse = SetJellyfinUserSuccess | BackgroundMessageFailure

export type BackgroundResponse<T extends BackgroundMessage> = T extends GetServiceConfigsMessage
  ? GetServiceConfigsResponse
  : T extends ConnectServiceMessage
    ? ConnectServiceResponse
    : T extends GetJellyfinUsersMessage
      ? GetJellyfinUsersResponse
      : T extends SetJellyfinUserMessage
        ? SetJellyfinUserResponse
        : never
