type Query<T> = (selector: string) => T

export function mmServiceHealthSelectors<T>(query: Query<T>) {
  const root = '.service-health'

  return {
    get: () => query(root),
    row: () => query(`${root} .service-health__row`),
    time: () => query(`${root} .service-health__time`),
    error: () => query(`${root} .service-health__error`),
    alert: () => query(`${root} .service-health__error[role="alert"]`),
    landmark: () => query(`${root}[role]`),
    section: () => query(`${root} section`),
    labelledBy: () => query(`${root} [aria-labelledby], ${root}[aria-labelledby]`),
    buttons: () => query(`${root} button`),
    links: () => query(`${root} a`),
  }
}
