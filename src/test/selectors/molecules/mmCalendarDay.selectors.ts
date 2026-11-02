type Query<T> = (selector: string) => T

export function mmCalendarDaySelectors<T>(query: Query<T>) {
  const root = 'button.calendar-day'

  return {
    get: () => query(root),
    date: (date: string) => query(`${root}[data-date="${date}"]`),
    today: () => query(`${root}.calendar-day--today`),
    selected: () => query(`${root}.calendar-day--selected[aria-pressed="true"]`),
    unselected: () => query(`${root}[aria-pressed="false"]`),
    outside: () => query(`${root}.calendar-day--outside`),
    describedBy: (id: string) => query(`${root}[aria-describedby="${id}"]`),
    number: () => query(`${root} .calendar-day__number`),
    indicators: () => query(`${root} .calendar-day__indicators`),
    decorativeIndicators: () => query(`${root} .calendar-day__indicators[aria-hidden="true"]`),
    tvDot: () => query(`${root} .calendar-day__dot--tv`),
    movieDot: () => query(`${root} .calendar-day__dot--movie`),
  }
}
