import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmRequestCard from './MmRequestCard.vue'
import MmMediaPoster from '../../atoms/MmMediaPoster/MmMediaPoster.vue'
import { mmRequestCardSelectors } from '../../../test/selectors/molecules/mmRequestCard.selectors'
import { mmCardSelectors } from '../../../test/selectors/atoms/mmCard.selectors'
import { mmMediaPosterSelectors } from '../../../test/selectors/atoms/mmMediaPoster.selectors'
import type { RequestCardData } from './MmRequestCard.vue'

const movieRequest: RequestCardData = {
  type: 'movie',
  title: 'Example Movie',
  status: 'Pending',
  mediaStatus: 'Processing',
  requestedBy: 'Alice',
  createdAt: '2026-10-20T12:00:00.000Z',
  posterUrl: 'https://image.tmdb.org/t/p/w185/example-poster.jpg',
}

let wrapper: VueWrapper

const query = (selector: string) => wrapper.find(selector)
const request = mmRequestCardSelectors(query)
const card = mmCardSelectors(query)
const poster = mmMediaPosterSelectors(query)

function createRequest(overrides: Partial<RequestCardData> = {}): RequestCardData {
  return { ...movieRequest, ...overrides }
}

function mountRequest(overrides: Partial<RequestCardData> = {}) {
  wrapper = mount(MmRequestCard, {
    props: { request: createRequest(overrides) },
  })
  return wrapper
}

describe('MmRequestCard', () => {
  it('renders the request title', () => {
    mountRequest()

    expect(request.title().text()).toBe('Example Movie')
  })

  it('uses the generic MmCard container', () => {
    mountRequest()

    expect(card.get().exists()).toBe(true)
    expect(card.padding('none').exists()).toBe(true)
  })

  it('displays Movie for movie requests', () => {
    mountRequest()

    expect(request.type().text()).toBe('Movie')
  })

  it('displays TV Show for television requests', () => {
    mountRequest({ type: 'tv', title: 'Example Series' })

    expect(request.type().text()).toBe('TV Show')
  })

  it('uses the shared media poster atom', () => {
    mountRequest()

    expect(poster.get().exists()).toBe(true)
    expect(wrapper.getComponent(MmMediaPoster).props()).toMatchObject({
      title: 'Example Movie',
      type: 'movie',
      image: 'https://image.tmdb.org/t/p/w185/example-poster.jpg',
    })
  })

  it('renders the supplied poster URL', () => {
    mountRequest()

    expect(poster.image().attributes('src')).toBe(
      'https://image.tmdb.org/t/p/w185/example-poster.jpg',
    )
    expect(poster.image().attributes('alt')).toBe('Example Movie poster')
    expect(poster.image().attributes('loading')).toBe('lazy')
  })

  it('renders a placeholder when the poster is missing', () => {
    mountRequest({ posterUrl: null })

    expect(poster.image().exists()).toBe(false)
    expect(poster.placeholder().attributes('aria-label')).toBe(
      'No poster available for Example Movie',
    )
  })

  it('renders a TV placeholder', () => {
    mountRequest({
      type: 'tv',
      title: 'Example Series',
      posterUrl: null,
    })

    expect(poster.placeholder().text()).toContain('📺')
  })

  it('renders exactly one status badge', () => {
    mountRequest({
      status: 'Unknown',
      mediaStatus: 'Available',
    })

    expect(request.badge().text()).toBe('Available')
    expect(wrapper.findAll('.request-card__badge')).toHaveLength(1)
  })

  it.each([
    ['Available', 'available'],
    ['Partially Available', 'partial'],
    ['Processing', 'processing'],
  ] as const)('prioritizes media status %s', (mediaStatus, cssClass) => {
    mountRequest({
      status: 'Unknown',
      mediaStatus,
    })

    expect(request.badge().text()).toBe(mediaStatus)
    expect(request.status(cssClass).exists()).toBe(true)
    expect(wrapper.findAll('.request-card__badge')).toHaveLength(1)
  })

  it.each([
    ['Pending', 'pending'],
    ['Approved', 'approved'],
    ['Declined', 'declined'],
    ['Unknown', 'unknown'],
  ] as const)('falls back to request status %s', (status, cssClass) => {
    mountRequest({
      status,
      mediaStatus: 'Unknown',
    })

    expect(request.badge().text()).toBe(status)
    expect(request.status(cssClass).exists()).toBe(true)
  })

  it('uses request status when media status is Pending', () => {
    mountRequest({
      status: 'Approved',
      mediaStatus: 'Pending',
    })

    expect(request.badge().text()).toBe('Approved')
    expect(request.status('approved').exists()).toBe(true)
  })

  it('displays Processing instead of Approved when media is processing', () => {
    mountRequest({
      status: 'Approved',
      mediaStatus: 'Processing',
    })

    expect(request.badge().text()).toBe('Processing')
    expect(request.status('processing').exists()).toBe(true)
  })

  it('displays the requester', () => {
    mountRequest()

    expect(request.requester().text()).toBe('Requested by Alice')
  })

  it('formats the request date', () => {
    mountRequest()

    expect(request.validDate().attributes('datetime')).toBe('2026-10-20T12:00:00.000Z')
    expect(request.validDate().text()).toBe('Oct 20, 2026')
  })

  it('handles invalid request dates', () => {
    mountRequest({ createdAt: 'invalid-date' })

    expect(request.validDate().exists()).toBe(false)
    expect(request.invalidDate().text()).toBe('Unknown date')
  })

  it('updates when the request changes', async () => {
    mountRequest()

    await wrapper.setProps({
      request: createRequest({
        title: 'Another Movie',
        status: 'Approved',
        mediaStatus: 'Available',
        requestedBy: 'Bob',
      }),
    })

    expect(request.title().text()).toBe('Another Movie')
    expect(request.requester().text()).toBe('Requested by Bob')
    expect(request.badge().text()).toBe('Available')
    expect(request.status('available').exists()).toBe(true)
    expect(wrapper.findAll('.request-card__badge')).toHaveLength(1)
  })

  it('updates the displayed status when request props change', async () => {
    mountRequest({
      status: 'Pending',
      mediaStatus: 'Unknown',
    })

    expect(request.badge().text()).toBe('Pending')

    await wrapper.setProps({
      request: createRequest({
        status: 'Approved',
        mediaStatus: 'Partially Available',
      }),
    })

    expect(request.badge().text()).toBe('Partially Available')
    expect(request.status('partial').exists()).toBe(true)
  })

  it('updates the poster when request props change', async () => {
    mountRequest()

    await wrapper.setProps({
      request: createRequest({
        title: 'Updated Series',
        type: 'tv',
        posterUrl: null,
      }),
    })

    expect(wrapper.getComponent(MmMediaPoster).props()).toMatchObject({
      title: 'Updated Series',
      type: 'tv',
      image: null,
    })
    expect(poster.placeholder().text()).toContain('📺')
  })

  it('updates the supplied poster URL reactively', async () => {
    mountRequest()

    await wrapper.setProps({
      request: createRequest({
        posterUrl: 'https://example.com/updated-poster.jpg',
      }),
    })

    expect(wrapper.getComponent(MmMediaPoster).props('image')).toBe(
      'https://example.com/updated-poster.jpg',
    )
    expect(poster.image().attributes('src')).toBe('https://example.com/updated-poster.jpg')
  })

  it('does not create an interactive control', () => {
    mountRequest()

    expect(request.buttons().exists()).toBe(false)
    expect(request.links().exists()).toBe(false)
  })
})
