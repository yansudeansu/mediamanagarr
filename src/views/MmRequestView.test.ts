import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import MmRequestView from './MmRequestView.vue'
import MmRequestCard from '../components/molecules/MmRequestCard/MmRequestCard.vue'
import MmPagination from '../components/molecules/MmPagination/MmPagination.vue'
import { sendBackgroundMessage } from '../utils/background-messaging'
import type { SeerrRequest, SeerrRequestsPage } from '../types/seerr'
import { mmRequestViewSelectors } from '../test/selectors/views/mmRequestView.selectors'

vi.mock('../utils/background-messaging', () => ({
  sendBackgroundMessage: vi.fn(),
}))

const mockedSendMessage = vi.mocked(sendBackgroundMessage)

const mockRequests: SeerrRequest[] = [
  {
    id: 1,
    type: 'movie',
    title: 'Dune: Part Two',
    status: 'Approved',
    mediaStatus: 'Available',
    requestedBy: 'Alice',
    createdAt: '2026-10-20T12:00:00.000Z',
    posterPath: null,
  },
  {
    id: 2,
    type: 'tv',
    title: 'The Last of Us',
    status: 'Pending',
    mediaStatus: 'Pending',
    requestedBy: 'Bob',
    createdAt: '2026-10-19T09:30:00.000Z',
    posterPath: null,
  },
]

function requestsPage(
  items: SeerrRequest[] = mockRequests,
  total = items.length,
): SeerrRequestsPage {
  return { items, total }
}

function mockSuccessfulLoad(requests: SeerrRequestsPage = requestsPage()) {
  mockedSendMessage.mockResolvedValue({ success: true, requests })
}

function deferredResponse<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolver) => {
    resolve = resolver
  })
  return { promise, resolve }
}

let wrapper: VueWrapper

const view = mmRequestViewSelectors((selector) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.requests-template /, ''))
})

function mountView() {
  wrapper = mount(MmRequestView)
  return wrapper
}

