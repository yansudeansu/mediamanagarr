import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmCalendarEvent from './MmCalendarEvent.vue'
import MmMediaPoster from '../../atoms/MmMediaPoster/MmMediaPoster.vue'
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

function mountEvent(item: CalendarItem = tvItem, image: string | null = null) {
  return mount(MmCalendarEvent, {
    props: {
      item,
      image,
    },
  })
}

describe('MmCalendarEvent', () => {
  it('renders a TV episode title and subtitle', () => {
    const wrapper = mountEvent()

    expect(wrapper.text()).toContain('Example Series')
    expect(wrapper.text()).toContain('S02E03 · The Adventure')
    expect(wrapper.text()).toContain('TV episode')
  })

  it('renders a movie title and subtitle', () => {
    const wrapper = mountEvent(digitalMovie)

    expect(wrapper.text()).toContain('Example Movie')
    expect(wrapper.text()).toContain('2026')
    expect(wrapper.text()).toContain('Movie')
  })

  it('labels TV releases as airing', () => {
    const wrapper = mountEvent()

    expect(wrapper.find('.calendar-event__release-type').text()).toBe('Airing')
  })

  it('labels digital movie releases', () => {
    const wrapper = mountEvent(digitalMovie)

    expect(wrapper.find('.calendar-event__release-type').text()).toBe('Digital release')
  })

  it('labels physical movie releases', () => {
    const wrapper = mountEvent({
      ...digitalMovie,
      releaseType: 'physical',
    })

    expect(wrapper.find('.calendar-event__release-type').text()).toBe('Physical release')
  })

  it('uses the shared media poster atom for TV', () => {
    const wrapper = mountEvent()

    expect(wrapper.getComponent(MmMediaPoster).props()).toMatchObject({
      title: 'Example Series',
      type: 'tv',
      image: null,
    })
  })

  it('uses the shared media poster atom for movies', () => {
    const wrapper = mountEvent(digitalMovie, 'https://example.com/poster.jpg')

    expect(wrapper.getComponent(MmMediaPoster).props()).toMatchObject({
      title: 'Example Movie',
      type: 'movie',
      image: 'https://example.com/poster.jpg',
    })
  })

  it('renders a poster image when supplied', () => {
    const wrapper = mountEvent(digitalMovie, 'https://example.com/poster.jpg')

    const image = wrapper.find('img')

    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe('https://example.com/poster.jpg')
    expect(image.attributes('alt')).toBe('Example Movie poster')
    expect(image.attributes('loading')).toBe('lazy')
  })

  it('renders a TV placeholder when no image is supplied', () => {
    const wrapper = mountEvent()

    expect(wrapper.find('img').exists()).toBe(false)

    const placeholder = wrapper.get('.media-poster__placeholder')

    expect(placeholder.text()).toContain('📺')
    expect(placeholder.attributes('role')).toBe('img')
    expect(placeholder.attributes('aria-label')).toBe('No poster available for Example Series')
  })

  it('renders a movie placeholder when no image is supplied', () => {
    const wrapper = mountEvent(digitalMovie)

    const placeholder = wrapper.get('.media-poster__placeholder')

    expect(placeholder.text()).toContain('🎬')
    expect(placeholder.attributes('aria-label')).toBe('No poster available for Example Movie')
  })

  it('renders a green indicator for TV', () => {
    const wrapper = mountEvent()

    expect(wrapper.find('.calendar-event__indicator--tv').exists()).toBe(true)
    expect(wrapper.find('.calendar-event__indicator--movie').exists()).toBe(false)
  })

  it('renders a blue indicator for movies', () => {
    const wrapper = mountEvent(digitalMovie)

    expect(wrapper.find('.calendar-event__indicator--movie').exists()).toBe(true)
    expect(wrapper.find('.calendar-event__indicator--tv').exists()).toBe(false)
  })

  it('hides the decorative media indicator from screen readers', () => {
    const wrapper = mountEvent()

    const indicator = wrapper.find('.calendar-event__indicator')

    expect(indicator.attributes('aria-hidden')).toBe('true')
    expect(indicator.attributes('aria-label')).toBeUndefined()
  })

  it('formats date-only release dates', () => {
    const wrapper = mountEvent(digitalMovie)

    expect(wrapper.find('time').text()).toBe('Nov 5, 2026')
    expect(wrapper.find('time').attributes('datetime')).toBe('2026-11-05')
  })

  it('formats timestamp release dates', () => {
    const wrapper = mountEvent()

    expect(wrapper.find('time').exists()).toBe(true)
    expect(wrapper.find('time').attributes('datetime')).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('handles an invalid date gracefully', () => {
    const wrapper = mountEvent({
      ...digitalMovie,
      date: 'not-a-date',
    })

    expect(wrapper.find('time').exists()).toBe(false)
    expect(wrapper.text()).toContain('Unknown date')
  })

  it('does not expose the original poster URL without an image prop', () => {
    const wrapper = mountEvent({
      ...digitalMovie,
      posterUrl: 'https://example.com/poster.jpg?apikey=secret',
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.html()).not.toContain('apikey=secret')
  })
})
