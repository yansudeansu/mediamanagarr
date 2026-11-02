import { describe, expect, it, vi } from 'vitest'
import { mmDownloadsViewSelectors } from './mmDownloadsView.selectors'

describe('mmDownloadsViewSelectors', () => {
  const select = () => mmDownloadsViewSelectors((selector) => selector)
  const root = '.downloads-template'
  const header = `${root} header.downloads-template__header`
  const actions = `${header} .downloads-template__actions`
  const stats = `${root} section.downloads-template__stats`
  const confirmation = `${root} section.downloads-template__confirmation`
  const content = `${root} section.downloads-template__content`
  const list = `${content} section.torrent-list`
  const card = `${list} .torrent-card`

  it('selects the view root and heading', () => {
    const view = select()

    expect(view.get()).toBe(root)
    expect(view.title()).toBe(`${header} #downloads-title`)
    expect(view.description()).toBe(`${header} .downloads-template__description`)
  })

  it('selects refresh and its states', () => {
    const view = select()

    expect(view.actions()).toBe(actions)
    expect(view.refresh()).toBe(`${actions} button`)
    expect(view.refreshDisabled()).toBe(`${actions} button:disabled`)
    expect(view.refreshEnabled()).toBe(`${actions} button:enabled`)
  })

  it('selects transfer statistics', () => {
    const view = select()

    expect(view.stats()).toBe(stats)
    expect(view.downloadSpeed()).toBe(`${stats} .transfer-stats__download`)
    expect(view.uploadSpeed()).toBe(`${stats} .transfer-stats__upload`)
  })

  it('selects removal confirmation', () => {
    const view = select()

    expect(view.confirmation()).toBe(confirmation)
    expect(view.confirmationTitle()).toBe(`${confirmation} .torrent-confirmation__title`)
    expect(view.confirm()).toBe(`${confirmation} button:last-child`)
    expect(view.cancel()).toBe(`${confirmation} button:first-child`)
    expect(view.deleteFiles()).toBe(`${confirmation} input[type="checkbox"]`)
  })

  it('selects loading, errors and retry', () => {
    const view = select()

    expect(view.content()).toBe(content)
    expect(view.loading()).toBe(`${content} .downloads-view__message[role="status"]`)
    expect(view.errors()).toBe(`${content} .downloads-view__error[role="alert"]`)
    expect(view.retry()).toBe(`${content} .downloads-view__error button`)
  })

  it('selects the torrent list and cards', () => {
    const view = select()

    expect(view.list()).toBe(list)
    expect(view.empty()).toBe(`${list} .torrent-list__empty`)
    expect(view.cards()).toBe(card)
    expect(view.card(0)).toBe(`${list} li:nth-child(1) .torrent-card`)
    expect(view.card(1)).toBe(`${list} li:nth-child(2) .torrent-card`)
    expect(view.torrentNames()).toBe(`${card} .torrent-card__name`)
  })

  it('selects torrent actions by accessible name', () => {
    const view = select()

    expect(view.start('Example Download')).toBe(
      `${card} button[aria-label="Start Example Download"]`,
    )
    expect(view.stop('Example Download')).toBe(`${card} button[aria-label="Stop Example Download"]`)
    expect(view.remove('Example Download')).toBe(
      `${card} button[aria-label="Remove Example Download"]`,
    )
  })

  it('selects pagination', () => {
    expect(select().pagination()).toBe(`${list} nav.pagination`)
  })

  it('delegates queries', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const view = mmDownloadsViewSelectors(query)

    expect(view.refresh()).toEqual({ selector: `${actions} button` })
    expect(view.list()).toEqual({ selector: list })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const view = mmDownloadsViewSelectors((selector) => `#app ${selector}`)

    expect(view.get()).toBe(`#app ${root}`)
    expect(view.refresh()).toBe(`#app ${actions} button`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmDownloadsViewSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
