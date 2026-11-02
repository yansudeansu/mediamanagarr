type Query<T> = (selector: string) => T

export function mmCalendarTooltipSelectors<T>(query: Query<T>) {
  const root = '.calendar-tooltip[role="tooltip"]'
  const item = `${root} .calendar-tooltip__item`

  return {
    get: () => query(root),
    heading: () => query(`${root} .calendar-tooltip__heading`),
    date: () => query(`${root} .calendar-tooltip__date`),
    count: () => query(`${root} .calendar-tooltip__count`),
    items: () => query(`${root} .calendar-tooltip__items`),
    item: (index: number) => query(`${item}:nth-child(${index + 1})`),
    firstItem: () => query(`${item}:first-child`),
    lastItem: () => query(`${item}:last-child`),
    itemTitle: (index: number) => query(`${item}:nth-child(${index + 1}) .calendar-tooltip__title`),
    itemSubtitle: (index: number) =>
      query(`${item}:nth-child(${index + 1}) .calendar-tooltip__subtitle`),
    titles: () => query(`${item} .calendar-tooltip__title`),
    subtitles: () => query(`${item} .calendar-tooltip__subtitle`),
    indicator: () => query(`${item} .calendar-tooltip__indicator`),
    tvIndicators: () => query(`${item} .calendar-tooltip__indicator--tv`),
    movieIndicators: () => query(`${item} .calendar-tooltip__indicator--movie`),
    decorativeIndicators: () => query(`${item} .calendar-tooltip__indicator[aria-hidden="true"]`),
    remaining: () => query(`${root} .calendar-tooltip__remaining`),
  }
}
