import { describe, expect, it, vi } from 'vitest'
import { mmCalendarGridSelectors } from './mmCalendarGrid.selectors'

describe('mmCalendarGridSelectors', () => {
  const select = () => mmCalendarGridSelectors((selector) => selector)

  it('selects the root and accessible label', () => {
    const grid = select()

    expect(grid.get()).toBe('section.calendar-grid')
    expect(grid.labelled('November 2026 calendar')).toBe(
      'section.calendar-grid[aria-label="November 2026 calendar"]',
    )
  })

  it('selects weekday headings', () => {
    const grid = select()

    expect(grid.weekdays()).toBe('section.calendar-grid .calendar-grid__weekdays')
    expect(grid.decorativeWeekdays()).toBe(
      'section.calendar-grid .calendar-grid__weekdays[aria-hidden="true"]',
    )
    expect(grid.weekdayLabels()).toBe('section.calendar-grid .calendar-grid__weekday')
  })

  it('selects the days container and buttons', () => {
    const grid = select()

    expect(grid.days()).toBe('section.calendar-grid .calendar-grid__days')
    expect(grid.dayButtons()).toBe('section.calendar-grid .calendar-grid__days button.calendar-day')
    expect(grid.day('2026-11-05')).toBe(
      'section.calendar-grid .calendar-grid__days button.calendar-day[data-date="2026-11-05"]',
    )
  })

  it('selects outside, today and selected days', () => {
    const grid = select()

    expect(grid.outsideDays()).toBe(
      'section.calendar-grid .calendar-grid__days button.calendar-day.calendar-day--outside',
    )
    expect(grid.today()).toBe(
      'section.calendar-grid .calendar-grid__days button.calendar-day.calendar-day--today',
    )
    expect(grid.selected()).toBe(
      'section.calendar-grid .calendar-grid__days button.calendar-day.calendar-day--selected[aria-pressed="true"]',
    )
  })

  it('selects release indicators', () => {
    const grid = select()

    expect(grid.tvDots()).toBe(
      'section.calendar-grid .calendar-grid__days button.calendar-day .calendar-day__dot--tv',
    )
    expect(grid.movieDots()).toBe(
      'section.calendar-grid .calendar-grid__days button.calendar-day .calendar-day__dot--movie',
    )
    expect(grid.dots()).toBe(
      'section.calendar-grid .calendar-grid__days button.calendar-day .calendar-day__dot',
    )
  })

  it('selects the tooltip wrapper and accessible tooltip', () => {
    const grid = select()

    expect(grid.tooltipWrapper()).toBe('section.calendar-grid .calendar-grid__tooltip')
    expect(grid.tooltip()).toBe(
      'section.calendar-grid .calendar-grid__tooltip .calendar-tooltip[role="tooltip"]',
    )
  })

  it('selects tooltip IDs and described days', () => {
    const grid = select()

    expect(grid.tooltipFor('tooltip-1')).toBe(
      'section.calendar-grid .calendar-grid__tooltip .calendar-tooltip[role="tooltip"][id="tooltip-1"]',
    )
    expect(grid.describedDay('2026-11-05', 'tooltip-1')).toBe(
      'section.calendar-grid .calendar-grid__days button.calendar-day[data-date="2026-11-05"][aria-describedby="tooltip-1"]',
    )
  })

  it('delegates selectors to the query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const grid = mmCalendarGridSelectors(query)

    expect(grid.day('2026-11-05')).toEqual({
      selector:
        'section.calendar-grid .calendar-grid__days button.calendar-day[data-date="2026-11-05"]',
    })
    expect(grid.tooltip()).toEqual({
      selector: 'section.calendar-grid .calendar-grid__tooltip .calendar-tooltip[role="tooltip"]',
    })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const grid = mmCalendarGridSelectors((selector) => `#calendar ${selector}`)

    expect(grid.get()).toBe('#calendar section.calendar-grid')
    expect(grid.day('2026-11-05')).toBe(
      '#calendar section.calendar-grid .calendar-grid__days button.calendar-day[data-date="2026-11-05"]',
    )
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmCalendarGridSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
