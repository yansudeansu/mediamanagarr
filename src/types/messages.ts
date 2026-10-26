import type { CalendarResult, CalendarServiceId } from './calendar'
import type { JellyfinArrivalsPage, JellyfinArrivalsQuery, JellyfinUser } from './jellyfin'
import type { SeerrRequestsPage, SeerrRequestsQuery } from './seerr'
import type { SafeServiceConfigs, ServiceConnectionInput, ServiceId } from './service'

export interface GetServiceConfigsMessage {
  type: 'GET_SERVICE_CONFIGS'
}

export interface ConnectServiceMessage {
  type: 'CONNECT_SERVICE'
  serviceId: ServiceId
  config: ServiceConnectionInput
}

export interface RemoveServiceMessage {
  type: 'REMOVE_SERVICE'
  serviceId: ServiceId
}

export interface GetJellyfinUsersMessage {
  type: 'GET_JELLYFIN_USERS'
}

export interface SetJellyfinUserMessage {
  type: 'SET_JELLYFIN_USER'
  userId: string
}

export interface GetJellyfinArrivalsMessage extends JellyfinArrivalsQuery {
  type: 'GET_JELLYFIN_ARRIVALS'
}

export interface GetJellyfinImageMessage {
  type: 'GET_JELLYFIN_IMAGE'
  itemId: string
  imageTag: string | null
}

export interface GetCalendarImageMessage {
  type: 'GET_CALENDAR_IMAGE'
  service: CalendarServiceId
  mediaId: number
}

export interface SetJellyfinArrivalUnreadMessage {
  type: 'SET_JELLYFIN_ARRIVAL_UNREAD'
  itemId: string
  unread: boolean
}

export interface ClearJellyfinNotificationsMessage {
  type: 'CLEAR_JELLYFIN_NOTIFICATIONS'
}

export interface GetSeerrRequestsMessage extends SeerrRequestsQuery {
  type: 'GET_SEERR_REQUESTS'
}

export interface GetCalendarMessage {
  type: 'GET_CALENDAR'
  start: string
  end: string
}

export type BackgroundMessage =
  | GetServiceConfigsMessage
  | ConnectServiceMessage
  | RemoveServiceMessage
  | GetJellyfinUsersMessage
  | SetJellyfinUserMessage
  | GetJellyfinArrivalsMessage
  | GetJellyfinImageMessage
  | GetCalendarImageMessage
  | SetJellyfinArrivalUnreadMessage
  | ClearJellyfinNotificationsMessage
  | GetSeerrRequestsMessage
  | GetCalendarMessage

export interface GetServiceConfigsSuccess {
  success: true
  configs: SafeServiceConfigs
}

export interface ConnectServiceSuccess {
  success: true
  serviceId: ServiceId
}

export interface RemoveServiceSuccess {
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

export interface GetJellyfinArrivalsSuccess {
  success: true
  arrivals: JellyfinArrivalsPage
  unreadCount: number
}

export interface GetJellyfinImageSuccess {
  success: true
  image: string | null
}

export interface GetCalendarImageSuccess {
  success: true
  image: string | null
}

export interface SetJellyfinArrivalUnreadSuccess {
  success: true
  unreadCount: number
}

export interface ClearJellyfinNotificationsSuccess {
  success: true
  unreadCount: number
}

export interface GetSeerrRequestsSuccess {
  success: true
  requests: SeerrRequestsPage
}

export interface GetCalendarSuccess {
  success: true
  calendar: CalendarResult
}

export interface BackgroundMessageFailure {
  success: false
  error: string
}

export type GetServiceConfigsResponse = GetServiceConfigsSuccess | BackgroundMessageFailure
export type ConnectServiceResponse = ConnectServiceSuccess | BackgroundMessageFailure
export type RemoveServiceResponse = RemoveServiceSuccess | BackgroundMessageFailure
export type GetJellyfinUsersResponse = GetJellyfinUsersSuccess | BackgroundMessageFailure
export type SetJellyfinUserResponse = SetJellyfinUserSuccess | BackgroundMessageFailure
export type GetJellyfinArrivalsResponse = GetJellyfinArrivalsSuccess | BackgroundMessageFailure
export type GetJellyfinImageResponse = GetJellyfinImageSuccess | BackgroundMessageFailure
export type GetCalendarImageResponse = GetCalendarImageSuccess | BackgroundMessageFailure

export type SetJellyfinArrivalUnreadResponse =
  SetJellyfinArrivalUnreadSuccess | BackgroundMessageFailure

export type ClearJellyfinNotificationsResponse =
  ClearJellyfinNotificationsSuccess | BackgroundMessageFailure

export type GetSeerrRequestsResponse = GetSeerrRequestsSuccess | BackgroundMessageFailure
export type GetCalendarResponse = GetCalendarSuccess | BackgroundMessageFailure

type BackgroundResponseMap = {
  GET_SERVICE_CONFIGS: GetServiceConfigsResponse
  CONNECT_SERVICE: ConnectServiceResponse
  REMOVE_SERVICE: RemoveServiceResponse
  GET_JELLYFIN_USERS: GetJellyfinUsersResponse
  SET_JELLYFIN_USER: SetJellyfinUserResponse
  GET_JELLYFIN_ARRIVALS: GetJellyfinArrivalsResponse
  GET_JELLYFIN_IMAGE: GetJellyfinImageResponse
  GET_CALENDAR_IMAGE: GetCalendarImageResponse
  SET_JELLYFIN_ARRIVAL_UNREAD: SetJellyfinArrivalUnreadResponse
  CLEAR_JELLYFIN_NOTIFICATIONS: ClearJellyfinNotificationsResponse
  GET_SEERR_REQUESTS: GetSeerrRequestsResponse
  GET_CALENDAR: GetCalendarResponse
}

export type BackgroundResponse<T extends BackgroundMessage> = BackgroundResponseMap[T['type']]
