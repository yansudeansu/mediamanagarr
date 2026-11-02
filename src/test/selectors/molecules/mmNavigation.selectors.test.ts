import { describe, expect, it, vi } from 'vitest'
import { mmNavigationSelectors } from './mmNavigation.selectors'

describe('mmNavigationSelectors', () => {
  it('selects the navigation landmark', () => {
    const query = vi.fn((selector: string) => selector)
    const navigation = mmNavigationSelectors(query)

    expect(navigation.get()).toBe('nav')
    expect(query).toHaveBeenCalledWith('nav')
  })

  it('selects navigation by accessible label', () => {
    const navigation = mmNavigationSelectors((selector) => selector)

    expect(navigation.labelled('Library navigation')).toBe('nav[aria-label="Library navigation"]')
  })

  it('selects navigation buttons', () => {
    const navigation = mmNavigationSelectors((selector) => selector)

    expect(navigation.buttons()).toBe('nav button')
    expect(navigation.button(0)).toBe('nav button:nth-child(1)')
    expect(navigation.button(2)).toBe('nav button:nth-child(3)')
  })

  it('selects current and inactive navigation buttons', () => {
    const navigation = mmNavigationSelectors((selector) => selector)

    expect(navigation.current()).toBe('nav button[aria-current="page"]')
    expect(navigation.inactive()).toBe('nav button:not([aria-current="page"])')
  })

  it('selects disabled and enabled navigation buttons', () => {
    const navigation = mmNavigationSelectors((selector) => selector)

    expect(navigation.disabled()).toBe('nav button:disabled')
    expect(navigation.enabled()).toBe('nav button:enabled')
  })

  it('selects ghost and small navigation buttons', () => {
    const navigation = mmNavigationSelectors((selector) => selector)

    expect(navigation.ghost()).toBe('nav button.button--ghost')
    expect(navigation.small()).toBe('nav button.button--small')
  })

  it('selects ARIA tab semantics when present', () => {
    const navigation = mmNavigationSelectors((selector) => selector)

    expect(navigation.tablist()).toBe('nav [role="tablist"]')
    expect(navigation.tabs()).toBe('nav [role="tab"]')
    expect(navigation.selectedTabs()).toBe('nav [aria-selected]')
  })

  it('delegates queries to the provided function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const navigation = mmNavigationSelectors(query)

    expect(navigation.get()).toEqual({ selector: 'nav' })
    expect(navigation.button(1)).toEqual({ selector: 'nav button:nth-child(2)' })
    expect(navigation.current()).toEqual({ selector: 'nav button[aria-current="page"]' })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const navigation = mmNavigationSelectors((selector) => `#app ${selector}`)

    expect(navigation.get()).toBe('#app nav')
    expect(navigation.button(1)).toBe('#app nav button:nth-child(2)')
    expect(navigation.current()).toBe('#app nav button[aria-current="page"]')
  })

  it('does not query until a selector method is called', () => {
    const query = vi.fn((selector: string) => selector)

    mmNavigationSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
