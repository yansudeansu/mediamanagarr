import { describe, expect, it, vi } from 'vitest'
import { mmProgressBarSelectors } from './mmProgressBar.selectors'

describe('mmProgressBarSelectors', () => {
  it('selects the progress bar root', () => {
    const query = vi.fn((selector: string) => selector)
    const progress = mmProgressBarSelectors(query)

    expect(progress.get()).toBe('.mm-progress-bar')
    expect(query).toHaveBeenCalledWith('.mm-progress-bar')
  })

  it('selects the header', () => {
    const progress = mmProgressBarSelectors((selector) => selector)
    expect(progress.header()).toBe('.mm-progress-bar .mm-progress-bar__header')
  })

  it('selects the label', () => {
    const progress = mmProgressBarSelectors((selector) => selector)
    expect(progress.label()).toBe('.mm-progress-bar .mm-progress-bar__label')
  })

  it('selects the percentage', () => {
    const progress = mmProgressBarSelectors((selector) => selector)
    expect(progress.percentage()).toBe('.mm-progress-bar .mm-progress-bar__percentage')
  })

  it('selects the accessible progress track', () => {
    const progress = mmProgressBarSelectors((selector) => selector)
    expect(progress.track()).toBe('.mm-progress-bar .mm-progress-bar__track[role="progressbar"]')
  })

  it('selects the fill', () => {
    const progress = mmProgressBarSelectors((selector) => selector)
    expect(progress.fill()).toBe('.mm-progress-bar .mm-progress-bar__fill')
  })

  it('selects a specific progress value', () => {
    const progress = mmProgressBarSelectors((selector) => selector)

    expect(progress.value(42.5)).toBe(
      '.mm-progress-bar .mm-progress-bar__track[role="progressbar"][aria-valuenow="42.5"]',
    )
  })

  it('selects empty progress', () => {
    const progress = mmProgressBarSelectors((selector) => selector)

    expect(progress.empty()).toBe(
      '.mm-progress-bar .mm-progress-bar__track[role="progressbar"][aria-valuenow="0"]',
    )
  })

  it('selects completed progress', () => {
    const progress = mmProgressBarSelectors((selector) => selector)

    expect(progress.complete()).toBe(
      '.mm-progress-bar .mm-progress-bar__track[role="progressbar"][aria-valuenow="100"]',
    )
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const progress = mmProgressBarSelectors(query)

    expect(progress.get()).toEqual({ selector: '.mm-progress-bar' })
    expect(progress.fill()).toEqual({ selector: '.mm-progress-bar .mm-progress-bar__fill' })
    expect(progress.value(50)).toEqual({
      selector: '.mm-progress-bar .mm-progress-bar__track[role="progressbar"][aria-valuenow="50"]',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#downloads ${selector}`
    const progress = mmProgressBarSelectors(query)

    expect(progress.get()).toBe('#downloads .mm-progress-bar')
    expect(progress.track()).toBe(
      '#downloads .mm-progress-bar .mm-progress-bar__track[role="progressbar"]',
    )
    expect(progress.complete()).toBe(
      '#downloads .mm-progress-bar .mm-progress-bar__track[role="progressbar"][aria-valuenow="100"]',
    )
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmProgressBarSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
