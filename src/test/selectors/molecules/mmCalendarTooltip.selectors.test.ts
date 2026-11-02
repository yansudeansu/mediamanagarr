import { describe, expect, it, vi } from 'vitest'
import { mmCalendarTooltipSelectors } from './mmCalendarTooltip.selectors'

describe('mmCalendarTooltipSelectors', () => {
  it('selects the accessible tooltip root', () => {
    const query = vi.fn((selector: string) => selector)
    const tooltip = mmCalendarTooltipSelectors(query)

    expect(tooltip.get()).toBe('.calendar-tooltip[role="tooltip"]')
    expect(query).toHaveBeenCalledWith('.calendar-tooltip[role="tooltip"]')
  })

  it('selects the heading, date, and release count', () => {
    const tooltip = mmCalendarTooltipSelectors((selector) => selector)

    expect(tooltip.heading()).toBe('.calendar-tooltip[role="tooltip"] .calendar-tooltip__heading')
    expect(tooltip.date()).toBe('.calendar-tooltip[role="tooltip"] .calendar-tooltip__date')
    expect(tooltip.count()).toBe('.calendar-tooltip[role="tooltip"] .calendar-tooltip__count')
  })

  it('selects the release items container', () => {
    const tooltip = mmCalendarTooltipSelectors((selector) => selector)

    expect(tooltip.items()).toBe('.calendar-tooltip[role="tooltip"] .calendar-tooltip__items')
  })

  it('selects individual release items', () => {
    const tooltip = mmCalendarTooltipSelectors((selector) => selector)

    expect(tooltip.item(0)).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item:nth-child(1)',
    )
    expect(tooltip.item(3)).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item:nth-child(4)',
    )
    expect(tooltip.firstItem()).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item:first-child',
    )
    expect(tooltip.lastItem()).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item:last-child',
    )
  })

  it('selects indexed titles and subtitles', () => {
    const tooltip = mmCalendarTooltipSelectors((selector) => selector)

    expect(tooltip.itemTitle(1)).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item:nth-child(2) .calendar-tooltip__title',
    )
    expect(tooltip.itemSubtitle(1)).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item:nth-child(2) .calendar-tooltip__subtitle',
    )
  })

  it('selects all release titles and subtitles', () => {
    const tooltip = mmCalendarTooltipSelectors((selector) => selector)

    expect(tooltip.titles()).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item .calendar-tooltip__title',
    )
    expect(tooltip.subtitles()).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item .calendar-tooltip__subtitle',
    )
  })

  it('selects media indicators', () => {
    const tooltip = mmCalendarTooltipSelectors((selector) => selector)

    expect(tooltip.indicator()).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item .calendar-tooltip__indicator',
    )
    expect(tooltip.tvIndicators()).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item .calendar-tooltip__indicator--tv',
    )
    expect(tooltip.movieIndicators()).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item .calendar-tooltip__indicator--movie',
    )
  })

  it('selects decorative indicators', () => {
    const tooltip = mmCalendarTooltipSelectors((selector) => selector)

    expect(tooltip.decorativeIndicators()).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item .calendar-tooltip__indicator[aria-hidden="true"]',
    )
  })

  it('selects the remaining release count', () => {
    const tooltip = mmCalendarTooltipSelectors((selector) => selector)

    expect(tooltip.remaining()).toBe(
      '.calendar-tooltip[role="tooltip"] .calendar-tooltip__remaining',
    )
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const tooltip = mmCalendarTooltipSelectors(query)

    expect(tooltip.get()).toEqual({ selector: '.calendar-tooltip[role="tooltip"]' })
    expect(tooltip.count()).toEqual({
      selector: '.calendar-tooltip[role="tooltip"] .calendar-tooltip__count',
    })
    expect(tooltip.item(2)).toEqual({
      selector: '.calendar-tooltip[role="tooltip"] .calendar-tooltip__item:nth-child(3)',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const tooltip = mmCalendarTooltipSelectors((selector) => `#calendar ${selector}`)

    expect(tooltip.get()).toBe('#calendar .calendar-tooltip[role="tooltip"]')
    expect(tooltip.count()).toBe(
      '#calendar .calendar-tooltip[role="tooltip"] .calendar-tooltip__count',
    )
    expect(tooltip.tvIndicators()).toBe(
      '#calendar .calendar-tooltip[role="tooltip"] .calendar-tooltip__item .calendar-tooltip__indicator--tv',
    )
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmCalendarTooltipSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
