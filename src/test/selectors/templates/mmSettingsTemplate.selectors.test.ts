import { describe, expect, it, vi } from 'vitest'
import { mmSettingsTemplateSelectors } from './mmSettingsTemplate.selectors'

describe('mmSettingsTemplateSelectors', () => {
  const select = () => mmSettingsTemplateSelectors((selector) => selector)
  const root = '.settings-template'
  const content = `${root} .settings-template__content`
  const navigation = `${root} > nav`

  it('selects the template root', () => {
    expect(select().get()).toBe(root)
  })

  it('selects the navigation slot', () => {
    expect(select().navigation()).toBe(navigation)
  })

  it('selects navigation by accessible label', () => {
    expect(select().labelledNavigation('Settings navigation')).toBe(
      `${navigation}[aria-label="Settings navigation"]`,
    )
  })

  it('selects navigation buttons', () => {
    expect(select().navigationButtons()).toBe(`${navigation} button`)
  })

  it('selects the content container', () => {
    expect(select().content()).toBe(content)
  })

  it('selects content sections', () => {
    const template = select()

    expect(template.sections()).toBe(`${content} section`)
    expect(template.labelledSection('Settings content')).toBe(
      `${content} section[aria-label="Settings content"]`,
    )
  })

  it('selects content headings', () => {
    expect(select().headings()).toBe(`${content} h1, ${content} h2, ${content} h3`)
  })

  it('selects labels and inputs', () => {
    const template = select()

    expect(template.labels()).toBe(`${content} label`)
    expect(template.inputs()).toBe(`${content} input`)
  })

  it('delegates queries', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const template = mmSettingsTemplateSelectors(query)

    expect(template.navigation()).toEqual({ selector: navigation })
    expect(template.content()).toEqual({ selector: content })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const template = mmSettingsTemplateSelectors((selector) => `#app ${selector}`)

    expect(template.get()).toBe('#app .settings-template')
    expect(template.navigation()).toBe(`#app ${navigation}`)
    expect(template.content()).toBe(`#app ${content}`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmSettingsTemplateSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
