export interface QBittorrentTorrent {
  hash: string
  name: string
  progress: number
  state: string
  downloadSpeed: number
  uploadSpeed: number
  eta: number
  size: number
  downloaded: number
}

export interface QBittorrentSnapshot {
  torrents: QBittorrentTorrent[]
  downloadSpeed: number
  uploadSpeed: number
}

export type QBittorrentTorrentAction = 'start' | 'stop' | 'remove'

export interface QBittorrentPendingAction {
  hash: string
  action: QBittorrentTorrentAction
}
