import { describe, expect, it, vi } from 'vitest'
import { mmCalendarDaySelectors } from './mmCalendarDay.selectors'

describe('mmCalendarDaySelectors', () => {
  it('selects the calendar day root', () => {
    const query = vi.fn((selector: string) => selector)
    const day = mmCalendarDaySelectors(query)

    expect(day.get()).toBe('button.calendar-day')
    expect(query).toHaveBeenCalledWith('button.calendar-day')
  })

  it('selects a specific calendar date', () => {
    const day = mmCalendarDaySelectors((selector) => selector)

    expect(day.date('2026-11-05')).toBe('button.calendar-day[data-date="2026-11-05"]')
  })

  it('selects today', () => {
    const day = mmCalendarDaySelectors((selector) => selector)

    expect(day.today()).toBe('button.calendar-day.calendar-day--today')
  })

  it('selects selected and unselected states', () => {
    const day = mmCalendarDaySelectors((selector) => selector)

    expect(day.selected()).toBe('button.calendar-day.calendar-day--selected[aria-pressed="true"]')
    expect(day.unselected()).toBe('button.calendar-day[aria-pressed="false"]')
  })

  it('selects dates outside the current month', () => {
    const day = mmCalendarDaySelectors((selector) => selector)

    expect(day.outside()).toBe('button.calendar-day.calendar-day--outside')
  })

  it('selects a day associated with a tooltip', () => {
    const day = mmCalendarDaySelectors((selector) => selector)

    expect(day.describedBy('calendar-day-tooltip')).toBe(
      'button.calendar-day[aria-describedby="calendar-day-tooltip"]',
    )
  })

  it('selects the day number', () => {
    const day = mmCalendarDaySelectors((selector) => selector)

    expect(day.number()).toBe('button.calendar-day .calendar-day__number')
  })

  it('selects the media indicators', () => {
    const day = mmCalendarDaySelectors((selector) => selector)

    expect(day.indicators()).toBe('button.calendar-day .calendar-day__indicators')
    expect(day.decorativeIndicators()).toBe(
      'button.calendar-day .calendar-day__indicators[aria-hidden="true"]',
    )
  })

  it('selects TV and movie indicators', () => {
    const day = mmCalendarDaySelectors((selector) => selector)

    expect(day.tvDot()).toBe('button.calendar-day .calendar-day__dot--tv')
    expect(day.movieDot()).toBe('button.calendar-day .calendar-day__dot--movie')
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const day = mmCalendarDaySelectors(query)

    expect(day.get()).toEqual({ selector: 'button.calendar-day' })
    expect(day.today()).toEqual({
      selector: 'button.calendar-day.calendar-day--today',
    })
    expect(day.tvDot()).toEqual({
      selector: 'button.calendar-day .calendar-day__dot--tv',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#calendar ${selector}`
    const day = mmCalendarDaySelectors(query)

    expect(day.get()).toBe('#calendar button.calendar-day')
    expect(day.selected()).toBe(
      '#calendar button.calendar-day.calendar-day--selected[aria-pressed="true"]',
    )
    expect(day.movieDot()).toBe('#calendar button.calendar-day .calendar-day__dot--movie')
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmCalendarDaySelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
