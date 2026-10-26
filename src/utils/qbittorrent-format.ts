const BYTE_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB'] as const

const TORRENT_STATUSES: Record<string, string> = {
  downloading: 'Downloading',
  forcedDL: 'Downloading',

  metaDL: 'Fetching metadata',
  forcedMetaDL: 'Fetching metadata',

  stalledDL: 'Stalled',
  queuedDL: 'Queued',
  checkingDL: 'Checking',

  pausedDL: 'Stopped',
  stoppedDL: 'Stopped',

  uploading: 'Seeding',
  forcedUP: 'Seeding',
  stalledUP: 'Seeding',

  queuedUP: 'Queued',
  checkingUP: 'Checking',

  pausedUP: 'Stopped',
  stoppedUP: 'Stopped',

  error: 'Error',
  missingFiles: 'Missing files',

  moving: 'Moving',
  allocating: 'Allocating',
  checkingResumeData: 'Checking',
}

const STOPPED_STATES = new Set(['pausedDL', 'pausedUP', 'stoppedDL', 'stoppedUP'])

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B'
  }

  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1)

  const value = bytes / 1024 ** exponent

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${BYTE_UNITS[exponent]}`
}

export function formatSpeed(bytesPerSecond: number): string {
  return `${formatBytes(bytesPerSecond)}/s`
}

export function formatEta(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0 || seconds >= 8_640_000) {
    return 'Unknown'
  }

  if (seconds === 0) {
    return 'Complete'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours >= 24) {
    return `${Math.floor(hours / 24)}d ${hours % 24}h`
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${Math.max(1, minutes)}m`
}

export function formatTorrentStatus(state: string): string {
  return TORRENT_STATUSES[state] ?? state
}

export function isTorrentStopped(state: string): boolean {
  return STOPPED_STATES.has(state)
}

export function formatProgress(progress: number): string {
  if (!Number.isFinite(progress)) {
    return '0.0%'
  }

  const percentage = Math.min(100, Math.max(0, progress * 100))

  return `${percentage.toFixed(1)}%`
}
