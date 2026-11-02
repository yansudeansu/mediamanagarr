import { describe, expect, it, vi } from 'vitest'
import { mmHeaderSelectors } from './mmHeader.selectors'

describe('mmHeaderSelectors', () => {
  it('selects the header root', () => {
    const query = vi.fn((selector: string) => selector)
    const header = mmHeaderSelectors(query)

    expect(header.get()).toBe('header.header')
    expect(query).toHaveBeenCalledWith('header.header')
  })

  it('selects the branding container', () => {
    const header = mmHeaderSelectors((selector) => selector)
    expect(header.branding()).toBe('header.header .header__branding')
  })

  it('selects the logo', () => {
    const header = mmHeaderSelectors((selector) => selector)
    expect(header.logo()).toBe('header.header img.header__logo')
  })

  it('selects the title', () => {
    const header = mmHeaderSelectors((selector) => selector)
    expect(header.title()).toBe('header.header h1.header__title')
  })

  it('selects the actions container', () => {
    const header = mmHeaderSelectors((selector) => selector)
    expect(header.actions()).toBe('header.header .header__actions')
  })

  it('selects action buttons', () => {
    const header = mmHeaderSelectors((selector) => selector)
    expect(header.actionButtons()).toBe('header.header .header__actions button')
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const header = mmHeaderSelectors(query)

    expect(header.get()).toEqual({ selector: 'header.header' })
    expect(header.title()).toEqual({ selector: 'header.header h1.header__title' })
    expect(header.actions()).toEqual({ selector: 'header.header .header__actions' })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#app ${selector}`
    const header = mmHeaderSelectors(query)

    expect(header.get()).toBe('#app header.header')
    expect(header.logo()).toBe('#app header.header img.header__logo')
    expect(header.actionButtons()).toBe('#app header.header .header__actions button')
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmHeaderSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
