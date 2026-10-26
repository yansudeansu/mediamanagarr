import type { CalendarItem } from '../../types/calendar'
import type { ServiceConfig } from '../../types/service'
import { buildServiceApiUrl } from './connection'

const SONARR_TIMEOUT_MS = 15_000

interface SonarrImage {
  coverType?: unknown
  remoteUrl?: unknown
  url?: unknown
}

interface SonarrSeries {
  id?: unknown
  title?: unknown
  images?: unknown
}

interface SonarrEpisode {
  id?: unknown
  seriesId?: unknown
  title?: unknown
  seasonNumber?: unknown
  episodeNumber?: unknown
  airDateUtc?: unknown
  airDate?: unknown
  series?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isValidId(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim()) {
    return false
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(0)

    date.setUTCFullYear(year, month - 1, day)
    date.setUTCHours(0, 0, 0, 0)

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    )
  }

  return Number.isFinite(new Date(value).getTime())
}

function getEpisodeDate(episode: SonarrEpisode): string | null {
  if (isValidDate(episode.airDateUtc)) {
    return episode.airDateUtc
  }

  if (isValidDate(episode.airDate)) {
    return episode.airDate
  }

  return null
}

function getPosterUrl(series: SonarrSeries | null): string | null {
  if (!series || !Array.isArray(series.images)) {
    return null
  }

  const poster = series.images.find(
    (image): image is SonarrImage => isRecord(image) && image.coverType === 'poster',
  )

  if (!poster) {
    return null
  }

  // Prefer the locally served poster over an external image.
  if (typeof poster.url === 'string' && poster.url.trim()) {
    return poster.url
  }

  if (typeof poster.remoteUrl === 'string' && poster.remoteUrl.trim()) {
    return poster.remoteUrl
  }

  return null
}

function formatEpisodeNumber(value: unknown): string {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
    ? String(value).padStart(2, '0')
    : '??'
}

function mapEpisode(episode: SonarrEpisode): CalendarItem | null {
  if (!isValidId(episode.id)) {
    return null
  }

  const date = getEpisodeDate(episode)

  if (!date) {
    return null
  }

  const series: SonarrSeries | null = isRecord(episode.series) ? episode.series : null

  const seriesTitle =
    typeof series?.title === 'string' && series.title.trim() ? series.title : 'Unknown series'

  const season = formatEpisodeNumber(episode.seasonNumber)
  const episodeNumber = formatEpisodeNumber(episode.episodeNumber)

  const episodeTitle =
    typeof episode.title === 'string' && episode.title.trim() ? ` · ${episode.title}` : ''

  const seriesId = isValidId(episode.seriesId)
    ? episode.seriesId
    : isValidId(series?.id)
      ? series.id
      : null

  return {
    id: `sonarr-${episode.id}`,
    source: 'sonarr',
    type: 'tv',
    title: seriesTitle,
    subtitle: `S${season}E${episodeNumber}${episodeTitle}`,
    date,
    releaseType: 'air',
    posterUrl: getPosterUrl(series),
    posterMediaId: seriesId,
  }
}

export async function fetchSonarrCalendar(
  config: ServiceConfig,
  start: Date,
  end: Date,
): Promise<CalendarItem[]> {
  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    start.getTime() >= end.getTime()
  ) {
    throw new Error('Invalid Sonarr calendar date range.')
  }

  const params = new URLSearchParams({
    start: start.toISOString(),
    end: end.toISOString(),
    includeSeries: 'true',
    unmonitored: 'false',
  })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), SONARR_TIMEOUT_MS)

  try {
    const response = await fetch(
      buildServiceApiUrl(config.url, `/api/v3/calendar?${params.toString()}`),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Api-Key': config.apiKey,
        },
        signal: controller.signal,
      },
    )

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Sonarr authentication failed. Check your API key.')
      }

      if (response.status === 404) {
        throw new Error('Sonarr calendar endpoint not found. Check the server URL.')
      }

      throw new Error(`Unable to load Sonarr calendar: HTTP ${response.status}.`)
    }

    const data: unknown = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Sonarr returned an invalid calendar response.')
    }

    return data
      .filter((episode): episode is SonarrEpisode => isRecord(episode))
      .map(mapEpisode)
      .filter((item): item is CalendarItem => item !== null)
  } catch (error) {
    if (
      error !== null &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new Error('Loading Sonarr calendar timed out.')
    }

    if (error instanceof TypeError) {
      throw new Error('Unable to reach Sonarr.')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while loading Sonarr calendar.')
  } finally {
    clearTimeout(timeout)
  }
}
