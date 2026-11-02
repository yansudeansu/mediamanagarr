type Query<T> = (selector: string) => T

export function mmUpNextTemplateSelectors<T>(query: Query<T>) {
  const root = '.up-next-template'
  const header = `${root} header.up-next-template__header`
  const actions = `${header} .up-next-template__actions`
  const filters = `${root} section.up-next-template__filters`
  const content = `${root} section.up-next-template__content`
  const pagination = `${root} nav.up-next-template__pagination`

  return {
    get: () => query(root),
    header: () => query(header),
    heading: () => query(`${header} .up-next-template__heading`),
    title: () => query(`${header} h2#up-next-title.up-next-template__title`),
    description: () => query(`${header} .up-next-template__description`),
    actions: () => query(actions),
    actionButtons: () => query(`${actions} button`),
    actionButton: (index: number) => query(`${actions} button:nth-child(${index + 1})`),
    filters: () => query(filters),
    labelledFilters: () => query(`${filters}[aria-label="Arrival filters"]`),
    filterButtons: () => query(`${filters} button`),
    content: () => query(content),
    labelledContent: () => query(`${content}[aria-labelledby="up-next-title"]`),
    articles: () => query(`${content} article`),
    pagination: () => query(pagination),
    labelledPagination: () => query(`${pagination}[aria-label="Arrival pagination"]`),
    paginationButtons: () => query(`${pagination} button`),
  }
}
