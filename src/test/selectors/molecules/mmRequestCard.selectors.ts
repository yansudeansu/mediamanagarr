type Query<T> = (selector: string) => T

export function mmRequestCardSelectors<T>(query: Query<T>) {
  const root = '.request-card'
  const badge = `${root} .request-card__badge`

  return {
    get: () => query(root),
    details: () => query(`${root} .request-card__details`),
    heading: () => query(`${root} .request-card__heading`),
    title: () => query(`${root} h3.request-card__title`),
    type: () => query(`${root} .request-card__type`),
    statuses: () => query(`${root} .request-card__statuses`),
    badge: () => query(badge),
    status: (status: string) => query(`${badge}.request-card__badge--${status}`),
    metadata: () => query(`${root} .request-card__metadata`),
    requester: () => query(`${root} .request-card__requester`),
    date: () => query(`${root} .request-card__date`),
    validDate: () => query(`${root} time.request-card__date`),
    invalidDate: () => query(`${root} span.request-card__date`),
    buttons: () => query(`${root} button`),
    links: () => query(`${root} a`),
  }
}
