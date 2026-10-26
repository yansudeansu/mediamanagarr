export function calendarDateKey(date: Date): string {
  return [
    String(date.getFullYear()).padStart(4, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

export function parseCalendarDateKey(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null
  }

  const [year, month, day] = value.split('-').map(Number)

  if (year < 100 || month < 1 || month > 12 || day < 1 || day > 31) {
    return null
  }

  const date = new Date(0)
  date.setFullYear(year, month - 1, day)
  date.setHours(12, 0, 0, 0)

  return calendarDateKey(date) === value ? date : null
}

export function calendarItemDateKey(value: string): string | null {
  // Date-only values represent calendar dates, not UTC timestamps.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return parseCalendarDateKey(value) ? value : null
  }

  const date = new Date(value)

  if (!Number.isFinite(date.getTime())) {
    return null
  }

  return calendarDateKey(date)
}

export function startOfCalendarMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function nextCalendarMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1)
}

export function previousCalendarMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1)
}

export function calendarMonthOffset(date: Date): number {
  // JavaScript: Sunday = 0.
  // Calendar: Monday = 0.
  return (startOfCalendarMonth(date).getDay() + 6) % 7
}

export function calendarDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export function calendarMonthRange(date: Date): {
  start: Date
  end: Date
} {
  const start = startOfCalendarMonth(date)
  const end = nextCalendarMonth(date)

  return { start, end }
}

export function isSameCalendarDay(first: Date, second: Date): boolean {
  return calendarDateKey(first) === calendarDateKey(second)
}

export function isSameCalendarMonth(first: Date, second: Date): boolean {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth()
}
