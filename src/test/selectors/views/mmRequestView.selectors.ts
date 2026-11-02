type Query<T> = (selector: string) => T

export function mmRequestViewSelectors<T>(query: Query<T>) {
  const root = '.requests-template'
  const header = `${root} header.requests-template__header`
  const actions = `${header} .requests-template__actions`
  const filters = `${root} section.requests-template__filters`
  const content = `${root} section.requests-template__content`
  const pagination = `${root} nav.requests-template__pagination`

  return {
    get: () => query(root),
    header: () => query(header),
    title: () => query(`${header} #requests-title`),
    description: () => query(`${header} .requests-template__description`),
    actions: () => query(actions),
    refresh: () => query(`${actions} button`),
    refreshDisabled: () => query(`${actions} button:disabled`),
    refreshEnabled: () => query(`${actions} button:enabled`),
    filters: () => query(filters),
    filterGroup: () => query(`${filters} .filter-group[role="group"]`),
    filterButtons: () => query(`${filters} button[aria-pressed]`),
    filter: (index: number) => query(`${filters} button[aria-pressed]:nth-of-type(${index + 1})`),
    activeFilter: () => query(`${filters} button[aria-pressed="true"]`),
    inactiveFilters: () => query(`${filters} button[aria-pressed="false"]`),
    content: () => query(content),
    loading: () => query(`${content} .request-view__message[role="status"]`),
    empty: () => query(`${content} .request-view__message:not([role])`),
    error: () => query(`${content} .request-view__error[role="alert"]`),
    retry: () => query(`${content} .request-view__error button`),
    cards: () => query(`${content} .request-card`),
    card: (index: number) => query(`${content} .request-card:nth-child(${index + 1})`),
    cardTitles: () => query(`${content} .request-card__title`),
    pagination: () => query(pagination),
    labelledPagination: () => query(`${pagination}[aria-label="Request pagination"]`),
    paginationButtons: () => query(`${pagination} button`),
  }
}
