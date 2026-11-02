import { describe, expect, it, vi } from 'vitest'
import { mmCalendarViewSelectors } from './mmCalendarView.selectors'

describe('mmCalendarViewSelectors', () => {
  const select = () => mmCalendarViewSelectors((selector) => selector)
  const root = '.calendar-template'
  const toolbar = `${root} .calendar-template__toolbar`
  const actions = `${toolbar} .calendar-template__actions`
  const navigation = `${root} .calendar-template__navigation`
  const status = `${root} .calendar-template__status`
  const content = `${root} .calendar-template__content`

  it('selects the view root and heading', () => {
    const view = select()

    expect(view.get()).toBe(root)
    expect(view.title()).toBe(`${root} #calendar-title`)
    expect(view.description()).toBe(`${root} .calendar-template__description`)
  })

  it('selects toolbar and filters', () => {
    const view = select()

    expect(view.toolbar()).toBe(toolbar)
    expect(view.filters()).toBe(`${toolbar} .calendar-template__filters`)
    expect(view.filterButtons()).toBe(`${toolbar} .filter-group__button`)
  })

  it('selects actions and their states', () => {
    const view = select()
    const refresh = `${actions} button[aria-label="Refresh calendar"]`

    expect(view.actions()).toBe(actions)
    expect(view.today()).toBe(`${actions} button:first-child`)
    expect(view.refresh()).toBe(refresh)
    expect(view.refreshDisabled()).toBe(`${refresh}:disabled`)
    expect(view.refreshEnabled()).toBe(`${refresh}:enabled`)
  })

  it('selects month navigation', () => {
    const view = select()

    expect(view.navigation()).toBe(navigation)
    expect(view.previous()).toBe(`${navigation} button[aria-label="Previous month"]`)
    expect(view.next()).toBe(`${navigation} button[aria-label="Next month"]`)
  })

  it('selects loading, errors, retry and warnings', () => {
    const view = select()

    expect(view.status()).toBe(status)
    expect(view.loading()).toBe(`${status} .calendar-view__message[role="status"]`)
    expect(view.error()).toBe(`${status} .calendar-view__error[role="alert"]`)
    expect(view.retry()).toBe(`${status} .calendar-view__error button`)
    expect(view.warnings()).toBe(`${status} .calendar-view__warning[role="status"]`)
  })

  it('selects content and its states', () => {
    const view = select()

    expect(view.content()).toBe(content)
    expect(view.setupGuidance()).toBe(`${content} .calendar-view__message`)
    expect(view.grid()).toBe(`${content} .calendar-grid`)
    expect(view.details()).toBe(`${root} .calendar-template__details`)
  })

  it('delegates queries', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const view = mmCalendarViewSelectors(query)

    expect(view.today()).toEqual({ selector: `${actions} button:first-child` })
    expect(view.error()).toEqual({
      selector: `${status} .calendar-view__error[role="alert"]`,
    })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const view = mmCalendarViewSelectors((selector) => `#app ${selector}`)

    expect(view.get()).toBe(`#app ${root}`)
    expect(view.refresh()).toBe(`#app ${actions} button[aria-label="Refresh calendar"]`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmCalendarViewSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
