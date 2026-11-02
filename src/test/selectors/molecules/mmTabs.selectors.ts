type Query<T> = (selector: string) => T

export function mmTabsSelectors<T>(query: Query<T>) {
  const root = '.tabs'
  const item = `${root} .tabs__items button.tabs__item`
  const scroll = `${root} button.tabs__scroll-button`

  return {
    get: () => query(root),
    tabs: () => query(`${root}.tabs--tabs`),
    navigation: () => query(`${root}.tabs--navigation`),
    tablist: () => query(`${root}[role="tablist"]`),
    labelled: (label: string) => query(`${root}[role="tablist"][aria-label="${label}"]`),
    viewport: () => query(`${root} .tabs__viewport`),
    navigationViewport: () => query(`${root} .tabs__viewport--navigation`),
    items: () => query(`${root} .tabs__items`),
    buttons: () => query(item),
    button: (index: number) => query(`${item}:nth-child(${index + 1})`),
    tabButtons: () => query(`${item}[role="tab"]`),
    tab: (index: number) => query(`${item}[role="tab"]:nth-child(${index + 1})`),
    selected: () => query(`${item}[aria-selected="true"]`),
    unselected: () => query(`${item}[aria-selected="false"]`),
    current: () => query(`${item}[aria-current="page"]`),
    enabled: () => query(`${item}:enabled`),
    disabled: () => query(`${item}:disabled`),
    keyboardEntry: () => query(`${item}[tabindex="0"]`),
    skipped: () => query(`${item}[tabindex="-1"]`),
    scrollButtons: () => query(scroll),
    scrollLeft: () => query(`${scroll}[aria-label="Scroll navigation left"]`),
    scrollRight: () => query(`${scroll}[aria-label="Scroll navigation right"]`),
    enabledScrollLeft: () => query(`${scroll}[aria-label="Scroll navigation left"]:enabled`),
    disabledScrollLeft: () => query(`${scroll}[aria-label="Scroll navigation left"]:disabled`),
    enabledScrollRight: () => query(`${scroll}[aria-label="Scroll navigation right"]:enabled`),
    disabledScrollRight: () => query(`${scroll}[aria-label="Scroll navigation right"]:disabled`),
  }
}
