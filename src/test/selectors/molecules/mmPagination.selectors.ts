type Query<T> = (selector: string) => T

export function mmPaginationSelectors<T>(query: Query<T>) {
  const root = 'nav.pagination[aria-label="Pagination"]'
  const previous = `${root} button.pagination-arrow[aria-label="Previous page"]`
  const next = `${root} button.pagination-arrow[aria-label="Next page"]`

  return {
    get: () => query(root),
    label: () => query(`${root} .pagination-label`),
    liveLabel: () => query(`${root} .pagination-label[aria-live="polite"][aria-atomic="true"]`),
    arrows: () => query(`${root} button.pagination-arrow`),
    previous: () => query(previous),
    next: () => query(next),
    previousDisabled: () => query(`${previous}:disabled`),
    previousEnabled: () => query(`${previous}:enabled`),
    nextDisabled: () => query(`${next}:disabled`),
    nextEnabled: () => query(`${next}:enabled`),
    previousIcon: () => query(`${previous} svg`),
    nextIcon: () => query(`${next} svg`),
    decorativePreviousIcon: () => query(`${previous} svg[aria-hidden="true"]`),
    decorativeNextIcon: () => query(`${next} svg[aria-hidden="true"]`),
    numberedPages: () => query(`${root} .pagination-page`),
    ellipses: () => query(`${root} .pagination-ellipsis`),
  }
}
