type Query<T> = (selector: string) => T

export function mmUpNextViewSelectors<T>(query: Query<T>) {
  const root = '.up-next-template'
  const header = `${root} header.up-next-template__header`
  const actions = `${header} .up-next-template__actions`
  const filters = `${root} section.up-next-template__filters`
  const content = `${root} section.up-next-template__content`
  const pagination = `${root} nav.up-next-template__pagination`

  return {
    get: () => query(root),
    header: () => query(header),
    title: () => query(`${header} #up-next-title`),
    description: () => query(`${header} .up-next-template__description`),
    actions: () => query(actions),
    actionButtons: () => query(`${actions} button`),
    clear: () => query(`${actions} button:first-child`),
    refresh: () => query(`${actions} button:last-child`),
    refreshDisabled: () => query(`${actions} button:last-child:disabled`),
    filters: () => query(filters),
    filterGroup: () => query(`${filters} .filter-group[role="group"]`),
    filterButtons: () => query(`${filters} button[aria-pressed]`),
    activeFilter: () => query(`${filters} button[aria-pressed="true"]`),
    content: () => query(content),
    loading: () => query(`${content} .up-next-view__message[role="status"]`),
    empty: () => query(`${content} .up-next-view__message:not([role])`),
    error: () => query(`${content} .up-next-view__error[role="alert"]`),
    actionError: () => query(`${content} .up-next-view__action-error[role="alert"]`),
    retry: () => query(`${content} .up-next-view__error button`),
    cards: () => query(`${content} .arrival-card`),
    links: () => query(`${content} .arrival-card__link`),
    cardButtons: () => query(`${content} .arrival-card button`),
    nestedLinkButtons: () => query(`${content} .arrival-card__link button`),
    indicators: () => query(`${content} .arrival-card__indicator`),
    images: () => query(`${content} .arrival-card img`),
    placeholders: () => query(`${content} .media-poster__placeholder`),
    pagination: () => query(pagination),
    labelledPagination: () => query(`${pagination}[aria-label="Arrival pagination"]`),
    nextPage: () => query(`${pagination} button[aria-label*="Next"]`),
    nextPageEnabled: () => query(`${pagination} button[aria-label*="Next"]:enabled`),
    buttons: () => query(`${root} button`),
    filter: (index: number) => query(`${filters} button[aria-pressed]:nth-of-type(${index + 1})`),
    card: (index: number) => query(`${content} .arrival-card:nth-of-type(${index + 1})`),
    link: (index: number) => query(`${content} .arrival-card__link:nth-of-type(${index + 1})`),
    indicator: (index: number) =>
      query(`${content} .arrival-card__indicator:nth-of-type(${index + 1})`),
  }
}
