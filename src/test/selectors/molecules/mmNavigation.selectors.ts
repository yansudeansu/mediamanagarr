type Query<T> = (selector: string) => T

export function mmNavigationSelectors<T>(query: Query<T>) {
  const root = 'nav'
  const button = `${root} button`

  return {
    get: () => query(root),
    labelled: (label: string) => query(`${root}[aria-label="${label}"]`),
    buttons: () => query(button),
    button: (index: number) => query(`${button}:nth-child(${index + 1})`),
    current: () => query(`${button}[aria-current="page"]`),
    inactive: () => query(`${button}:not([aria-current="page"])`),
    disabled: () => query(`${button}:disabled`),
    enabled: () => query(`${button}:enabled`),
    ghost: () => query(`${button}.button--ghost`),
    small: () => query(`${button}.button--small`),
    tablist: () => query(`${root} [role="tablist"]`),
    tabs: () => query(`${root} [role="tab"]`),
    selectedTabs: () => query(`${root} [aria-selected]`),
  }
}
