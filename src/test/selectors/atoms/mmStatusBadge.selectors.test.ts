import { describe, expect, it, vi } from 'vitest'
import { mmStatusBadgeSelectors } from './mmStatusBadge.selectors'

describe('mmStatusBadgeSelectors', () => {
  it('selects the badge root', () => {
    const query = vi.fn((selector: string) => selector)
    const badge = mmStatusBadgeSelectors(query)

    expect(badge.get()).toBe('span.status-badge')
    expect(query).toHaveBeenCalledWith('span.status-badge')
  })

  it.each(['neutral', 'info', 'success', 'danger'] as const)(
    'selects the %s variant',
    (variant) => {
      const badge = mmStatusBadgeSelectors((selector) => selector)

      expect(badge.variant(variant)).toBe(`span.status-badge.status-badge--${variant}`)
    },
  )

  it('selects the status dot', () => {
    const badge = mmStatusBadgeSelectors((selector) => selector)

    expect(badge.dot()).toBe('span.status-badge .status-badge__dot')
  })

  it('selects the decorative status dot', () => {
    const badge = mmStatusBadgeSelectors((selector) => selector)

    expect(badge.decorativeDot()).toBe('span.status-badge .status-badge__dot[aria-hidden="true"]')
  })

  it('selects the readable label', () => {
    const badge = mmStatusBadgeSelectors((selector) => selector)

    expect(badge.label()).toBe('span.status-badge .status-badge__label')
  })

  it('selects interactive controls inside the badge', () => {
    const badge = mmStatusBadgeSelectors((selector) => selector)

    expect(badge.buttons()).toBe('span.status-badge button')
    expect(badge.links()).toBe('span.status-badge a')
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const badge = mmStatusBadgeSelectors(query)

    expect(badge.get()).toEqual({ selector: 'span.status-badge' })
    expect(badge.variant('success')).toEqual({
      selector: 'span.status-badge.status-badge--success',
    })
    expect(badge.label()).toEqual({
      selector: 'span.status-badge .status-badge__label',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#settings ${selector}`
    const badge = mmStatusBadgeSelectors(query)

    expect(badge.get()).toBe('#settings span.status-badge')
    expect(badge.variant('danger')).toBe('#settings span.status-badge.status-badge--danger')
    expect(badge.label()).toBe('#settings span.status-badge .status-badge__label')
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmStatusBadgeSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