describe('MmRequestView', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockSuccessfulLoad()
  })

  it('renders the requests template', async () => {
    mountView()
    await flushPromises()

    expect(view.get().exists()).toBe(true)
  })

  it('loads the first page of all requests on mount', async () => {
    mountView()
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'GET_SEERR_REQUESTS',
      page: 1,
      pageSize: 10,
      filter: 'all',
    })
  })

  it('renders requests returned by the background', async () => {
    mountView()
    await flushPromises()

    expect(view.cards().exists()).toBe(true)
    expect(view.content().text()).toContain('Dune: Part Two')
    expect(view.content().text()).toContain('The Last of Us')
    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(2)
  })

  it('maps Seerr request fields to the generic card data', async () => {
    mountView()
    await flushPromises()

    const cards = wrapper.findAllComponents(MmRequestCard)

    expect(cards[0]?.props('request')).toEqual({
      title: 'Dune: Part Two',
      type: 'movie',
      posterUrl: null,
      status: 'Approved',
      mediaStatus: 'Available',
      requestedBy: 'Alice',
      createdAt: '2026-10-20T12:00:00.000Z',
    })
    expect(cards[1]?.props('request')).toEqual({
      title: 'The Last of Us',
      type: 'tv',
      posterUrl: null,
      status: 'Pending',
      mediaStatus: 'Pending',
      requestedBy: 'Bob',
      createdAt: '2026-10-19T09:30:00.000Z',
    })
  })

  it('converts a relative poster path into a TMDB image URL', async () => {
    mockSuccessfulLoad(requestsPage([{ ...mockRequests[0]!, posterPath: '/example-poster.jpg' }]))
    mountView()
    await flushPromises()

    expect(wrapper.getComponent(MmRequestCard).props('request').posterUrl).toBe(
      'https://image.tmdb.org/t/p/w185/example-poster.jpg',
    )
  })

  it('passes null when the poster path is missing', async () => {
    mountView()
    await flushPromises()

    const cards = wrapper.findAllComponents(MmRequestCard)

    expect(cards[0]?.props('request').posterUrl).toBeNull()
    expect(cards[1]?.props('request').posterUrl).toBeNull()
  })

  it.each([
    ['absolute HTTP URL', 'http://untrusted.example.com/poster.jpg'],
    ['absolute HTTPS URL', 'https://untrusted.example.com/poster.jpg'],
    ['protocol-relative URL', '//untrusted.example.com/poster.jpg'],
    ['relative path without leading slash', 'poster.jpg'],
    ['backslash-prefixed path', '\\untrusted.example.com\\poster.jpg'],
  ])('rejects an unsafe %s', async (_description, posterPath) => {
    mockSuccessfulLoad(requestsPage([{ ...mockRequests[0]!, posterPath }]))
    mountView()
    await flushPromises()

    expect(wrapper.getComponent(MmRequestCard).props('request').posterUrl).toBeNull()
  })

  it('shows a loading state while fetching requests', async () => {
    const pending = deferredResponse<{ success: true; requests: SeerrRequestsPage }>()
    mockedSendMessage.mockReturnValue(pending.promise)

    mountView()
    await wrapper.vm.$nextTick()

    expect(view.loading().text()).toBe('Loading requests…')
    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(0)

    pending.resolve({ success: true, requests: requestsPage() })
    await flushPromises()

    expect(view.loading().exists()).toBe(false)
    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(2)
  })

  it('shows an empty state when there are no requests', async () => {
    mockSuccessfulLoad(requestsPage([]))
    mountView()
    await flushPromises()

    expect(view.empty().text()).toContain('No requests found.')
    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(0)
  })

  it('shows background errors', async () => {
    mockedSendMessage.mockResolvedValue({ success: false, error: 'Seerr is unavailable.' })
    mountView()
    await flushPromises()

    expect(view.error().text()).toContain('Seerr is unavailable.')
    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(0)
  })

  it('shows unexpected errors', async () => {
    mockedSendMessage.mockRejectedValue(new Error('Network failure.'))
    mountView()
    await flushPromises()

    expect(view.error().text()).toContain('Network failure.')
  })

  it('uses a fallback message for non-Error failures', async () => {
    mockedSendMessage.mockRejectedValue('Unexpected failure')
    mountView()
    await flushPromises()

    expect(view.error().text()).toContain('An unexpected error occurred.')
  })

  it('retries after a failed request', async () => {
    mockedSendMessage
      .mockResolvedValueOnce({ success: false, error: 'Seerr is unavailable.' })
      .mockResolvedValueOnce({ success: true, requests: requestsPage() })

    mountView()
    await flushPromises()

    expect(view.error().text()).toContain('Seerr is unavailable.')

    await view.retry().trigger('click')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledTimes(2)
    expect(view.error().exists()).toBe(false)
    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(2)
  })

  it('refreshes the current page', async () => {
    mountView()
    await flushPromises()

    await view.refresh().trigger('click')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledTimes(2)
    expect(sendBackgroundMessage).toHaveBeenLastCalledWith({
      type: 'GET_SEERR_REQUESTS',
      page: 1,
      pageSize: 10,
      filter: 'all',
    })
  })

  it('selects the pending filter and resets to page one', async () => {
    mountView()
    await flushPromises()

    await view.filter(1).trigger('click')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenLastCalledWith({
      type: 'GET_SEERR_REQUESTS',
      page: 1,
      pageSize: 10,
      filter: 'pending',
    })
  })

  it('selects the approved filter', async () => {
    mountView()
    await flushPromises()

    await view.filter(2).trigger('click')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenLastCalledWith({
      type: 'GET_SEERR_REQUESTS',
      page: 1,
      pageSize: 10,
      filter: 'approved',
    })
  })

  it('does not refetch when selecting the active filter', async () => {
    mountView()
    await flushPromises()

    await view.activeFilter().trigger('click')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledTimes(1)
  })

  it('renders pagination when multiple pages are available', async () => {
    mockSuccessfulLoad(requestsPage(mockRequests, 25))
    mountView()
    await flushPromises()

    expect(view.pagination().exists()).toBe(true)
    expect(wrapper.getComponent(MmPagination).props('totalPages')).toBe(3)
  })

  it('does not render pagination for a single page', async () => {
    mountView()
    await flushPromises()

    expect(view.pagination().exists()).toBe(false)
  })

  it('loads the selected page from the background', async () => {
    mockSuccessfulLoad(requestsPage(mockRequests, 25))
    mountView()
    await flushPromises()

    wrapper.getComponent(MmPagination).vm.$emit('update:page', 2)
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenLastCalledWith({
      type: 'GET_SEERR_REQUESTS',
      page: 2,
      pageSize: 10,
      filter: 'all',
    })
  })

  it('resets pagination when changing filters', async () => {
    mockSuccessfulLoad(requestsPage(mockRequests, 25))
    mountView()
    await flushPromises()

    wrapper.getComponent(MmPagination).vm.$emit('update:page', 2)
    await flushPromises()

    await view.filter(1).trigger('click')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenLastCalledWith({
      type: 'GET_SEERR_REQUESTS',
      page: 1,
      pageSize: 10,
      filter: 'pending',
    })
  })

  it('ignores stale responses when filters change quickly', async () => {
    const pending = deferredResponse<{ success: true; requests: SeerrRequestsPage }>()

    mockedSendMessage
      .mockResolvedValueOnce({ success: true, requests: requestsPage() })
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValueOnce({
        success: true,
        requests: requestsPage([mockRequests[0]!]),
      })

    mountView()
    await flushPromises()

    await view.filter(1).trigger('click')
    await view.filter(2).trigger('click')
    await flushPromises()

    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(1)

    pending.resolve({ success: true, requests: requestsPage([mockRequests[1]!]) })
    await flushPromises()

    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(1)
    expect(view.content().text()).toContain('Dune: Part Two')
    expect(view.content().text()).not.toContain('The Last of Us')
  })

  it('prevents duplicate refreshes while loading', async () => {
    const pending = deferredResponse<{ success: true; requests: SeerrRequestsPage }>()
    mockedSendMessage.mockReturnValue(pending.promise)

    mountView()
    await wrapper.vm.$nextTick()

    expect(view.refreshDisabled().exists()).toBe(true)

    await view.refresh().trigger('click')

    expect(sendBackgroundMessage).toHaveBeenCalledTimes(1)

    pending.resolve({ success: true, requests: requestsPage() })
    await flushPromises()
  })

  it('does not accept invalid page changes', async () => {
    mockSuccessfulLoad(requestsPage(mockRequests, 25))
    mountView()
    await flushPromises()

    const pagination = wrapper.getComponent(MmPagination)

    pagination.vm.$emit('update:page', 0)
    pagination.vm.$emit('update:page', 4)
    pagination.vm.$emit('update:page', 1)
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledTimes(1)
  })
})
