type Query<T> = (selector: string) => T

export function mmDownloadsTemplateSelectors<T>(query: Query<T>) {
  const root = '.downloads-template'
  const header = `${root} header.downloads-template__header`
  const stats = `${root} section.downloads-template__stats`
  const confirmation = `${root} section.downloads-template__confirmation`
  const content = `${root} section.downloads-template__content`

  return {
    get: () => query(root),
    header: () => query(header),
    heading: () => query(`${header} .downloads-template__heading`),
    title: () => query(`${header} h2#downloads-title.downloads-template__title`),
    description: () => query(`${header} .downloads-template__description`),
    actions: () => query(`${header} .downloads-template__actions`),
    actionButtons: () => query(`${header} .downloads-template__actions button`),
    stats: () => query(stats),
    labelledStats: () => query(`${stats}[aria-label="Transfer statistics"]`),
    confirmation: () => query(confirmation),
    labelledConfirmation: () => query(`${confirmation}[aria-label="Torrent removal confirmation"]`),
    content: () => query(content),
    labelledContent: () => query(`${content}[aria-labelledby="downloads-title"]`),
  }
}
