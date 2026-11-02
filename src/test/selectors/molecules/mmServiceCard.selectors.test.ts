import { describe, expect, it, vi } from 'vitest'
import { mmServiceCardSelectors } from './mmServiceCard.selectors'

describe('mmServiceCardSelectors', () => {
  const select = () => mmServiceCardSelectors((selector) => selector)

  it('selects the native service button', () => {
    expect(select().get()).toBe('button.service-card')
  })

  it('selects the service name', () => {
    expect(select().name()).toBe('button.service-card .service-card__name')
  })

  it('selects selected and unselected states', () => {
    const card = select()

    expect(card.selected()).toBe('button.service-card.service-card--selected[aria-current="true"]')
    expect(card.unselected()).toBe(
      'button.service-card:not(.service-card--selected):not([aria-current])',
    )
  })

  it('selects disabled and enabled states', () => {
    const card = select()

    expect(card.disabled()).toBe('button.service-card:disabled')
    expect(card.enabled()).toBe('button.service-card:enabled')
  })

  it('selects an optional chevron', () => {
    expect(select().chevron()).toBe('button.service-card .service-card__chevron')
  })

  it('selects custom accessible naming attributes', () => {
    const card = select()

    expect(card.customLabel()).toBe('button.service-card[aria-label]')
    expect(card.labelledBy()).toBe('button.service-card[aria-labelledby]')
  })

  it('selects an explicitly assigned role', () => {
    expect(select().customRole()).toBe('button.service-card[role]')
  })

  it('delegates queries to the provided function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const card = mmServiceCardSelectors(query)

    expect(card.get()).toEqual({ selector: 'button.service-card' })
    expect(card.name()).toEqual({
      selector: 'button.service-card .service-card__name',
    })
    expect(card.disabled()).toEqual({
      selector: 'button.service-card:disabled',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const card = mmServiceCardSelectors((selector) => `#services ${selector}`)

    expect(card.get()).toBe('#services button.service-card')
    expect(card.name()).toBe('#services button.service-card .service-card__name')
    expect(card.selected()).toBe(
      '#services button.service-card.service-card--selected[aria-current="true"]',
    )
  })

  it('does not execute queries during construction', () => {
    const query = vi.fn((selector: string) => selector)

    mmServiceCardSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
