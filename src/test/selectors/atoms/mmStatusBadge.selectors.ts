export type StatusBadgeVariant = 'neutral' | 'info' | 'success' | 'danger'

type Query<T> = (selector: string) => T

export function mmStatusBadgeSelectors<T>(query: Query<T>) {
  const root = 'span.status-badge'

  return {
    get: () => query(root),
    variant: (variant: StatusBadgeVariant) => query(`${root}.status-badge--${variant}`),
    dot: () => query(`${root} .status-badge__dot`),
    decorativeDot: () => query(`${root} .status-badge__dot[aria-hidden="true"]`),
    label: () => query(`${root} .status-badge__label`),
    buttons: () => query(`${root} button`),
    links: () => query(`${root} a`),
  }
}
