import { describe, expect, it, vi } from 'vitest'
import { mmCalendarEventSelectors } from './mmCalendarEvent.selectors'

describe('mmCalendarEventSelectors', () => {
  it('selects the calendar event root', () => {
    const query = vi.fn((selector: string) => selector)
    const event = mmCalendarEventSelectors(query)

    expect(event.get()).toBe('article.calendar-event')
    expect(query).toHaveBeenCalledWith('article.calendar-event')
  })

  it('selects the details and heading', () => {
    const event = mmCalendarEventSelectors((selector) => selector)

    expect(event.details()).toBe('article.calendar-event .calendar-event__details')
    expect(event.heading()).toBe('article.calendar-event .calendar-event__heading')
  })

  it('selects the title, type, and subtitle', () => {
    const event = mmCalendarEventSelectors((selector) => selector)

    expect(event.title()).toBe('article.calendar-event .calendar-event__title')
    expect(event.type()).toBe('article.calendar-event .calendar-event__type')
    expect(event.subtitle()).toBe('article.calendar-event .calendar-event__subtitle')
  })

  it('selects the footer and release type', () => {
    const event = mmCalendarEventSelectors((selector) => selector)

    expect(event.footer()).toBe('article.calendar-event .calendar-event__footer')
    expect(event.releaseType()).toBe('article.calendar-event .calendar-event__release-type')
  })

  it('selects the event date', () => {
    const event = mmCalendarEventSelectors((selector) => selector)

    expect(event.date()).toBe('article.calendar-event .calendar-event__date')
    expect(event.validDate()).toBe('article.calendar-event time.calendar-event__date')
    expect(event.invalidDate()).toBe('article.calendar-event span.calendar-event__date')
  })

  it('selects the media indicator', () => {
    const event = mmCalendarEventSelectors((selector) => selector)

    expect(event.indicator()).toBe('article.calendar-event .calendar-event__indicator')
  })

  it('selects TV and movie indicators', () => {
    const event = mmCalendarEventSelectors((selector) => selector)

    expect(event.tvIndicator()).toBe(
      'article.calendar-event .calendar-event__indicator.calendar-event__indicator--tv',
    )
    expect(event.movieIndicator()).toBe(
      'article.calendar-event .calendar-event__indicator.calendar-event__indicator--movie',
    )
  })

  it('selects the decorative indicator', () => {
    const event = mmCalendarEventSelectors((selector) => selector)

    expect(event.decorativeIndicator()).toBe(
      'article.calendar-event .calendar-event__indicator[aria-hidden="true"]',
    )
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const event = mmCalendarEventSelectors(query)

    expect(event.get()).toEqual({ selector: 'article.calendar-event' })
    expect(event.title()).toEqual({
      selector: 'article.calendar-event .calendar-event__title',
    })
    expect(event.tvIndicator()).toEqual({
      selector: 'article.calendar-event .calendar-event__indicator.calendar-event__indicator--tv',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#calendar ${selector}`
    const event = mmCalendarEventSelectors(query)

    expect(event.get()).toBe('#calendar article.calendar-event')
    expect(event.title()).toBe('#calendar article.calendar-event .calendar-event__title')
    expect(event.movieIndicator()).toBe(
      '#calendar article.calendar-event .calendar-event__indicator.calendar-event__indicator--movie',
    )
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmCalendarEventSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
