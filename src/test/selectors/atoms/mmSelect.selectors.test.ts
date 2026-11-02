import { describe, expect, it, vi } from 'vitest'
import { mmSelectSelectors } from './mmSelect.selectors'

describe('mmSelectSelectors', () => {
  it('selects the root', () => {
    const query = vi.fn((selector: string) => selector)
    const select = mmSelectSelectors(query)

    expect(select.get()).toBe('.select-field')
    expect(query).toHaveBeenCalledWith('.select-field')
  })

  it('selects the label and required indicator', () => {
    const select = mmSelectSelectors((selector) => selector)

    expect(select.label()).toBe('.select-field .select-field__label')
    expect(select.requiredIndicator()).toBe('.select-field .select-field__required')
  })

  it('selects the wrapper and trigger', () => {
    const select = mmSelectSelectors((selector) => selector)

    expect(select.wrapper()).toBe('.select-field .select-field__wrapper')
    expect(select.trigger()).toBe('.select-field button.select-field__trigger')
  })

  it('selects open and closed states', () => {
    const select = mmSelectSelectors((selector) => selector)

    expect(select.opened()).toBe('.select-field button.select-field__trigger[aria-expanded="true"]')
    expect(select.closed()).toBe(
      '.select-field button.select-field__trigger[aria-expanded="false"]',
    )
  })

  it('selects disabled and enabled states', () => {
    const select = mmSelectSelectors((selector) => selector)

    expect(select.disabled()).toBe('.select-field button.select-field__trigger:disabled')
    expect(select.enabled()).toBe('.select-field button.select-field__trigger:enabled')
  })

  it('selects loading, invalid, and placeholder states', () => {
    const select = mmSelectSelectors((selector) => selector)

    expect(select.loading()).toBe('.select-field button.select-field__trigger[aria-busy="true"]')
    expect(select.invalid()).toBe('.select-field button.select-field__trigger[aria-invalid="true"]')
    expect(select.placeholder()).toBe(
      '.select-field button.select-field__trigger.select-field__trigger--placeholder',
    )
  })

  it('selects the visible value and icons', () => {
    const select = mmSelectSelectors((selector) => selector)

    expect(select.value()).toBe('.select-field button.select-field__trigger .select-field__value')
    expect(select.spinner()).toBe(
      '.select-field button.select-field__trigger .select-field__spinner',
    )
    expect(select.chevron()).toBe(
      '.select-field button.select-field__trigger .select-field__chevron',
    )
  })

  it('selects the listbox', () => {
    const select = mmSelectSelectors((selector) => selector)

    expect(select.dropdown()).toBe('.select-field .select-field__dropdown[role="listbox"]')
  })

  it('selects options by index', () => {
    const select = mmSelectSelectors((selector) => selector)

    expect(select.options()).toBe('.select-field button.select-field__option[role="option"]')
    expect(select.option(0)).toBe(
      '.select-field button.select-field__option[role="option"]:nth-of-type(1)',
    )
    expect(select.option(2)).toBe(
      '.select-field button.select-field__option[role="option"]:nth-of-type(3)',
    )
  })

  it('selects selected, active, and disabled options', () => {
    const select = mmSelectSelectors((selector) => selector)

    expect(select.selected()).toBe(
      '.select-field button.select-field__option[role="option"][aria-selected="true"]',
    )
    expect(select.active()).toBe(
      '.select-field button.select-field__option[role="option"][tabindex="0"]',
    )
    expect(select.disabledOptions()).toBe(
      '.select-field button.select-field__option[role="option"]:disabled',
    )
    expect(select.enabledOptions()).toBe(
      '.select-field button.select-field__option[role="option"]:enabled',
    )
  })

  it('selects option labels and checkmarks', () => {
    const select = mmSelectSelectors((selector) => selector)

    expect(select.optionLabel()).toBe(
      '.select-field button.select-field__option[role="option"] .select-field__option-label',
    )
    expect(select.check()).toBe(
      '.select-field button.select-field__option[role="option"] .select-field__check',
    )
  })

  it('selects the hidden input, hint, and error', () => {
    const select = mmSelectSelectors((selector) => selector)

    expect(select.hiddenInput()).toBe('.select-field input[type="hidden"]')
    expect(select.hint()).toBe('.select-field .select-field__hint')
    expect(select.error()).toBe('.select-field .select-field__error[role="alert"]')
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const select = mmSelectSelectors(query)

    expect(select.get()).toEqual({ selector: '.select-field' })
    expect(select.trigger()).toEqual({ selector: '.select-field button.select-field__trigger' })
    expect(select.option(1)).toEqual({
      selector: '.select-field button.select-field__option[role="option"]:nth-of-type(2)',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#settings ${selector}`
    const select = mmSelectSelectors(query)

    expect(select.get()).toBe('#settings .select-field')
    expect(select.trigger()).toBe('#settings .select-field button.select-field__trigger')
    expect(select.dropdown()).toBe(
      '#settings .select-field .select-field__dropdown[role="listbox"]',
    )
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmSelectSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
