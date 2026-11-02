import { describe, expect, it, vi } from 'vitest'
import { mmCheckboxSelectors } from './mmCheckbox.selectors'

describe('mmCheckboxSelectors', () => {
  it('selects the checkbox root', () => {
    const query = vi.fn((selector: string) => selector)
    const checkbox = mmCheckboxSelectors(query)

    expect(checkbox.get()).toBe('.checkbox-field')
    expect(query).toHaveBeenCalledWith('.checkbox-field')
  })

  it('selects the checkbox row', () => {
    const checkbox = mmCheckboxSelectors((selector) => selector)

    expect(checkbox.row()).toBe('.checkbox-field .checkbox-field__row')
  })

  it('selects the native checkbox control', () => {
    const checkbox = mmCheckboxSelectors((selector) => selector)

    expect(checkbox.control()).toBe('.checkbox-field input.checkbox-field__control')
  })

  it('selects checked checkboxes', () => {
    const checkbox = mmCheckboxSelectors((selector) => selector)

    expect(checkbox.checked()).toBe('.checkbox-field input.checkbox-field__control:checked')
  })

  it('selects unchecked checkboxes', () => {
    const checkbox = mmCheckboxSelectors((selector) => selector)

    expect(checkbox.unchecked()).toBe('.checkbox-field input.checkbox-field__control:not(:checked)')
  })

  it('selects disabled checkboxes', () => {
    const checkbox = mmCheckboxSelectors((selector) => selector)

    expect(checkbox.disabled()).toBe('.checkbox-field input.checkbox-field__control:disabled')
  })

  it('selects enabled checkboxes', () => {
    const checkbox = mmCheckboxSelectors((selector) => selector)

    expect(checkbox.enabled()).toBe('.checkbox-field input.checkbox-field__control:enabled')
  })

  it('selects required checkboxes', () => {
    const checkbox = mmCheckboxSelectors((selector) => selector)

    expect(checkbox.required()).toBe('.checkbox-field input.checkbox-field__control:required')
  })

  it('selects the checkbox label', () => {
    const checkbox = mmCheckboxSelectors((selector) => selector)

    expect(checkbox.label()).toBe('.checkbox-field .checkbox-field__label')
  })

  it('selects the required indicator', () => {
    const checkbox = mmCheckboxSelectors((selector) => selector)

    expect(checkbox.requiredIndicator()).toBe('.checkbox-field .checkbox-field__required')
  })

  it('selects the checkbox hint', () => {
    const checkbox = mmCheckboxSelectors((selector) => selector)

    expect(checkbox.hint()).toBe('.checkbox-field .checkbox-field__hint')
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const checkbox = mmCheckboxSelectors(query)

    expect(checkbox.get()).toEqual({ selector: '.checkbox-field' })
    expect(checkbox.control()).toEqual({
      selector: '.checkbox-field input.checkbox-field__control',
    })
    expect(checkbox.hint()).toEqual({
      selector: '.checkbox-field .checkbox-field__hint',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#settings ${selector}`
    const checkbox = mmCheckboxSelectors(query)

    expect(checkbox.get()).toBe('#settings .checkbox-field')
    expect(checkbox.checked()).toBe(
      '#settings .checkbox-field input.checkbox-field__control:checked',
    )
    expect(checkbox.hint()).toBe('#settings .checkbox-field .checkbox-field__hint')
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmCheckboxSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
