import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmArrivalCard from './MmArrivalCard.vue'
import MmMediaPoster from '../../atoms/MmMediaPoster/MmMediaPoster.vue'
import { mmArrivalCardSelectors } from '../../../test/selectors/molecules/mmArrivalCard.selectors'
import { mmCardSelectors } from '../../../test/selectors/atoms/mmCard.selectors'
import { mmMediaPosterSelectors } from '../../../test/selectors/atoms/mmMediaPoster.selectors'
import { mmButtonSelectors } from '../../../test/selectors/atoms/mmButton.selectors'
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

const movieUrl =
  'https://media.example.com/jellyfin/web/#/details?id=0123456789abcdef0123456789abcdef'

const episodeUrl =
  'https://media.example.com/jellyfin/web/#/details?id=abcdef0123456789abcdef0123456789'

let wrapper: VueWrapper

const query = (selector: string) => wrapper.find(selector)

const arrival = mmArrivalCardSelectors(query)
const card = mmCardSelectors(query)
const poster = mmMediaPosterSelectors(query)
const button = mmButtonSelectors(query)

function createArrival(overrides: Partial<JellyfinArrival> = {}): JellyfinArrival {
  return {
    ...movieArrival,
    ...overrides,
  }
}

function mountArrival(
  overrides: Partial<JellyfinArrival> = {},
  options: {
    image?: string | null
    busy?: boolean
    mediaUrl?: string | null
  } = {},
) {
  wrapper = mount(MmArrivalCard, {
    props: {
      arrival: createArrival(overrides),
      ...options,
    },
  })
  return wrapper
}

