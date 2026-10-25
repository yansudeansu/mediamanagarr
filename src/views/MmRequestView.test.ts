import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import MmRequestView from './MmRequestView.vue'
import MmRequestsTemplate from '../components/templates/MmRequestsTemplate/MmRequestsTemplate.vue'
import MmRequestCard from '../components/molecules/MmRequestCard/MmRequestCard.vue'
import MmPagination from '../components/molecules/MmPagination/MmPagination.vue'
import { sendBackgroundMessage } from '../utils/background-messaging'
import type { SeerrRequest, SeerrRequestsPage } from '../types/seerr'

vi.mock('../utils/background-messaging', () => ({
  sendBackgroundMessage: vi.fn(),
}))

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
  vi.mocked(sendBackgroundMessage).mockResolvedValue({
    success: true,
    requests,
  })
}

function deferredResponse<T>() {
  let resolve!: (value: T) => void

  const promise = new Promise<T>((resolver) => {
    resolve = resolver
  })

  return { promise, resolve }
}

describe('MmRequestView', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockSuccessfulLoad()
  })

  it('renders the requests template', async () => {
    const wrapper = mount(MmRequestView)
    await flushPromises()

    expect(wrapper.findComponent(MmRequestsTemplate).exists()).toBe(true)
  })

  it('loads the first page of all requests on mount', async () => {
    mount(MmRequestView)
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'GET_SEERR_REQUESTS',
      page: 1,
      pageSize: 10,
      filter: 'all',
    })
  })

  it('renders requests returned by the background', async () => {
    const wrapper = mount(MmRequestView)
    await flushPromises()

    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(2)
    expect(wrapper.text()).toContain('Dune: Part Two')
    expect(wrapper.text()).toContain('The Last of Us')
  })

  it('shows a loading state while fetching requests', async () => {
    const pending = deferredResponse<{
      success: true
      requests: SeerrRequestsPage
    }>()

    vi.mocked(sendBackgroundMessage).mockReturnValue(pending.promise)

    const wrapper = mount(MmRequestView)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[role="status"]').text()).toBe('Loading requests…')
    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(0)

    pending.resolve({
      success: true,
      requests: requestsPage(),
    })

    await flushPromises()

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(2)
  })

  it('shows an empty state when there are no requests', async () => {
    mockSuccessfulLoad(requestsPage([]))

    const wrapper = mount(MmRequestView)
    await flushPromises()

    expect(wrapper.text()).toContain('No requests found.')
    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(0)
  })

  it('shows background errors', async () => {
    vi.mocked(sendBackgroundMessage).mockResolvedValue({
      success: false,
      error: 'Seerr is unavailable.',
    })

    const wrapper = mount(MmRequestView)
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Seerr is unavailable.')
    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(0)
  })

  it('shows unexpected errors', async () => {
    vi.mocked(sendBackgroundMessage).mockRejectedValue(new Error('Network failure.'))

    const wrapper = mount(MmRequestView)
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Network failure.')
  })

  it('uses a fallback message for non-Error failures', async () => {
    vi.mocked(sendBackgroundMessage).mockRejectedValue('Unexpected failure')

    const wrapper = mount(MmRequestView)
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('An unexpected error occurred.')
  })

  it('retries after a failed request', async () => {
    vi.mocked(sendBackgroundMessage)
      .mockResolvedValueOnce({
        success: false,
        error: 'Seerr is unavailable.',
      })
      .mockResolvedValueOnce({
        success: true,
        requests: requestsPage(),
      })

    const wrapper = mount(MmRequestView)
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Seerr is unavailable.')

    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledTimes(2)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(2)
  })

  it('refreshes the current page', async () => {
    const wrapper = mount(MmRequestView)
    await flushPromises()

    await wrapper.get('.requests-template__actions button').trigger('click')
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
    const wrapper = mount(MmRequestView)
    await flushPromises()

    const filterButtons = wrapper.findAll('button[aria-pressed]')

    await filterButtons[1]!.trigger('click')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenLastCalledWith({
      type: 'GET_SEERR_REQUESTS',
      page: 1,
      pageSize: 10,
      filter: 'pending',
    })
  })

  it('selects the approved filter', async () => {
    const wrapper = mount(MmRequestView)
    await flushPromises()

    const filterButtons = wrapper.findAll('button[aria-pressed]')

    await filterButtons[2]!.trigger('click')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenLastCalledWith({
      type: 'GET_SEERR_REQUESTS',
      page: 1,
      pageSize: 10,
      filter: 'approved',
    })
  })

  it('does not refetch when selecting the active filter', async () => {
    const wrapper = mount(MmRequestView)
    await flushPromises()

    await wrapper.get('button[aria-pressed="true"]').trigger('click')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledTimes(1)
  })

  it('renders pagination when multiple pages are available', async () => {
    mockSuccessfulLoad(requestsPage(mockRequests, 25))

    const wrapper = mount(MmRequestView)
    await flushPromises()

    expect(wrapper.findComponent(MmPagination).exists()).toBe(true)
    expect(wrapper.getComponent(MmPagination).props('totalPages')).toBe(3)
  })

  it('does not render pagination for a single page', async () => {
    const wrapper = mount(MmRequestView)
    await flushPromises()

    expect(wrapper.findComponent(MmPagination).exists()).toBe(false)
  })

  it('loads the selected page from the background', async () => {
    mockSuccessfulLoad(requestsPage(mockRequests, 25))

    const wrapper = mount(MmRequestView)
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

    const wrapper = mount(MmRequestView)
    await flushPromises()

    wrapper.getComponent(MmPagination).vm.$emit('update:page', 2)
    await flushPromises()

    const filterButtons = wrapper.findAll('button[aria-pressed]')

    await filterButtons[1]!.trigger('click')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenLastCalledWith({
      type: 'GET_SEERR_REQUESTS',
      page: 1,
      pageSize: 10,
      filter: 'pending',
    })
  })

  it('ignores stale responses when filters change quickly', async () => {
    const pending = deferredResponse<{
      success: true
      requests: SeerrRequestsPage
    }>()

    vi.mocked(sendBackgroundMessage)
      .mockResolvedValueOnce({
        success: true,
        requests: requestsPage(),
      })
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValueOnce({
        success: true,
        requests: requestsPage([mockRequests[0]!]),
      })

    const wrapper = mount(MmRequestView)
    await flushPromises()

    const filterButtons = wrapper.findAll('button[aria-pressed]')

    await filterButtons[1]!.trigger('click')
    await filterButtons[2]!.trigger('click')
    await flushPromises()

    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(1)

    pending.resolve({
      success: true,
      requests: requestsPage([mockRequests[1]!]),
    })

    await flushPromises()

    expect(wrapper.findAllComponents(MmRequestCard)).toHaveLength(1)
    expect(wrapper.text()).toContain('Dune: Part Two')
    expect(wrapper.text()).not.toContain('The Last of Us')
  })

  it('prevents duplicate refreshes while loading', async () => {
    const pending = deferredResponse<{
      success: true
      requests: SeerrRequestsPage
    }>()

    vi.mocked(sendBackgroundMessage).mockReturnValue(pending.promise)

    const wrapper = mount(MmRequestView)
    await wrapper.vm.$nextTick()

    const refreshButton = wrapper.get('.requests-template__actions button')

    expect(refreshButton.attributes('disabled')).toBeDefined()

    await refreshButton.trigger('click')

    expect(sendBackgroundMessage).toHaveBeenCalledTimes(1)

    pending.resolve({
      success: true,
      requests: requestsPage(),
    })

    await flushPromises()
  })

  it('does not accept invalid page changes', async () => {
    mockSuccessfulLoad(requestsPage(mockRequests, 25))

    const wrapper = mount(MmRequestView)
    await flushPromises()

    const pagination = wrapper.getComponent(MmPagination)

    pagination.vm.$emit('update:page', 0)
    pagination.vm.$emit('update:page', 4)
    pagination.vm.$emit('update:page', 1)

    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledTimes(1)
  })
})
