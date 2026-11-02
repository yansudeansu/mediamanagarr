import type { ButtonSize, ButtonVariant } from '../../../components/atoms/MmButton/MmButton.vue'

type Query<T> = (selector: string) => T

export function mmButtonSelectors<T>(query: Query<T>) {
  const root = 'button.button'

  return {
    get: () => query(root),
    disabled: () => query(`${root}:disabled`),
    enabled: () => query(`${root}:enabled`),
    loading: () => query(`${root}[aria-busy="true"]`),
    currentPage: () => query(`${root}[aria-current="page"]`),
    iconOnly: () => query(`${root}.button--icon-only`),
    variant: (variant: ButtonVariant) => query(`${root}.button--${variant}`),
    size: (size: ButtonSize) => query(`${root}.button--${size}`),
    content: () => query(`${root} .button__content`),
    spinner: () => query(`${root} .button__spinner`),
  }
}
