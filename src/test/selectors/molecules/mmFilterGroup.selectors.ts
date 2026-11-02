type Query<T> = (selector: string) => T

export function mmFilterGroupSelectors<T>(query: Query<T>) {
  const root = '.filter-group[role="group"]'
  const button = `${root} button.filter-group__button`

  return {
    get: () => query(root),
    labelled: (label: string) => query(`${root}[aria-label="${label}"]`),
    buttons: () => query(button),
    button: (index: number) => query(`${button}:nth-child(${index + 1})`),
    active: () => query(`${button}.filter-group__button--active`),
    pressed: () => query(`${button}[aria-pressed="true"]`),
    unpressed: () => query(`${button}[aria-pressed="false"]`),
    disabled: () => query(`${button}:disabled`),
    enabled: () => query(`${button}:enabled`),
    indicators: () => query(`${button} .filter-group__indicator`),
    decorativeIndicators: () => query(`${button} .filter-group__indicator[aria-hidden="true"]`),
    indicator: (index: number) =>
      query(`${button}:nth-child(${index + 1}) .filter-group__indicator`),
  }
}
