import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmCalendarDay from './MmCalendarDay.vue'
import { mmCalendarDaySelectors } from '../../../test/selectors/molecules/mmCalendarDay.selectors'
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

let wrapper: VueWrapper

const day = mmCalendarDaySelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^button\.calendar-day /, ''))
})

function mountDay(props: Partial<InstanceType<typeof MmCalendarDay>['$props']> = {}) {
  wrapper = mount(MmCalendarDay, {
    props: {
      date: '2026-11-05',
      day: 5,
      ...props,
    },
  })
  return wrapper
}

describe('MmCalendarDay', () => {
  it('renders the day number', () => {
    mountDay()

    expect(day.number().text()).toContain('5')
    expect(day.get().attributes('type')).toBe('button')
  })

  it('emits the selected date when clicked', async () => {
    mountDay()

    await day.get().trigger('click')

    expect(wrapper.emitted('select')).toEqual([['2026-11-05']])
  })

  it('renders TV and movie indicators', () => {
    mountDay({ items: [tvItem, movieItem] })

    expect(day.tvDot().exists()).toBe(true)
    expect(day.movieDot().exists()).toBe(true)
  })

  it('renders only one indicator per media type', () => {
    mountDay({
      items: [
        tvItem,
        { ...tvItem, id: 'sonarr-102' },
        movieItem,
        { ...movieItem, id: 'radarr-202' },
      ],
    })

    expect(day.tvDot().exists()).toBe(true)
    expect(day.movieDot().exists()).toBe(true)
    expect(wrapper.findAll('.calendar-day__dot--tv')).toHaveLength(1)
    expect(wrapper.findAll('.calendar-day__dot--movie')).toHaveLength(1)
  })

  it('renders no indicators for an empty day', () => {
    mountDay()

    expect(day.indicators().exists()).toBe(false)
  })

  it('marks today and selected states', () => {
    mountDay({
      isToday: true,
      isSelected: true,
    })

    expect(day.today().exists()).toBe(true)
    expect(day.selected().exists()).toBe(true)
    expect(day.get().attributes('aria-pressed')).toBe('true')
  })

  it('marks adjacent-month dates', () => {
    mountDay({ isOutsideMonth: true })

    expect(day.outside().exists()).toBe(true)
  })

  it('provides an accessible date label', () => {
    mountDay()

    expect(day.get().attributes('aria-label')).toBe('Thursday, November 5, 2026')
  })

  it('includes the release count in the accessible label', () => {
    mountDay({ items: [tvItem, movieItem] })

    expect(day.get().attributes('aria-label')).toBe('Thursday, November 5, 2026, 2 releases')
  })

  it('hides decorative indicators from screen readers', () => {
    mountDay({ items: [tvItem] })

    expect(day.decorativeIndicators().exists()).toBe(true)
    expect(day.indicators().attributes('aria-hidden')).toBe('true')
  })

  it('emits preview on mouse enter when releases exist', async () => {
    mountDay({ items: [tvItem] })

    await day.get().trigger('mouseenter')

    expect(wrapper.emitted('preview')).toEqual([['2026-11-05']])
  })

  it('does not emit preview on empty dates', async () => {
    mountDay()

    await day.get().trigger('mouseenter')

    expect(wrapper.emitted('preview')).toBeUndefined()
  })

  it('emits hide-preview on mouse leave', async () => {
    mountDay({ items: [tvItem] })

    await day.get().trigger('mouseleave')

    expect(wrapper.emitted('hide-preview')).toEqual([['2026-11-05']])
  })

  it('shows the preview on keyboard focus', async () => {
    mountDay({ items: [tvItem] })

    await day.get().trigger('focus')

    expect(wrapper.emitted('preview')).toEqual([['2026-11-05']])
  })

  it('hides the preview on blur', async () => {
    mountDay({ items: [tvItem] })

    await day.get().trigger('blur')

    expect(wrapper.emitted('hide-preview')).toEqual([['2026-11-05']])
  })

  it('hides the preview when Escape is pressed', async () => {
    mountDay({ items: [tvItem] })

    await day.get().trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('hide-preview')).toEqual([['2026-11-05']])
  })

  it('connects the active tooltip using aria-describedby', () => {
    mountDay({
      items: [tvItem],
      tooltipId: 'calendar-day-tooltip',
    })

    expect(day.describedBy('calendar-day-tooltip').exists()).toBe(true)
  })

  it('does not reference a tooltip on empty dates', () => {
    mountDay({ tooltipId: 'calendar-day-tooltip' })

    expect(day.get().attributes('aria-describedby')).toBeUndefined()
  })

  it('does not use a native title tooltip', () => {
    mountDay({ items: [tvItem] })

    expect(day.get().attributes('title')).toBeUndefined()
  })
})
