import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmArrivalCard from './MmArrivalCard.vue'
import type { JellyfinArrival } from '../../../types/jellyfin'

const movieArrival: JellyfinArrival = {
  id: 'movie-42',
  type: 'Movie',
  title: 'Example Movie',
  subtitle: '2026',
  dateAdded: '2026-10-20T12:00:00.000Z',
  imageId: 'movie-42',
  imageTag: 'poster-tag',
  unread: false,
}

function createArrival(overrides: Partial<JellyfinArrival> = {}): JellyfinArrival {
  return {
    ...movieArrival,
    ...overrides,
  }
}

function mountArrival(
  overrides: Partial<JellyfinArrival> = {},
  options: { image?: string | null; busy?: boolean } = {},
) {
  return mount(MmArrivalCard, {
    props: {
      arrival: createArrival(overrides),
      ...options,
    },
  })
}

describe('MmArrivalCard', () => {
  it('renders the arrival title', () => {
    const wrapper = mountArrival()

    expect(wrapper.get('.arrival-card__title').text()).toBe('Example Movie')
    expect(wrapper.get('.arrival-card__title').attributes('title')).toBe('Example Movie')
  })

  it('uses the generic MmCard container without padding', () => {
    const wrapper = mountArrival()

    expect(wrapper.find('.mm-card').exists()).toBe(true)
    expect(wrapper.find('.mm-card--padding-none').exists()).toBe(true)
  })

  it('renders movie metadata', () => {
    const wrapper = mountArrival()

    expect(wrapper.get('.arrival-card__type').text()).toBe('Movie')
    expect(wrapper.get('.arrival-card__subtitle').text()).toBe('2026')
  })

  it('renders episode metadata', () => {
    const wrapper = mountArrival({
      id: 'episode-42',
      type: 'Episode',
      title: 'The Beginning',
      subtitle: 'Example Series · S01E02',
      imageId: 'series-42',
      imageTag: null,
    })

    expect(wrapper.get('.arrival-card__title').text()).toBe('The Beginning')
    expect(wrapper.get('.arrival-card__type').text()).toBe('Episode')
    expect(wrapper.get('.arrival-card__subtitle').text()).toBe('Example Series · S01E02')
  })

  it('renders supplied artwork', () => {
    const wrapper = mountArrival({}, { image: 'data:image/png;base64,example' })

    const image = wrapper.get('img')

    expect(image.attributes('src')).toBe('data:image/png;base64,example')
    expect(image.attributes('alt')).toBe('Example Movie poster')
    expect(image.attributes('loading')).toBe('lazy')
    expect(wrapper.find('.arrival-card__poster-placeholder').exists()).toBe(false)
  })

  it('renders a placeholder when artwork is missing', () => {
    const wrapper = mountArrival()

    expect(wrapper.find('img').exists()).toBe(false)

    const placeholder = wrapper.get('.arrival-card__poster-placeholder')

    expect(placeholder.attributes('role')).toBe('img')
    expect(placeholder.attributes('aria-label')).toBe('No poster available for Example Movie')
    expect(placeholder.text()).toContain('🎬')
  })

  it('renders an episode placeholder', () => {
    const wrapper = mountArrival({
      type: 'Episode',
      title: 'Example Episode',
    })

    expect(wrapper.get('.arrival-card__poster-placeholder').text()).toContain('📺')
    expect(wrapper.get('.arrival-card__poster-placeholder').attributes('aria-label')).toBe(
      'No poster available for Example Episode',
    )
  })

  it('renders a placeholder when image is explicitly null', () => {
    const wrapper = mountArrival({}, { image: null })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.arrival-card__poster-placeholder').exists()).toBe(true)
  })

  it('formats the date with time', () => {
    const wrapper = mountArrival()

    const date = wrapper.get('time')

    expect(date.attributes('datetime')).toBe('2026-10-20T12:00:00.000Z')

    const expected = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date('2026-10-20T12:00:00.000Z'))

    expect(date.text()).toBe(expected)
  })

  it('handles invalid dates', () => {
    const wrapper = mountArrival({
      dateAdded: 'invalid-date',
    })

    expect(wrapper.find('time').exists()).toBe(false)
    expect(wrapper.get('.arrival-card__date').text()).toBe('Unknown date')
  })

  it('does not show the unread indicator for a read arrival', () => {
    const wrapper = mountArrival()

    expect(wrapper.find('.arrival-card__indicator').exists()).toBe(false)
    expect(wrapper.get('.arrival-card').classes()).not.toContain('arrival-card--unread')
  })

  it('shows the unread indicator for a new arrival', () => {
    const wrapper = mountArrival({
      unread: true,
    })

    const indicator = wrapper.get('.arrival-card__indicator')

    expect(indicator.attributes('aria-label')).toBe('New arrival')
    expect(indicator.attributes('title')).toBe('New arrival')
    expect(wrapper.get('.arrival-card').classes()).toContain('arrival-card--unread')
  })

  it('shows Flag as new for a read arrival', () => {
    const wrapper = mountArrival()

    expect(wrapper.get('button').text()).toBe('Flag as new')
  })

  it('shows Dismiss for an unread arrival', () => {
    const wrapper = mountArrival({
      unread: true,
    })

    expect(wrapper.get('button').text()).toBe('Dismiss')
  })

  it('emits an unread action when Flag as new is clicked', async () => {
    const wrapper = mountArrival()

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('toggleUnread')).toEqual([['movie-42', true]])
  })

  it('emits a read action when Dismiss is clicked', async () => {
    const wrapper = mountArrival({
      unread: true,
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('toggleUnread')).toEqual([['movie-42', false]])
  })

  it('disables the action while busy', () => {
    const wrapper = mountArrival({}, { busy: true })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('does not emit an action while busy', async () => {
    const wrapper = mountArrival({}, { busy: true })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('toggleUnread')).toBeUndefined()
  })

  it('updates the title and metadata when the arrival changes', async () => {
    const wrapper = mountArrival()

    await wrapper.setProps({
      arrival: createArrival({
        id: 'episode-43',
        type: 'Episode',
        title: 'Another Episode',
        subtitle: 'Another Series · S02E03',
        unread: true,
      }),
    })

    expect(wrapper.get('.arrival-card__title').text()).toBe('Another Episode')
    expect(wrapper.get('.arrival-card__type').text()).toBe('Episode')
    expect(wrapper.get('.arrival-card__subtitle').text()).toBe('Another Series · S02E03')
    expect(wrapper.get('.arrival-card').classes()).toContain('arrival-card--unread')
    expect(wrapper.get('button').text()).toBe('Dismiss')
  })

  it('updates artwork when the image prop changes', async () => {
    const wrapper = mountArrival()

    expect(wrapper.find('img').exists()).toBe(false)

    await wrapper.setProps({
      image: 'data:image/jpeg;base64,updated',
    })

    expect(wrapper.get('img').attributes('src')).toBe('data:image/jpeg;base64,updated')
    expect(wrapper.find('.arrival-card__poster-placeholder').exists()).toBe(false)

    await wrapper.setProps({
      image: null,
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.arrival-card__poster-placeholder').exists()).toBe(true)
  })

  it('updates the action when unread changes', async () => {
    const wrapper = mountArrival()

    expect(wrapper.get('button').text()).toBe('Flag as new')

    await wrapper.setProps({
      arrival: createArrival({
        unread: true,
      }),
    })

    expect(wrapper.get('button').text()).toBe('Dismiss')

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('toggleUnread')).toEqual([['movie-42', false]])
  })

  it('updates the disabled state when busy changes', async () => {
    const wrapper = mountArrival({}, { busy: true })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()

    await wrapper.setProps({
      busy: false,
    })

    expect(wrapper.get('button').attributes('disabled')).toBeUndefined()

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('toggleUnread')).toEqual([['movie-42', true]])
  })

  it('contains exactly one notification action button', () => {
    const wrapper = mountArrival()

    expect(wrapper.findAll('button')).toHaveLength(1)
  })
})
