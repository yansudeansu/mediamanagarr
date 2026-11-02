type Query<T> = (selector: string) => T

export function mmArrivalCardSelectors<T>(query: Query<T>) {
  const root = 'article.arrival-card'

  return {
    get: () => query(root),
    unread: () => query(`${root}.arrival-card--unread`),
    details: () => query(`${root} .arrival-card__details`),
    heading: () => query(`${root} .arrival-card__heading`),
    title: () => query(`${root} .arrival-card__title`),
    link: () => query(`${root} a.arrival-card__link`),
    type: () => query(`${root} .arrival-card__type`),
    subtitle: () => query(`${root} .arrival-card__subtitle`),
    footer: () => query(`${root} .arrival-card__footer`),
    date: () => query(`${root} .arrival-card__date`),
    validDate: () => query(`${root} time.arrival-card__date`),
    invalidDate: () => query(`${root} span.arrival-card__date`),
    indicator: () => query(`${root} .arrival-card__indicator[aria-label="New arrival"]`),
  }
}
