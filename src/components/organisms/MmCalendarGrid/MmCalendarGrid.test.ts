import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import MmCalendarGrid from './MmCalendarGrid.vue'
import MmCalendarDay from '../../molecules/MmCalendarDay/MmCalendarDay.vue'
import type { CalendarItem } from '../../../types/calendar'
import { mmCalendarGridSelectors } from '../../../test/selectors/organisms/mmCalendarGrid.selectors'
import { mmCalendarDaySelectors } from '../../../test/selectors/molecules/mmCalendarDay.selectors'
import { mmCalendarTooltipSelectors } from '../../../test/selectors/molecules/mmCalendarTooltip.selectors'

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
  month?: string
  selectedDate?: string | null
  today?: string
  items?: CalendarItem[]
}

let wrapper: VueWrapper

const query = (selector: string) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^section\.calendar-grid /, ''))
}

const grid = mmCalendarGridSelectors(query)
const day = mmCalendarDaySelectors(query)
const tooltip = mmCalendarTooltipSelectors(query)

function mountGrid(options: MountOptions = {}) {
  wrapper = mount(MmCalendarGrid, {
    props: {
      month: options.month ?? '2026-11-01',
      selectedDate: options.selectedDate ?? null,
      today: options.today ?? '2026-11-05',
      items: options.items ?? [],
    },
  })
  return wrapper
}

