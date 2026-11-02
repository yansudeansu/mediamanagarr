import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmCalendarEvent from './MmCalendarEvent.vue'
import MmMediaPoster from '../../atoms/MmMediaPoster/MmMediaPoster.vue'
import { mmCalendarEventSelectors } from '../../../test/selectors/molecules/mmCalendarEvent.selectors'
import { mmMediaPosterSelectors } from '../../../test/selectors/atoms/mmMediaPoster.selectors'
import type { CalendarItem } from '../../../types/calendar'

const tvItem: CalendarItem = {
  id: 'sonarr-101',
  source: 'sonarr',
  type: 'tv',
  title: 'Example Series',
  subtitle: 'S02E03 · The Adventure',
  date: '2026-11-05T20:00:00Z',
  releaseType: 'air',
  posterUrl: null,
}

const digitalMovie: CalendarItem = {
  id: 'radarr-201',
  source: 'radarr',
  type: 'movie',
  title: 'Example Movie',
  subtitle: '2026',
  date: '2026-11-05',
  releaseType: 'digital',
  posterUrl: null,
}

let wrapper: VueWrapper

const query = (selector: string) => wrapper.find(selector)
const event = mmCalendarEventSelectors(query)
const poster = mmMediaPosterSelectors(query)

function mountEvent(item: CalendarItem = tvItem, image: string | null = null) {
  wrapper = mount(MmCalendarEvent, {
    props: { item, image },
  })
  return wrapper
}

describe('MmCalendarEvent', () => {
  it('renders a TV episode title and subtitle', () => {
    mountEvent()

    expect(event.title().text()).toBe('Example Series')
    expect(event.subtitle().text()).toBe('S02E03 · The Adventure')
    expect(event.type().text()).toBe('TV episode')
  })

  it('renders a movie title and subtitle', () => {
    mountEvent(digitalMovie)

    expect(event.title().text()).toBe('Example Movie')
    expect(event.subtitle().text()).toBe('2026')
    expect(event.type().text()).toBe('Movie')
  })

  it('labels TV releases as airing', () => {
    mountEvent()

    expect(event.releaseType().text()).toBe('Airing')
  })

  it('labels digital movie releases', () => {
    mountEvent(digitalMovie)

    expect(event.releaseType().text()).toBe('Digital release')
  })

  it('labels physical movie releases', () => {
    mountEvent({
      ...digitalMovie,
      releaseType: 'physical',
    })

    expect(event.releaseType().text()).toBe('Physical release')
  })

  it('uses the shared media poster atom for TV', () => {
    mountEvent()

    expect(wrapper.getComponent(MmMediaPoster).props()).toMatchObject({
      title: 'Example Series',
      type: 'tv',
      image: null,
    })
  })

  it('uses the shared media poster atom for movies', () => {
    mountEvent(digitalMovie, 'https://example.com/poster.jpg')

    expect(wrapper.getComponent(MmMediaPoster).props()).toMatchObject({
      title: 'Example Movie',
      type: 'movie',
      image: 'https://example.com/poster.jpg',
    })
  })

  it('renders a poster image when supplied', () => {
    mountEvent(digitalMovie, 'https://example.com/poster.jpg')

    const image = poster.image()

    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe('https://example.com/poster.jpg')
    expect(image.attributes('alt')).toBe('Example Movie poster')
    expect(image.attributes('loading')).toBe('lazy')
  })

  it('renders a TV placeholder when no image is supplied', () => {
    mountEvent()

    expect(poster.image().exists()).toBe(false)

    const placeholder = poster.placeholder()

    expect(placeholder.text()).toContain('📺')
    expect(placeholder.attributes('role')).toBe('img')
    expect(placeholder.attributes('aria-label')).toBe('No poster available for Example Series')
  })

  it('renders a movie placeholder when no image is supplied', () => {
    mountEvent(digitalMovie)

    const placeholder = poster.placeholder()

    expect(placeholder.text()).toContain('🎬')
    expect(placeholder.attributes('aria-label')).toBe('No poster available for Example Movie')
  })

  it('renders a green indicator for TV', () => {
    mountEvent()

    expect(event.tvIndicator().exists()).toBe(true)
    expect(event.movieIndicator().exists()).toBe(false)
  })

  it('renders a blue indicator for movies', () => {
    mountEvent(digitalMovie)

    expect(event.movieIndicator().exists()).toBe(true)
    expect(event.tvIndicator().exists()).toBe(false)
  })

  it('hides the decorative media indicator from screen readers', () => {
    mountEvent()

    expect(event.decorativeIndicator().exists()).toBe(true)
    expect(event.indicator().attributes('aria-hidden')).toBe('true')
    expect(event.indicator().attributes('aria-label')).toBeUndefined()
  })

  it('formats date-only release dates', () => {
    mountEvent(digitalMovie)

    expect(event.validDate().text()).toBe('Nov 5, 2026')
    expect(event.validDate().attributes('datetime')).toBe('2026-11-05')
  })

  it('formats timestamp release dates', () => {
    mountEvent()

    expect(event.validDate().exists()).toBe(true)
    expect(event.validDate().attributes('datetime')).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('handles an invalid date gracefully', () => {
    mountEvent({
      ...digitalMovie,
      date: 'not-a-date',
    })

    expect(event.validDate().exists()).toBe(false)
    expect(event.invalidDate().text()).toBe('Unknown date')
  })

  it('does not expose the original poster URL without an image prop', () => {
    mountEvent({
      ...digitalMovie,
      posterUrl: 'https://example.com/poster.jpg?apikey=secret',
    })

    expect(poster.image().exists()).toBe(false)
    expect(wrapper.html()).not.toContain('apikey=secret')
  })
})
