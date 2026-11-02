import { describe, expect, it, vi } from 'vitest'
import { mmPanelSelectors } from './mmPanel.selectors'

describe('mmPanelSelectors', () => {
  it('selects the panel root', () => {
    const query = vi.fn((selector: string) => selector)
    const panel = mmPanelSelectors(query)

    expect(panel.get()).toBe('section.mm-panel')
    expect(query).toHaveBeenCalledWith('section.mm-panel')
  })

  it.each(['sm', 'md'] as const)('selects %s padding', (padding) => {
    const panel = mmPanelSelectors((selector) => selector)

    expect(panel.padding(padding)).toBe(`section.mm-panel.mm-panel--padding-${padding}`)
  })

  it('selects direct slot children', () => {
    const panel = mmPanelSelectors((selector) => selector)

    expect(panel.content()).toBe('section.mm-panel > *')
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const panel = mmPanelSelectors(query)

    expect(panel.get()).toEqual({ selector: 'section.mm-panel' })
    expect(panel.padding('sm')).toEqual({ selector: 'section.mm-panel.mm-panel--padding-sm' })
    expect(panel.content()).toEqual({ selector: 'section.mm-panel > *' })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#settings ${selector}`
    const panel = mmPanelSelectors(query)

    expect(panel.get()).toBe('#settings section.mm-panel')
    expect(panel.padding('md')).toBe('#settings section.mm-panel.mm-panel--padding-md')
    expect(panel.content()).toBe('#settings section.mm-panel > *')
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmPanelSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
