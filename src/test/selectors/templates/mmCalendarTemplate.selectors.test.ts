import { describe, expect, it, vi } from 'vitest'
import { mmCalendarTemplateSelectors } from './mmCalendarTemplate.selectors'

describe('mmCalendarTemplateSelectors', () => {
  const select = () => mmCalendarTemplateSelectors((selector) => selector)
  const root = '.calendar-template'
  const toolbar = `${root} section.calendar-template__toolbar`
  const content = `${root} section.calendar-template__content`

  it('selects the template root', () => {
    expect(select().get()).toBe(root)
  })

  it('selects the header and heading', () => {
    const template = select()

    expect(template.header()).toBe(`${root} header.calendar-template__header`)
    expect(template.heading()).toBe(`${root} .calendar-template__heading`)
    expect(template.title()).toBe(`${root} h2#calendar-title.calendar-template__title`)
    expect(template.description()).toBe(`${root} .calendar-template__description`)
  })

  it('selects the toolbar and its accessible label', () => {
    const template = select()

    expect(template.toolbar()).toBe(toolbar)
    expect(template.labelledToolbar()).toBe(`${toolbar}[aria-label="Calendar controls"]`)
  })

  it('selects filters and actions', () => {
    const template = select()

    expect(template.filters()).toBe(`${toolbar} .calendar-template__filters`)
    expect(template.actions()).toBe(`${toolbar} .calendar-template__actions`)
  })

  it('selects navigation and its accessible label', () => {
    const template = select()

    expect(template.navigation()).toBe(`${root} section.calendar-template__navigation`)
    expect(template.labelledNavigation()).toBe(
      `${root} section.calendar-template__navigation[aria-label="Calendar navigation"]`,
    )
  })

  it('selects the status container and accessible status message', () => {
    const template = select()

    expect(template.status()).toBe(`${root} .calendar-template__status`)
    expect(template.statusMessage()).toBe(`${root} .calendar-template__status [role="status"]`)
  })

  it('selects the content and its heading reference', () => {
    const template = select()

    expect(template.content()).toBe(content)
    expect(template.labelledContent()).toBe(`${content}[aria-labelledby="calendar-title"]`)
  })

  it('selects the details container', () => {
    expect(select().details()).toBe(`${root} .calendar-template__details`)
  })

  it('delegates queries', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const template = mmCalendarTemplateSelectors(query)

    expect(template.title()).toEqual({
      selector: `${root} h2#calendar-title.calendar-template__title`,
    })
    expect(template.content()).toEqual({ selector: content })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const template = mmCalendarTemplateSelectors((selector) => `#app ${selector}`)

    expect(template.get()).toBe('#app .calendar-template')
    expect(template.filters()).toBe(`#app ${toolbar} .calendar-template__filters`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmCalendarTemplateSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
