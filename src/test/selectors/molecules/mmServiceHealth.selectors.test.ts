import { describe, expect, it, vi } from 'vitest'
import { mmServiceHealthSelectors } from './mmServiceHealth.selectors'

describe('mmServiceHealthSelectors', () => {
  const select = () => mmServiceHealthSelectors((selector) => selector)

  it('selects the service health root', () => {
    expect(select().get()).toBe('.service-health')
  })

  it('selects the status row', () => {
    expect(select().row()).toBe('.service-health .service-health__row')
  })

  it('selects the last checked timestamp', () => {
    expect(select().time()).toBe('.service-health .service-health__time')
  })

  it('selects the error and accessible alert', () => {
    const health = select()

    expect(health.error()).toBe('.service-health .service-health__error')
    expect(health.alert()).toBe('.service-health .service-health__error[role="alert"]')
  })

  it('selects an explicitly assigned landmark role', () => {
    expect(select().landmark()).toBe('.service-health[role]')
  })

  it('selects optional sections and accessible labels', () => {
    const health = select()

    expect(health.section()).toBe('.service-health section')
    expect(health.labelledBy()).toBe(
      '.service-health [aria-labelledby], .service-health[aria-labelledby]',
    )
  })

  it('selects interactive controls when present', () => {
    const health = select()

    expect(health.buttons()).toBe('.service-health button')
    expect(health.links()).toBe('.service-health a')
  })

  it('delegates queries to the provided function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const health = mmServiceHealthSelectors(query)

    expect(health.get()).toEqual({ selector: '.service-health' })
    expect(health.time()).toEqual({
      selector: '.service-health .service-health__time',
    })
    expect(health.alert()).toEqual({
      selector: '.service-health .service-health__error[role="alert"]',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const health = mmServiceHealthSelectors((selector) => `#settings ${selector}`)

    expect(health.get()).toBe('#settings .service-health')
    expect(health.row()).toBe('#settings .service-health .service-health__row')
    expect(health.error()).toBe('#settings .service-health .service-health__error')
  })

  it('does not query during construction', () => {
    const query = vi.fn((selector: string) => selector)

    mmServiceHealthSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
