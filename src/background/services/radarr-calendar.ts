import type { CalendarItem } from '../../types/calendar'
import type { ServiceConfig } from '../../types/service'
import { buildServiceApiUrl } from './connection'

const RADARR_TIMEOUT_MS = 15_000

interface RadarrImage {
  coverType?: unknown
  remoteUrl?: unknown
  url?: unknown
}

interface RadarrMovie {
  id?: unknown
  title?: unknown
  year?: unknown
  digitalRelease?: unknown
  physicalRelease?: unknown
  inCinemas?: unknown
  images?: unknown
}

interface MovieRelease {
  date: string
  releaseType: 'digital' | 'physical'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function getReleaseDate(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const match = /^(\d{4}-\d{2}-\d{2})(?:$|T)/.exec(value)

  if (!match) {
    return null
  }

  const dateKey = match[1]
  const [year, month, day] = dateKey.split('-').map(Number)

  if (year < 100 || month < 1 || month > 12 || day < 1 || day > 31) {
    return null
  }

  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  date.setUTCHours(0, 0, 0, 0)

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  if (value !== dateKey && !Number.isFinite(new Date(value).getTime())) {
    return null
  }

  return dateKey
}

function getMovieRelease(movie: RadarrMovie): MovieRelease | null {
  const digitalDate = getReleaseDate(movie.digitalRelease)

  if (digitalDate) {
    return {
      date: digitalDate,
      releaseType: 'digital',
    }
  }

  const physicalDate = getReleaseDate(movie.physicalRelease)

  if (physicalDate) {
    return {
      date: physicalDate,
      releaseType: 'physical',
    }
  }

  return null
}

function getPosterUrl(movie: RadarrMovie): string | null {
  if (!Array.isArray(movie.images)) {
    return null
  }

  const poster = movie.images.find(
    (image): image is RadarrImage => isRecord(image) && image.coverType === 'poster',
  )

  if (!poster) {
    return null
  }

  if (typeof poster.url === 'string' && poster.url.trim()) {
    return poster.url
  }

  if (typeof poster.remoteUrl === 'string' && poster.remoteUrl.trim()) {
    return poster.remoteUrl
  }

  return null
}

function mapMovie(movie: RadarrMovie): CalendarItem | null {
  if (typeof movie.id !== 'number' || !Number.isSafeInteger(movie.id) || movie.id < 1) {
    return null
  }

  const release = getMovieRelease(movie)

  if (!release) {
    return null
  }

  const title =
    typeof movie.title === 'string' && movie.title.trim() ? movie.title : 'Unknown movie'

  const subtitle =
    typeof movie.year === 'number' && Number.isSafeInteger(movie.year) && movie.year > 0
      ? String(movie.year)
      : 'Movie'

  return {
    id: `radarr-${movie.id}`,
    source: 'radarr',
    type: 'movie',
    title,
    subtitle,
    date: release.date,
    releaseType: release.releaseType,
    posterUrl: getPosterUrl(movie),
    posterMediaId: movie.id,
  }
}

export async function fetchRadarrCalendar(
  config: ServiceConfig,
  start: Date,
  end: Date,
): Promise<CalendarItem[]> {
  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    start.getTime() >= end.getTime()
  ) {
    throw new Error('Invalid Radarr calendar date range.')
  }

  const params = new URLSearchParams({
    start: start.toISOString(),
    end: end.toISOString(),
    unmonitored: 'false',
  })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), RADARR_TIMEOUT_MS)

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
        throw new Error('Radarr authentication failed. Check your API key.')
      }

      if (response.status === 404) {
        throw new Error('Radarr calendar endpoint not found. Check the server URL.')
      }

      throw new Error(`Unable to load Radarr calendar: HTTP ${response.status}.`)
    }

    const data: unknown = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Radarr returned an invalid calendar response.')
    }

    return data
      .filter((movie): movie is RadarrMovie => isRecord(movie))
      .map(mapMovie)
      .filter((item): item is CalendarItem => item !== null)
  } catch (error) {
    if (
      error !== null &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new Error('Loading Radarr calendar timed out.', { cause: error })
    }

    if (error instanceof TypeError) {
      throw new Error('Unable to reach Radarr.', { cause: error })
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while loading Radarr calendar.', { cause: error })
  } finally {
    clearTimeout(timeout)
  }
}
