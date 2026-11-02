type Query<T> = (selector: string) => T

export function mmHeaderSelectors<T>(query: Query<T>) {
  const root = 'header.header'

  return {
    get: () => query(root),
    branding: () => query(`${root} .header__branding`),
    logo: () => query(`${root} img.header__logo`),
    title: () => query(`${root} h1.header__title`),
    actions: () => query(`${root} .header__actions`),
    actionButtons: () => query(`${root} .header__actions button`),
  }
}
