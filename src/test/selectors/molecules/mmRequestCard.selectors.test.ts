import { describe, expect, it, vi } from 'vitest'
import { mmRequestCardSelectors } from './mmRequestCard.selectors'

describe('mmRequestCardSelectors', () => {
  const select = () => mmRequestCardSelectors((selector) => selector)

  it('selects the request card root', () => {
    expect(select().get()).toBe('.request-card')
  })

  it('selects the details and heading', () => {
    const card = select()

    expect(card.details()).toBe('.request-card .request-card__details')
    expect(card.heading()).toBe('.request-card .request-card__heading')
  })

  it('selects the title and media type', () => {
    const card = select()

    expect(card.title()).toBe('.request-card h3.request-card__title')
    expect(card.type()).toBe('.request-card .request-card__type')
  })

  it('selects the status container and badge', () => {
    const card = select()

    expect(card.statuses()).toBe('.request-card .request-card__statuses')
    expect(card.badge()).toBe('.request-card .request-card__badge')
  })

  it('selects status variants', () => {
    const card = select()

    expect(card.status('pending')).toBe(
      '.request-card .request-card__badge.request-card__badge--pending',
    )
    expect(card.status('available')).toBe(
      '.request-card .request-card__badge.request-card__badge--available',
    )
    expect(card.status('partial')).toBe(
      '.request-card .request-card__badge.request-card__badge--partial',
    )
  })

  it('selects metadata and requester', () => {
    const card = select()

    expect(card.metadata()).toBe('.request-card .request-card__metadata')
    expect(card.requester()).toBe('.request-card .request-card__requester')
  })

  it('selects valid and invalid dates', () => {
    const card = select()

    expect(card.date()).toBe('.request-card .request-card__date')
    expect(card.validDate()).toBe('.request-card time.request-card__date')
    expect(card.invalidDate()).toBe('.request-card span.request-card__date')
  })

  it('selects interactive controls when present', () => {
    const card = select()

    expect(card.buttons()).toBe('.request-card button')
    expect(card.links()).toBe('.request-card a')
  })

  it('delegates queries to the provided function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const card = mmRequestCardSelectors(query)

    expect(card.get()).toEqual({ selector: '.request-card' })
    expect(card.title()).toEqual({ selector: '.request-card h3.request-card__title' })
    expect(card.status('processing')).toEqual({
      selector: '.request-card .request-card__badge.request-card__badge--processing',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped queries', () => {
    const card = mmRequestCardSelectors((selector) => `#requests ${selector}`)

    expect(card.get()).toBe('#requests .request-card')
    expect(card.title()).toBe('#requests .request-card h3.request-card__title')
    expect(card.badge()).toBe('#requests .request-card .request-card__badge')
  })

  it('does not query during construction', () => {
    const query = vi.fn((selector: string) => selector)

    mmRequestCardSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
