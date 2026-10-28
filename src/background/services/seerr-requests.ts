import type { ServiceConfig } from '../../types/service'
import {
  SEERR_REQUEST_FILTERS,
  type SeerrMediaStatus,
  type SeerrRequest,
  type SeerrRequestFilter,
  type SeerrRequestStatus,
  type SeerrRequestsPage,
  type SeerrRequestsQuery,
} from '../../types/seerr'
import { buildServiceApiUrl } from './connection'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100
const REQUEST_TIMEOUT_MS = 10_000
const METADATA_CONCURRENCY = 3

interface SeerrUserResponse {
  displayName?: string
  username?: string
}

interface SeerrMediaResponse {
  tmdbId?: number
  status?: number
  posterPath?: string | null
}

interface SeerrRequestResponse {
  id: number
  status: number
  type: 'movie' | 'tv'
  createdAt: string
  requestedBy?: SeerrUserResponse
  media?: SeerrMediaResponse
}

interface SeerrRequestsResponse {
  results?: SeerrRequestResponse[]
  pageInfo?: {
    results?: number
    pages?: number
    page?: number
  }
}

interface NormalizedQuery {
  page: number
  pageSize: number
  filter: SeerrRequestFilter
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function normalizeQuery(query: SeerrRequestsQuery): NormalizedQuery {
  const page = query.page ?? DEFAULT_PAGE
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE
  const filter = query.filter ?? 'all'

  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error('Invalid Seerr page number.')
  }

  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
    throw new Error(`Seerr page size must be between 1 and ${MAX_PAGE_SIZE}.`)
  }

  if (!SEERR_REQUEST_FILTERS.includes(filter)) {
    throw new Error('Invalid Seerr request filter.')
  }

  if (!Number.isSafeInteger((page - 1) * pageSize)) {
    throw new Error('Invalid Seerr pagination offset.')
  }

  return { page, pageSize, filter }
}

function getRequestStatus(status: number): SeerrRequestStatus {
  switch (status) {
    case 1:
      return 'Pending'
    case 2:
      return 'Approved'
    case 3:
      return 'Declined'
    default:
      return 'Unknown'
  }
}

function getMediaStatus(status?: number): SeerrMediaStatus {
  switch (status) {
    case 2:
      return 'Pending'
    case 3:
      return 'Processing'
    case 4:
      return 'Partially Available'
    case 5:
      return 'Available'
    default:
      return 'Unknown'
  }
}

function validateRequestsResponse(value: unknown): SeerrRequestsResponse {
  if (!isRecord(value) || !Array.isArray(value.results)) {
    throw new Error('Seerr returned an invalid requests response.')
  }

  for (const request of value.results) {
    if (
      !isRecord(request) ||
      typeof request.id !== 'number' ||
      !Number.isSafeInteger(request.id) ||
      typeof request.status !== 'number' ||
      (request.type !== 'movie' && request.type !== 'tv') ||
      typeof request.createdAt !== 'string'
    ) {
      throw new Error('Seerr returned an invalid request item.')
    }

    if (request.media !== undefined && request.media !== null && !isRecord(request.media)) {
      throw new Error('Seerr returned invalid request media.')
    }

    if (
      request.requestedBy !== undefined &&
      request.requestedBy !== null &&
      !isRecord(request.requestedBy)
    ) {
      throw new Error('Seerr returned invalid requester information.')
    }
  }

  if (
    value.pageInfo !== undefined &&
    (!isRecord(value.pageInfo) ||
      typeof value.pageInfo.results !== 'number' ||
      !Number.isSafeInteger(value.pageInfo.results) ||
      value.pageInfo.results < 0)
  ) {
    throw new Error('Seerr returned invalid pagination information.')
  }

  return value as unknown as SeerrRequestsResponse
}

async function seerrFetch(config: ServiceConfig, path: string): Promise<unknown> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(buildServiceApiUrl(config.url, path), {
      method: 'GET',
      headers: {
        'X-Api-Key': config.apiKey,
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Seerr authentication failed. Check your API key.')
      }

      if (response.status === 404) {
        throw new Error('Seerr endpoint not found. Check the server URL and base path.')
      }

      throw new Error(`Seerr returned HTTP ${response.status}.`)
    }

    try {
      return (await response.json()) as unknown
    } catch {
      throw new Error('Seerr returned invalid JSON.')
    }
  } catch (error) {
    if (
      error !== null &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new Error('Seerr request timed out.', { cause: error })
    }

    if (error instanceof TypeError) {
      throw new Error('Unable to reach Seerr. Check the server address and availability.', {
        cause: error,
      })
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}

function getFallbackTitle(request: SeerrRequestResponse): string {
  return request.type === 'movie' ? `Movie #${request.id}` : `TV Show #${request.id}`
}

function getRequesterName(requestedBy?: SeerrUserResponse): string {
  const displayName = requestedBy?.displayName?.trim()

  if (displayName) {
    return displayName
  }

  const username = requestedBy?.username?.trim()

  return username || 'Unknown user'
}

async function normalizeRequest(
  config: ServiceConfig,
  request: SeerrRequestResponse,
): Promise<SeerrRequest> {
  let title = getFallbackTitle(request)
  let posterPath = request.media?.posterPath ?? null

  const tmdbId = request.media?.tmdbId

  if (typeof tmdbId === 'number' && Number.isSafeInteger(tmdbId) && tmdbId > 0) {
    try {
      const metadata = await seerrFetch(config, `/api/v1/${request.type}/${tmdbId}`)

      if (isRecord(metadata)) {
        const metadataTitle =
          typeof metadata.title === 'string'
            ? metadata.title
            : typeof metadata.name === 'string'
              ? metadata.name
              : null

        if (metadataTitle?.trim()) {
          title = metadataTitle.trim()
        }

        if (typeof metadata.posterPath === 'string') {
          posterPath = metadata.posterPath
        }
      }
    } catch {
      // Metadata is optional. Keep the request visible if enrichment fails.
    }
  }

  return {
    id: request.id,
    type: request.type,
    title,
    status: getRequestStatus(request.status),
    mediaStatus: getMediaStatus(request.media?.status),
    requestedBy: getRequesterName(request.requestedBy),
    createdAt: request.createdAt,
    posterPath,
  }
}

async function normalizeRequests(
  config: ServiceConfig,
  requests: SeerrRequestResponse[],
): Promise<SeerrRequest[]> {
  const items = new Array<SeerrRequest>(requests.length)
  let nextIndex = 0

  async function worker(): Promise<void> {
    while (nextIndex < requests.length) {
      const index = nextIndex
      nextIndex += 1

      const request = requests[index]

      if (!request) {
        continue
      }

      items[index] = await normalizeRequest(config, request)
    }
  }

  const workerCount = Math.min(METADATA_CONCURRENCY, requests.length)

  await Promise.all(Array.from({ length: workerCount }, () => worker()))

  return items
}

export async function fetchSeerrRequests(
  config: ServiceConfig,
  query: SeerrRequestsQuery = {},
): Promise<SeerrRequestsPage> {
  const { page, pageSize, filter } = normalizeQuery(query)

  const params = new URLSearchParams({
    take: String(pageSize),
    skip: String((page - 1) * pageSize),
    sort: 'added',
  })

  if (filter !== 'all') {
    params.set('filter', filter)
  }

  const response = await seerrFetch(config, `/api/v1/request?${params.toString()}`)

  const data = validateRequestsResponse(response)
  const items = await normalizeRequests(config, data.results ?? [])

  return {
    items,
    total: data.pageInfo?.results ?? items.length,
  }
}
