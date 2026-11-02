type Query<T> = (selector: string) => T

export function mmTorrentListSelectors<T>(query: Query<T>) {
  const root = 'section.torrent-list'
  const items = `${root} ul.torrent-list__items`
  const item = `${items} > li.torrent-list__item`
  const card = `${item} .torrent-card`
  const pagination = `${root} nav.pagination[aria-label="Pagination"]`

  return {
    get: () => query(root),
    labelled: (label: string) => query(`${root}[aria-label="${label}"]`),
    empty: () => query(`${root} .torrent-list__empty`),
    emptyTitle: () => query(`${root} .torrent-list__empty-title`),
    emptyDescription: () => query(`${root} .torrent-list__empty-description`),
    items: () => query(items),
    listItems: () => query(item),
    listItem: (index: number) => query(`${item}:nth-child(${index + 1})`),
    cards: () => query(card),
    card: (index: number) => query(`${item}:nth-child(${index + 1}) .torrent-card`),
    names: () => query(`${card} .torrent-card__name`),
    name: (index: number) => query(`${item}:nth-child(${index + 1}) .torrent-card__name`),
    progressbars: () => query(`${card} [role="progressbar"]`),
    progressbar: (index: number) =>
      query(`${item}:nth-child(${index + 1}) .torrent-card [role="progressbar"]`),
    pagination: () => query(pagination),
    previous: () => query(`${pagination} button[aria-label="Previous page"]`),
    next: () => query(`${pagination} button[aria-label="Next page"]`),
  }
}
