type Query<T> = (selector: string) => T

export function mmTorrentConfirmationSelectors<T>(query: Query<T>) {
  const root = 'section.torrent-confirmation'
  const actions = `${root} .torrent-confirmation__actions`
  const button = `${actions} button`

  return {
    get: () => query(root),
    labelledBy: (id: string) => query(`${root}[aria-labelledby="${id}"]`),
    content: () => query(`${root} .torrent-confirmation__content`),
    title: () => query(`${root} h3.torrent-confirmation__title`),
    name: () => query(`${root} .torrent-confirmation__name`),
    description: () => query(`${root} .torrent-confirmation__description`),
    option: () => query(`${root} .torrent-confirmation__option`),
    warning: () => query(`${root} .torrent-confirmation__warning`),
    alert: () => query(`${root} .torrent-confirmation__warning[role="alert"]`),
    actions: () => query(actions),
    buttons: () => query(button),
    cancel: () => query(`${button}.button--secondary`),
    confirm: () => query(`${button}.button--danger`),
    cancelDisabled: () => query(`${button}.button--secondary:disabled`),
    confirmDisabled: () => query(`${button}.button--danger:disabled`),
    confirmLoading: () => query(`${button}.button--danger[aria-busy="true"]`),
  }
}
