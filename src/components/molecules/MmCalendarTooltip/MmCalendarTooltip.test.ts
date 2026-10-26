import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmCalendarTooltip from './MmCalendarTooltip.vue'
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

describe('MmCalendarTooltip', () => {
  it('renders an accessible tooltip', () => {
    const wrapper = mount(MmCalendarTooltip, {
      props: {
        date: '2026-11-05',
        items: [tvItem],
      },
    })

    expect(wrapper.attributes('role')).toBe('tooltip')
    expect(wrapper.text()).toContain('Thursday, November 5')
  })

  it('renders release titles and subtitles', () => {
    const wrapper = mount(MmCalendarTooltip, {
      props: {
        date: '2026-11-05',
        items: [tvItem, movieItem],
      },
    })

    expect(wrapper.text()).toContain('Example Series')
    expect(wrapper.text()).toContain('S02E03 · The Adventure')
    expect(wrapper.text()).toContain('Example Movie')
    expect(wrapper.text()).toContain('2026')
  })

  it('renders media indicators', () => {
    const wrapper = mount(MmCalendarTooltip, {
      props: {
        date: '2026-11-05',
        items: [tvItem, movieItem],
      },
    })

    expect(wrapper.findAll('.calendar-tooltip__indicator--tv')).toHaveLength(1)
    expect(wrapper.findAll('.calendar-tooltip__indicator--movie')).toHaveLength(1)
  })

  it('shows the plural release count', () => {
    const wrapper = mount(MmCalendarTooltip, {
      props: {
        date: '2026-11-05',
        items: [tvItem, movieItem],
      },
    })

    expect(wrapper.get('.calendar-tooltip__count').text()).toBe('2 releases')
  })

  it('shows the singular release count', () => {
    const wrapper = mount(MmCalendarTooltip, {
      props: {
        date: '2026-11-05',
        items: [tvItem],
      },
    })

    expect(wrapper.get('.calendar-tooltip__count').text()).toBe('1 release')
  })

  it('shows zero releases when the day is empty', () => {
    const wrapper = mount(MmCalendarTooltip, {
      props: {
        date: '2026-11-05',
        items: [],
      },
    })

    expect(wrapper.get('.calendar-tooltip__count').text()).toBe('0 releases')
    expect(wrapper.findAll('.calendar-tooltip__item')).toHaveLength(0)
  })

  it('limits the preview to four releases', () => {
    const items = Array.from({ length: 6 }, (_, index) => ({
      ...tvItem,
      id: `sonarr-${index}`,
      title: `Series ${index}`,
    }))

    const wrapper = mount(MmCalendarTooltip, {
      props: {
        date: '2026-11-05',
        items,
      },
    })

    expect(wrapper.findAll('.calendar-tooltip__item')).toHaveLength(4)
    expect(wrapper.get('.calendar-tooltip__remaining').text()).toBe('+2 more')
    expect(wrapper.get('.calendar-tooltip__count').text()).toBe('6 releases')
  })

  it('handles invalid dates', () => {
    const wrapper = mount(MmCalendarTooltip, {
      props: {
        date: 'invalid',
        items: [tvItem],
      },
    })

    expect(wrapper.text()).toContain('Unknown date')
  })
})
