import { describe, expect, it, vi } from 'vitest'
import { mmFilterGroupSelectors } from './mmFilterGroup.selectors'

describe('mmFilterGroupSelectors', () => {
  it('selects the accessible filter group', () => {
    const query = vi.fn((selector: string) => selector)
    const filters = mmFilterGroupSelectors(query)

    expect(filters.get()).toBe('.filter-group[role="group"]')
    expect(query).toHaveBeenCalledWith('.filter-group[role="group"]')
  })

  it('selects a group by its accessible label', () => {
    const filters = mmFilterGroupSelectors((selector) => selector)

    expect(filters.labelled('Request status filters')).toBe(
      '.filter-group[role="group"][aria-label="Request status filters"]',
    )
  })

  it('selects all filter buttons', () => {
    const filters = mmFilterGroupSelectors((selector) => selector)

    expect(filters.buttons()).toBe('.filter-group[role="group"] button.filter-group__button')
  })

  it('selects indexed filter buttons', () => {
    const filters = mmFilterGroupSelectors((selector) => selector)

    expect(filters.button(0)).toBe(
      '.filter-group[role="group"] button.filter-group__button:nth-child(1)',
    )
    expect(filters.button(2)).toBe(
      '.filter-group[role="group"] button.filter-group__button:nth-child(3)',
    )
  })

  it('selects active and pressed filters', () => {
    const filters = mmFilterGroupSelectors((selector) => selector)

    expect(filters.active()).toBe(
      '.filter-group[role="group"] button.filter-group__button.filter-group__button--active',
    )
    expect(filters.pressed()).toBe(
      '.filter-group[role="group"] button.filter-group__button[aria-pressed="true"]',
    )
    expect(filters.unpressed()).toBe(
      '.filter-group[role="group"] button.filter-group__button[aria-pressed="false"]',
    )
  })

  it('selects disabled and enabled filters', () => {
    const filters = mmFilterGroupSelectors((selector) => selector)

    expect(filters.disabled()).toBe(
      '.filter-group[role="group"] button.filter-group__button:disabled',
    )
    expect(filters.enabled()).toBe(
      '.filter-group[role="group"] button.filter-group__button:enabled',
    )
  })

  it('selects filter indicators', () => {
    const filters = mmFilterGroupSelectors((selector) => selector)

    expect(filters.indicators()).toBe(
      '.filter-group[role="group"] button.filter-group__button .filter-group__indicator',
    )
    expect(filters.decorativeIndicators()).toBe(
      '.filter-group[role="group"] button.filter-group__button .filter-group__indicator[aria-hidden="true"]',
    )
  })

  it('selects an indicator belonging to a specific filter', () => {
    const filters = mmFilterGroupSelectors((selector) => selector)

    expect(filters.indicator(1)).toBe(
      '.filter-group[role="group"] button.filter-group__button:nth-child(2) .filter-group__indicator',
    )
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const filters = mmFilterGroupSelectors(query)

    expect(filters.get()).toEqual({ selector: '.filter-group[role="group"]' })
    expect(filters.button(1)).toEqual({
      selector: '.filter-group[role="group"] button.filter-group__button:nth-child(2)',
    })
    expect(filters.pressed()).toEqual({
      selector: '.filter-group[role="group"] button.filter-group__button[aria-pressed="true"]',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const filters = mmFilterGroupSelectors((selector) => `#requests ${selector}`)

    expect(filters.get()).toBe('#requests .filter-group[role="group"]')
    expect(filters.button(0)).toBe(
      '#requests .filter-group[role="group"] button.filter-group__button:nth-child(1)',
    )
    expect(filters.active()).toBe(
      '#requests .filter-group[role="group"] button.filter-group__button.filter-group__button--active',
    )
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmFilterGroupSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
