import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import MmCalendarDetails from './MmCalendarDetails.vue'
import MmCalendarEvent from '../../molecules/MmCalendarEvent/MmCalendarEvent.vue'
import type { CalendarItem } from '../../../types/calendar'

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

function mountDetails(options: MountOptions = {}) {
  return mount(MmCalendarDetails, {
    props: {
      date: options.date ?? '2026-11-05',
      items: options.items ?? [],
      images: options.images ?? {},
      loading: options.loading ?? false,
    },
  })
}

describe('MmCalendarDetails', () => {
  it('renders the selected date as a heading', () => {
    const wrapper = mountDetails()

    expect(wrapper.get('.calendar-details__title').text()).toBe('Thursday, November 5, 2026')
  })

  it('labels the section using its heading', () => {
    const wrapper = mountDetails()

    const section = wrapper.get('section')
    const heading = wrapper.get('.calendar-details__title')

    expect(heading.attributes('id')).toBeTruthy()
    expect(section.attributes('aria-labelledby')).toBe(heading.attributes('id'))
  })

  it('uses unique heading IDs for multiple instances in the same application', () => {
    const Parent = defineComponent({
      setup() {
        return () =>
          h('div', [
            h(MmCalendarDetails, {
              date: '2026-11-05',
              items: [tvItem],
            }),
            h(MmCalendarDetails, {
              date: '2026-11-06',
              items: [movieItem],
            }),
          ])
      },
    })

    const wrapper = mount(Parent)

    const sections = wrapper.findAll('section.calendar-details')
    const headings = wrapper.findAll('.calendar-details__title')

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
    const wrapper = mountDetails()

    expect(wrapper.get('.calendar-details__count').text()).toBe('0 releases')
  })

  it('uses singular wording for one release', () => {
    const wrapper = mountDetails({
      items: [tvItem],
    })

    expect(wrapper.get('.calendar-details__count').text()).toBe('1 release')
  })

  it('uses plural wording for multiple releases', () => {
    const wrapper = mountDetails({
      items: [tvItem, movieItem],
    })

    expect(wrapper.get('.calendar-details__count').text()).toBe('2 releases')
  })

  it('shows an empty state when no releases are scheduled', () => {
    const wrapper = mountDetails()

    expect(wrapper.get('.calendar-details__state').text()).toBe(
      'No releases scheduled for this day.',
    )

    expect(wrapper.findAllComponents(MmCalendarEvent)).toHaveLength(0)
  })

  it('renders one calendar event for each item', () => {
    const wrapper = mountDetails({
      items: [tvItem, movieItem],
    })

    const events = wrapper.findAllComponents(MmCalendarEvent)

    expect(events).toHaveLength(2)
    expect(events[0]?.props('item')).toEqual(tvItem)
    expect(events[1]?.props('item')).toEqual(movieItem)
  })

  it('renders TV and movie titles', () => {
    const wrapper = mountDetails({
      items: [tvItem, movieItem],
    })

    expect(wrapper.text()).toContain('Example Series')
    expect(wrapper.text()).toContain('Example Movie')
  })

  it('passes resolved artwork to the correct event', () => {
    const image = 'data:image/jpeg;base64,example'

    const wrapper = mountDetails({
      items: [tvItem, movieItem],
      images: {
        'sonarr-101': image,
        'radarr-201': null,
      },
    })

    const events = wrapper.findAllComponents(MmCalendarEvent)

    expect(events[0]?.props('image')).toBe(image)
    expect(events[1]?.props('image')).toBe(null)

    expect(wrapper.get('img').attributes('src')).toBe(image)
  })

  it('uses placeholders when artwork is not available', () => {
    const wrapper = mountDetails({
      items: [tvItem, movieItem],
    })

    expect(wrapper.findAll('img')).toHaveLength(0)
    expect(wrapper.findAll('.media-poster__placeholder')).toHaveLength(2)
  })

  it('does not expose unresolved poster URLs', () => {
    const wrapper = mountDetails({
      items: [
        {
          ...tvItem,
          posterUrl: 'https://example.com/poster.jpg?apikey=secret',
        },
      ],
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.html()).not.toContain('apikey=secret')
  })

  it('shows a loading state while fetching releases', () => {
    const wrapper = mountDetails({
      items: [tvItem],
      loading: true,
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Loading releases…')
    expect(wrapper.findAllComponents(MmCalendarEvent)).toHaveLength(0)
  })

  it('prioritizes loading over the empty state', () => {
    const wrapper = mountDetails({
      loading: true,
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Loading releases…')
    expect(wrapper.text()).not.toContain('No releases scheduled for this day.')
  })

  it('handles invalid dates gracefully', () => {
    const wrapper = mountDetails({
      date: 'not-a-date',
    })

    expect(wrapper.get('.calendar-details__title').text()).toBe('Unknown date')
  })

  it('updates the heading when the selected date changes', async () => {
    const wrapper = mountDetails()

    await wrapper.setProps({
      date: '2026-11-06',
    })

    expect(wrapper.get('.calendar-details__title').text()).toBe('Friday, November 6, 2026')
  })

  it('updates the release count when items change', async () => {
    const wrapper = mountDetails()

    expect(wrapper.get('.calendar-details__count').text()).toBe('0 releases')

    await wrapper.setProps({
      items: [tvItem, movieItem],
    })

    expect(wrapper.get('.calendar-details__count').text()).toBe('2 releases')
    expect(wrapper.findAllComponents(MmCalendarEvent)).toHaveLength(2)
  })

  it('updates artwork when the images prop changes', async () => {
    const wrapper = mountDetails({
      items: [tvItem],
    })

    expect(wrapper.find('img').exists()).toBe(false)

    await wrapper.setProps({
      images: {
        'sonarr-101': 'data:image/png;base64,updated',
      },
    })

    expect(wrapper.get('img').attributes('src')).toBe('data:image/png;base64,updated')
  })

  it('switches from loading to showing releases', async () => {
    const wrapper = mountDetails({
      items: [tvItem],
      loading: true,
    })

    await wrapper.setProps({
      loading: false,
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.findAllComponents(MmCalendarEvent)).toHaveLength(1)
  })
})
