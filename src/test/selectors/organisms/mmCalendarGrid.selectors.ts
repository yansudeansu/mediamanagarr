type Query<T> = (selector: string) => T

export function mmCalendarGridSelectors<T>(query: Query<T>) {
  const root = 'section.calendar-grid'
  const day = `${root} .calendar-grid__days button.calendar-day`
  const tooltip = `${root} .calendar-grid__tooltip`

  return {
    get: () => query(root),
    labelled: (label: string) => query(`${root}[aria-label="${label}"]`),
    weekdays: () => query(`${root} .calendar-grid__weekdays`),
    decorativeWeekdays: () => query(`${root} .calendar-grid__weekdays[aria-hidden="true"]`),
    weekdayLabels: () => query(`${root} .calendar-grid__weekday`),
    days: () => query(`${root} .calendar-grid__days`),
    dayButtons: () => query(day),
    day: (date: string) => query(`${day}[data-date="${date}"]`),
    outsideDays: () => query(`${day}.calendar-day--outside`),
    today: () => query(`${day}.calendar-day--today`),
    selected: () => query(`${day}.calendar-day--selected[aria-pressed="true"]`),
    tvDots: () => query(`${day} .calendar-day__dot--tv`),
    movieDots: () => query(`${day} .calendar-day__dot--movie`),
    dots: () => query(`${day} .calendar-day__dot`),
    tooltipWrapper: () => query(tooltip),
    tooltip: () => query(`${tooltip} .calendar-tooltip[role="tooltip"]`),
    tooltipFor: (id: string) => query(`${tooltip} .calendar-tooltip[role="tooltip"][id="${id}"]`),
    describedDay: (date: string, id: string) =>
      query(`${day}[data-date="${date}"][aria-describedby="${id}"]`),
  }
}
