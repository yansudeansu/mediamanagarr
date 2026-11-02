type Query<T> = (selector: string) => T

export function mmCalendarDetailsSelectors<T>(query: Query<T>) {
  const root = 'section.calendar-details'
  const events = `${root} .calendar-details__events`

  return {
    get: () => query(root),
    labelledBy: (id: string) => query(`${root}[aria-labelledby="${id}"]`),
    header: () => query(`${root} .calendar-details__header`),
    heading: () => query(`${root} .calendar-details__heading`),
    title: () => query(`${root} h3.calendar-details__title`),
    count: () => query(`${root} .calendar-details__count`),
    state: () => query(`${root} .calendar-details__state`),
    loading: () => query(`${root} .calendar-details__state[role="status"]`),
    empty: () => query(`${root} .calendar-details__state:not([role="status"])`),
    events: () => query(events),
    eventCards: () => query(`${events} article.calendar-event`),
    eventCard: (index: number) =>
      query(`${events} > :nth-child(${index + 1}) article.calendar-event`),
    images: () => query(`${events} img`),
    placeholders: () => query(`${events} .media-poster__placeholder`),
  }
}
