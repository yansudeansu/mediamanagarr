import { describe, expect, it, vi } from 'vitest'
import { mmIconSelectors } from './mmIcon.selectors'

describe('mmIconSelectors', () => {
  it('selects the SVG root', () => {
    const query = vi.fn((selector: string) => selector)
    const icon = mmIconSelectors(query)

    expect(icon.get()).toBe('svg.lucide')
    expect(query).toHaveBeenCalledWith('svg.lucide')
  })

  it('selects decorative icons', () => {
    const icon = mmIconSelectors((selector) => selector)

    expect(icon.decorative()).toBe('svg.lucide[aria-hidden="true"][focusable="false"]')
  })

  it('selects icons by size', () => {
    const icon = mmIconSelectors((selector) => selector)

    expect(icon.size(18)).toBe('svg.lucide[width="18"][height="18"]')
    expect(icon.size(24)).toBe('svg.lucide[width="24"][height="24"]')
  })

  it('selects icons using the current text color', () => {
    const icon = mmIconSelectors((selector) => selector)

    expect(icon.stroke()).toBe('svg.lucide[stroke="currentColor"]')
  })

  it('selects icons by stroke width', () => {
    const icon = mmIconSelectors((selector) => selector)

    expect(icon.strokeWidth(2)).toBe('svg.lucide[stroke-width="2"]')
  })

  it('selects SVG shapes', () => {
    const icon = mmIconSelectors((selector) => selector)

    expect(icon.shapes()).toBe(
      'svg.lucide path, svg.lucide line, svg.lucide polyline, svg.lucide rect, svg.lucide circle',
    )
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const icon = mmIconSelectors(query)

    expect(icon.get()).toEqual({ selector: 'svg.lucide' })
    expect(icon.size(18)).toEqual({ selector: 'svg.lucide[width="18"][height="18"]' })
    expect(icon.stroke()).toEqual({ selector: 'svg.lucide[stroke="currentColor"]' })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#settings ${selector}`
    const icon = mmIconSelectors(query)

    expect(icon.get()).toBe('#settings svg.lucide')
    expect(icon.decorative()).toBe('#settings svg.lucide[aria-hidden="true"][focusable="false"]')
    expect(icon.size(24)).toBe('#settings svg.lucide[width="24"][height="24"]')
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmIconSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