describe('MmCalendarGrid', () => {
  it('renders a labeled calendar section', () => {
    mountGrid()

    expect(grid.labelled('November 2026 calendar').exists()).toBe(true)
  })

  it('renders Monday-first weekday headings', () => {
    mountGrid()

    expect(wrapper.findAll('.calendar-grid__weekday').map((weekday) => weekday.text())).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ])
  })

  it('hides decorative weekday headings from screen readers', () => {
    mountGrid()

    expect(grid.decorativeWeekdays().exists()).toBe(true)
  })

  it('renders complete weeks', () => {
    mountGrid()

    expect(wrapper.findAllComponents(MmCalendarDay).length % 7).toBe(0)
  })

  it('renders 42 days for November 2026', () => {
    mountGrid()

    expect(wrapper.findAllComponents(MmCalendarDay)).toHaveLength(42)
  })

  it('starts November 2026 on Monday, October 26', () => {
    mountGrid()

    const days = wrapper.findAllComponents(MmCalendarDay)

    expect(days[0]?.props('date')).toBe('2026-10-26')
    expect(days[0]?.props('day')).toBe(26)
    expect(days[0]?.props('isOutsideMonth')).toBe(true)
  })

  it('ends November 2026 on Sunday, December 6', () => {
    mountGrid()

    const days = wrapper.findAllComponents(MmCalendarDay)

    expect(days.at(-1)?.props('date')).toBe('2026-12-06')
    expect(days.at(-1)?.props('isOutsideMonth')).toBe(true)
  })

  it('renders five weeks when appropriate', () => {
    mountGrid({ month: '2026-09-01' })

    expect(wrapper.findAllComponents(MmCalendarDay)).toHaveLength(35)
  })

  it('renders four weeks when appropriate', () => {
    mountGrid({ month: '2027-02-01' })

    expect(wrapper.findAllComponents(MmCalendarDay)).toHaveLength(28)
  })

  it('marks dates inside and outside the month', () => {
    mountGrid()

    expect(day.date('2026-11-05').classes()).not.toContain('calendar-day--outside')
    expect(day.date('2026-10-26').classes()).toContain('calendar-day--outside')
  })

  it('highlights today', () => {
    mountGrid()

    expect(day.date('2026-11-05').classes()).toContain('calendar-day--today')
  })

  it('highlights the selected date', () => {
    mountGrid({ selectedDate: '2026-11-12' })

    expect(day.date('2026-11-12').attributes('aria-pressed')).toBe('true')
  })

  it('does not select a date by default', () => {
    mountGrid()

    expect(grid.selected().exists()).toBe(false)
  })

  it('renders TV and movie indicators', () => {
    mountGrid({ items: [tvItem, movieItem] })

    const selectedDay = day.date('2026-11-05')

    expect(selectedDay.find('.calendar-day__dot--tv').exists()).toBe(true)
    expect(selectedDay.find('.calendar-day__dot--movie').exists()).toBe(true)
  })

  it('includes the release count in the accessible label', () => {
    mountGrid({ items: [tvItem, movieItem] })

    expect(day.date('2026-11-05').attributes('aria-label')).toContain('2 releases')
  })

  it('shows releases on adjacent-month dates', () => {
    mountGrid({
      items: [{ ...tvItem, date: '2026-10-26' }],
    })

    expect(day.date('2026-10-26').find('.calendar-day__dot--tv').exists()).toBe(true)
  })

  it('ignores invalid release dates', () => {
    mountGrid({
      items: [{ ...tvItem, date: 'invalid' }],
    })

    expect(grid.dots().exists()).toBe(false)
  })

  it('emits selection on click', async () => {
    mountGrid()

    await day.date('2026-11-05').trigger('click')

    expect(wrapper.emitted('select')).toEqual([['2026-11-05']])
  })

  it('allows selecting adjacent-month dates', async () => {
    mountGrid()

    await day.date('2026-10-26').trigger('click')

    expect(wrapper.emitted('select')).toEqual([['2026-10-26']])
  })

  it('updates when the month changes', async () => {
    mountGrid()

    await wrapper.setProps({ month: '2026-12-01' })

    expect(grid.labelled('December 2026 calendar').exists()).toBe(true)
    expect(day.date('2026-12-15').exists()).toBe(true)
  })

  it('updates indicators when items change', async () => {
    mountGrid()

    await wrapper.setProps({ items: [tvItem, movieItem] })

    expect(day.date('2026-11-05').findAll('.calendar-day__dot')).toHaveLength(2)
  })

  it('updates selected dates', async () => {
    mountGrid({ selectedDate: '2026-11-05' })

    await wrapper.setProps({ selectedDate: '2026-11-12' })

    expect(day.date('2026-11-05').attributes('aria-pressed')).toBe('false')
    expect(day.date('2026-11-12').attributes('aria-pressed')).toBe('true')
  })

  it('handles invalid months gracefully', () => {
    mountGrid({ month: 'invalid' })

    expect(grid.labelled('Unknown month calendar').exists()).toBe(true)
    expect(wrapper.findAllComponents(MmCalendarDay)).toHaveLength(0)
  })

  it('shows the tooltip when hovering over a date with releases', async () => {
    mountGrid({ items: [tvItem, movieItem] })

    await day.date('2026-11-05').trigger('mouseenter')

    expect(tooltip.get().exists()).toBe(true)
    expect(tooltip.get().text()).toContain('Example Series')
    expect(tooltip.get().text()).toContain('Example Movie')
  })

  it('does not show a tooltip for empty dates', async () => {
    mountGrid({ items: [tvItem] })

    await day.date('2026-11-06').trigger('mouseenter')

    expect(grid.tooltip().exists()).toBe(false)
  })

  it('hides the tooltip on mouse leave', async () => {
    mountGrid({ items: [tvItem] })

    const selectedDay = day.date('2026-11-05')

    await selectedDay.trigger('mouseenter')
    await selectedDay.trigger('mouseleave')

    expect(grid.tooltip().exists()).toBe(false)
  })

  it('shows the tooltip on keyboard focus', async () => {
    mountGrid({ items: [tvItem] })

    await day.date('2026-11-05').trigger('focus')

    expect(grid.tooltip().exists()).toBe(true)
  })

  it('hides the tooltip on Escape', async () => {
    mountGrid({ items: [tvItem] })

    const selectedDay = day.date('2026-11-05')

    await selectedDay.trigger('focus')
    await selectedDay.trigger('keydown', { key: 'Escape' })

    expect(grid.tooltip().exists()).toBe(false)
  })

  it('hides the tooltip when selecting a date', async () => {
    mountGrid({ items: [tvItem] })

    const selectedDay = day.date('2026-11-05')

    await selectedDay.trigger('mouseenter')
    await selectedDay.trigger('click')

    expect(grid.tooltip().exists()).toBe(false)
    expect(wrapper.emitted('select')).toEqual([['2026-11-05']])
  })

  it('closes the tooltip when the month changes', async () => {
    mountGrid({ items: [tvItem] })

    await day.date('2026-11-05').trigger('mouseenter')
    await wrapper.setProps({ month: '2026-12-01' })

    expect(grid.tooltip().exists()).toBe(false)
  })

  it('closes the tooltip when releases change', async () => {
    mountGrid({ items: [tvItem] })

    await day.date('2026-11-05').trigger('mouseenter')
    await wrapper.setProps({ items: [] })

    expect(grid.tooltip().exists()).toBe(false)
  })

  it('links the hovered day to its tooltip accessibly', async () => {
    mountGrid({ items: [tvItem] })

    await day.date('2026-11-05').trigger('mouseenter')

    const tooltipId = tooltip.get().attributes('id')

    expect(tooltipId).toBeTruthy()
    expect(tooltip.get().attributes('role')).toBe('tooltip')
    expect(day.date('2026-11-05').attributes('aria-describedby')).toBe(tooltipId)
  })

  it('uses unique tooltip IDs for multiple grids in the same application', async () => {
    const Parent = defineComponent({
      setup() {
        return () =>
          h('div', [
            h(MmCalendarGrid, {
              month: '2026-11-01',
              today: '2026-11-05',
              items: [tvItem],
            }),
            h(MmCalendarGrid, {
              month: '2026-11-01',
              today: '2026-11-05',
              items: [tvItem],
            }),
          ])
      },
    })

    const parent = mount(Parent)
    const grids = parent.findAllComponents(MmCalendarGrid)

    expect(grids).toHaveLength(2)

    await grids[0]!.get('[data-date="2026-11-05"]').trigger('mouseenter')
    await grids[1]!.get('[data-date="2026-11-05"]').trigger('mouseenter')

    const firstTooltip = grids[0]!.get('.calendar-tooltip')
    const secondTooltip = grids[1]!.get('.calendar-tooltip')
    const firstId = firstTooltip.attributes('id')
    const secondId = secondTooltip.attributes('id')

    expect(firstId).toBeTruthy()
    expect(secondId).toBeTruthy()
    expect(firstId).not.toBe(secondId)
    expect(grids[0]!.get('[data-date="2026-11-05"]').attributes('aria-describedby')).toBe(firstId)
    expect(grids[1]!.get('[data-date="2026-11-05"]').attributes('aria-describedby')).toBe(secondId)
  })
})
