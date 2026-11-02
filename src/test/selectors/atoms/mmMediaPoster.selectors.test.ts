import { describe, expect, it, vi } from 'vitest'
import { mmMediaPosterSelectors } from './mmMediaPoster.selectors'

describe('mmMediaPosterSelectors', () => {
  it('selects the poster root', () => {
    const query = vi.fn((selector: string) => selector)
    const poster = mmMediaPosterSelectors(query)

    expect(poster.get()).toBe('.media-poster')
    expect(query).toHaveBeenCalledWith('.media-poster')
  })

  it('selects default-sized posters', () => {
    const poster = mmMediaPosterSelectors((selector) => selector)

    expect(poster.size('default')).toBe('.media-poster:not(.media-poster--small)')
  })

  it('selects small posters', () => {
    const poster = mmMediaPosterSelectors((selector) => selector)

    expect(poster.size('small')).toBe('.media-poster.media-poster--small')
  })

  it('selects poster images', () => {
    const poster = mmMediaPosterSelectors((selector) => selector)

    expect(poster.image()).toBe('.media-poster img.media-poster__image')
  })

  it('selects accessible placeholders', () => {
    const poster = mmMediaPosterSelectors((selector) => selector)

    expect(poster.placeholder()).toBe('.media-poster .media-poster__placeholder[role="img"]')
  })

  it('selects decorative placeholder icons', () => {
    const poster = mmMediaPosterSelectors((selector) => selector)

    expect(poster.placeholderIcon()).toBe(
      '.media-poster .media-poster__placeholder span[aria-hidden="true"]',
    )
  })

  it('passes selectors to the provided query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const poster = mmMediaPosterSelectors(query)

    expect(poster.get()).toEqual({ selector: '.media-poster' })
    expect(poster.image()).toEqual({ selector: '.media-poster img.media-poster__image' })
    expect(poster.placeholder()).toEqual({
      selector: '.media-poster .media-poster__placeholder[role="img"]',
    })
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('supports scoped query implementations', () => {
    const query = (selector: string) => `#library ${selector}`
    const poster = mmMediaPosterSelectors(query)

    expect(poster.get()).toBe('#library .media-poster')
    expect(poster.size('small')).toBe('#library .media-poster.media-poster--small')
    expect(poster.image()).toBe('#library .media-poster img.media-poster__image')
  })

  it('does not execute queries when the selector object is created', () => {
    const query = vi.fn((selector: string) => selector)

    mmMediaPosterSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
