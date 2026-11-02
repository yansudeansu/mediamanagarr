type Query<T> = (selector: string) => T

export function mmCalendarEventSelectors<T>(query: Query<T>) {
  const root = 'article.calendar-event'
  const indicator = `${root} .calendar-event__indicator`

  return {
    get: () => query(root),
    details: () => query(`${root} .calendar-event__details`),
    heading: () => query(`${root} .calendar-event__heading`),
    title: () => query(`${root} .calendar-event__title`),
    type: () => query(`${root} .calendar-event__type`),
    subtitle: () => query(`${root} .calendar-event__subtitle`),
    footer: () => query(`${root} .calendar-event__footer`),
    releaseType: () => query(`${root} .calendar-event__release-type`),
    date: () => query(`${root} .calendar-event__date`),
    validDate: () => query(`${root} time.calendar-event__date`),
    invalidDate: () => query(`${root} span.calendar-event__date`),
    indicator: () => query(indicator),
    tvIndicator: () => query(`${indicator}.calendar-event__indicator--tv`),
    movieIndicator: () => query(`${indicator}.calendar-event__indicator--movie`),
    decorativeIndicator: () => query(`${indicator}[aria-hidden="true"]`),
  }
}
