import { describe, expect, it, vi } from 'vitest'
import { mmDownloadsTemplateSelectors } from './mmDownloadsTemplate.selectors'

describe('mmDownloadsTemplateSelectors', () => {
  const select = () => mmDownloadsTemplateSelectors((selector) => selector)
  const root = '.downloads-template'
  const header = `${root} header.downloads-template__header`
  const stats = `${root} section.downloads-template__stats`
  const confirmation = `${root} section.downloads-template__confirmation`
  const content = `${root} section.downloads-template__content`

  it('selects the template root', () => {
    expect(select().get()).toBe(root)
  })

  it('selects the header and heading', () => {
    const template = select()

    expect(template.header()).toBe(header)
    expect(template.heading()).toBe(`${header} .downloads-template__heading`)
    expect(template.title()).toBe(`${header} h2#downloads-title.downloads-template__title`)
    expect(template.description()).toBe(`${header} .downloads-template__description`)
  })

  it('selects actions and their buttons', () => {
    const template = select()

    expect(template.actions()).toBe(`${header} .downloads-template__actions`)
    expect(template.actionButtons()).toBe(`${header} .downloads-template__actions button`)
  })

  it('selects transfer statistics and their accessible label', () => {
    const template = select()

    expect(template.stats()).toBe(stats)
    expect(template.labelledStats()).toBe(`${stats}[aria-label="Transfer statistics"]`)
  })

  it('selects removal confirmation and its accessible label', () => {
    const template = select()

    expect(template.confirmation()).toBe(confirmation)
    expect(template.labelledConfirmation()).toBe(
      `${confirmation}[aria-label="Torrent removal confirmation"]`,
    )
  })

  it('selects the content and its heading reference', () => {
    const template = select()

    expect(template.content()).toBe(content)
    expect(template.labelledContent()).toBe(`${content}[aria-labelledby="downloads-title"]`)
  })

  it('delegates queries', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const template = mmDownloadsTemplateSelectors(query)

    expect(template.title()).toEqual({
      selector: `${header} h2#downloads-title.downloads-template__title`,
    })
    expect(template.content()).toEqual({ selector: content })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const template = mmDownloadsTemplateSelectors((selector) => `#app ${selector}`)

    expect(template.get()).toBe('#app .downloads-template')
    expect(template.stats()).toBe(`#app ${stats}`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmDownloadsTemplateSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
