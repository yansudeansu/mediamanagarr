import { describe, expect, it, vi } from 'vitest'
import { appSelectors } from './app.selectors'

describe('appSelectors', () => {
  const selectors = appSelectors((selector) => selector)

  it('selects the application shell', () => {
    expect(selectors.get()).toBe('.app-shell')
  })

  it('selects each workspace mode', () => {
    expect(selectors.popup()).toBe('.app-shell:not(.app-shell--detached):not(.app-shell--sidebar)')
    expect(selectors.detached()).toBe('.app-shell.app-shell--detached')
    expect(selectors.sidebar()).toBe('.app-shell.app-shell--sidebar')
  })

  it('selects the application header and footer', () => {
    expect(selectors.header()).toBe('.app-shell header.header')
    expect(selectors.footer()).toBe('.app-shell footer.footer')
  })

  it('selects main navigation and the current page', () => {
    expect(selectors.navigation()).toBe('.app-shell nav[aria-label="Main navigation"]')
    expect(selectors.currentPage()).toBe(
      '.app-shell nav[aria-label="Main navigation"] [aria-current="page"]',
    )
  })

  it('selects navigation buttons by view position', () => {
    expect(selectors.navigationButton('requests')).toBe(
      '.app-shell nav[aria-label="Main navigation"] button:nth-of-type(1)',
    )
    expect(selectors.navigationButton('up-next')).toBe(
      '.app-shell nav[aria-label="Main navigation"] button:nth-of-type(2)',
    )
    expect(selectors.navigationButton('calendar')).toBe(
      '.app-shell nav[aria-label="Main navigation"] button:nth-of-type(3)',
    )
    expect(selectors.navigationButton('downloads')).toBe(
      '.app-shell nav[aria-label="Main navigation"] button:nth-of-type(4)',
    )
  })

  it('rejects unknown navigation views', () => {
    expect(() => selectors.navigationButton('Calendar')).toThrow(
      'Unknown navigation view: Calendar',
    )
    expect(() => selectors.navigationButton('unknown')).toThrow('Unknown navigation view: unknown')
  })

  it('selects Quick Access and Settings controls', () => {
    expect(selectors.quickAccess()).toBe('.app-shell button[aria-label="Open workspace menu"]')
    expect(selectors.openSettings()).toBe('.app-shell button[aria-label="Open settings"]')
    expect(selectors.back()).toBe('.app-shell button[aria-label="Back to previous view"]')
  })

  it('selects application content and Settings content', () => {
    expect(selectors.content()).toBe('.app-shell main.app-content')
    expect(selectors.settingsContent()).toBe('.app-shell main.app-content--settings')
  })

  it('selects workspace errors and the empty setup state', () => {
    expect(selectors.workspaceError()).toBe('.app-shell .workspace-error[role="alert"]')
    expect(selectors.emptyNavigation()).toBe('.app-shell .empty-navigation')
    expect(selectors.setupSettings()).toBe('.app-shell .empty-navigation button')
  })

  it('delegates selectors to the supplied query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const app = appSelectors(query)

    expect(app.get()).toEqual({ selector: '.app-shell' })
    expect(app.back()).toEqual({
      selector: '.app-shell button[aria-label="Back to previous view"]',
    })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('keeps every selector scoped to the application shell', () => {
    const values = [
      selectors.get(),
      selectors.popup(),
      selectors.detached(),
      selectors.sidebar(),
      selectors.header(),
      selectors.footer(),
      selectors.navigation(),
      selectors.currentPage(),
      selectors.navigationButton('calendar'),
      selectors.quickAccess(),
      selectors.openSettings(),
      selectors.back(),
      selectors.content(),
      selectors.settingsContent(),
      selectors.workspaceError(),
      selectors.emptyNavigation(),
      selectors.setupSettings(),
    ]

    expect(values.every((selector) => selector.startsWith('.app-shell'))).toBe(true)
  })

  it('does not execute queries until a selector is requested', () => {
    const query = vi.fn((selector: string) => selector)
    const app = appSelectors(query)

    expect(query).not.toHaveBeenCalled()

    app.navigation()

    expect(query).toHaveBeenCalledOnce()
  })
})
