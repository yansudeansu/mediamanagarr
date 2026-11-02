import { describe, expect, it, vi } from 'vitest'
import { mmServiceSelectorSelectors } from './mmServiceSelector.selectors'

describe('mmServiceSelectorSelectors', () => {
  const select = () => mmServiceSelectorSelectors((selector) => selector)
  const root = '.service-selector'
  const list = `${root} .service-selector__list`
  const card = `${list} button.service-card`

  it('selects the root and list', () => {
    const selector = select()

    expect(selector.get()).toBe(root)
    expect(selector.list()).toBe(list)
  })

  it('selects the accessible group', () => {
    const selector = select()

    expect(selector.group()).toBe(`${list}[role="group"]`)
    expect(selector.labelled('Service connections')).toBe(
      `${list}[role="group"][aria-label="Service connections"]`,
    )
  })

  it('selects all cards', () => {
    expect(select().cards()).toBe(card)
  })

  it('selects cards by zero-based index', () => {
    const selector = select()

    expect(selector.card(0)).toBe(`${card}:nth-child(1)`)
    expect(selector.card(4)).toBe(`${card}:nth-child(5)`)
  })

  it('selects service names', () => {
    const selector = select()

    expect(selector.names()).toBe(`${card} .service-card__name`)
    expect(selector.name(0)).toBe(`${card}:nth-child(1) .service-card__name`)
    expect(selector.name(2)).toBe(`${card}:nth-child(3) .service-card__name`)
  })

  it('selects the selected card', () => {
    expect(select().selected()).toBe(`${card}.service-card--selected[aria-current="true"]`)
  })

  it('selects unselected cards', () => {
    expect(select().unselected()).toBe(`${card}:not(.service-card--selected):not([aria-current])`)
  })

  it('selects disabled cards', () => {
    expect(select().disabled()).toBe(`${card}:disabled`)
  })

  it('selects enabled cards', () => {
    expect(select().enabled()).toBe(`${card}:enabled`)
  })

  it('delegates queries', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const selector = mmServiceSelectorSelectors(query)

    expect(selector.card(2)).toEqual({ selector: `${card}:nth-child(3)` })
    expect(selector.selected()).toEqual({
      selector: `${card}.service-card--selected[aria-current="true"]`,
    })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const selector = mmServiceSelectorSelectors((value) => `#settings ${value}`)

    expect(selector.get()).toBe('#settings .service-selector')
    expect(selector.card(0)).toBe(`#settings ${card}:nth-child(1)`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmServiceSelectorSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
