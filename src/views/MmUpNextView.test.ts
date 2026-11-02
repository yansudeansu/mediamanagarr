import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import MmUpNextView from './MmUpNextView.vue'
import type { JellyfinArrival } from '../types/jellyfin'
import { sendBackgroundMessage } from '../utils/background-messaging'
import { mmUpNextViewSelectors } from '../test/selectors/views/mmUpNextView.selectors'

vi.mock('../utils/background-messaging', () => ({
  sendBackgroundMessage: vi.fn(),
}))

const mockSendMessage = vi.mocked(sendBackgroundMessage)
const MOVIE_ID = '0123456789abcdef0123456789abcdef'
const EPISODE_ID = 'abcdef0123456789abcdef0123456789'
const SERIES_ID = '11111111111111111111111111111111'
const JELLYFIN_URL = 'https://media.example.com/jellyfin'

const movieArrival: JellyfinArrival = {
  id: 'movie-1',
  type: 'Movie',
  title: 'The Emerald Horizon',
  subtitle: '2026',
  dateAdded: '2026-10-24T18:30:00.000Z',
  imageId: 'movie-1',
  imageTag: 'movie-poster-tag',
  unread: true,
}

const episodeArrival: JellyfinArrival = {
  id: 'episode-2',
  type: 'Episode',
  title: 'The First Signal',
  subtitle: 'Signals from Tomorrow · S01E01',
  dateAdded: '2026-10-23T14:15:00.000Z',
  imageId: 'series-2',
  imageTag: null,
  unread: false,
}

function createArrival(overrides: Partial<JellyfinArrival> = {}): JellyfinArrival {
  return { ...movieArrival, ...overrides }
}

function arrivalsResponse(
  items: JellyfinArrival[] = [movieArrival, episodeArrival],
  total = items.length,
  unreadCount = items.filter((item) => item.unread).length,
) {
  return { success: true as const, arrivals: { items, total }, unreadCount }
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

function mockSuccessfulMessages() {
  mockSendMessage.mockImplementation(async (message) => {
    switch (message.type) {
      case 'GET_JELLYFIN_ARRIVALS':
        return message.filter === 'new'
          ? arrivalsResponse([movieArrival], 1, 1)
          : arrivalsResponse()
      case 'GET_JELLYFIN_IMAGE':
        return { success: true, image: null }
      case 'SET_JELLYFIN_ARRIVAL_UNREAD':
        return { success: true, unreadCount: message.unread ? 2 : 0 }
      case 'CLEAR_JELLYFIN_NOTIFICATIONS':
        return { success: true, unreadCount: 0 }
      default:
        throw new Error(`Unexpected message: ${message.type}`)
    }
  })
}

let wrapper: VueWrapper

const view = mmUpNextViewSelectors((selector) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.up-next-template /, ''))
})

function mountView(jellyfinUrl?: string | null) {
  wrapper = mount(MmUpNextView, { props: { jellyfinUrl } })
  return wrapper
}

function findButton(_wrapper: ReturnType<typeof mountView>, label: string) {
  const button = view
    .get()
    .findAll('button')
    .find((item) => item.text().includes(label))
  if (!button) throw new Error(`Button not found: ${label}`)
  return button
}

async function settle() {
  await flushPromises()
}

function arrivalRequests() {
  return mockSendMessage.mock.calls
    .map(([message]) => message)
    .filter((message) => message.type === 'GET_JELLYFIN_ARRIVALS')
}

function mockLinkableArrivals() {
  const movie = createArrival({ id: MOVIE_ID, imageId: MOVIE_ID })
  const episode: JellyfinArrival = {
    ...episodeArrival,
    id: EPISODE_ID,
    imageId: SERIES_ID,
  }

  mockSendMessage.mockImplementation(async (message) => {
    if (message.type === 'GET_JELLYFIN_ARRIVALS') return arrivalsResponse([movie, episode])
    if (message.type === 'GET_JELLYFIN_IMAGE') return { success: true, image: null }
    throw new Error(`Unexpected message: ${message.type}`)
  })
}

