import { describe, expect, it, vi } from 'vitest'
import { mmCardSelectors } from './mmCard.selectors'

describe('mmCardSelectors', () => {
  it('selects the card root', () => {
    const query = vi.fn((selector: string) => selector)
    const card = mmCardSelectors(query)

    expect(card.get()).toBe('article.mm-card')
    expect(query).toHaveBeenCalledWith('article.mm-card')
  })

  it.each([
    ['default', 'article.mm-card.mm-card--default'],
    ['outlined', 'article.mm-card.mm-card--outlined'],
  ] as const)('selects the %s variant', (variant, expected) => {
    const card = mmCardSelectors((selector) => selector)

    expect(card.variant(variant)).toBe(expected)
  })

  it.each([
    ['none', 'article.mm-card.mm-card--padding-none'],
    ['sm', 'article.mm-card.mm-card--padding-sm'],
    ['md', 'article.mm-card.mm-card--padding-md'],
  ] as const)('selects the %s padding', (padding, expected) => {
    const card = mmCardSelectors((selector) => selector)

    expect(card.padding(padding)).toBe(expected)
  })

  it('selects the header', () => {
    const card = mmCardSelectors((selector) => selector)

    expect(card.header()).toBe('article.mm-card .mm-card__header')
  })

  it('selects the content', () => {
    const card = mmCardSelectors((selector) => selector)

    expect(card.content()).toBe('article.mm-card .mm-card__content')
  })

  it('selects the footer', () => {
    const card = mmCardSelectors((selector) => selector)

    expect(card.footer()).toBe('article.mm-card .mm-card__footer')
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const card = mmCardSelectors(query)

    expect(card.get()).toEqual({
      selector: 'article.mm-card',
    })
    expect(card.header()).toEqual({
      selector: 'article.mm-card .mm-card__header',
    })
    expect(card.footer()).toEqual({
      selector: 'article.mm-card .mm-card__footer',
    })

    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#settings ${selector}`
    const card = mmCardSelectors(query)

    expect(card.get()).toBe('#settings article.mm-card')
    expect(card.content()).toBe('#settings article.mm-card .mm-card__content')
    expect(card.footer()).toBe('#settings article.mm-card .mm-card__footer')
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmCardSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
