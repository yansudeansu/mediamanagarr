import { describe, expect, it, vi } from 'vitest'
import { mmTorrentListSelectors } from './mmTorrentList.selectors'

describe('mmTorrentListSelectors', () => {
  const select = () => mmTorrentListSelectors((selector) => selector)
  const root = 'section.torrent-list'
  const items = `${root} ul.torrent-list__items`
  const item = `${items} > li.torrent-list__item`
  const card = `${item} .torrent-card`
  const pagination = `${root} nav.pagination[aria-label="Pagination"]`

  it('selects the root and accessible label', () => {
    const list = select()

    expect(list.get()).toBe(root)
    expect(list.labelled('Torrent downloads')).toBe(`${root}[aria-label="Torrent downloads"]`)
  })

  it('selects the empty state', () => {
    const list = select()

    expect(list.empty()).toBe(`${root} .torrent-list__empty`)
    expect(list.emptyTitle()).toBe(`${root} .torrent-list__empty-title`)
    expect(list.emptyDescription()).toBe(`${root} .torrent-list__empty-description`)
  })

  it('selects the semantic list', () => {
    const list = select()

    expect(list.items()).toBe(items)
    expect(list.listItems()).toBe(item)
  })

  it('selects list items by zero-based index', () => {
    const list = select()

    expect(list.listItem(0)).toBe(`${item}:nth-child(1)`)
    expect(list.listItem(2)).toBe(`${item}:nth-child(3)`)
  })

  it('selects torrent cards', () => {
    const list = select()

    expect(list.cards()).toBe(card)
    expect(list.card(0)).toBe(`${item}:nth-child(1) .torrent-card`)
    expect(list.card(2)).toBe(`${item}:nth-child(3) .torrent-card`)
  })

  it('selects torrent names', () => {
    const list = select()

    expect(list.names()).toBe(`${card} .torrent-card__name`)
    expect(list.name(0)).toBe(`${item}:nth-child(1) .torrent-card__name`)
    expect(list.name(2)).toBe(`${item}:nth-child(3) .torrent-card__name`)
  })

  it('selects accessible progressbars', () => {
    const list = select()

    expect(list.progressbars()).toBe(`${card} [role="progressbar"]`)
    expect(list.progressbar(0)).toBe(`${item}:nth-child(1) .torrent-card [role="progressbar"]`)
  })

  it('selects pagination', () => {
    const list = select()

    expect(list.pagination()).toBe(pagination)
    expect(list.previous()).toBe(`${pagination} button[aria-label="Previous page"]`)
    expect(list.next()).toBe(`${pagination} button[aria-label="Next page"]`)
  })

  it('delegates queries', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const list = mmTorrentListSelectors(query)

    expect(list.card(1)).toEqual({
      selector: `${item}:nth-child(2) .torrent-card`,
    })
    expect(list.next()).toEqual({
      selector: `${pagination} button[aria-label="Next page"]`,
    })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const list = mmTorrentListSelectors((selector) => `#downloads ${selector}`)

    expect(list.get()).toBe('#downloads section.torrent-list')
    expect(list.name(0)).toBe(`#downloads ${item}:nth-child(1) .torrent-card__name`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmTorrentListSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
