export type CardVariant = 'default' | 'outlined'
export type CardPadding = 'none' | 'sm' | 'md'

type Query<T> = (selector: string) => T

export function mmCardSelectors<T>(query: Query<T>) {
  const root = 'article.mm-card'

  return {
    get: () => query(root),
    variant: (variant: CardVariant) => query(`${root}.mm-card--${variant}`),
    padding: (padding: CardPadding) => query(`${root}.mm-card--padding-${padding}`),
    header: () => query(`${root} .mm-card__header`),
    content: () => query(`${root} .mm-card__content`),
    footer: () => query(`${root} .mm-card__footer`),
  }
}
