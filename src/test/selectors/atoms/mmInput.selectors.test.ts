import { describe, expect, it, vi } from 'vitest'
import { mmInputSelectors } from './mmInput.selectors'

describe('mmInputSelectors', () => {
  it('selects the input root', () => {
    const query = vi.fn((selector: string) => selector)
    const input = mmInputSelectors(query)

    expect(input.get()).toBe('.input-field')
    expect(query).toHaveBeenCalledWith('.input-field')
  })

  it('selects the label', () => {
    const input = mmInputSelectors((selector) => selector)
    expect(input.label()).toBe('.input-field .input-field__label')
  })

  it('selects the required indicator', () => {
    const input = mmInputSelectors((selector) => selector)
    expect(input.requiredIndicator()).toBe('.input-field .input-field__required')
  })

  it('selects the native input control', () => {
    const input = mmInputSelectors((selector) => selector)
    expect(input.control()).toBe('.input-field input.input-field__control')
  })

  it.each(['text', 'url', 'password'] as const)('selects %s inputs', (type) => {
    const input = mmInputSelectors((selector) => selector)
    expect(input.type(type)).toBe(`.input-field input.input-field__control[type="${type}"]`)
  })

  it('selects disabled inputs', () => {
    const input = mmInputSelectors((selector) => selector)
    expect(input.disabled()).toBe('.input-field input.input-field__control:disabled')
  })

  it('selects enabled inputs', () => {
    const input = mmInputSelectors((selector) => selector)
    expect(input.enabled()).toBe('.input-field input.input-field__control:enabled')
  })

  it('selects required inputs', () => {
    const input = mmInputSelectors((selector) => selector)
    expect(input.required()).toBe('.input-field input.input-field__control:required')
  })

  it('selects invalid inputs', () => {
    const input = mmInputSelectors((selector) => selector)
    expect(input.invalid()).toBe('.input-field input.input-field__control[aria-invalid="true"]')
  })

  it('selects inputs without an invalid state', () => {
    const input = mmInputSelectors((selector) => selector)
    expect(input.valid()).toBe('.input-field input.input-field__control:not([aria-invalid="true"])')
  })

  it('selects the hint', () => {
    const input = mmInputSelectors((selector) => selector)
    expect(input.hint()).toBe('.input-field .input-field__hint')
  })

  it('selects the error alert', () => {
    const input = mmInputSelectors((selector) => selector)
    expect(input.error()).toBe('.input-field .input-field__error[role="alert"]')
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const input = mmInputSelectors(query)

    expect(input.get()).toEqual({ selector: '.input-field' })
    expect(input.control()).toEqual({ selector: '.input-field input.input-field__control' })
    expect(input.error()).toEqual({ selector: '.input-field .input-field__error[role="alert"]' })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#settings ${selector}`
    const input = mmInputSelectors(query)

    expect(input.get()).toBe('#settings .input-field')
    expect(input.type('url')).toBe('#settings .input-field input.input-field__control[type="url"]')
    expect(input.error()).toBe('#settings .input-field .input-field__error[role="alert"]')
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmInputSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
