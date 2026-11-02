import type { InputType } from '../../../components/atoms/MmInput/MmInput.vue'

type Query<T> = (selector: string) => T

export function mmInputSelectors<T>(query: Query<T>) {
  const root = '.input-field'
  const control = `${root} input.input-field__control`

  return {
    get: () => query(root),
    label: () => query(`${root} .input-field__label`),
    requiredIndicator: () => query(`${root} .input-field__required`),
    control: () => query(control),
    type: (type: InputType) => query(`${control}[type="${type}"]`),
    disabled: () => query(`${control}:disabled`),
    enabled: () => query(`${control}:enabled`),
    required: () => query(`${control}:required`),
    invalid: () => query(`${control}[aria-invalid="true"]`),
    valid: () => query(`${control}:not([aria-invalid="true"])`),
    hint: () => query(`${root} .input-field__hint`),
    error: () => query(`${root} .input-field__error[role="alert"]`),
  }
}
