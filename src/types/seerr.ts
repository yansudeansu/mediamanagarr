export const SEERR_REQUEST_FILTERS = ['all', 'pending', 'approved'] as const

export type SeerrRequestFilter = (typeof SEERR_REQUEST_FILTERS)[number]

export type SeerrMediaType = 'movie' | 'tv'

export type SeerrRequestStatus = 'Pending' | 'Approved' | 'Declined' | 'Unknown'

export type SeerrMediaStatus =
  'Pending' | 'Processing' | 'Partially Available' | 'Available' | 'Unknown'

export interface SeerrRequest {
  id: number
  type: SeerrMediaType
  title: string
  status: SeerrRequestStatus
  mediaStatus: SeerrMediaStatus
  requestedBy: string
  createdAt: string
  posterPath: string | null
}

export interface SeerrRequestsPage {
  items: SeerrRequest[]
  total: number
}

export interface SeerrRequestsQuery {
  page?: number
  pageSize?: number
  filter?: SeerrRequestFilter
}
