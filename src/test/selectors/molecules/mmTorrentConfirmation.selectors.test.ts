import { describe, expect, it, vi } from 'vitest'
import { mmTorrentConfirmationSelectors } from './mmTorrentConfirmation.selectors'

describe('mmTorrentConfirmationSelectors', () => {
  const select = () => mmTorrentConfirmationSelectors((selector) => selector)

  it('selects the confirmation section', () => {
    const confirmation = select()

    expect(confirmation.get()).toBe('section.torrent-confirmation')
    expect(confirmation.labelledBy('heading-1')).toBe(
      'section.torrent-confirmation[aria-labelledby="heading-1"]',
    )
  })

  it('selects the content and heading', () => {
    const confirmation = select()

    expect(confirmation.content()).toBe(
      'section.torrent-confirmation .torrent-confirmation__content',
    )
    expect(confirmation.title()).toBe('section.torrent-confirmation h3.torrent-confirmation__title')
  })

  it('selects the item name and description', () => {
    const confirmation = select()

    expect(confirmation.name()).toBe('section.torrent-confirmation .torrent-confirmation__name')
    expect(confirmation.description()).toBe(
      'section.torrent-confirmation .torrent-confirmation__description',
    )
  })

  it('selects the delete-files option', () => {
    const confirmation = select()

    expect(confirmation.option()).toBe('section.torrent-confirmation .torrent-confirmation__option')
  })

  it('selects the warning and accessible alert', () => {
    const confirmation = select()

    expect(confirmation.warning()).toBe(
      'section.torrent-confirmation .torrent-confirmation__warning',
    )
    expect(confirmation.alert()).toBe(
      'section.torrent-confirmation .torrent-confirmation__warning[role="alert"]',
    )
  })

  it('selects the action container and buttons', () => {
    const confirmation = select()

    expect(confirmation.actions()).toBe(
      'section.torrent-confirmation .torrent-confirmation__actions',
    )
    expect(confirmation.buttons()).toBe(
      'section.torrent-confirmation .torrent-confirmation__actions button',
    )
  })

  it('selects cancel and confirm actions', () => {
    const confirmation = select()

    expect(confirmation.cancel()).toBe(
      'section.torrent-confirmation .torrent-confirmation__actions button.button--secondary',
    )
    expect(confirmation.confirm()).toBe(
      'section.torrent-confirmation .torrent-confirmation__actions button.button--danger',
    )
  })

  it('selects disabled actions', () => {
    const confirmation = select()

    expect(confirmation.cancelDisabled()).toBe(
      'section.torrent-confirmation .torrent-confirmation__actions button.button--secondary:disabled',
    )
    expect(confirmation.confirmDisabled()).toBe(
      'section.torrent-confirmation .torrent-confirmation__actions button.button--danger:disabled',
    )
  })

  it('selects the loading confirmation action', () => {
    const confirmation = select()

    expect(confirmation.confirmLoading()).toBe(
      'section.torrent-confirmation .torrent-confirmation__actions button.button--danger[aria-busy="true"]',
    )
  })

  it('delegates selectors to the query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const confirmation = mmTorrentConfirmationSelectors(query)

    expect(confirmation.title()).toEqual({
      selector: 'section.torrent-confirmation h3.torrent-confirmation__title',
    })
    expect(confirmation.confirm()).toEqual({
      selector: 'section.torrent-confirmation .torrent-confirmation__actions button.button--danger',
    })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const confirmation = mmTorrentConfirmationSelectors((selector) => `#downloads ${selector}`)

    expect(confirmation.get()).toBe('#downloads section.torrent-confirmation')
    expect(confirmation.warning()).toBe(
      '#downloads section.torrent-confirmation .torrent-confirmation__warning',
    )
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmTorrentConfirmationSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
