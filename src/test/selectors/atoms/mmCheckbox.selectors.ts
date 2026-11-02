type Query<T> = (selector: string) => T

export function mmCheckboxSelectors<T>(query: Query<T>) {
  const root = '.checkbox-field'
  const control = `${root} input.checkbox-field__control`

  return {
    get: () => query(root),
    row: () => query(`${root} .checkbox-field__row`),
    control: () => query(control),
    checked: () => query(`${control}:checked`),
    unchecked: () => query(`${control}:not(:checked)`),
    disabled: () => query(`${control}:disabled`),
    enabled: () => query(`${control}:enabled`),
    required: () => query(`${control}:required`),
    label: () => query(`${root} .checkbox-field__label`),
    requiredIndicator: () => query(`${root} .checkbox-field__required`),
    hint: () => query(`${root} .checkbox-field__hint`),
  }
}
