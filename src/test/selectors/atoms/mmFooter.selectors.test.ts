import { describe, expect, it, vi } from 'vitest'
import { mmFooterSelectors } from './mmFooter.selectors'

describe('mmFooterSelectors', () => {
  it('selects the footer root', () => {
    const query = vi.fn((selector: string) => selector)
    const footer = mmFooterSelectors(query)

    expect(footer.get()).toBe('footer.footer')
    expect(query).toHaveBeenCalledWith('footer.footer')
  })

  it('selects the brand', () => {
    const footer = mmFooterSelectors((selector) => selector)

    expect(footer.brand()).toBe('footer.footer .footer__brand')
  })

  it('selects the version', () => {
    const footer = mmFooterSelectors((selector) => selector)

    expect(footer.version()).toBe('footer.footer .footer__version')
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const footer = mmFooterSelectors(query)

    expect(footer.get()).toEqual({ selector: 'footer.footer' })
    expect(footer.brand()).toEqual({ selector: 'footer.footer .footer__brand' })
    expect(footer.version()).toEqual({ selector: 'footer.footer .footer__version' })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#settings ${selector}`
    const footer = mmFooterSelectors(query)

    expect(footer.get()).toBe('#settings footer.footer')
    expect(footer.brand()).toBe('#settings footer.footer .footer__brand')
    expect(footer.version()).toBe('#settings footer.footer .footer__version')
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmFooterSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
