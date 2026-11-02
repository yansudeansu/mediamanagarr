import { describe, expect, it, vi } from 'vitest'
import { settingsViewSelectors } from './settingsView.selectors'

describe('settingsViewSelectors', () => {
  const select = () => settingsViewSelectors((selector) => selector)
  const root = '.settings-template'

  it('selects the settings root', () => {
    expect(select().get()).toBe(root)
  })

  it('selects the navigation and tabs', () => {
    const view = select()

    expect(view.navigation()).toContain('.settings-template__navigation')
    expect(view.tabs()).toContain('.tabs')
    expect(view.tablist()).toContain('[role="tablist"]')
    expect(view.selectedTab()).toContain('[aria-selected="true"]')
  })

  it('selects the connections section', () => {
    const view = select()

    expect(view.connections()).toContain('[aria-labelledby="service-connections-title"]')
    expect(view.connectionsTitle()).toContain('#service-connections-title')
    expect(view.serviceSelector()).toContain('.service-selector')
    expect(view.serviceForm()).toContain('.service-form')
  })

  it('selects connection feedback', () => {
    const view = select()

    expect(view.serviceError()).toContain('.service-form__error')
    expect(view.serviceSuccess()).toContain('.service-form__success')
  })

  it('selects service health and its states', () => {
    const view = select()

    expect(view.health()).toContain('.service-health')
    expect(view.healthBadge()).toContain('.status-badge__label')
    expect(view.healthTime()).toContain('.service-health__time')
    expect(view.healthAlert()).toContain('[role="alert"]')
  })

  it('selects the workspace section', () => {
    const view = select()

    expect(view.workspace()).toContain('[aria-labelledby="workspace-settings-title"]')
    expect(view.workspaceTitle()).toContain('#workspace-settings-title')
    expect(view.workspacePanel()).toContain('.mm-panel')
    expect(view.workspaceSelect()).toContain('.select-field')
  })

  it('selects workspace actions and feedback', () => {
    const view = select()

    expect(view.openSidebar()).toContain('button:first-of-type')
    expect(view.openDetached()).toContain('button:last-of-type')
    expect(view.workspaceError()).toContain('[role="alert"]')
    expect(view.workspaceSuccess()).toContain('[role="status"]')
  })

  it('delegates queries to the provided function', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const view = settingsViewSelectors(query)

    expect(view.health()).toEqual({
      selector: expect.stringContaining('.service-health'),
    })
    expect(query).toHaveBeenCalledOnce()
  })

  it('supports scoped queries', () => {
    const view = settingsViewSelectors((selector) => `#app ${selector}`)

    expect(view.get()).toBe(`#app ${root}`)
    expect(view.health()).toContain(`#app ${root}`)
    expect(view.workspace()).toContain(`#app ${root}`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    settingsViewSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
