type Query<T> = (selector: string) => T

export function mmTorrentCardSelectors<T>(query: Query<T>) {
  const root = '.torrent-card'
  const status = `${root} .torrent-card__status`
  const actions = `${root} .torrent-card__actions`
  const button = `${actions} button`

  return {
    get: () => query(root),
    heading: () => query(`${root} .torrent-card__heading`),
    name: () => query(`${root} .torrent-card__name`),
    status: () => query(status),
    statusVariant: (variant: string) => query(`${status}.torrent-card__status--${variant}`),
    progress: () => query(`${root} .torrent-card__progress`),
    progressDetails: () => query(`${root} .torrent-card__progress-details`),
    size: () => query(`${root} .torrent-card__size`),
    percentage: () => query(`${root} .torrent-card__percentage`),
    stats: () => query(`${root} .torrent-card__stats`),
    download: () => query(`${root} .torrent-card__stat[title^="Download:"]`),
    upload: () => query(`${root} .torrent-card__stat[title^="Upload:"]`),
    eta: () => query(`${root} .torrent-card__stat--eta`),
    actions: () => query(actions),
    buttons: () => query(button),
    primary: () => query(`${button}:first-child`),
    remove: () => query(`${button}:last-child`),
    primaryLabelled: (label: string) => query(`${button}:first-child[aria-label="${label}"]`),
    removeLabelled: (label: string) => query(`${button}:last-child[aria-label="${label}"]`),
    primaryDisabled: () => query(`${button}:first-child:disabled`),
    removeDisabled: () => query(`${button}:last-child:disabled`),
    primaryLoading: () => query(`${button}:first-child[aria-busy="true"]`),
    removeLoading: () => query(`${button}:last-child[aria-busy="true"]`),
  }
}
