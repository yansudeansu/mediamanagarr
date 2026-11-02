import { describe, expect, it, vi } from 'vitest'
import { mmRequestsTemplateSelectors } from './mmRequestsTemplate.selectors'

describe('mmRequestsTemplateSelectors', () => {
  const select = () => mmRequestsTemplateSelectors((selector) => selector)
  const root = '.requests-template'
  const header = `${root} header.requests-template__header`
  const filters = `${root} section.requests-template__filters`
  const content = `${root} section.requests-template__content`
  const pagination = `${root} nav.requests-template__pagination`

  it('selects the template root', () => {
    expect(select().get()).toBe(root)
  })

  it('selects the header and heading', () => {
    const template = select()

    expect(template.header()).toBe(header)
    expect(template.heading()).toBe(`${header} .requests-template__heading`)
    expect(template.title()).toBe(`${header} h2#requests-title.requests-template__title`)
    expect(template.description()).toBe(`${header} .requests-template__description`)
  })

  it('selects actions and their buttons', () => {
    const template = select()

    expect(template.actions()).toBe(`${header} .requests-template__actions`)
    expect(template.actionButtons()).toBe(`${header} .requests-template__actions button`)
  })

  it('selects filters and their accessible label', () => {
    const template = select()

    expect(template.filters()).toBe(filters)
    expect(template.labelledFilters()).toBe(`${filters}[aria-label="Request filters"]`)
    expect(template.filterButtons()).toBe(`${filters} button`)
  })

  it('selects the content and its heading reference', () => {
    const template = select()

    expect(template.content()).toBe(content)
    expect(template.labelledContent()).toBe(`${content}[aria-labelledby="requests-title"]`)
  })

  it('selects pagination and its accessible label', () => {
    const template = select()

    expect(template.pagination()).toBe(pagination)
    expect(template.labelledPagination()).toBe(`${pagination}[aria-label="Request pagination"]`)
    expect(template.paginationButtons()).toBe(`${pagination} button`)
  })

  it('delegates queries', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const template = mmRequestsTemplateSelectors(query)

    expect(template.title()).toEqual({
      selector: `${header} h2#requests-title.requests-template__title`,
    })
    expect(template.pagination()).toEqual({ selector: pagination })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const template = mmRequestsTemplateSelectors((selector) => `#app ${selector}`)

    expect(template.get()).toBe('#app .requests-template')
    expect(template.filters()).toBe(`#app ${filters}`)
    expect(template.pagination()).toBe(`#app ${pagination}`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmRequestsTemplateSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