describe('MmUpNextView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSuccessfulMessages()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requests the first All page on mount', async () => {
    mountView()
    await settle()

    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'GET_JELLYFIN_ARRIVALS',
      page: 1,
      pageSize: 10,
      filter: 'all',
    })
  })

  it('shows a loading state while arrivals are fetched', async () => {
    const request = deferred<ReturnType<typeof arrivalsResponse>>()

    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') return request.promise
      return { success: true, image: null }
    })

    mountView()
    await nextTick()

    expect(view.loading().text()).toBe('Loading arrivals…')
    expect(view.cards().exists()).toBe(false)

    request.resolve(arrivalsResponse())
    await settle()

    expect(view.loading().exists()).toBe(false)
    expect(view.get().findAll('.arrival-card')).toHaveLength(2)
  })

  it('renders movies and episodes', async () => {
    const wrapper = mountView()
    await settle()

    expect(view.get().findAll('.arrival-card')).toHaveLength(2)
    expect(wrapper.text()).toContain('The Emerald Horizon')
    expect(wrapper.text()).toContain('The First Signal')
    expect(wrapper.text()).toContain('Signals from Tomorrow · S01E01')
  })

  describe('direct Jellyfin media links', () => {
    it('does not render links without a configured Jellyfin URL', async () => {
      mockLinkableArrivals()
      mountView()
      await settle()

      expect(view.get().findAll('.arrival-card')).toHaveLength(2)
      expect(view.get().findAll('.arrival-card__link')).toHaveLength(0)
    })

    it('links directly to movies and episodes in Jellyfin', async () => {
      mockLinkableArrivals()
      mountView(JELLYFIN_URL)
      await settle()

      const links = view.get().findAll('.arrival-card__link')

      expect(links).toHaveLength(2)
      expect(links[0]?.text()).toBe('The Emerald Horizon')
      expect(links[0]?.attributes('href')).toBe(`${JELLYFIN_URL}/web/#/details?id=${MOVIE_ID}`)
      expect(links[1]?.text()).toBe('The First Signal')
      expect(links[1]?.attributes('href')).toBe(`${JELLYFIN_URL}/web/#/details?id=${EPISODE_ID}`)
    })

    it('uses the episode item ID rather than the series artwork ID', async () => {
      mockLinkableArrivals()
      mountView(JELLYFIN_URL)
      await settle()

      const episodeLink = view.get().findAll('.arrival-card__link')[1]

      expect(episodeLink?.attributes('href')).toContain(EPISODE_ID)
      expect(episodeLink?.attributes('href')).not.toContain(SERIES_ID)
      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'GET_JELLYFIN_IMAGE',
        itemId: SERIES_ID,
        imageTag: null,
      })
    })

    it('opens media links in a new tab securely', async () => {
      mockLinkableArrivals()
      mountView(JELLYFIN_URL)
      await settle()

      for (const link of view.get().findAll('.arrival-card__link')) {
        expect(link.attributes('target')).toBe('_blank')
        expect(link.attributes('rel')).toContain('noopener')
        expect(link.attributes('rel')).toContain('noreferrer')
      }
    })

    it('preserves reverse-proxy paths', async () => {
      mockLinkableArrivals()
      mountView(' https://media.example.com/jellyfin/ ')
      await settle()

      expect(view.links().attributes('href')).toBe(`${JELLYFIN_URL}/web/#/details?id=${MOVIE_ID}`)
    })

    it('does not render links for an invalid server URL', async () => {
      mockLinkableArrivals()
      mountView('ftp://media.example.com')
      await settle()

      expect(view.get().findAll('.arrival-card')).toHaveLength(2)
      expect(view.get().findAll('.arrival-card__link')).toHaveLength(0)
    })

    it('does not render links for invalid item IDs', async () => {
      const invalidArrival = createArrival({ id: 'movie-1' })

      mockSendMessage.mockImplementation(async (message) => {
        if (message.type === 'GET_JELLYFIN_ARRIVALS') return arrivalsResponse([invalidArrival])
        if (message.type === 'GET_JELLYFIN_IMAGE') return { success: true, image: null }
        throw new Error(`Unexpected message: ${message.type}`)
      })

      mountView(JELLYFIN_URL)
      await settle()

      expect(view.get().findAll('.arrival-card')).toHaveLength(1)
      expect(view.links().exists()).toBe(false)
    })

    it('updates links reactively when the Jellyfin URL changes', async () => {
      mockLinkableArrivals()
      const wrapper = mountView()
      await settle()

      expect(view.get().findAll('.arrival-card__link')).toHaveLength(0)

      await wrapper.setProps({ jellyfinUrl: JELLYFIN_URL })

      expect(view.get().findAll('.arrival-card__link')).toHaveLength(2)
      expect(view.links().attributes('href')).toBe(`${JELLYFIN_URL}/web/#/details?id=${MOVIE_ID}`)

      await wrapper.setProps({ jellyfinUrl: 'http://localhost:8096' })

      expect(view.links().attributes('href')).toBe(
        `http://localhost:8096/web/#/details?id=${MOVIE_ID}`,
      )

      await wrapper.setProps({ jellyfinUrl: null })

      expect(view.get().findAll('.arrival-card__link')).toHaveLength(0)
    })

    it('does not refetch arrivals or artwork when the URL changes', async () => {
      mockLinkableArrivals()
      const wrapper = mountView()
      await settle()

      const requestCount = mockSendMessage.mock.calls.length

      await wrapper.setProps({ jellyfinUrl: JELLYFIN_URL })
      await wrapper.setProps({ jellyfinUrl: null })

      expect(mockSendMessage.mock.calls.length).toBe(requestCount)
    })

    it('keeps notification controls separate from media links', async () => {
      mockLinkableArrivals()
      mountView(JELLYFIN_URL)
      await settle()

      expect(view.get().findAll('.arrival-card__link')).toHaveLength(2)
      expect(view.get().findAll('.arrival-card button')).toHaveLength(2)
      expect(view.get().findAll('.arrival-card__link button')).toHaveLength(0)
    })
  })

  it('shows the unread count and total', async () => {
    const wrapper = mountView()
    await settle()

    expect(wrapper.text()).toContain('1 new · 2 unwatched items')
  })

  it('preserves the All total when switching to New', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        return message.filter === 'new'
          ? arrivalsResponse([movieArrival], 1, 1)
          : arrivalsResponse([movieArrival, episodeArrival], 92, 1)
      }
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    await view.filter(1).trigger('click')
    await settle()

    expect(wrapper.text()).toContain('1 new · 92 unwatched items')
  })

  it('omits the new count when there are no unread arrivals', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        return arrivalsResponse([{ ...movieArrival, unread: false }], 1, 0)
      }
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    expect(wrapper.text()).toContain('1 unwatched items')
    expect(wrapper.text()).not.toContain('1 new ·')
    expect(wrapper.text()).not.toContain('Clear notifications')
  })

  it('shows the All empty state', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') return arrivalsResponse([])
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    expect(wrapper.text()).toContain('Nothing unwatched in your recent library.')
    expect(view.cards().exists()).toBe(false)
  })

  it('shows a background error and Retry button', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        return { success: false, error: 'Jellyfin is unavailable.' }
      }
      return { success: true, image: null }
    })

    mountView()
    await settle()

    expect(view.error().text()).toContain('Jellyfin is unavailable.')
    expect(view.retry().exists()).toBe(true)
    expect(view.cards().exists()).toBe(false)
  })

  it('handles rejected background requests', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') throw new Error('Connection lost')
      return { success: true, image: null }
    })

    mountView()
    await settle()

    expect(view.error().text()).toContain('Connection lost')
  })

  it('retries after a failed request', async () => {
    let attempts = 0

    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        attempts++
        return attempts === 1 ? { success: false, error: 'Temporary failure' } : arrivalsResponse()
      }
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    expect(wrapper.text()).toContain('Temporary failure')

    await view.retry().trigger('click')
    await settle()

    expect(view.get().findAll('.arrival-card')).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Temporary failure')
  })

  it('refreshes the current filter and page', async () => {
    mountView()
    await settle()

    await view.filter(1).trigger('click')
    await settle()

    await view.refresh().trigger('click')
    await settle()

    expect(arrivalRequests().at(-1)).toEqual({
      type: 'GET_JELLYFIN_ARRIVALS',
      page: 1,
      pageSize: 10,
      filter: 'new',
    })
  })

  it('does not refresh twice while loading', async () => {
    const request = deferred<ReturnType<typeof arrivalsResponse>>()

    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') return request.promise
      return { success: true, image: null }
    })

    mountView()
    await view.refresh().trigger('click')

    expect(arrivalRequests()).toHaveLength(1)

    request.resolve(arrivalsResponse())
    await settle()
  })

  it('requests the New filter from the background', async () => {
    const wrapper = mountView()
    await settle()

    await view.filter(1).trigger('click')
    await settle()

    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'GET_JELLYFIN_ARRIVALS',
      page: 1,
      pageSize: 10,
      filter: 'new',
    })
    expect(view.get().findAll('.arrival-card')).toHaveLength(1)
    expect(wrapper.text()).toContain('The Emerald Horizon')
    expect(wrapper.text()).not.toContain('The First Signal')
  })

  it('shows unread arrivals even when they are absent from the All page', async () => {
    const distantArrival = createArrival({
      id: 'movie-27',
      title: 'Beyond the Silver Nebula',
      unread: true,
    })

    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        return message.filter === 'new'
          ? arrivalsResponse([distantArrival], 1, 1)
          : arrivalsResponse([episodeArrival], 92, 1)
      }
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    expect(wrapper.text()).not.toContain('Beyond the Silver Nebula')

    await view.filter(1).trigger('click')
    await settle()

    expect(wrapper.text()).toContain('Beyond the Silver Nebula')
    expect(wrapper.text()).toContain('1 new · 92 unwatched items')
  })

  it('shows the New empty state', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        return message.filter === 'new'
          ? arrivalsResponse([], 0, 0)
          : arrivalsResponse([episodeArrival], 1, 0)
      }
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    await view.filter(1).trigger('click')
    await settle()

    expect(wrapper.text()).toContain('No new items right now.')
    expect(view.cards().exists()).toBe(false)
  })

  it('hides New pagination when only one unread arrival exists', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        return message.filter === 'new'
          ? arrivalsResponse([movieArrival], 1, 1)
          : arrivalsResponse([movieArrival], 92, 1)
      }
      return { success: true, image: null }
    })

    mountView()
    await settle()

    expect(view.pagination().exists()).toBe(true)

    await view.filter(1).trigger('click')
    await settle()

    expect(view.pagination().exists()).toBe(false)
  })

  it('shows New pagination when there are more than ten unread arrivals', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        return message.filter === 'new'
          ? arrivalsResponse([movieArrival], 13, 13)
          : arrivalsResponse([movieArrival], 92, 13)
      }
      return { success: true, image: null }
    })

    mountView()
    await settle()

    await view.filter(1).trigger('click')
    await settle()

    expect(view.pagination().exists()).toBe(true)
    expect(view.nextPage().exists()).toBe(true)
    expect(view.nextPage().attributes('disabled')).toBeUndefined()
  })

  it('loads the second New page', async () => {
    const secondPageArrival = createArrival({
      id: 'movie-11',
      title: 'The Violet Sun',
    })

    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        if (message.filter === 'new') {
          return message.page === 2
            ? arrivalsResponse([secondPageArrival], 11, 11)
            : arrivalsResponse([movieArrival], 11, 11)
        }
        return arrivalsResponse([movieArrival], 92, 11)
      }
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    await view.filter(1).trigger('click')
    await settle()
    await view.nextPage().trigger('click')
    await settle()

    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'GET_JELLYFIN_ARRIVALS',
      page: 2,
      pageSize: 10,
      filter: 'new',
    })
    expect(wrapper.text()).toContain('The Violet Sun')
  })

  it('resets to page one when switching filters', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        return message.filter === 'new'
          ? arrivalsResponse([movieArrival], 1, 1)
          : arrivalsResponse([movieArrival], 22, 1)
      }
      return { success: true, image: null }
    })

    mountView()
    await settle()

    await view.nextPage().trigger('click')
    await settle()
    await view.filter(1).trigger('click')
    await settle()

    expect(arrivalRequests().at(-1)).toEqual({
      type: 'GET_JELLYFIN_ARRIVALS',
      page: 1,
      pageSize: 10,
      filter: 'new',
    })
  })

  it('returns to All arrivals', async () => {
    mountView()
    await settle()

    await view.filter(1).trigger('click')
    await settle()
    await view.filter(0).trigger('click')
    await settle()

    expect(view.get().findAll('.arrival-card')).toHaveLength(2)
    expect(arrivalRequests().at(-1)?.filter).toBe('all')
  })

  it('loads the selected All page', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        return arrivalsResponse(
          message.page === 2
            ? [createArrival({ id: 'movie-11', title: 'The Violet Sun' })]
            : [movieArrival],
          11,
          2,
        )
      }
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    await view.nextPage().trigger('click')
    await settle()

    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'GET_JELLYFIN_ARRIVALS',
      page: 2,
      pageSize: 10,
      filter: 'all',
    })
    expect(wrapper.text()).toContain('The Violet Sun')
    expect(wrapper.text()).not.toContain('The Emerald Horizon')
  })

  it('requests artwork for each arrival', async () => {
    mountView()
    await settle()

    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'GET_JELLYFIN_IMAGE',
      itemId: 'movie-1',
      imageTag: 'movie-poster-tag',
    })
    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'GET_JELLYFIN_IMAGE',
      itemId: 'series-2',
      imageTag: null,
    })
    expect(view.get().findAll('.arrival-card')).toHaveLength(2)
  })

  it('renders returned artwork', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') return arrivalsResponse([movieArrival])
      if (message.type === 'GET_JELLYFIN_IMAGE') {
        return { success: true, image: 'data:image/png;base64,fictional-artwork' }
      }
      throw new Error(`Unexpected message: ${message.type}`)
    })

    mountView()
    await settle()

    expect(view.images().attributes('src')).toBe('data:image/png;base64,fictional-artwork')
  })

  it('uses a placeholder when artwork fails', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') return arrivalsResponse([movieArrival])
      if (message.type === 'GET_JELLYFIN_IMAGE') {
        return { success: false, error: 'Image unavailable' }
      }
      throw new Error(`Unexpected message: ${message.type}`)
    })

    mountView()
    await settle()

    expect(view.images().exists()).toBe(false)
    expect(view.placeholders().exists()).toBe(true)
    expect(view.error().exists()).toBe(false)
  })

  it('caches completed artwork requests across refreshes', async () => {
    mountView()
    await settle()

    await view.refresh().trigger('click')
    await settle()

    const imageCalls = mockSendMessage.mock.calls.filter(
      ([message]) => message.type === 'GET_JELLYFIN_IMAGE',
    )

    expect(imageCalls).toHaveLength(2)
  })

  it('marks a new arrival as read in All', async () => {
    const wrapper = mountView()
    await settle()

    await findButton(wrapper, 'Dismiss').trigger('click')
    await settle()

    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'SET_JELLYFIN_ARRIVAL_UNREAD',
      itemId: 'movie-1',
      unread: false,
    })
    expect(view.indicators().exists()).toBe(false)
    expect(wrapper.text()).not.toContain('1 new ·')
  })

  it('flags a read arrival as new', async () => {
    const wrapper = mountView()
    await settle()

    await findButton(wrapper, 'Flag as new').trigger('click')
    await settle()

    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'SET_JELLYFIN_ARRIVAL_UNREAD',
      itemId: 'episode-2',
      unread: true,
    })
    expect(view.get().findAll('.arrival-card__indicator')).toHaveLength(2)
    expect(wrapper.text()).toContain('2 new · 2 unwatched items')
  })

  it('dismisses an arrival from New and reloads the filtered list', async () => {
    let dismissed = false

    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        if (message.filter === 'new') {
          return dismissed ? arrivalsResponse([], 0, 0) : arrivalsResponse([movieArrival], 1, 1)
        }
        return arrivalsResponse()
      }
      if (message.type === 'SET_JELLYFIN_ARRIVAL_UNREAD') {
        dismissed = true
        return { success: true, unreadCount: 0 }
      }
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    await view.filter(1).trigger('click')
    await settle()
    await findButton(wrapper, 'Dismiss').trigger('click')
    await settle()

    expect(wrapper.text()).toContain('No new items right now.')
    expect(view.cards().exists()).toBe(false)
    expect(arrivalRequests().at(-1)?.filter).toBe('new')
  })

  it('clamps New pagination after dismissing the last item on page two', async () => {
    let dismissed = false
    const finalArrival = createArrival({ id: 'movie-11', title: 'The Violet Sun' })

    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        if (message.filter === 'new') {
          if (dismissed) return arrivalsResponse([movieArrival], 10, 10)
          return message.page === 2
            ? arrivalsResponse([finalArrival], 11, 11)
            : arrivalsResponse([movieArrival], 11, 11)
        }
        return arrivalsResponse([movieArrival], 92, 11)
      }
      if (message.type === 'SET_JELLYFIN_ARRIVAL_UNREAD') {
        dismissed = true
        return { success: true, unreadCount: 10 }
      }
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    await view.filter(1).trigger('click')
    await settle()
    await view.nextPage().trigger('click')
    await settle()

    expect(wrapper.text()).toContain('The Violet Sun')

    await findButton(wrapper, 'Dismiss').trigger('click')
    await settle()

    expect(arrivalRequests().at(-1)).toEqual({
      type: 'GET_JELLYFIN_ARRIVALS',
      page: 1,
      pageSize: 10,
      filter: 'new',
    })
    expect(wrapper.text()).toContain('The Emerald Horizon')
    expect(wrapper.text()).not.toContain('The Violet Sun')
    expect(view.pagination().exists()).toBe(false)
  })

  it('does not send duplicate actions for a busy item', async () => {
    const request = deferred<{ success: true; unreadCount: number }>()

    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') return arrivalsResponse()
      if (message.type === 'GET_JELLYFIN_IMAGE') return { success: true, image: null }
      if (message.type === 'SET_JELLYFIN_ARRIVAL_UNREAD') return request.promise
      throw new Error(`Unexpected message: ${message.type}`)
    })

    const wrapper = mountView()
    await settle()

    await findButton(wrapper, 'Dismiss').trigger('click')
    await findButton(wrapper, 'Dismiss').trigger('click')

    const calls = mockSendMessage.mock.calls.filter(
      ([message]) => message.type === 'SET_JELLYFIN_ARRIVAL_UNREAD',
    )

    expect(calls).toHaveLength(1)

    request.resolve({ success: true, unreadCount: 0 })
    await settle()
  })

  it('preserves an arrival when its notification action fails', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') return arrivalsResponse()
      if (message.type === 'GET_JELLYFIN_IMAGE') return { success: true, image: null }
      if (message.type === 'SET_JELLYFIN_ARRIVAL_UNREAD') {
        return { success: false, error: 'Unable to update notification' }
      }
      throw new Error(`Unexpected message: ${message.type}`)
    })

    const wrapper = mountView()
    await settle()

    await findButton(wrapper, 'Dismiss').trigger('click')
    await settle()

    expect(wrapper.text()).toContain('Unable to update notification')
    expect(view.indicators().exists()).toBe(true)
    expect(wrapper.text()).toContain('1 new · 2 unwatched items')
  })

  it('clears all notifications in All', async () => {
    const wrapper = mountView()
    await settle()

    await view.clear().trigger('click')
    await settle()

    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'CLEAR_JELLYFIN_NOTIFICATIONS',
    })
    expect(view.indicators().exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Clear notifications')
    expect(wrapper.text()).toContain('2 unwatched items')
  })

  it('clears New and removes its pagination', async () => {
    let cleared = false

    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        if (message.filter === 'new') {
          return cleared ? arrivalsResponse([], 0, 0) : arrivalsResponse([movieArrival], 11, 11)
        }
        return arrivalsResponse([movieArrival], 92, 11)
      }
      if (message.type === 'CLEAR_JELLYFIN_NOTIFICATIONS') {
        cleared = true
        return { success: true, unreadCount: 0 }
      }
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    await view.filter(1).trigger('click')
    await settle()

    expect(view.pagination().exists()).toBe(true)

    await view.clear().trigger('click')
    await settle()

    expect(wrapper.text()).toContain('No new items right now.')
    expect(view.pagination().exists()).toBe(false)
  })

  it('does not clear notifications twice while clearing', async () => {
    const request = deferred<{ success: true; unreadCount: number }>()

    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') return arrivalsResponse()
      if (message.type === 'GET_JELLYFIN_IMAGE') return { success: true, image: null }
      if (message.type === 'CLEAR_JELLYFIN_NOTIFICATIONS') return request.promise
      throw new Error(`Unexpected message: ${message.type}`)
    })

    mountView()
    await settle()

    await view.clear().trigger('click')
    await view.clear().trigger('click')

    const calls = mockSendMessage.mock.calls.filter(
      ([message]) => message.type === 'CLEAR_JELLYFIN_NOTIFICATIONS',
    )

    expect(calls).toHaveLength(1)

    request.resolve({ success: true, unreadCount: 0 })
    await settle()
  })

  it('shows an error when clearing notifications fails', async () => {
    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') return arrivalsResponse()
      if (message.type === 'GET_JELLYFIN_IMAGE') return { success: true, image: null }
      if (message.type === 'CLEAR_JELLYFIN_NOTIFICATIONS') {
        return { success: false, error: 'Unable to clear notifications' }
      }
      throw new Error(`Unexpected message: ${message.type}`)
    })

    mountView()
    await settle()

    await view.clear().trigger('click')
    await settle()

    expect(view.actionError().text()).toContain('Unable to clear notifications')
    expect(view.indicators().exists()).toBe(true)
  })

  it('ignores stale responses after switching filters', async () => {
    const pendingNew = deferred<ReturnType<typeof arrivalsResponse>>()
    let newRequests = 0

    mockSendMessage.mockImplementation(async (message) => {
      if (message.type === 'GET_JELLYFIN_ARRIVALS') {
        if (message.filter === 'new') {
          newRequests++
          return pendingNew.promise
        }
        return arrivalsResponse([movieArrival, episodeArrival], 92, 1)
      }
      return { success: true, image: null }
    })

    const wrapper = mountView()
    await settle()

    await view.filter(1).trigger('click')
    await nextTick()

    expect(newRequests).toBe(1)

    // The filter remains interactive while arrivals load.
    await view.filter(0).trigger('click')
    await settle()

    pendingNew.resolve(
      arrivalsResponse([createArrival({ id: 'stale-movie', title: 'The Forgotten Comet' })], 1, 1),
    )
    await settle()

    expect(wrapper.text()).toContain('The Emerald Horizon')
    expect(wrapper.text()).toContain('The First Signal')
    expect(wrapper.text()).not.toContain('The Forgotten Comet')
    expect(arrivalRequests().at(-1)?.filter).toBe('all')
  })
})
