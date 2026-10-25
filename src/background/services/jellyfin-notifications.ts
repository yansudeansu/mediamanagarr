import type { JellyfinArrivalFilter, JellyfinArrivalsPage } from '../../types/jellyfin'
import type { ServiceConfig } from '../../types/service'
import { getJellyfinUserSelection } from '../../utils/jellyfin-storage'
import { getServiceConfig } from '../../utils/service-storage'
import { fetchJellyfinArrivals } from './jellyfin-arrivals'

const STORAGE_KEY = 'mediaManagarrArrivals'
const MAX_KNOWN_IDS = 2000
const SCAN_PAGE_SIZE = 50

interface ArrivalState {
  initialized: boolean
  knownIds: string[]
  unreadIds: string[]
}

interface StoredArrivalState {
  serverUrl: string
  userId: string
  state: ArrivalState
}

export interface JellyfinArrivalsResult extends JellyfinArrivalsPage {
  unreadCount: number
}

let operationQueue: Promise<void> = Promise.resolve()

function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const result = operationQueue.then(operation)

  operationQueue = result.then(
    () => undefined,
    () => undefined,
  )

  return result
}

function getStorage() {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    throw new Error('Browser extension storage is unavailable.')
  }

  return chrome.storage.local
}

async function getContext(): Promise<{ config: ServiceConfig; userId: string }> {
  const config = await getServiceConfig('jellyfin')

  if (!config) {
    throw new Error('Jellyfin is not configured.')
  }

  const userId = await getJellyfinUserSelection(config.url)

  if (!userId) {
    throw new Error('Select your Jellyfin user in Settings.')
  }

  return { config, userId }
}

async function readState(serverUrl: string, userId: string): Promise<ArrivalState> {
  const stored = await getStorage().get(STORAGE_KEY)
  const value = stored[STORAGE_KEY] as StoredArrivalState | undefined

  if (value?.serverUrl === serverUrl && value.userId === userId && value.state) {
    return {
      initialized: value.state.initialized === true,
      knownIds: Array.isArray(value.state.knownIds) ? value.state.knownIds : [],
      unreadIds: Array.isArray(value.state.unreadIds) ? value.state.unreadIds : [],
    }
  }

  return {
    initialized: false,
    knownIds: [],
    unreadIds: [],
  }
}

async function writeState(serverUrl: string, userId: string, state: ArrivalState): Promise<void> {
  await getStorage().set({
    [STORAGE_KEY]: {
      serverUrl,
      userId,
      state,
    } satisfies StoredArrivalState,
  })
}

async function scanArrivals(): Promise<JellyfinArrivalsResult> {
  const { config, userId } = await getContext()

  const result = await fetchJellyfinArrivals(config, userId, {
    page: 1,
    pageSize: SCAN_PAGE_SIZE,
  })

  const state = await readState(config.url, userId)

  const knownIds = new Set(state.knownIds)
  const unreadIds = new Set(state.unreadIds)

  if (!state.initialized) {
    for (const item of result.items) {
      knownIds.add(item.id)
    }
  } else {
    for (const item of result.items) {
      if (!knownIds.has(item.id)) {
        unreadIds.add(item.id)
      }

      knownIds.add(item.id)
    }
  }

  const currentIds = new Set(result.items.map((item) => item.id))

  for (const id of unreadIds) {
    if (!currentIds.has(id)) {
      unreadIds.delete(id)
    }
  }

  const nextState: ArrivalState = {
    initialized: true,
    knownIds: Array.from(knownIds).slice(-MAX_KNOWN_IDS),
    unreadIds: Array.from(unreadIds),
  }

  await writeState(config.url, userId, nextState)

  return {
    items: result.items.map((item) => ({
      ...item,
      unread: unreadIds.has(item.id),
    })),
    total: result.total,
    unreadCount: unreadIds.size,
  }
}

export function scanJellyfinArrivals(): Promise<JellyfinArrivalsResult> {
  return serialize(scanArrivals)
}

export function loadJellyfinArrivalsPage(
  page: number,
  pageSize: number,
  filter: JellyfinArrivalFilter = 'all',
): Promise<JellyfinArrivalsResult> {
  return serialize(async () => {
    const scan = await scanArrivals()

    if (filter === 'new') {
      const unreadItems = scan.items.filter((item) => item.unread)
      const startIndex = (page - 1) * pageSize

      return {
        items: unreadItems.slice(startIndex, startIndex + pageSize),
        total: unreadItems.length,
        unreadCount: scan.unreadCount,
      }
    }

    const { config, userId } = await getContext()
    const state = await readState(config.url, userId)

    const result = await fetchJellyfinArrivals(config, userId, {
      page,
      pageSize,
    })

    const unreadIds = new Set(state.unreadIds)

    return {
      items: result.items.map((item) => ({
        ...item,
        unread: unreadIds.has(item.id),
      })),
      total: result.total,
      unreadCount: unreadIds.size,
    }
  })
}

export function clearJellyfinNotifications(): Promise<number> {
  return serialize(async () => {
    const { config, userId } = await getContext()
    const state = await readState(config.url, userId)

    state.unreadIds = []

    await writeState(config.url, userId, state)

    return 0
  })
}

export function setJellyfinArrivalUnread(itemId: string, unread: boolean): Promise<number> {
  return serialize(async () => {
    const { config, userId } = await getContext()

    const recent = await fetchJellyfinArrivals(config, userId, {
      page: 1,
      pageSize: SCAN_PAGE_SIZE,
    })

    if (!recent.items.some((item) => item.id === itemId)) {
      throw new Error('This item is no longer in your unwatched arrivals.')
    }

    const state = await readState(config.url, userId)
    const knownIds = new Set(state.knownIds)
    const unreadIds = new Set(state.unreadIds)

    knownIds.add(itemId)

    if (unread) {
      unreadIds.add(itemId)
    } else {
      unreadIds.delete(itemId)
    }

    state.initialized = true
    state.knownIds = Array.from(knownIds).slice(-MAX_KNOWN_IDS)
    state.unreadIds = Array.from(unreadIds)

    await writeState(config.url, userId, state)

    return unreadIds.size
  })
}
