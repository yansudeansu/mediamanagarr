import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmCalendarDay from './MmCalendarDay.vue'
import type { CalendarItem } from '../../../types/calendar'

const tvItem: CalendarItem = {
  id: 'sonarr-101',
  source: 'sonarr',
  type: 'tv',
  title: 'Example Series',
  subtitle: 'S01E01',
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

function mountDay(props: Partial<InstanceType<typeof MmCalendarDay>['$props']> = {}) {
  return mount(MmCalendarDay, {
    props: {
      date: '2026-11-05',
      day: 5,
      ...props,
    },
  })
}

describe('MmCalendarDay', () => {
  it('renders the day number', () => {
    const wrapper = mountDay()

    expect(wrapper.text()).toContain('5')
    expect(wrapper.find('button').attributes('type')).toBe('button')
  })

  it('emits the selected date when clicked', async () => {
    const wrapper = mountDay()

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('select')).toEqual([['2026-11-05']])
  })

  it('renders TV and movie indicators', () => {
    const wrapper = mountDay({
      items: [tvItem, movieItem],
    })

    expect(wrapper.find('.calendar-day__dot--tv').exists()).toBe(true)
    expect(wrapper.find('.calendar-day__dot--movie').exists()).toBe(true)
  })

  it('renders only one indicator per media type', () => {
    const wrapper = mountDay({
      items: [
        tvItem,
        { ...tvItem, id: 'sonarr-102' },
        movieItem,
        { ...movieItem, id: 'radarr-202' },
      ],
    })

    expect(wrapper.findAll('.calendar-day__dot--tv')).toHaveLength(1)
    expect(wrapper.findAll('.calendar-day__dot--movie')).toHaveLength(1)
  })

  it('renders no indicators for an empty day', () => {
    const wrapper = mountDay()

    expect(wrapper.find('.calendar-day__indicators').exists()).toBe(false)
  })

  it('marks today and selected states', () => {
    const wrapper = mountDay({
      isToday: true,
      isSelected: true,
    })

    expect(wrapper.classes()).toContain('calendar-day--today')
    expect(wrapper.classes()).toContain('calendar-day--selected')
    expect(wrapper.attributes('aria-pressed')).toBe('true')
  })

  it('marks adjacent-month dates', () => {
    const wrapper = mountDay({
      isOutsideMonth: true,
    })

    expect(wrapper.classes()).toContain('calendar-day--outside')
  })

  it('provides an accessible date label', () => {
    const wrapper = mountDay()

    expect(wrapper.attributes('aria-label')).toBe('Thursday, November 5, 2026')
  })

  it('includes the release count in the accessible label', () => {
    const wrapper = mountDay({
      items: [tvItem, movieItem],
    })

    expect(wrapper.attributes('aria-label')).toBe('Thursday, November 5, 2026, 2 releases')
  })

  it('hides decorative indicators from screen readers', () => {
    const wrapper = mountDay({
      items: [tvItem],
    })

    expect(wrapper.get('.calendar-day__indicators').attributes('aria-hidden')).toBe('true')
  })

  it('emits preview on mouse enter when releases exist', async () => {
    const wrapper = mountDay({
      items: [tvItem],
    })

    await wrapper.trigger('mouseenter')

    expect(wrapper.emitted('preview')).toEqual([['2026-11-05']])
  })

  it('does not emit preview on empty dates', async () => {
    const wrapper = mountDay()

    await wrapper.trigger('mouseenter')

    expect(wrapper.emitted('preview')).toBeUndefined()
  })

  it('emits hide-preview on mouse leave', async () => {
    const wrapper = mountDay({
      items: [tvItem],
    })

    await wrapper.trigger('mouseleave')

    expect(wrapper.emitted('hide-preview')).toEqual([['2026-11-05']])
  })

  it('shows the preview on keyboard focus', async () => {
    const wrapper = mountDay({
      items: [tvItem],
    })

    await wrapper.trigger('focus')

    expect(wrapper.emitted('preview')).toEqual([['2026-11-05']])
  })

  it('hides the preview on blur', async () => {
    const wrapper = mountDay({
      items: [tvItem],
    })

    await wrapper.trigger('blur')

    expect(wrapper.emitted('hide-preview')).toEqual([['2026-11-05']])
  })

  it('hides the preview when Escape is pressed', async () => {
    const wrapper = mountDay({
      items: [tvItem],
    })

    await wrapper.trigger('keydown', {
      key: 'Escape',
    })

    expect(wrapper.emitted('hide-preview')).toEqual([['2026-11-05']])
  })

  it('connects the active tooltip using aria-describedby', () => {
    const wrapper = mountDay({
      items: [tvItem],
      tooltipId: 'calendar-day-tooltip',
    })

    expect(wrapper.attributes('aria-describedby')).toBe('calendar-day-tooltip')
  })

  it('does not reference a tooltip on empty dates', () => {
    const wrapper = mountDay({
      tooltipId: 'calendar-day-tooltip',
    })

    expect(wrapper.attributes('aria-describedby')).toBeUndefined()
  })

  it('does not use a native title tooltip', () => {
    const wrapper = mountDay({
      items: [tvItem],
    })

    expect(wrapper.attributes('title')).toBeUndefined()
  })
})
