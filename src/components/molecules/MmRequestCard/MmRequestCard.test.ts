import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmRequestCard from './MmRequestCard.vue'
import type { SeerrRequest } from '../../../types/seerr'

const movieRequest: SeerrRequest = {
  id: 42,
  type: 'movie',
  title: 'Example Movie',
  status: 'Pending',
  mediaStatus: 'Processing',
  requestedBy: 'Alice',
  createdAt: '2026-10-20T12:00:00.000Z',
  posterPath: '/example-poster.jpg',
}

function createRequest(overrides: Partial<SeerrRequest> = {}): SeerrRequest {
  return {
    ...movieRequest,
    ...overrides,
  }
}

function mountRequest(overrides: Partial<SeerrRequest> = {}) {
  return mount(MmRequestCard, {
    props: {
      request: createRequest(overrides),
    },
  })
}

describe('MmRequestCard', () => {
  it('renders the request title', () => {
    const wrapper = mountRequest()

    expect(wrapper.get('.request-card__title').text()).toBe('Example Movie')
  })

  it('uses the generic MmCard container', () => {
    const wrapper = mountRequest()

    expect(wrapper.find('.mm-card').exists()).toBe(true)
    expect(wrapper.find('.mm-card--padding-none').exists()).toBe(true)
  })

  it('displays Movie for movie requests', () => {
    const wrapper = mountRequest()

    expect(wrapper.get('.request-card__type').text()).toBe('Movie')
  })

  it('displays TV Show for television requests', () => {
    const wrapper = mountRequest({
      type: 'tv',
      title: 'Example Series',
    })

    expect(wrapper.get('.request-card__type').text()).toBe('TV Show')
  })

  it('renders a TMDB poster', () => {
    const wrapper = mountRequest()

    const image = wrapper.get('img')

    expect(image.attributes('src')).toBe('https://image.tmdb.org/t/p/w185/example-poster.jpg')
    expect(image.attributes('alt')).toBe('Example Movie poster')
    expect(image.attributes('loading')).toBe('lazy')
  })

  it('renders a placeholder when the poster is missing', () => {
    const wrapper = mountRequest({
      posterPath: null,
    })

    expect(wrapper.find('img').exists()).toBe(false)

    expect(wrapper.get('.request-card__poster-placeholder').attributes('aria-label')).toBe(
      'No poster available for Example Movie',
    )
  })

  it('rejects non-relative poster paths', () => {
    const wrapper = mountRequest({
      posterPath: 'https://untrusted.example.com/poster.jpg',
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.request-card__poster-placeholder').exists()).toBe(true)
  })

  it('renders exactly one status badge', () => {
    const wrapper = mountRequest({
      status: 'Unknown',
      mediaStatus: 'Available',
    })

    const badges = wrapper.findAll('.request-card__badge')

    expect(badges).toHaveLength(1)
    expect(badges[0]?.text()).toBe('Available')
  })

  it.each([
    ['Available', 'available'],
    ['Partially Available', 'partial'],
    ['Processing', 'processing'],
  ] as const)('prioritizes media status %s', (mediaStatus, cssClass) => {
    const wrapper = mountRequest({
      status: 'Unknown',
      mediaStatus,
    })

    const badge = wrapper.get('.request-card__badge')

    expect(badge.text()).toBe(mediaStatus)
    expect(badge.classes()).toContain(`request-card__badge--${cssClass}`)
    expect(wrapper.findAll('.request-card__badge')).toHaveLength(1)
  })

  it.each([
    ['Pending', 'pending'],
    ['Approved', 'approved'],
    ['Declined', 'declined'],
    ['Unknown', 'unknown'],
  ] as const)('falls back to request status %s', (status, cssClass) => {
    const wrapper = mountRequest({
      status,
      mediaStatus: 'Unknown',
    })

    const badge = wrapper.get('.request-card__badge')

    expect(badge.text()).toBe(status)
    expect(badge.classes()).toContain(`request-card__badge--${cssClass}`)
  })

  it('uses request status when media status is Pending', () => {
    const wrapper = mountRequest({
      status: 'Approved',
      mediaStatus: 'Pending',
    })

    const badge = wrapper.get('.request-card__badge')

    expect(badge.text()).toBe('Approved')
    expect(badge.classes()).toContain('request-card__badge--approved')
  })

  it('displays Processing instead of Approved when media is processing', () => {
    const wrapper = mountRequest({
      status: 'Approved',
      mediaStatus: 'Processing',
    })

    const badge = wrapper.get('.request-card__badge')

    expect(badge.text()).toBe('Processing')
    expect(badge.classes()).toContain('request-card__badge--processing')
  })

  it('displays the requester', () => {
    const wrapper = mountRequest()

    expect(wrapper.get('.request-card__requester').text()).toBe('Requested by Alice')
  })

  it('formats the request date', () => {
    const wrapper = mountRequest()

    const date = wrapper.get('time')

    expect(date.attributes('datetime')).toBe('2026-10-20T12:00:00.000Z')
    expect(date.text()).toBe('Oct 20, 2026')
  })

  it('handles invalid request dates', () => {
    const wrapper = mountRequest({
      createdAt: 'invalid-date',
    })

    expect(wrapper.find('time').exists()).toBe(false)
    expect(wrapper.get('.request-card__date').text()).toBe('Unknown date')
  })

  it('updates when the request changes', async () => {
    const wrapper = mountRequest()

    await wrapper.setProps({
      request: createRequest({
        id: 43,
        title: 'Another Movie',
        status: 'Approved',
        mediaStatus: 'Available',
        requestedBy: 'Bob',
      }),
    })

    expect(wrapper.get('.request-card__title').text()).toBe('Another Movie')
    expect(wrapper.get('.request-card__requester').text()).toBe('Requested by Bob')

    const badges = wrapper.findAll('.request-card__badge')

    expect(badges).toHaveLength(1)
    expect(badges[0]?.text()).toBe('Available')
    expect(badges[0]?.classes()).toContain('request-card__badge--available')
  })

  it('updates the displayed status when request props change', async () => {
    const wrapper = mountRequest({
      status: 'Pending',
      mediaStatus: 'Unknown',
    })

    expect(wrapper.get('.request-card__badge').text()).toBe('Pending')

    await wrapper.setProps({
      request: createRequest({
        status: 'Approved',
        mediaStatus: 'Partially Available',
      }),
    })

    expect(wrapper.get('.request-card__badge').text()).toBe('Partially Available')
    expect(wrapper.get('.request-card__badge').classes()).toContain('request-card__badge--partial')
  })

  it('does not create an interactive control', () => {
    const wrapper = mountRequest()

    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
  })
})
