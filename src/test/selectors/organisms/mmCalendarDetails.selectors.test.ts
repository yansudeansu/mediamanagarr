import { describe, expect, it, vi } from 'vitest'
import { mmCalendarDetailsSelectors } from './mmCalendarDetails.selectors'

describe('mmCalendarDetailsSelectors', () => {
  const select = () => mmCalendarDetailsSelectors((selector) => selector)

  it('selects the root and accessible label', () => {
    const details = select()

    expect(details.get()).toBe('section.calendar-details')
    expect(details.labelledBy('heading-1')).toBe(
      'section.calendar-details[aria-labelledby="heading-1"]',
    )
  })

  it('selects the header and heading', () => {
    const details = select()

    expect(details.header()).toBe('section.calendar-details .calendar-details__header')
    expect(details.heading()).toBe('section.calendar-details .calendar-details__heading')
    expect(details.title()).toBe('section.calendar-details h3.calendar-details__title')
  })

  it('selects the release count', () => {
    expect(select().count()).toBe('section.calendar-details .calendar-details__count')
  })

  it('selects loading and empty states', () => {
    const details = select()

    expect(details.state()).toBe('section.calendar-details .calendar-details__state')
    expect(details.loading()).toBe(
      'section.calendar-details .calendar-details__state[role="status"]',
    )
    expect(details.empty()).toBe(
      'section.calendar-details .calendar-details__state:not([role="status"])',
    )
  })

  it('selects the event container and cards', () => {
    const details = select()

    expect(details.events()).toBe('section.calendar-details .calendar-details__events')
    expect(details.eventCards()).toBe(
      'section.calendar-details .calendar-details__events article.calendar-event',
    )
    expect(details.eventCard(0)).toBe(
      'section.calendar-details .calendar-details__events > :nth-child(1) article.calendar-event',
    )
    expect(details.eventCard(1)).toBe(
      'section.calendar-details .calendar-details__events > :nth-child(2) article.calendar-event',
    )
  })

  it('selects artwork and placeholders', () => {
    const details = select()

    expect(details.images()).toBe('section.calendar-details .calendar-details__events img')
    expect(details.placeholders()).toBe(
      'section.calendar-details .calendar-details__events .media-poster__placeholder',
    )
  })

  it('delegates selectors to the query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const details = mmCalendarDetailsSelectors(query)

    expect(details.title()).toEqual({
      selector: 'section.calendar-details h3.calendar-details__title',
    })
    expect(details.loading()).toEqual({
      selector: 'section.calendar-details .calendar-details__state[role="status"]',
    })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const details = mmCalendarDetailsSelectors((selector) => `#calendar ${selector}`)

    expect(details.get()).toBe('#calendar section.calendar-details')
    expect(details.count()).toBe('#calendar section.calendar-details .calendar-details__count')
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmCalendarDetailsSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
