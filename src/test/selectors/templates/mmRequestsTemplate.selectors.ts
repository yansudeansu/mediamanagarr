type Query<T> = (selector: string) => T

export function mmRequestsTemplateSelectors<T>(query: Query<T>) {
  const root = '.requests-template'
  const header = `${root} header.requests-template__header`
  const filters = `${root} section.requests-template__filters`
  const content = `${root} section.requests-template__content`
  const pagination = `${root} nav.requests-template__pagination`

  return {
    get: () => query(root),
    header: () => query(header),
    heading: () => query(`${header} .requests-template__heading`),
    title: () => query(`${header} h2#requests-title.requests-template__title`),
    description: () => query(`${header} .requests-template__description`),
    actions: () => query(`${header} .requests-template__actions`),
    actionButtons: () => query(`${header} .requests-template__actions button`),
    filters: () => query(filters),
    labelledFilters: () => query(`${filters}[aria-label="Request filters"]`),
    filterButtons: () => query(`${filters} button`),
    content: () => query(content),
    labelledContent: () => query(`${content}[aria-labelledby="requests-title"]`),
    pagination: () => query(pagination),
    labelledPagination: () => query(`${pagination}[aria-label="Request pagination"]`),
    paginationButtons: () => query(`${pagination} button`),
  }
}
