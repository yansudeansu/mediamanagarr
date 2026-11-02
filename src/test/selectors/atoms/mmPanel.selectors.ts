export type PanelPadding = 'sm' | 'md'

type Query<T> = (selector: string) => T

export function mmPanelSelectors<T>(query: Query<T>) {
  const root = 'section.mm-panel'

  return {
    get: () => query(root),
    padding: (padding: PanelPadding) => query(`${root}.mm-panel--padding-${padding}`),
    content: () => query(`${root} > *`),
  }
}
