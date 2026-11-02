import { describe, expect, it, vi } from 'vitest'
import { mmButtonSelectors } from './mmButton.selectors'

describe('mmButtonSelectors', () => {
  it('selects the button root', () => {
    const query = vi.fn((selector: string) => selector)
    const button = mmButtonSelectors(query)

    expect(button.get()).toBe('button.button')
    expect(query).toHaveBeenCalledWith('button.button')
  })

  it('selects disabled buttons', () => {
    const button = mmButtonSelectors((selector) => selector)

    expect(button.disabled()).toBe('button.button:disabled')
  })

  it('selects enabled buttons', () => {
    const button = mmButtonSelectors((selector) => selector)

    expect(button.enabled()).toBe('button.button:enabled')
  })

  it('selects loading buttons', () => {
    const button = mmButtonSelectors((selector) => selector)

    expect(button.loading()).toBe('button.button[aria-busy="true"]')
  })

  it('selects the current pagination page', () => {
    const button = mmButtonSelectors((selector) => selector)

    expect(button.currentPage()).toBe('button.button[aria-current="page"]')
  })

  it('selects icon-only buttons', () => {
    const button = mmButtonSelectors((selector) => selector)

    expect(button.iconOnly()).toBe('button.button.button--icon-only')
  })

  it.each([
    ['primary', 'button.button.button--primary'],
    ['secondary', 'button.button.button--secondary'],
    ['danger', 'button.button.button--danger'],
    ['ghost', 'button.button.button--ghost'],
    ['pagination', 'button.button.button--pagination'],
  ] as const)('selects the %s variant', (variant, expected) => {
    const button = mmButtonSelectors((selector) => selector)

    expect(button.variant(variant)).toBe(expected)
  })

  it.each([
    ['small', 'button.button.button--small'],
    ['medium', 'button.button.button--medium'],
  ] as const)('selects the %s size', (size, expected) => {
    const button = mmButtonSelectors((selector) => selector)

    expect(button.size(size)).toBe(expected)
  })

  it('selects the button content', () => {
    const button = mmButtonSelectors((selector) => selector)

    expect(button.content()).toBe('button.button .button__content')
  })

  it('selects the loading spinner', () => {
    const button = mmButtonSelectors((selector) => selector)

    expect(button.spinner()).toBe('button.button .button__spinner')
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const button = mmButtonSelectors(query)

    expect(button.get()).toEqual({ selector: 'button.button' })
    expect(button.disabled()).toEqual({
      selector: 'button.button:disabled',
    })
    expect(button.loading()).toEqual({
      selector: 'button.button[aria-busy="true"]',
    })

    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#settings ${selector}`
    const button = mmButtonSelectors(query)

    expect(button.get()).toBe('#settings button.button')
    expect(button.disabled()).toBe('#settings button.button:disabled')
    expect(button.spinner()).toBe('#settings button.button .button__spinner')
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmButtonSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
