import { describe, expect, it, vi } from 'vitest'
import { mmRequestViewSelectors } from './mmRequestView.selectors'

describe('mmRequestViewSelectors', () => {
  const select = () => mmRequestViewSelectors((selector) => selector)
  const root = '.requests-template'
  const header = `${root} header.requests-template__header`
  const actions = `${header} .requests-template__actions`
  const filters = `${root} section.requests-template__filters`
  const content = `${root} section.requests-template__content`
  const pagination = `${root} nav.requests-template__pagination`

  it('selects the root and heading', () => {
    const view = select()

    expect(view.get()).toBe(root)
    expect(view.header()).toBe(header)
    expect(view.title()).toBe(`${header} #requests-title`)
    expect(view.description()).toBe(`${header} .requests-template__description`)
  })

  it('selects refresh and its states', () => {
    const view = select()

    expect(view.actions()).toBe(actions)
    expect(view.refresh()).toBe(`${actions} button`)
    expect(view.refreshDisabled()).toBe(`${actions} button:disabled`)
    expect(view.refreshEnabled()).toBe(`${actions} button:enabled`)
  })

  it('selects filters and their states', () => {
    const view = select()

    expect(view.filters()).toBe(filters)
    expect(view.filterGroup()).toBe(`${filters} .filter-group[role="group"]`)
    expect(view.filterButtons()).toBe(`${filters} button[aria-pressed]`)
    expect(view.filter(0)).toBe(`${filters} button[aria-pressed]:nth-of-type(1)`)
    expect(view.filter(2)).toBe(`${filters} button[aria-pressed]:nth-of-type(3)`)
    expect(view.activeFilter()).toBe(`${filters} button[aria-pressed="true"]`)
    expect(view.inactiveFilters()).toBe(`${filters} button[aria-pressed="false"]`)
  })

  it('selects loading, empty, error and retry states', () => {
    const view = select()

    expect(view.content()).toBe(content)
    expect(view.loading()).toBe(`${content} .request-view__message[role="status"]`)
    expect(view.empty()).toBe(`${content} .request-view__message:not([role])`)
    expect(view.error()).toBe(`${content} .request-view__error[role="alert"]`)
    expect(view.retry()).toBe(`${content} .request-view__error button`)
  })

  it('selects request cards', () => {
    const view = select()

    expect(view.cards()).toBe(`${content} .request-card`)
    expect(view.card(0)).toBe(`${content} .request-card:nth-child(1)`)
    expect(view.card(1)).toBe(`${content} .request-card:nth-child(2)`)
    expect(view.cardTitles()).toBe(`${content} .request-card__title`)
  })

  it('selects pagination', () => {
    const view = select()

    expect(view.pagination()).toBe(pagination)
    expect(view.labelledPagination()).toBe(`${pagination}[aria-label="Request pagination"]`)
    expect(view.paginationButtons()).toBe(`${pagination} button`)
  })

  it('delegates queries', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const view = mmRequestViewSelectors(query)

    expect(view.refresh()).toEqual({ selector: `${actions} button` })
    expect(view.error()).toEqual({
      selector: `${content} .request-view__error[role="alert"]`,
    })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const view = mmRequestViewSelectors((selector) => `#app ${selector}`)

    expect(view.get()).toBe(`#app ${root}`)
    expect(view.refresh()).toBe(`#app ${actions} button`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmRequestViewSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
