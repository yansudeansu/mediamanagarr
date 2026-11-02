import { describe, expect, it, vi } from 'vitest'
import { mmPaginationSelectors } from './mmPagination.selectors'

describe('mmPaginationSelectors', () => {
  it('selects the accessible pagination landmark', () => {
    const query = vi.fn((selector: string) => selector)
    const pagination = mmPaginationSelectors(query)

    expect(pagination.get()).toBe('nav.pagination[aria-label="Pagination"]')
    expect(query).toHaveBeenCalledWith('nav.pagination[aria-label="Pagination"]')
  })

  it('selects the page label and live announcement', () => {
    const pagination = mmPaginationSelectors((selector) => selector)

    expect(pagination.label()).toBe('nav.pagination[aria-label="Pagination"] .pagination-label')
    expect(pagination.liveLabel()).toBe(
      'nav.pagination[aria-label="Pagination"] .pagination-label[aria-live="polite"][aria-atomic="true"]',
    )
  })

  it('selects the navigation arrows', () => {
    const pagination = mmPaginationSelectors((selector) => selector)

    expect(pagination.arrows()).toBe(
      'nav.pagination[aria-label="Pagination"] button.pagination-arrow',
    )
    expect(pagination.previous()).toBe(
      'nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Previous page"]',
    )
    expect(pagination.next()).toBe(
      'nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Next page"]',
    )
  })

  it('selects disabled and enabled previous arrows', () => {
    const pagination = mmPaginationSelectors((selector) => selector)

    expect(pagination.previousDisabled()).toBe(
      'nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Previous page"]:disabled',
    )
    expect(pagination.previousEnabled()).toBe(
      'nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Previous page"]:enabled',
    )
  })

  it('selects disabled and enabled next arrows', () => {
    const pagination = mmPaginationSelectors((selector) => selector)

    expect(pagination.nextDisabled()).toBe(
      'nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Next page"]:disabled',
    )
    expect(pagination.nextEnabled()).toBe(
      'nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Next page"]:enabled',
    )
  })

  it('selects the previous and next arrow icons', () => {
    const pagination = mmPaginationSelectors((selector) => selector)

    expect(pagination.previousIcon()).toBe(
      'nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Previous page"] svg',
    )
    expect(pagination.nextIcon()).toBe(
      'nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Next page"] svg',
    )
  })

  it('selects decorative arrow icons', () => {
    const pagination = mmPaginationSelectors((selector) => selector)

    expect(pagination.decorativePreviousIcon()).toBe(
      'nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Previous page"] svg[aria-hidden="true"]',
    )
    expect(pagination.decorativeNextIcon()).toBe(
      'nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Next page"] svg[aria-hidden="true"]',
    )
  })

  it('selects optional numbered pages and ellipses', () => {
    const pagination = mmPaginationSelectors((selector) => selector)

    expect(pagination.numberedPages()).toBe(
      'nav.pagination[aria-label="Pagination"] .pagination-page',
    )
    expect(pagination.ellipses()).toBe(
      'nav.pagination[aria-label="Pagination"] .pagination-ellipsis',
    )
  })

  it('delegates queries to the provided function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const pagination = mmPaginationSelectors(query)

    expect(pagination.get()).toEqual({
      selector: 'nav.pagination[aria-label="Pagination"]',
    })
    expect(pagination.label()).toEqual({
      selector: 'nav.pagination[aria-label="Pagination"] .pagination-label',
    })
    expect(pagination.nextDisabled()).toEqual({
      selector:
        'nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Next page"]:disabled',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const pagination = mmPaginationSelectors((selector) => `#results ${selector}`)

    expect(pagination.get()).toBe('#results nav.pagination[aria-label="Pagination"]')
    expect(pagination.label()).toBe(
      '#results nav.pagination[aria-label="Pagination"] .pagination-label',
    )
    expect(pagination.previous()).toBe(
      '#results nav.pagination[aria-label="Pagination"] button.pagination-arrow[aria-label="Previous page"]',
    )
  })

  it('does not execute queries when created', () => {
    const query = vi.fn((selector: string) => selector)

    mmPaginationSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
