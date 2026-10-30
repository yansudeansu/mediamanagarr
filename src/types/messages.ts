import type { CalendarResult, CalendarServiceId } from './calendar'
import type { JellyfinArrivalsPage, JellyfinArrivalsQuery, JellyfinUser } from './jellyfin'
import type { QBittorrentSnapshot } from './qbittorrent'
import type { SeerrRequestsPage, SeerrRequestsQuery } from './seerr'
import type {
  SafeServiceConfigs,
  ServiceConnectionInput,
  ServiceHealthStates,
  ServiceId,
} from './service'

export interface GetServiceConfigsMessage {
  type: 'GET_SERVICE_CONFIGS'
}

export interface GetServiceHealthMessage {
  type: 'GET_SERVICE_HEALTH'
}

export interface ConnectServiceMessage {
  type: 'CONNECT_SERVICE'
  serviceId: ServiceId
  config: ServiceConnectionInput
}

export interface TestServiceConnectionMessage {
  type: 'TEST_SERVICE_CONNECTION'
  serviceId: ServiceId
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

export interface GetQBittorrentDownloadsMessage {
  type: 'GET_QBITTORRENT_DOWNLOADS'
}

export interface StartQBittorrentTorrentMessage {
  type: 'START_QBITTORRENT_TORRENT'
  hash: string
}

export interface StopQBittorrentTorrentMessage {
  type: 'STOP_QBITTORRENT_TORRENT'
  hash: string
}

export interface DeleteQBittorrentTorrentMessage {
  type: 'DELETE_QBITTORRENT_TORRENT'
  hash: string
  deleteFiles: boolean
}

export interface OpenDetachedWorkspaceMessage {
  type: 'OPEN_DETACHED_WORKSPACE'
}

export type BackgroundMessage =
  | GetServiceConfigsMessage
  | GetServiceHealthMessage
  | ConnectServiceMessage
  | TestServiceConnectionMessage
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
  | GetQBittorrentDownloadsMessage
  | StartQBittorrentTorrentMessage
  | StopQBittorrentTorrentMessage
  | DeleteQBittorrentTorrentMessage
  | OpenDetachedWorkspaceMessage

export interface GetServiceConfigsSuccess {
  success: true
  configs: SafeServiceConfigs
}

export interface GetServiceHealthSuccess {
  success: true
  health: ServiceHealthStates
}

export interface ConnectServiceSuccess {
  success: true
  serviceId: ServiceId
}

export interface TestServiceConnectionSuccess {
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

export interface GetQBittorrentDownloadsSuccess {
  success: true
  downloads: QBittorrentSnapshot
}

export interface QBittorrentTorrentActionSuccess {
  success: true
  completed: true
}

export interface OpenDetachedWorkspaceSuccess {
  success: true
  windowId: number
}

export interface BackgroundMessageFailure {
  success: false
  error: string
}

export type GetServiceConfigsResponse = GetServiceConfigsSuccess | BackgroundMessageFailure

export type GetServiceHealthResponse = GetServiceHealthSuccess | BackgroundMessageFailure

export type ConnectServiceResponse = ConnectServiceSuccess | BackgroundMessageFailure

export type TestServiceConnectionResponse = TestServiceConnectionSuccess | BackgroundMessageFailure

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

export type GetQBittorrentDownloadsResponse =
  GetQBittorrentDownloadsSuccess | BackgroundMessageFailure

export type QBittorrentTorrentActionResponse =
  QBittorrentTorrentActionSuccess | BackgroundMessageFailure

export type OpenDetachedWorkspaceResponse = OpenDetachedWorkspaceSuccess | BackgroundMessageFailure

type BackgroundResponseMap = {
  GET_SERVICE_CONFIGS: GetServiceConfigsResponse
  GET_SERVICE_HEALTH: GetServiceHealthResponse
  CONNECT_SERVICE: ConnectServiceResponse
  TEST_SERVICE_CONNECTION: TestServiceConnectionResponse
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
  GET_QBITTORRENT_DOWNLOADS: GetQBittorrentDownloadsResponse
  START_QBITTORRENT_TORRENT: QBittorrentTorrentActionResponse
  STOP_QBITTORRENT_TORRENT: QBittorrentTorrentActionResponse
  DELETE_QBITTORRENT_TORRENT: QBittorrentTorrentActionResponse
  OPEN_DETACHED_WORKSPACE: OpenDetachedWorkspaceResponse
}

export type BackgroundResponse<T extends BackgroundMessage> = BackgroundResponseMap[T['type']]
