import { describe, expect, it, vi } from 'vitest'
import { mmUpNextTemplateSelectors } from './mmUpNextTemplate.selectors'

describe('mmUpNextTemplateSelectors', () => {
  const select = () => mmUpNextTemplateSelectors((selector) => selector)
  const root = '.up-next-template'
  const header = `${root} header.up-next-template__header`
  const actions = `${header} .up-next-template__actions`
  const filters = `${root} section.up-next-template__filters`
  const content = `${root} section.up-next-template__content`
  const pagination = `${root} nav.up-next-template__pagination`

  it('selects the template root', () => {
    expect(select().get()).toBe(root)
  })

  it('selects the header and heading', () => {
    const template = select()

    expect(template.header()).toBe(header)
    expect(template.heading()).toBe(`${header} .up-next-template__heading`)
    expect(template.title()).toBe(`${header} h2#up-next-title.up-next-template__title`)
    expect(template.description()).toBe(`${header} .up-next-template__description`)
  })

  it('selects actions and their buttons', () => {
    const template = select()

    expect(template.actions()).toBe(actions)
    expect(template.actionButtons()).toBe(`${actions} button`)
    expect(template.actionButton(0)).toBe(`${actions} button:nth-child(1)`)
    expect(template.actionButton(1)).toBe(`${actions} button:nth-child(2)`)
  })

  it('selects filters and their accessible label', () => {
    const template = select()

    expect(template.filters()).toBe(filters)
    expect(template.labelledFilters()).toBe(`${filters}[aria-label="Arrival filters"]`)
    expect(template.filterButtons()).toBe(`${filters} button`)
  })

  it('selects content and its heading reference', () => {
    const template = select()

    expect(template.content()).toBe(content)
    expect(template.labelledContent()).toBe(`${content}[aria-labelledby="up-next-title"]`)
    expect(template.articles()).toBe(`${content} article`)
  })

  it('selects pagination and its accessible label', () => {
    const template = select()

    expect(template.pagination()).toBe(pagination)
    expect(template.labelledPagination()).toBe(`${pagination}[aria-label="Arrival pagination"]`)
    expect(template.paginationButtons()).toBe(`${pagination} button`)
  })

  it('delegates queries', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const template = mmUpNextTemplateSelectors(query)

    expect(template.title()).toEqual({
      selector: `${header} h2#up-next-title.up-next-template__title`,
    })
    expect(template.pagination()).toEqual({ selector: pagination })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const template = mmUpNextTemplateSelectors((selector) => `#app ${selector}`)

    expect(template.get()).toBe('#app .up-next-template')
    expect(template.filters()).toBe(`#app ${filters}`)
    expect(template.pagination()).toBe(`#app ${pagination}`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmUpNextTemplateSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
