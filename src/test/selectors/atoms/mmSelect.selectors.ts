type Query<T> = (selector: string) => T

export function mmSelectSelectors<T>(query: Query<T>) {
  const root = '.select-field'
  const trigger = `${root} button.select-field__trigger`
  const option = `${root} button.select-field__option[role="option"]`

  return {
    get: () => query(root),
    label: () => query(`${root} .select-field__label`),
    requiredIndicator: () => query(`${root} .select-field__required`),
    wrapper: () => query(`${root} .select-field__wrapper`),
    trigger: () => query(trigger),
    opened: () => query(`${trigger}[aria-expanded="true"]`),
    closed: () => query(`${trigger}[aria-expanded="false"]`),
    disabled: () => query(`${trigger}:disabled`),
    enabled: () => query(`${trigger}:enabled`),
    loading: () => query(`${trigger}[aria-busy="true"]`),
    invalid: () => query(`${trigger}[aria-invalid="true"]`),
    placeholder: () => query(`${trigger}.select-field__trigger--placeholder`),
    value: () => query(`${trigger} .select-field__value`),
    spinner: () => query(`${trigger} .select-field__spinner`),
    chevron: () => query(`${trigger} .select-field__chevron`),
    dropdown: () => query(`${root} .select-field__dropdown[role="listbox"]`),
    options: () => query(option),
    option: (index: number) => query(`${option}:nth-of-type(${index + 1})`),
    selected: () => query(`${option}[aria-selected="true"]`),
    active: () => query(`${option}[tabindex="0"]`),
    disabledOptions: () => query(`${option}:disabled`),
    enabledOptions: () => query(`${option}:enabled`),
    optionLabel: () => query(`${option} .select-field__option-label`),
    check: () => query(`${option} .select-field__check`),
    hiddenInput: () => query(`${root} input[type="hidden"]`),
    hint: () => query(`${root} .select-field__hint`),
    error: () => query(`${root} .select-field__error[role="alert"]`),
  }
}
