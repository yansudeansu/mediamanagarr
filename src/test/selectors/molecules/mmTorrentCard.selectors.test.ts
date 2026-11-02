import { describe, expect, it, vi } from 'vitest'
import { mmTorrentCardSelectors } from './mmTorrentCard.selectors'

describe('mmTorrentCardSelectors', () => {
  const select = () => mmTorrentCardSelectors((selector) => selector)

  it('selects the root and heading', () => {
    const card = select()

    expect(card.get()).toBe('.torrent-card')
    expect(card.heading()).toBe('.torrent-card .torrent-card__heading')
    expect(card.name()).toBe('.torrent-card .torrent-card__name')
  })

  it('selects the status and its variants', () => {
    const card = select()

    expect(card.status()).toBe('.torrent-card .torrent-card__status')
    expect(card.statusVariant('downloading')).toBe(
      '.torrent-card .torrent-card__status.torrent-card__status--downloading',
    )
    expect(card.statusVariant('error')).toBe(
      '.torrent-card .torrent-card__status.torrent-card__status--error',
    )
  })

  it('selects progress details', () => {
    const card = select()

    expect(card.progress()).toBe('.torrent-card .torrent-card__progress')
    expect(card.progressDetails()).toBe('.torrent-card .torrent-card__progress-details')
    expect(card.size()).toBe('.torrent-card .torrent-card__size')
    expect(card.percentage()).toBe('.torrent-card .torrent-card__percentage')
  })

  it('selects transfer statistics', () => {
    const card = select()

    expect(card.stats()).toBe('.torrent-card .torrent-card__stats')
    expect(card.download()).toBe('.torrent-card .torrent-card__stat[title^="Download:"]')
    expect(card.upload()).toBe('.torrent-card .torrent-card__stat[title^="Upload:"]')
    expect(card.eta()).toBe('.torrent-card .torrent-card__stat--eta')
  })

  it('selects the action container and buttons', () => {
    const card = select()

    expect(card.actions()).toBe('.torrent-card .torrent-card__actions')
    expect(card.buttons()).toBe('.torrent-card .torrent-card__actions button')
    expect(card.primary()).toBe('.torrent-card .torrent-card__actions button:first-child')
    expect(card.remove()).toBe('.torrent-card .torrent-card__actions button:last-child')
  })

  it('selects actions by accessible label', () => {
    const card = select()

    expect(card.primaryLabelled('Stop Example Download')).toBe(
      '.torrent-card .torrent-card__actions button:first-child[aria-label="Stop Example Download"]',
    )
    expect(card.removeLabelled('Remove Example Download')).toBe(
      '.torrent-card .torrent-card__actions button:last-child[aria-label="Remove Example Download"]',
    )
  })

  it('selects disabled actions', () => {
    const card = select()

    expect(card.primaryDisabled()).toBe(
      '.torrent-card .torrent-card__actions button:first-child:disabled',
    )
    expect(card.removeDisabled()).toBe(
      '.torrent-card .torrent-card__actions button:last-child:disabled',
    )
  })

  it('selects loading actions', () => {
    const card = select()

    expect(card.primaryLoading()).toBe(
      '.torrent-card .torrent-card__actions button:first-child[aria-busy="true"]',
    )
    expect(card.removeLoading()).toBe(
      '.torrent-card .torrent-card__actions button:last-child[aria-busy="true"]',
    )
  })

  it('delegates selectors to the query function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const card = mmTorrentCardSelectors(query)

    expect(card.name()).toEqual({ selector: '.torrent-card .torrent-card__name' })
    expect(card.primary()).toEqual({
      selector: '.torrent-card .torrent-card__actions button:first-child',
    })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const card = mmTorrentCardSelectors((selector) => `#downloads ${selector}`)

    expect(card.get()).toBe('#downloads .torrent-card')
    expect(card.remove()).toBe('#downloads .torrent-card .torrent-card__actions button:last-child')
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmTorrentCardSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
