import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import MmCalendarDetails from './MmCalendarDetails.vue'
import MmCalendarEvent from '../../molecules/MmCalendarEvent/MmCalendarEvent.vue'
import type { CalendarItem } from '../../../types/calendar'
import { mmCalendarDetailsSelectors } from '../../../test/selectors/organisms/mmCalendarDetails.selectors'
import { mmMediaPosterSelectors } from '../../../test/selectors/atoms/mmMediaPoster.selectors'

const tvItem: CalendarItem = {
  id: 'sonarr-101',
  source: 'sonarr',
  type: 'tv',
  title: 'Example Series',
  subtitle: 'S02E03 · The Adventure',
  date: '2026-11-05',
  releaseType: 'air',
  posterUrl: null,
}

const movieItem: CalendarItem = {
  id: 'radarr-201',
  source: 'radarr',
  type: 'movie',
  title: 'Example Movie',
  subtitle: '2026',
  date: '2026-11-05',
  releaseType: 'digital',
  posterUrl: null,
}

interface MountOptions {
  date?: string
  items?: CalendarItem[]
  images?: Record<string, string | null>
  loading?: boolean
}

let wrapper: VueWrapper

const query = (selector: string) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^section\.calendar-details /, ''))
}

const details = mmCalendarDetailsSelectors(query)
const poster = mmMediaPosterSelectors(query)

function mountDetails(options: MountOptions = {}) {
  wrapper = mount(MmCalendarDetails, {
    props: {
      date: options.date ?? '2026-11-05',
      items: options.items ?? [],
      images: options.images ?? {},
      loading: options.loading ?? false,
    },
  })
  return wrapper
}

describe('MmCalendarDetails', () => {
  it('renders the selected date as a heading', () => {
    mountDetails()

    expect(details.title().text()).toBe('Thursday, November 5, 2026')
  })

  it('labels the section using its heading', () => {
    mountDetails()

    const section = details.get()
    const heading = details.title()

    expect(heading.attributes('id')).toBeTruthy()
    expect(section.attributes('aria-labelledby')).toBe(heading.attributes('id'))
  })

  it('uses unique heading IDs for multiple instances in the same application', () => {
    const Parent = defineComponent({
      setup() {
        return () =>
          h('div', [
            h(MmCalendarDetails, { date: '2026-11-05', items: [tvItem] }),
            h(MmCalendarDetails, { date: '2026-11-06', items: [movieItem] }),
          ])
      },
    })

    const parent = mount(Parent)
    const sections = parent.findAll('section.calendar-details')
    const headings = parent.findAll('.calendar-details__title')

    expect(sections).toHaveLength(2)
    expect(headings).toHaveLength(2)

    const firstId = headings[0]!.attributes('id')
    const secondId = headings[1]!.attributes('id')

    expect(firstId).toBeTruthy()
    expect(secondId).toBeTruthy()
    expect(firstId).not.toBe(secondId)
    expect(sections[0]!.attributes('aria-labelledby')).toBe(firstId)
    expect(sections[1]!.attributes('aria-labelledby')).toBe(secondId)
  })

  it('shows a zero-release count for an empty day', () => {
    mountDetails()

    expect(details.count().text()).toBe('0 releases')
  })

  it('uses singular wording for one release', () => {
    mountDetails({ items: [tvItem] })

    expect(details.count().text()).toBe('1 release')
  })

  it('uses plural wording for multiple releases', () => {
    mountDetails({ items: [tvItem, movieItem] })

    expect(details.count().text()).toBe('2 releases')
  })

  it('shows an empty state when no releases are scheduled', () => {
    mountDetails()

    expect(details.empty().text()).toBe('No releases scheduled for this day.')
    expect(details.eventCards().exists()).toBe(false)
  })

  it('renders one calendar event for each item', () => {
    mountDetails({ items: [tvItem, movieItem] })

    const events = wrapper.findAllComponents(MmCalendarEvent)

    expect(events).toHaveLength(2)
    expect(events[0]?.props('item')).toEqual(tvItem)
    expect(events[1]?.props('item')).toEqual(movieItem)
    expect(wrapper.findAll('article.calendar-event')).toHaveLength(2)
  })

  it('renders TV and movie titles', () => {
    mountDetails({ items: [tvItem, movieItem] })

    expect(details.get().text()).toContain('Example Series')
    expect(details.get().text()).toContain('Example Movie')
  })

  it('passes resolved artwork to the correct event', () => {
    const image = 'data:image/jpeg;base64,example'

    mountDetails({
      items: [tvItem, movieItem],
      images: {
        'sonarr-101': image,
        'radarr-201': null,
      },
    })

    const events = wrapper.findAllComponents(MmCalendarEvent)

    expect(events[0]?.props('image')).toBe(image)
    expect(events[1]?.props('image')).toBe(null)
    expect(poster.image().attributes('src')).toBe(image)
  })

  it('uses placeholders when artwork is not available', () => {
    mountDetails({ items: [tvItem, movieItem] })

    expect(details.images().exists()).toBe(false)
    expect(wrapper.findAll('.media-poster__placeholder')).toHaveLength(2)
  })

  it('does not expose unresolved poster URLs', () => {
    mountDetails({
      items: [{ ...tvItem, posterUrl: 'https://example.com/poster.jpg?apikey=secret' }],
    })

    expect(details.images().exists()).toBe(false)
    expect(wrapper.html()).not.toContain('apikey=secret')
  })

  it('shows a loading state while fetching releases', () => {
    mountDetails({ items: [tvItem], loading: true })

    expect(details.loading().text()).toBe('Loading releases…')
    expect(details.eventCards().exists()).toBe(false)
  })

  it('prioritizes loading over the empty state', () => {
    mountDetails({ loading: true })

    expect(details.loading().text()).toBe('Loading releases…')
    expect(details.empty().exists()).toBe(false)
  })

  it('handles invalid dates gracefully', () => {
    mountDetails({ date: 'not-a-date' })

    expect(details.title().text()).toBe('Unknown date')
  })

  it('updates the heading when the selected date changes', async () => {
    mountDetails()

    await wrapper.setProps({ date: '2026-11-06' })

    expect(details.title().text()).toBe('Friday, November 6, 2026')
  })

  it('updates the release count when items change', async () => {
    mountDetails()

    expect(details.count().text()).toBe('0 releases')

    await wrapper.setProps({ items: [tvItem, movieItem] })

    expect(details.count().text()).toBe('2 releases')
    expect(wrapper.findAllComponents(MmCalendarEvent)).toHaveLength(2)
  })

  it('updates artwork when the images prop changes', async () => {
    mountDetails({ items: [tvItem] })

    expect(details.images().exists()).toBe(false)

    await wrapper.setProps({
      images: { 'sonarr-101': 'data:image/png;base64,updated' },
    })

    expect(poster.image().attributes('src')).toBe('data:image/png;base64,updated')
  })

  it('switches from loading to showing releases', async () => {
    mountDetails({ items: [tvItem], loading: true })

    await wrapper.setProps({ loading: false })

    expect(details.loading().exists()).toBe(false)
    expect(wrapper.findAllComponents(MmCalendarEvent)).toHaveLength(1)
  })
})
