import { describe, expect, it, vi } from 'vitest'
import { mmUpNextViewSelectors } from './mmUpNextView.selectors'

describe('mmUpNextViewSelectors', () => {
  const select = () => mmUpNextViewSelectors((selector) => selector)
  const root = '.up-next-template'

  it('selects the root and header', () => {
    const view = select()
    expect(view.get()).toBe(root)
    expect(view.title()).toBe(`${root} header.up-next-template__header #up-next-title`)
    expect(view.description()).toContain('.up-next-template__description')
  })

  it('selects the action buttons and disabled state', () => {
    const view = select()
    expect(view.clear()).toContain('button:first-child')
    expect(view.refresh()).toContain('button:last-child')
    expect(view.refreshDisabled()).toContain('button:last-child:disabled')
  })

  it('selects the filters by index and state', () => {
    const view = select()
    expect(view.filter(0)).toContain('button[aria-pressed]:nth-of-type(1)')
    expect(view.filter(1)).toContain('button[aria-pressed]:nth-of-type(2)')
    expect(view.activeFilter()).toContain('button[aria-pressed="true"]')
  })

  it('selects loading, empty, error and action error states', () => {
    const view = select()
    expect(view.loading()).toContain('[role="status"]')
    expect(view.empty()).toContain('.up-next-view__message:not([role])')
    expect(view.error()).toContain('.up-next-view__error[role="alert"]')
    expect(view.actionError()).toContain('.up-next-view__action-error[role="alert"]')
    expect(view.retry()).toContain('.up-next-view__error button')
  })

  it('selects cards, artwork, links and indicators', () => {
    const view = select()
    expect(view.cards()).toContain('.arrival-card')
    expect(view.card(1)).toContain('.arrival-card:nth-of-type(2)')
    expect(view.links()).toContain('.arrival-card__link')
    expect(view.images()).toContain('.arrival-card img')
    expect(view.placeholders()).toContain('.media-poster__placeholder')
    expect(view.indicators()).toContain('.arrival-card__indicator')
  })

  it('selects labelled pagination and its next button', () => {
    const view = select()
    expect(view.labelledPagination()).toContain('[aria-label="Arrival pagination"]')
    expect(view.nextPage()).toContain('button[aria-label*="Next"]')
    expect(view.nextPageEnabled()).toContain(':enabled')
  })

  it('delegates queries to the provided function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const view = mmUpNextViewSelectors(query)
    expect(view.loading()).toEqual({ selector: expect.stringContaining('[role="status"]') })
    expect(query).toHaveBeenCalledOnce()
  })

  it('supports scoped queries', () => {
    const view = mmUpNextViewSelectors((selector) => `#app ${selector}`)
    expect(view.get()).toBe(`#app ${root}`)
    expect(view.refresh()).toContain(`#app ${root}`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)
    mmUpNextViewSelectors(query)
    expect(query).not.toHaveBeenCalled()
  })
})
