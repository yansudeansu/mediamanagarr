type Query<T> = (selector: string) => T

export function mmQuickAccessSelectors<T>(query: Query<T>) {
  const root = '.quick-access'
  const trigger = `${root} button[aria-label="Open workspace menu"]`
  const menu = `${root} #quick-access-menu`
  const link = `${menu} .quick-access__services a.quick-access__item`
  const settings = `${menu} button[aria-label="Open settings"]`

  return {
    get: () => query(root),
    trigger: () => query(trigger),
    opened: () => query(`${trigger}[aria-expanded="true"][aria-controls="quick-access-menu"]`),
    closed: () => query(`${trigger}[aria-expanded="false"]`),
    triggerIcon: () => query(`${trigger} svg`),
    menu: () => query(menu),
    heading: () => query(`${menu} .quick-access__heading`),
    services: () => query(`${menu} .quick-access__services`),
    links: () => query(link),
    link: (index: number) => query(`${link}:nth-child(${index + 1})`),
    linkNamed: (label: string) => query(`${link}[aria-label="Open ${label} in a new tab"]`),
    linkName: (index: number) => query(`${link}:nth-child(${index + 1}) .quick-access__name`),
    linkIcon: (index: number) => query(`${link}:nth-child(${index + 1}) svg`),
    decorativeIcons: () => query(`${link} svg[aria-hidden="true"]`),
    empty: () => query(`${menu} .quick-access__empty`),
    separator: () => query(`${menu} .quick-access__separator`),
    settings: () => query(settings),
  }
}
