type Query<T> = (selector: string) => T

export function mmServiceSelectorSelectors<T>(query: Query<T>) {
  const root = '.service-selector'
  const list = `${root} .service-selector__list`
  const card = `${list} button.service-card`

  return {
    get: () => query(root),
    list: () => query(list),
    group: () => query(`${list}[role="group"]`),
    labelled: (label: string) => query(`${list}[role="group"][aria-label="${label}"]`),
    cards: () => query(card),
    card: (index: number) => query(`${card}:nth-child(${index + 1})`),
    names: () => query(`${card} .service-card__name`),
    name: (index: number) => query(`${card}:nth-child(${index + 1}) .service-card__name`),
    selected: () => query(`${card}.service-card--selected[aria-current="true"]`),
    unselected: () => query(`${card}:not(.service-card--selected):not([aria-current])`),
    disabled: () => query(`${card}:disabled`),
    enabled: () => query(`${card}:enabled`),
  }
}
