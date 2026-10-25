import type {
  JellyfinArrival,
  JellyfinArrivalsPage,
  JellyfinArrivalsQuery,
} from '../../types/jellyfin'
import type { ServiceConfig } from '../../types/service'
import { buildServiceApiUrl } from './connection'

const JELLYFIN_TIMEOUT_MS = 15_000
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100

interface JellyfinApiItem {
  Id?: unknown
  Name?: unknown
  Type?: unknown
  DateCreated?: unknown
  ProductionYear?: unknown
  SeriesName?: unknown
  ParentIndexNumber?: unknown
  IndexNumber?: unknown
  SeriesId?: unknown
  ImageTags?: unknown
  UserData?: unknown
}

interface JellyfinApiItemsResponse {
  Items?: unknown
  TotalRecordCount?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function createHeaders(apiKey: string): HeadersInit {
  return {
    Accept: 'application/json',
    Authorization: `MediaBrowser Client="MediaManagarr", Device="Browser Extension", DeviceId="mediamanagarr", Version="0.1.0", Token="${apiKey}"`,
  }
}

function formatEpisodeSubtitle(item: JellyfinApiItem): string {
  const season =
    typeof item.ParentIndexNumber === 'number'
      ? String(item.ParentIndexNumber).padStart(2, '0')
      : '??'

  const episode =
    typeof item.IndexNumber === 'number' ? String(item.IndexNumber).padStart(2, '0') : '??'

  const series = typeof item.SeriesName === 'string' ? item.SeriesName : 'Unknown series'

  return `${series} · S${season}E${episode}`
}

function mapArrival(item: JellyfinApiItem): JellyfinArrival {
  const isEpisode = item.Type === 'Episode'

  const imageTags = isRecord(item.ImageTags) ? item.ImageTags : {}

  return {
    id: item.Id as string,
    type: isEpisode ? 'Episode' : 'Movie',
    title: item.Name as string,
    subtitle: isEpisode
      ? formatEpisodeSubtitle(item)
      : typeof item.ProductionYear === 'number'
        ? String(item.ProductionYear)
        : 'Movie',
    dateAdded: typeof item.DateCreated === 'string' ? item.DateCreated : '',
    imageId:
      isEpisode && typeof item.SeriesId === 'string' && item.SeriesId
        ? item.SeriesId
        : (item.Id as string),
    imageTag: !isEpisode && typeof imageTags.Primary === 'string' ? imageTags.Primary : null,
    unread: false,
  }
}

function isValidArrival(item: unknown): item is JellyfinApiItem {
  if (!isRecord(item)) {
    return false
  }

  if (item.Type !== 'Movie' && item.Type !== 'Episode') {
    return false
  }

  if (typeof item.Id !== 'string' || !item.Id || typeof item.Name !== 'string') {
    return false
  }

  return isRecord(item.UserData) && item.UserData.Played === false
}

export async function fetchJellyfinArrivals(
  config: ServiceConfig,
  userId: string,
  query: JellyfinArrivalsQuery = {},
): Promise<JellyfinArrivalsPage> {
  const page = query.page ?? 1
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > MAX_PAGE_SIZE ||
    !Number.isSafeInteger((page - 1) * pageSize)
  ) {
    throw new Error('Invalid Jellyfin pagination parameters.')
  }

  if (!userId.trim()) {
    throw new Error('Select your Jellyfin user in Settings.')
  }

  const params = new URLSearchParams({
    Recursive: 'true',
    IncludeItemTypes: 'Movie,Episode',
    IsPlayed: 'false',
    SortBy: 'DateCreated',
    SortOrder: 'Descending',
    StartIndex: String((page - 1) * pageSize),
    Limit: String(pageSize),
    Fields: 'DateCreated',
  })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), JELLYFIN_TIMEOUT_MS)

  try {
    const response = await fetch(
      buildServiceApiUrl(
        config.url,
        `/Users/${encodeURIComponent(userId)}/Items?${params.toString()}`,
      ),
      {
        method: 'GET',
        headers: createHeaders(config.apiKey),
        signal: controller.signal,
      },
    )

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Jellyfin did not allow access to the selected user.')
      }

      throw new Error(`Unable to load Jellyfin arrivals: HTTP ${response.status}.`)
    }

    const data: unknown = await response.json()

    if (!isRecord(data) || !Array.isArray((data as JellyfinApiItemsResponse).Items)) {
      throw new Error('Jellyfin returned an invalid items response.')
    }

    const items = (data.Items as unknown[]).filter(isValidArrival).map(mapArrival)

    if (
      data.TotalRecordCount !== undefined &&
      (typeof data.TotalRecordCount !== 'number' ||
        !Number.isSafeInteger(data.TotalRecordCount) ||
        data.TotalRecordCount < 0)
    ) {
      throw new Error('Jellyfin returned an invalid item count.')
    }

    return {
      items,
      total: typeof data.TotalRecordCount === 'number' ? data.TotalRecordCount : items.length,
    }
  } catch (error) {
    if (
      error !== null &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new Error('Loading Jellyfin arrivals timed out.')
    }

    if (error instanceof TypeError) {
      throw new Error('Unable to reach Jellyfin.')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred while loading Jellyfin arrivals.')
  } finally {
    clearTimeout(timeout)
  }
}
