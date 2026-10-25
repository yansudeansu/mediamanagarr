export interface JellyfinUser {
  id: string
  name: string
}

export interface JellyfinUserSelection {
  serverUrl: string
  userId: string
}

export interface JellyfinArrival {
  id: string
  type: 'Movie' | 'Episode'
  title: string
  subtitle: string
  dateAdded: string
  imageId: string
  imageTag: string | null
  unread: boolean
}

export interface JellyfinArrivalsPage {
  items: JellyfinArrival[]
  total: number
}

export type JellyfinArrivalFilter = 'all' | 'new'

export interface JellyfinArrivalsQuery {
  page?: number
  pageSize?: number
  filter?: JellyfinArrivalFilter
}
