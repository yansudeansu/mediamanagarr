import { describe, expect, it, vi } from 'vitest'
import { mmTransferStatsSelectors } from './mmTransferStats.selectors'

describe('mmTransferStatsSelectors', () => {
  const select = () => mmTransferStatsSelectors((selector) => selector)

  it('selects the root and accessible section', () => {
    const stats = select()

    expect(stats.get()).toBe('section.transfer-stats')
    expect(stats.labelled()).toBe('section.transfer-stats[aria-label="Overall transfer speeds"]')
  })

  it('selects items by position', () => {
    const stats = select()

    expect(stats.items()).toBe('section.transfer-stats .transfer-stats__item')
    expect(stats.item(0)).toBe('section.transfer-stats .transfer-stats__item:nth-child(1)')
    expect(stats.item(1)).toBe('section.transfer-stats .transfer-stats__item:nth-child(3)')
  })

  it('selects headings, labels and values', () => {
    const stats = select()

    expect(stats.headings()).toBe(
      'section.transfer-stats .transfer-stats__item .transfer-stats__heading',
    )
    expect(stats.labels()).toBe(
      'section.transfer-stats .transfer-stats__item .transfer-stats__label',
    )
    expect(stats.values()).toBe(
      'section.transfer-stats .transfer-stats__item .transfer-stats__value',
    )
  })

  it('selects download statistics', () => {
    const stats = select()

    expect(stats.download()).toBe('section.transfer-stats .transfer-stats__item:first-child')
    expect(stats.downloadLabel()).toBe(
      'section.transfer-stats .transfer-stats__item:first-child .transfer-stats__label',
    )
    expect(stats.downloadValue()).toBe(
      'section.transfer-stats .transfer-stats__item:first-child .transfer-stats__value',
    )
    expect(stats.downloadIcon()).toBe(
      'section.transfer-stats .transfer-stats__item:first-child .transfer-stats__icon svg',
    )
  })

  it('selects upload statistics', () => {
    const stats = select()

    expect(stats.upload()).toBe('section.transfer-stats .transfer-stats__item:last-child')
    expect(stats.uploadLabel()).toBe(
      'section.transfer-stats .transfer-stats__item:last-child .transfer-stats__label',
    )
    expect(stats.uploadValue()).toBe(
      'section.transfer-stats .transfer-stats__item:last-child .transfer-stats__value',
    )
    expect(stats.uploadIcon()).toBe(
      'section.transfer-stats .transfer-stats__item:last-child .transfer-stats__icon svg',
    )
  })

  it('selects decorative icons', () => {
    const stats = select()

    expect(stats.icons()).toBe(
      'section.transfer-stats .transfer-stats__item .transfer-stats__icon svg',
    )
    expect(stats.decorativeIcons()).toBe(
      'section.transfer-stats .transfer-stats__item .transfer-stats__icon svg[aria-hidden="true"][focusable="false"]',
    )
  })

  it('selects the decorative divider', () => {
    const stats = select()

    expect(stats.divider()).toBe('section.transfer-stats .transfer-stats__divider')
    expect(stats.decorativeDivider()).toBe(
      'section.transfer-stats .transfer-stats__divider[aria-hidden="true"]',
    )
  })

  it('selects prohibited ARIA states', () => {
    const stats = select()

    expect(stats.liveRegions()).toBe(
      'section.transfer-stats [aria-live], section.transfer-stats[aria-live]',
    )
    expect(stats.labelledValues()).toBe(
      'section.transfer-stats .transfer-stats__item .transfer-stats__value[aria-label]',
    )
  })

  it('delegates selectors to the query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const stats = mmTransferStatsSelectors(query)

    expect(stats.downloadValue()).toEqual({
      selector: 'section.transfer-stats .transfer-stats__item:first-child .transfer-stats__value',
    })
    expect(stats.uploadValue()).toEqual({
      selector: 'section.transfer-stats .transfer-stats__item:last-child .transfer-stats__value',
    })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const stats = mmTransferStatsSelectors((selector) => `#downloads ${selector}`)

    expect(stats.get()).toBe('#downloads section.transfer-stats')
    expect(stats.downloadValue()).toBe(
      '#downloads section.transfer-stats .transfer-stats__item:first-child .transfer-stats__value',
    )
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmTransferStatsSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
