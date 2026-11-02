import { describe, expect, it, vi } from 'vitest'
import { mmArrivalCardSelectors } from './mmArrivalCard.selectors'

describe('mmArrivalCardSelectors', () => {
  it('selects the arrival card root', () => {
    const query = vi.fn((selector: string) => selector)
    const arrival = mmArrivalCardSelectors(query)

    expect(arrival.get()).toBe('article.arrival-card')
    expect(query).toHaveBeenCalledWith('article.arrival-card')
  })

  it('selects unread arrivals', () => {
    const arrival = mmArrivalCardSelectors((selector) => selector)

    expect(arrival.unread()).toBe('article.arrival-card.arrival-card--unread')
  })

  it('selects the details and heading', () => {
    const arrival = mmArrivalCardSelectors((selector) => selector)

    expect(arrival.details()).toBe('article.arrival-card .arrival-card__details')
    expect(arrival.heading()).toBe('article.arrival-card .arrival-card__heading')
  })

  it('selects the title and media link', () => {
    const arrival = mmArrivalCardSelectors((selector) => selector)

    expect(arrival.title()).toBe('article.arrival-card .arrival-card__title')
    expect(arrival.link()).toBe('article.arrival-card a.arrival-card__link')
  })

  it('selects media metadata', () => {
    const arrival = mmArrivalCardSelectors((selector) => selector)

    expect(arrival.type()).toBe('article.arrival-card .arrival-card__type')
    expect(arrival.subtitle()).toBe('article.arrival-card .arrival-card__subtitle')
  })

  it('selects the footer and date', () => {
    const arrival = mmArrivalCardSelectors((selector) => selector)

    expect(arrival.footer()).toBe('article.arrival-card .arrival-card__footer')
    expect(arrival.date()).toBe('article.arrival-card .arrival-card__date')
  })

  it('distinguishes valid and invalid dates', () => {
    const arrival = mmArrivalCardSelectors((selector) => selector)

    expect(arrival.validDate()).toBe('article.arrival-card time.arrival-card__date')
    expect(arrival.invalidDate()).toBe('article.arrival-card span.arrival-card__date')
  })

  it('selects the accessible unread indicator', () => {
    const arrival = mmArrivalCardSelectors((selector) => selector)

    expect(arrival.indicator()).toBe(
      'article.arrival-card .arrival-card__indicator[aria-label="New arrival"]',
    )
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const arrival = mmArrivalCardSelectors(query)

    expect(arrival.get()).toEqual({ selector: 'article.arrival-card' })
    expect(arrival.unread()).toEqual({
      selector: 'article.arrival-card.arrival-card--unread',
    })
    expect(arrival.title()).toEqual({
      selector: 'article.arrival-card .arrival-card__title',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#arrivals ${selector}`
    const arrival = mmArrivalCardSelectors(query)

    expect(arrival.get()).toBe('#arrivals article.arrival-card')
    expect(arrival.title()).toBe('#arrivals article.arrival-card .arrival-card__title')
    expect(arrival.indicator()).toBe(
      '#arrivals article.arrival-card .arrival-card__indicator[aria-label="New arrival"]',
    )
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmArrivalCardSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
