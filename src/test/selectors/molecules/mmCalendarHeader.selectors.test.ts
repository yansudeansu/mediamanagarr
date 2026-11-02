import { describe, expect, it, vi } from 'vitest'
import { mmCalendarHeaderSelectors } from './mmCalendarHeader.selectors'

describe('mmCalendarHeaderSelectors', () => {
  it('selects the calendar header root', () => {
    const query = vi.fn((selector: string) => selector)
    const header = mmCalendarHeaderSelectors(query)

    expect(header.get()).toBe('.calendar-header')
    expect(query).toHaveBeenCalledWith('.calendar-header')
  })

  it('selects the navigation group', () => {
    const header = mmCalendarHeaderSelectors((selector) => selector)

    expect(header.navigation()).toBe('.calendar-header .calendar-header__navigation[role="group"]')
  })

  it('selects the month title', () => {
    const header = mmCalendarHeaderSelectors((selector) => selector)

    expect(header.title()).toBe(
      '.calendar-header .calendar-header__navigation h2.calendar-header__title',
    )
  })

  it('selects the live month announcement', () => {
    const header = mmCalendarHeaderSelectors((selector) => selector)

    expect(header.liveTitle()).toBe(
      '.calendar-header .calendar-header__navigation h2.calendar-header__title[aria-live="polite"]',
    )
  })

  it('selects the previous-month button', () => {
    const header = mmCalendarHeaderSelectors((selector) => selector)

    expect(header.previous()).toBe(
      '.calendar-header .calendar-header__navigation button[aria-label="Previous month"]',
    )
  })

  it('selects the next-month button', () => {
    const header = mmCalendarHeaderSelectors((selector) => selector)

    expect(header.next()).toBe(
      '.calendar-header .calendar-header__navigation button[aria-label="Next month"]',
    )
  })

  it('selects the navigation buttons', () => {
    const header = mmCalendarHeaderSelectors((selector) => selector)

    expect(header.buttons()).toBe('.calendar-header .calendar-header__navigation button')
  })

  it('selects optional actions', () => {
    const header = mmCalendarHeaderSelectors((selector) => selector)

    expect(header.actions()).toBe('.calendar-header .calendar-header__actions')
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const header = mmCalendarHeaderSelectors(query)

    expect(header.get()).toEqual({ selector: '.calendar-header' })
    expect(header.title()).toEqual({
      selector: '.calendar-header .calendar-header__navigation h2.calendar-header__title',
    })
    expect(header.previous()).toEqual({
      selector: '.calendar-header .calendar-header__navigation button[aria-label="Previous month"]',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const header = mmCalendarHeaderSelectors((selector) => `#calendar ${selector}`)

    expect(header.get()).toBe('#calendar .calendar-header')
    expect(header.title()).toBe(
      '#calendar .calendar-header .calendar-header__navigation h2.calendar-header__title',
    )
    expect(header.next()).toBe(
      '#calendar .calendar-header .calendar-header__navigation button[aria-label="Next month"]',
    )
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmCalendarHeaderSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