describe('MmArrivalCard', () => {
  it('renders the arrival title', () => {
    mountArrival()

    expect(arrival.title().text()).toBe('Example Movie')
    expect(arrival.title().attributes('title')).toBe('Example Movie')
  })

  it('uses the generic MmCard container without padding', () => {
    mountArrival()

    expect(card.get().exists()).toBe(true)
    expect(card.padding('none').exists()).toBe(true)
  })

  it('renders movie metadata', () => {
    mountArrival()

    expect(arrival.type().text()).toBe('Movie')
    expect(arrival.subtitle().text()).toBe('2026')
  })

  it('renders episode metadata', () => {
    mountArrival({
      id: 'episode-42',
      type: 'Episode',
      title: 'The Beginning',
      subtitle: 'Example Series · S01E02',
      imageId: 'series-42',
      imageTag: null,
    })

    expect(arrival.title().text()).toBe('The Beginning')
    expect(arrival.type().text()).toBe('Episode')
    expect(arrival.subtitle().text()).toBe('Example Series · S01E02')
  })

  it('uses the shared media poster atom', () => {
    mountArrival()

    expect(wrapper.getComponent(MmMediaPoster).props()).toMatchObject({
      title: 'Example Movie',
      type: 'movie',
      image: null,
    })
  })

  it('maps Jellyfin episodes to TV posters', () => {
    mountArrival({
      type: 'Episode',
      title: 'Example Episode',
    })

    expect(wrapper.getComponent(MmMediaPoster).props()).toMatchObject({
      title: 'Example Episode',
      type: 'tv',
    })
  })

  it('renders supplied artwork', () => {
    mountArrival({}, { image: 'data:image/png;base64,example' })

    const image = poster.image()

    expect(image.attributes('src')).toBe('data:image/png;base64,example')
    expect(image.attributes('alt')).toBe('Example Movie poster')
    expect(image.attributes('loading')).toBe('lazy')
    expect(poster.placeholder().exists()).toBe(false)
  })

  it('renders a placeholder when artwork is missing', () => {
    mountArrival()

    expect(poster.image().exists()).toBe(false)

    const placeholder = poster.placeholder()

    expect(placeholder.attributes('role')).toBe('img')
    expect(placeholder.attributes('aria-label')).toBe('No poster available for Example Movie')
    expect(placeholder.text()).toContain('🎬')
  })

  it('renders an episode placeholder', () => {
    mountArrival({
      type: 'Episode',
      title: 'Example Episode',
    })

    expect(poster.placeholder().text()).toContain('📺')
    expect(poster.placeholder().attributes('aria-label')).toBe(
      'No poster available for Example Episode',
    )
  })

  it('renders a placeholder when image is explicitly null', () => {
    mountArrival({}, { image: null })

    expect(poster.image().exists()).toBe(false)
    expect(poster.placeholder().exists()).toBe(true)
  })

  it('formats the date with time', () => {
    mountArrival()

    const date = arrival.validDate()

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
    mountArrival({
      dateAdded: 'invalid-date',
    })

    expect(arrival.validDate().exists()).toBe(false)
    expect(arrival.invalidDate().text()).toBe('Unknown date')
  })

  it('does not show the unread indicator for a read arrival', () => {
    mountArrival()

    expect(arrival.indicator().exists()).toBe(false)
    expect(arrival.unread().exists()).toBe(false)
  })

  it('shows the unread indicator for a new arrival', () => {
    mountArrival({ unread: true })

    const indicator = arrival.indicator()

    expect(indicator.attributes('role')).toBe('img')
    expect(indicator.attributes('aria-label')).toBe('New arrival')
    expect(indicator.attributes('title')).toBe('New arrival')
    expect(arrival.unread().exists()).toBe(true)
  })

  it('shows Flag as new for a read arrival', () => {
    mountArrival()

    expect(button.get().text()).toBe('Flag as new')
  })

  it('shows Dismiss for an unread arrival', () => {
    mountArrival({ unread: true })

    expect(button.get().text()).toBe('Dismiss')
  })

  it('emits an unread action when Flag as new is clicked', async () => {
    mountArrival()

    await button.get().trigger('click')

    expect(wrapper.emitted('toggleUnread')).toEqual([['movie-42', true]])
  })

  it('emits a read action when Dismiss is clicked', async () => {
    mountArrival({ unread: true })

    await button.get().trigger('click')

    expect(wrapper.emitted('toggleUnread')).toEqual([['movie-42', false]])
  })

  it('disables the action while busy', () => {
    mountArrival({}, { busy: true })

    expect(button.disabled().exists()).toBe(true)
  })

  it('does not emit an action while busy', async () => {
    mountArrival({}, { busy: true })

    await button.get().trigger('click')

    expect(wrapper.emitted('toggleUnread')).toBeUndefined()
  })

  it('updates the title and metadata when the arrival changes', async () => {
    mountArrival()

    await wrapper.setProps({
      arrival: createArrival({
        id: 'episode-43',
        type: 'Episode',
        title: 'Another Episode',
        subtitle: 'Another Series · S02E03',
        unread: true,
      }),
    })

    expect(arrival.title().text()).toBe('Another Episode')
    expect(arrival.type().text()).toBe('Episode')
    expect(arrival.subtitle().text()).toBe('Another Series · S02E03')
    expect(arrival.unread().exists()).toBe(true)
    expect(button.get().text()).toBe('Dismiss')
  })

  it('updates artwork when the image prop changes', async () => {
    mountArrival()

    expect(poster.image().exists()).toBe(false)

    await wrapper.setProps({
      image: 'data:image/jpeg;base64,updated',
    })

    expect(poster.image().attributes('src')).toBe('data:image/jpeg;base64,updated')
    expect(poster.placeholder().exists()).toBe(false)

    await wrapper.setProps({
      image: null,
    })

    expect(poster.image().exists()).toBe(false)
    expect(poster.placeholder().exists()).toBe(true)
  })

  it('updates the action when unread changes', async () => {
    mountArrival()

    expect(button.get().text()).toBe('Flag as new')

    await wrapper.setProps({
      arrival: createArrival({
        unread: true,
      }),
    })

    expect(button.get().text()).toBe('Dismiss')

    await button.get().trigger('click')

    expect(wrapper.emitted('toggleUnread')).toEqual([['movie-42', false]])
  })

  it('updates the disabled state when busy changes', async () => {
    mountArrival({}, { busy: true })

    expect(button.disabled().exists()).toBe(true)

    await wrapper.setProps({
      busy: false,
    })

    expect(button.disabled().exists()).toBe(false)

    await button.get().trigger('click')

    expect(wrapper.emitted('toggleUnread')).toEqual([['movie-42', true]])
  })

  it('contains exactly one notification action button', () => {
    mountArrival()

    expect(wrapper.findAll('button')).toHaveLength(1)
  })

  describe('direct media links', () => {
    it('renders a plain title when no media URL is provided', () => {
      mountArrival()

      expect(arrival.title().text()).toBe('Example Movie')
      expect(arrival.link().exists()).toBe(false)
    })

    it('renders a direct link when a media URL is provided', () => {
      mountArrival({}, { mediaUrl: movieUrl })

      const link = arrival.link()

      expect(link.element.tagName).toBe('A')
      expect(link.text()).toBe('Example Movie')
      expect(link.attributes('href')).toBe(movieUrl)
    })

    it('opens direct links in a new tab safely', () => {
      mountArrival({}, { mediaUrl: movieUrl })

      const link = arrival.link()

      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toContain('noopener')
      expect(link.attributes('rel')).toContain('noreferrer')
    })

    it('supports direct links for episodes', () => {
      mountArrival(
        {
          id: 'episode-42',
          type: 'Episode',
          title: 'The Beginning',
        },
        { mediaUrl: episodeUrl },
      )

      const link = arrival.link()

      expect(link.text()).toBe('The Beginning')
      expect(link.attributes('href')).toBe(episodeUrl)
    })

    it('does not render a link for an explicitly null URL', () => {
      mountArrival({}, { mediaUrl: null })

      expect(arrival.link().exists()).toBe(false)
      expect(arrival.title().text()).toBe('Example Movie')
    })

    it('updates the link when the media URL changes', async () => {
      mountArrival()

      expect(arrival.link().exists()).toBe(false)

      await wrapper.setProps({ mediaUrl: movieUrl })

      expect(arrival.link().attributes('href')).toBe(movieUrl)

      await wrapper.setProps({ mediaUrl: episodeUrl })

      expect(arrival.link().attributes('href')).toBe(episodeUrl)

      await wrapper.setProps({ mediaUrl: null })

      expect(arrival.link().exists()).toBe(false)
    })

    it('keeps the unread action separate from the media link', async () => {
      mountArrival({}, { mediaUrl: movieUrl })

      expect(wrapper.findAll('.arrival-card__link')).toHaveLength(1)
      expect(wrapper.findAll('button')).toHaveLength(1)

      await button.get().trigger('click')

      expect(wrapper.emitted('toggleUnread')).toEqual([['movie-42', true]])
    })

    it('keeps the media link available while the unread action is busy', () => {
      mountArrival({}, { mediaUrl: movieUrl, busy: true })

      expect(arrival.link().attributes('href')).toBe(movieUrl)
      expect(button.disabled().exists()).toBe(true)
    })
  })
})
