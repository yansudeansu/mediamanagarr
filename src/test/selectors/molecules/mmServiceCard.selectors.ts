type Query<T> = (selector: string) => T

export function mmServiceCardSelectors<T>(query: Query<T>) {
  const root = 'button.service-card'

  return {
    get: () => query(root),
    name: () => query(`${root} .service-card__name`),
    selected: () => query(`${root}.service-card--selected[aria-current="true"]`),
    unselected: () => query(`${root}:not(.service-card--selected):not([aria-current])`),
    disabled: () => query(`${root}:disabled`),
    enabled: () => query(`${root}:enabled`),
    chevron: () => query(`${root} .service-card__chevron`),
    customLabel: () => query(`${root}[aria-label]`),
    labelledBy: () => query(`${root}[aria-labelledby]`),
    customRole: () => query(`${root}[role]`),
  }
}
