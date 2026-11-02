import { describe, expect, it, vi } from 'vitest'
import { mmTabsSelectors } from './mmTabs.selectors'

describe('mmTabsSelectors', () => {
  const select = () => mmTabsSelectors((selector) => selector)

  it('selects the root and variants', () => {
    const tabs = select()

    expect(tabs.get()).toBe('.tabs')
    expect(tabs.tabs()).toBe('.tabs.tabs--tabs')
    expect(tabs.navigation()).toBe('.tabs.tabs--navigation')
  })

  it('selects the accessible tablist', () => {
    const tabs = select()

    expect(tabs.tablist()).toBe('.tabs[role="tablist"]')
    expect(tabs.labelled('Settings sections')).toBe(
      '.tabs[role="tablist"][aria-label="Settings sections"]',
    )
  })

  it('selects the viewport and items container', () => {
    const tabs = select()

    expect(tabs.viewport()).toBe('.tabs .tabs__viewport')
    expect(tabs.navigationViewport()).toBe('.tabs .tabs__viewport--navigation')
    expect(tabs.items()).toBe('.tabs .tabs__items')
  })

  it('selects navigation buttons by position', () => {
    const tabs = select()

    expect(tabs.buttons()).toBe('.tabs .tabs__items button.tabs__item')
    expect(tabs.button(0)).toBe('.tabs .tabs__items button.tabs__item:nth-child(1)')
    expect(tabs.button(2)).toBe('.tabs .tabs__items button.tabs__item:nth-child(3)')
  })

  it('selects ARIA tabs by position', () => {
    const tabs = select()

    expect(tabs.tabButtons()).toBe('.tabs .tabs__items button.tabs__item[role="tab"]')
    expect(tabs.tab(1)).toBe('.tabs .tabs__items button.tabs__item[role="tab"]:nth-child(2)')
  })

  it('selects selected and unselected tabs', () => {
    const tabs = select()

    expect(tabs.selected()).toBe('.tabs .tabs__items button.tabs__item[aria-selected="true"]')
    expect(tabs.unselected()).toBe('.tabs .tabs__items button.tabs__item[aria-selected="false"]')
    expect(tabs.current()).toBe('.tabs .tabs__items button.tabs__item[aria-current="page"]')
  })

  it('selects enabled and disabled items', () => {
    const tabs = select()

    expect(tabs.enabled()).toBe('.tabs .tabs__items button.tabs__item:enabled')
    expect(tabs.disabled()).toBe('.tabs .tabs__items button.tabs__item:disabled')
  })

  it('selects keyboard navigation states', () => {
    const tabs = select()

    expect(tabs.keyboardEntry()).toBe('.tabs .tabs__items button.tabs__item[tabindex="0"]')
    expect(tabs.skipped()).toBe('.tabs .tabs__items button.tabs__item[tabindex="-1"]')
  })

  it('selects scroll controls', () => {
    const tabs = select()

    expect(tabs.scrollButtons()).toBe('.tabs button.tabs__scroll-button')
    expect(tabs.scrollLeft()).toBe(
      '.tabs button.tabs__scroll-button[aria-label="Scroll navigation left"]',
    )
    expect(tabs.scrollRight()).toBe(
      '.tabs button.tabs__scroll-button[aria-label="Scroll navigation right"]',
    )
  })

  it('selects enabled and disabled scroll controls', () => {
    const tabs = select()

    expect(tabs.enabledScrollLeft()).toBe(
      '.tabs button.tabs__scroll-button[aria-label="Scroll navigation left"]:enabled',
    )
    expect(tabs.disabledScrollLeft()).toBe(
      '.tabs button.tabs__scroll-button[aria-label="Scroll navigation left"]:disabled',
    )
    expect(tabs.enabledScrollRight()).toBe(
      '.tabs button.tabs__scroll-button[aria-label="Scroll navigation right"]:enabled',
    )
    expect(tabs.disabledScrollRight()).toBe(
      '.tabs button.tabs__scroll-button[aria-label="Scroll navigation right"]:disabled',
    )
  })

  it('delegates selectors to the query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const tabs = mmTabsSelectors(query)

    expect(tabs.get()).toEqual({ selector: '.tabs' })
    expect(tabs.button(1)).toEqual({
      selector: '.tabs .tabs__items button.tabs__item:nth-child(2)',
    })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const tabs = mmTabsSelectors((selector) => `#settings ${selector}`)

    expect(tabs.get()).toBe('#settings .tabs')
    expect(tabs.current()).toBe(
      '#settings .tabs .tabs__items button.tabs__item[aria-current="page"]',
    )
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmTabsSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
