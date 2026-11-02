type Query<T> = (selector: string) => T

export function appSelectors<T>(query: Query<T>) {
  const root = '.app-shell'
  const navigation = 'nav[aria-label="Main navigation"]'
  const navigationViews = ['requests', 'up-next', 'calendar', 'downloads'] as const

  return {
    get: () => query(root),
    popup: () => query(`${root}:not(.app-shell--detached):not(.app-shell--sidebar)`),
    detached: () => query(`${root}.app-shell--detached`),
    sidebar: () => query(`${root}.app-shell--sidebar`),
    header: () => query(`${root} header.header`),
    footer: () => query(`${root} footer.footer`),
    navigation: () => query(`${root} ${navigation}`),
    currentPage: () => query(`${root} ${navigation} [aria-current="page"]`),
    navigationButton: (view: string) => {
      const index = navigationViews.indexOf(view as (typeof navigationViews)[number])
      if (index === -1) throw new Error(`Unknown navigation view: ${view}`)
      return query(`${root} ${navigation} button:nth-of-type(${index + 1})`)
    },
    quickAccess: () => query(`${root} button[aria-label="Open workspace menu"]`),
    openSettings: () => query(`${root} button[aria-label="Open settings"]`),
    back: () => query(`${root} button[aria-label="Back to previous view"]`),
    content: () => query(`${root} main.app-content`),
    settingsContent: () => query(`${root} main.app-content--settings`),
    workspaceError: () => query(`${root} .workspace-error[role="alert"]`),
    emptyNavigation: () => query(`${root} .empty-navigation`),
    setupSettings: () => query(`${root} .empty-navigation button`),
  }
}
