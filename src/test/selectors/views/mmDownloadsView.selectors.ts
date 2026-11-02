type Query<T> = (selector: string) => T

export function mmDownloadsViewSelectors<T>(query: Query<T>) {
  const root = '.downloads-template'
  const header = `${root} header.downloads-template__header`
  const actions = `${header} .downloads-template__actions`
  const stats = `${root} section.downloads-template__stats`
  const confirmation = `${root} section.downloads-template__confirmation`
  const content = `${root} section.downloads-template__content`
  const list = `${content} section.torrent-list`
  const card = `${list} .torrent-card`

  return {
    get: () => query(root),
    title: () => query(`${header} #downloads-title`),
    description: () => query(`${header} .downloads-template__description`),
    actions: () => query(actions),
    refresh: () => query(`${actions} button`),
    refreshDisabled: () => query(`${actions} button:disabled`),
    refreshEnabled: () => query(`${actions} button:enabled`),
    stats: () => query(stats),
    downloadSpeed: () => query(`${stats} .transfer-stats__download`),
    uploadSpeed: () => query(`${stats} .transfer-stats__upload`),
    confirmation: () => query(confirmation),
    confirmationTitle: () => query(`${confirmation} .torrent-confirmation__title`),
    confirm: () => query(`${confirmation} button:last-child`),
    cancel: () => query(`${confirmation} button:first-child`),
    deleteFiles: () => query(`${confirmation} input[type="checkbox"]`),
    content: () => query(content),
    loading: () => query(`${content} .downloads-view__message[role="status"]`),
    errors: () => query(`${content} .downloads-view__error[role="alert"]`),
    retry: () => query(`${content} .downloads-view__error button`),
    list: () => query(list),
    empty: () => query(`${list} .torrent-list__empty`),
    cards: () => query(card),
    card: (index: number) => query(`${list} li:nth-child(${index + 1}) ${card.split(' ').at(-1)}`),
    torrentNames: () => query(`${card} .torrent-card__name`),
    start: (name: string) => query(`${card} button[aria-label="Start ${name}"]`),
    stop: (name: string) => query(`${card} button[aria-label="Stop ${name}"]`),
    remove: (name: string) => query(`${card} button[aria-label="Remove ${name}"]`),
    pagination: () => query(`${list} nav.pagination`),
  }
}
