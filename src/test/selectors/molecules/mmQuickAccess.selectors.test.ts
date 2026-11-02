import { describe, expect, it, vi } from 'vitest'
import { mmQuickAccessSelectors } from './mmQuickAccess.selectors'

describe('mmQuickAccessSelectors', () => {
  const select = () => mmQuickAccessSelectors((selector) => selector)

  it('selects the root and trigger', () => {
    const menu = select()

    expect(menu.get()).toBe('.quick-access')
    expect(menu.trigger()).toBe('.quick-access button[aria-label="Open workspace menu"]')
  })

  it('selects expanded and collapsed trigger states', () => {
    const menu = select()

    expect(menu.opened()).toBe(
      '.quick-access button[aria-label="Open workspace menu"][aria-expanded="true"][aria-controls="quick-access-menu"]',
    )
    expect(menu.closed()).toBe(
      '.quick-access button[aria-label="Open workspace menu"][aria-expanded="false"]',
    )
  })

  it('selects the trigger icon', () => {
    expect(select().triggerIcon()).toBe(
      '.quick-access button[aria-label="Open workspace menu"] svg',
    )
  })

  it('selects the menu and its heading', () => {
    const menu = select()

    expect(menu.menu()).toBe('.quick-access #quick-access-menu')
    expect(menu.heading()).toBe('.quick-access #quick-access-menu .quick-access__heading')
    expect(menu.services()).toBe('.quick-access #quick-access-menu .quick-access__services')
  })

  it('selects service links', () => {
    const menu = select()

    expect(menu.links()).toBe(
      '.quick-access #quick-access-menu .quick-access__services a.quick-access__item',
    )
    expect(menu.link(0)).toBe(
      '.quick-access #quick-access-menu .quick-access__services a.quick-access__item:nth-child(1)',
    )
    expect(menu.link(2)).toBe(
      '.quick-access #quick-access-menu .quick-access__services a.quick-access__item:nth-child(3)',
    )
  })

  it('selects a service link by accessible name', () => {
    expect(select().linkNamed('Dashboard')).toBe(
      '.quick-access #quick-access-menu .quick-access__services a.quick-access__item[aria-label="Open Dashboard in a new tab"]',
    )
  })

  it('selects service names and icons', () => {
    const menu = select()

    expect(menu.linkName(1)).toBe(
      '.quick-access #quick-access-menu .quick-access__services a.quick-access__item:nth-child(2) .quick-access__name',
    )
    expect(menu.linkIcon(1)).toBe(
      '.quick-access #quick-access-menu .quick-access__services a.quick-access__item:nth-child(2) svg',
    )
  })

  it('selects decorative link icons', () => {
    expect(select().decorativeIcons()).toBe(
      '.quick-access #quick-access-menu .quick-access__services a.quick-access__item svg[aria-hidden="true"]',
    )
  })

  it('selects the empty state and separator', () => {
    const menu = select()

    expect(menu.empty()).toBe('.quick-access #quick-access-menu .quick-access__empty')
    expect(menu.separator()).toBe('.quick-access #quick-access-menu .quick-access__separator')
  })

  it('selects the settings button', () => {
    expect(select().settings()).toBe(
      '.quick-access #quick-access-menu button[aria-label="Open settings"]',
    )
  })

  it('delegates queries to the provided function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const menu = mmQuickAccessSelectors(query)

    expect(menu.get()).toEqual({ selector: '.quick-access' })
    expect(menu.link(1)).toEqual({
      selector:
        '.quick-access #quick-access-menu .quick-access__services a.quick-access__item:nth-child(2)',
    })
    expect(menu.settings()).toEqual({
      selector: '.quick-access #quick-access-menu button[aria-label="Open settings"]',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped queries', () => {
    const menu = mmQuickAccessSelectors((selector) => `#app ${selector}`)

    expect(menu.get()).toBe('#app .quick-access')
    expect(menu.trigger()).toBe('#app .quick-access button[aria-label="Open workspace menu"]')
    expect(menu.menu()).toBe('#app .quick-access #quick-access-menu')
  })

  it('does not query during construction', () => {
    const query = vi.fn((selector: string) => selector)

    mmQuickAccessSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
