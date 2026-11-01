import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import MmCalendarGrid from './MmCalendarGrid.vue'
import MmCalendarDay from '../../molecules/MmCalendarDay/MmCalendarDay.vue'
import MmCalendarTooltip from '../../molecules/MmCalendarTooltip/MmCalendarTooltip.vue'
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
  month?: string
  selectedDate?: string | null
  today?: string
  items?: CalendarItem[]
}

function mountGrid(options: MountOptions = {}) {
  return mount(MmCalendarGrid, {
    props: {
      month: options.month ?? '2026-11-01',
      selectedDate: options.selectedDate ?? null,
      today: options.today ?? '2026-11-05',
      items: options.items ?? [],
    },
  })
}

describe('MmCalendarGrid', () => {
  it('renders a labeled calendar section', () => {
    const wrapper = mountGrid()

    expect(wrapper.get('section').attributes('aria-label')).toBe('November 2026 calendar')
  })

  it('renders Monday-first weekday headings', () => {
    const wrapper = mountGrid()

    expect(wrapper.findAll('.calendar-grid__weekday').map((day) => day.text())).toEqual([
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
    const wrapper = mountGrid()

    expect(wrapper.get('.calendar-grid__weekdays').attributes('aria-hidden')).toBe('true')
  })

  it('renders complete weeks', () => {
    const wrapper = mountGrid()

    expect(wrapper.findAllComponents(MmCalendarDay).length % 7).toBe(0)
  })

  it('renders 42 days for November 2026', () => {
    const wrapper = mountGrid()

    expect(wrapper.findAllComponents(MmCalendarDay)).toHaveLength(42)
  })

  it('starts November 2026 on Monday, October 26', () => {
    const wrapper = mountGrid()
    const days = wrapper.findAllComponents(MmCalendarDay)

    expect(days[0]?.props('date')).toBe('2026-10-26')
    expect(days[0]?.props('day')).toBe(26)
    expect(days[0]?.props('isOutsideMonth')).toBe(true)
  })

  it('ends November 2026 on Sunday, December 6', () => {
    const wrapper = mountGrid()
    const days = wrapper.findAllComponents(MmCalendarDay)

    expect(days.at(-1)?.props('date')).toBe('2026-12-06')
    expect(days.at(-1)?.props('isOutsideMonth')).toBe(true)
  })

  it('renders five weeks when appropriate', () => {
    const wrapper = mountGrid({
      month: '2026-09-01',
    })

    expect(wrapper.findAllComponents(MmCalendarDay)).toHaveLength(35)
  })

  it('renders four weeks when appropriate', () => {
    const wrapper = mountGrid({
      month: '2027-02-01',
    })

    expect(wrapper.findAllComponents(MmCalendarDay)).toHaveLength(28)
  })

  it('marks dates inside and outside the month', () => {
    const wrapper = mountGrid()

    expect(wrapper.get('[data-date="2026-11-05"]').classes()).not.toContain('calendar-day--outside')
    expect(wrapper.get('[data-date="2026-10-26"]').classes()).toContain('calendar-day--outside')
  })

  it('highlights today', () => {
    const wrapper = mountGrid()

    expect(wrapper.get('[data-date="2026-11-05"]').classes()).toContain('calendar-day--today')
  })

  it('highlights the selected date', () => {
    const wrapper = mountGrid({
      selectedDate: '2026-11-12',
    })

    expect(wrapper.get('[data-date="2026-11-12"]').attributes('aria-pressed')).toBe('true')
  })

  it('does not select a date by default', () => {
    const wrapper = mountGrid()

    expect(wrapper.find('[aria-pressed="true"]').exists()).toBe(false)
  })

  it('renders TV and movie indicators', () => {
    const wrapper = mountGrid({
      items: [tvItem, movieItem],
    })

    const day = wrapper.get('[data-date="2026-11-05"]')

    expect(day.find('.calendar-day__dot--tv').exists()).toBe(true)
    expect(day.find('.calendar-day__dot--movie').exists()).toBe(true)
  })

  it('includes the release count in the accessible label', () => {
    const wrapper = mountGrid({
      items: [tvItem, movieItem],
    })

    expect(wrapper.get('[data-date="2026-11-05"]').attributes('aria-label')).toContain('2 releases')
  })

  it('shows releases on adjacent-month dates', () => {
    const wrapper = mountGrid({
      items: [
        {
          ...tvItem,
          date: '2026-10-26',
        },
      ],
    })

    expect(wrapper.get('[data-date="2026-10-26"]').find('.calendar-day__dot--tv').exists()).toBe(
      true,
    )
  })

  it('ignores invalid release dates', () => {
    const wrapper = mountGrid({
      items: [
        {
          ...tvItem,
          date: 'invalid',
        },
      ],
    })

    expect(wrapper.findAll('.calendar-day__dot')).toHaveLength(0)
  })

  it('emits selection on click', async () => {
    const wrapper = mountGrid()

    await wrapper.get('[data-date="2026-11-05"]').trigger('click')

    expect(wrapper.emitted('select')).toEqual([['2026-11-05']])
  })

  it('allows selecting adjacent-month dates', async () => {
    const wrapper = mountGrid()

    await wrapper.get('[data-date="2026-10-26"]').trigger('click')

    expect(wrapper.emitted('select')).toEqual([['2026-10-26']])
  })

  it('updates when the month changes', async () => {
    const wrapper = mountGrid()

    await wrapper.setProps({
      month: '2026-12-01',
    })

    expect(wrapper.get('section').attributes('aria-label')).toBe('December 2026 calendar')
    expect(wrapper.find('[data-date="2026-12-15"]').exists()).toBe(true)
  })

  it('updates indicators when items change', async () => {
    const wrapper = mountGrid()

    await wrapper.setProps({
      items: [tvItem, movieItem],
    })

    expect(wrapper.get('[data-date="2026-11-05"]').findAll('.calendar-day__dot')).toHaveLength(2)
  })

  it('updates selected dates', async () => {
    const wrapper = mountGrid({
      selectedDate: '2026-11-05',
    })

    await wrapper.setProps({
      selectedDate: '2026-11-12',
    })

    expect(wrapper.get('[data-date="2026-11-05"]').attributes('aria-pressed')).toBe('false')
    expect(wrapper.get('[data-date="2026-11-12"]').attributes('aria-pressed')).toBe('true')
  })

  it('handles invalid months gracefully', () => {
    const wrapper = mountGrid({
      month: 'invalid',
    })

    expect(wrapper.get('section').attributes('aria-label')).toBe('Unknown month calendar')
    expect(wrapper.findAllComponents(MmCalendarDay)).toHaveLength(0)
  })

  it('shows the tooltip when hovering over a date with releases', async () => {
    const wrapper = mountGrid({
      items: [tvItem, movieItem],
    })

    await wrapper.get('[data-date="2026-11-05"]').trigger('mouseenter')

    expect(wrapper.findComponent(MmCalendarTooltip).exists()).toBe(true)
    expect(wrapper.get('.calendar-tooltip').text()).toContain('Example Series')
    expect(wrapper.get('.calendar-tooltip').text()).toContain('Example Movie')
  })

  it('does not show a tooltip for empty dates', async () => {
    const wrapper = mountGrid({
      items: [tvItem],
    })

    await wrapper.get('[data-date="2026-11-06"]').trigger('mouseenter')

    expect(wrapper.findComponent(MmCalendarTooltip).exists()).toBe(false)
  })

  it('hides the tooltip on mouse leave', async () => {
    const wrapper = mountGrid({
      items: [tvItem],
    })

    const day = wrapper.get('[data-date="2026-11-05"]')

    await day.trigger('mouseenter')
    await day.trigger('mouseleave')

    expect(wrapper.findComponent(MmCalendarTooltip).exists()).toBe(false)
  })

  it('shows the tooltip on keyboard focus', async () => {
    const wrapper = mountGrid({
      items: [tvItem],
    })

    await wrapper.get('[data-date="2026-11-05"]').trigger('focus')

    expect(wrapper.findComponent(MmCalendarTooltip).exists()).toBe(true)
  })

  it('hides the tooltip on Escape', async () => {
    const wrapper = mountGrid({
      items: [tvItem],
    })

    const day = wrapper.get('[data-date="2026-11-05"]')

    await day.trigger('focus')
    await day.trigger('keydown', {
      key: 'Escape',
    })

    expect(wrapper.findComponent(MmCalendarTooltip).exists()).toBe(false)
  })

  it('hides the tooltip when selecting a date', async () => {
    const wrapper = mountGrid({
      items: [tvItem],
    })

    const day = wrapper.get('[data-date="2026-11-05"]')

    await day.trigger('mouseenter')
    await day.trigger('click')

    expect(wrapper.findComponent(MmCalendarTooltip).exists()).toBe(false)
    expect(wrapper.emitted('select')).toEqual([['2026-11-05']])
  })

  it('closes the tooltip when the month changes', async () => {
    const wrapper = mountGrid({
      items: [tvItem],
    })

    await wrapper.get('[data-date="2026-11-05"]').trigger('mouseenter')

    await wrapper.setProps({
      month: '2026-12-01',
    })

    expect(wrapper.findComponent(MmCalendarTooltip).exists()).toBe(false)
  })

  it('closes the tooltip when releases change', async () => {
    const wrapper = mountGrid({
      items: [tvItem],
    })

    await wrapper.get('[data-date="2026-11-05"]').trigger('mouseenter')

    await wrapper.setProps({
      items: [],
    })

    expect(wrapper.findComponent(MmCalendarTooltip).exists()).toBe(false)
  })

  it('links the hovered day to its tooltip accessibly', async () => {
    const wrapper = mountGrid({
      items: [tvItem],
    })

    const day = wrapper.get('[data-date="2026-11-05"]')

    await day.trigger('mouseenter')

    const tooltip = wrapper.get('.calendar-tooltip')
    const tooltipId = tooltip.attributes('id')

    expect(tooltipId).toBeTruthy()
    expect(tooltip.attributes('role')).toBe('tooltip')
    expect(day.attributes('aria-describedby')).toBe(tooltipId)
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

    const wrapper = mount(Parent)
    const grids = wrapper.findAllComponents(MmCalendarGrid)

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
