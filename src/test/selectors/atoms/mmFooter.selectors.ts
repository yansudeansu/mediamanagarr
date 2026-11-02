type Query<T> = (selector: string) => T

export function mmFooterSelectors<T>(query: Query<T>) {
  const root = 'footer.footer'

  return {
    get: () => query(root),
    brand: () => query(`${root} .footer__brand`),
    version: () => query(`${root} .footer__version`),
  }
}
