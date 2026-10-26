export type CalendarServiceId = 'sonarr' | 'radarr'

export type CalendarMediaType = 'tv' | 'movie'

export type CalendarReleaseType = 'air' | 'digital' | 'physical'

export type CalendarFilter = 'all' | CalendarMediaType

export type CalendarServiceFilter = 'all' | CalendarServiceId

export type CalendarServiceState = 'not-configured' | 'connected' | 'failed'

export interface CalendarItem {
  id: string
  source: CalendarServiceId
  type: CalendarMediaType
  title: string
  subtitle: string
  date: string
  releaseType: CalendarReleaseType
  posterUrl: string | null
  posterMediaId?: number | null
}

export interface CalendarServiceStatus {
  service: CalendarServiceId
  state: CalendarServiceState
  error?: string
}

export interface CalendarResult {
  items: CalendarItem[]
  services: CalendarServiceStatus[]
}

export interface CalendarDateRange {
  start: string
  end: string
}

export interface CalendarPosition {
  month: string
  selectedDate: string
}
