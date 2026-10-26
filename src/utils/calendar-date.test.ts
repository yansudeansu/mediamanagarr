import { describe, expect, it } from 'vitest'
import {
  calendarDateKey,
  calendarDaysInMonth,
  calendarItemDateKey,
  calendarMonthOffset,
  calendarMonthRange,
  isSameCalendarDay,
  isSameCalendarMonth,
  nextCalendarMonth,
  parseCalendarDateKey,
  previousCalendarMonth,
  startOfCalendarMonth,
} from './calendar-date'

describe('calendarDateKey', () => {
  it('formats a local date as YYYY-MM-DD', () => {
    expect(calendarDateKey(new Date(2026, 10, 5))).toBe('2026-11-05')
  })

  it('pads single-digit months and days', () => {
    expect(calendarDateKey(new Date(2026, 0, 3))).toBe('2026-01-03')
  })
})

describe('parseCalendarDateKey', () => {
  it('parses a valid date', () => {
    const date = parseCalendarDateKey('2026-11-05')

    expect(date).not.toBeNull()
    expect(date?.getFullYear()).toBe(2026)
    expect(date?.getMonth()).toBe(10)
    expect(date?.getDate()).toBe(5)
  })

  it('rejects invalid formats', () => {
    expect(parseCalendarDateKey('2026-1-5')).toBeNull()
    expect(parseCalendarDateKey('not-a-date')).toBeNull()
    expect(parseCalendarDateKey('')).toBeNull()
  })

  it('rejects impossible dates', () => {
    expect(parseCalendarDateKey('2026-02-30')).toBeNull()
    expect(parseCalendarDateKey('2026-04-31')).toBeNull()
    expect(parseCalendarDateKey('2026-13-01')).toBeNull()
  })

  it('handles leap years', () => {
    expect(parseCalendarDateKey('2024-02-29')).not.toBeNull()
    expect(parseCalendarDateKey('2025-02-29')).toBeNull()
  })
})

describe('calendarItemDateKey', () => {
  it('preserves date-only values', () => {
    expect(calendarItemDateKey('2026-11-01')).toBe('2026-11-01')
  })

  it('rejects invalid date-only values', () => {
    expect(calendarItemDateKey('2026-02-30')).toBeNull()
  })

  it('converts UTC timestamps into local calendar dates', () => {
    const timestamp = '2026-11-01T00:30:00Z'
    const expected = calendarDateKey(new Date(timestamp))

    expect(calendarItemDateKey(timestamp)).toBe(expected)
  })

  it('rejects invalid timestamps', () => {
    expect(calendarItemDateKey('invalid')).toBeNull()
  })
})

describe('calendar month navigation', () => {
  it('returns the first day of the month', () => {
    expect(calendarDateKey(startOfCalendarMonth(new Date(2026, 10, 25)))).toBe('2026-11-01')
  })

  it('moves to the next month', () => {
    expect(calendarDateKey(nextCalendarMonth(new Date(2026, 11, 15)))).toBe('2027-01-01')
  })

  it('moves to the previous month', () => {
    expect(calendarDateKey(previousCalendarMonth(new Date(2026, 0, 15)))).toBe('2025-12-01')
  })

  it('handles leap-year February', () => {
    expect(calendarDaysInMonth(new Date(2024, 1, 1))).toBe(29)
  })

  it('handles non-leap-year February', () => {
    expect(calendarDaysInMonth(new Date(2025, 1, 1))).toBe(28)
  })

  it('uses Monday as the first weekday', () => {
    // November 1, 2026 is a Sunday.
    expect(calendarMonthOffset(new Date(2026, 10, 1))).toBe(6)

    // June 1, 2026 is a Monday.
    expect(calendarMonthOffset(new Date(2026, 5, 1))).toBe(0)
  })
})

describe('calendarMonthRange', () => {
  it('returns the current month and exclusive next-month boundary', () => {
    const { start, end } = calendarMonthRange(new Date(2026, 10, 15))

    expect(calendarDateKey(start)).toBe('2026-11-01')
    expect(calendarDateKey(end)).toBe('2026-12-01')
  })

  it('handles year boundaries', () => {
    const { start, end } = calendarMonthRange(new Date(2026, 11, 15))

    expect(calendarDateKey(start)).toBe('2026-12-01')
    expect(calendarDateKey(end)).toBe('2027-01-01')
  })
})

describe('calendar date comparisons', () => {
  it('recognizes dates on the same local day', () => {
    expect(isSameCalendarDay(new Date(2026, 10, 5, 8), new Date(2026, 10, 5, 20))).toBe(true)
  })

  it('distinguishes different days', () => {
    expect(isSameCalendarDay(new Date(2026, 10, 5), new Date(2026, 10, 6))).toBe(false)
  })

  it('recognizes dates in the same month', () => {
    expect(isSameCalendarMonth(new Date(2026, 10, 1), new Date(2026, 10, 30))).toBe(true)
  })

  it('distinguishes different months', () => {
    expect(isSameCalendarMonth(new Date(2026, 10, 30), new Date(2026, 11, 1))).toBe(false)
  })
})
