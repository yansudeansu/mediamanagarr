import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmPanel from './MmPanel.vue'
import { mmPanelSelectors } from '../../../test/selectors/atoms/mmPanel.selectors'

let wrapper: VueWrapper

const panel = mmPanelSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^section\.mm-panel > /, ''))
})

describe('MmPanel', () => {
  it('renders a section element', () => {
    wrapper = mount(MmPanel)

    expect(panel.get().element.tagName).toBe('SECTION')
    expect(panel.get().classes()).toContain('mm-panel')
  })

  it('renders default slot content', () => {
    wrapper = mount(MmPanel, {
      slots: {
        default: '<p data-testid="content">Panel content</p>',
      },
    })

    expect(panel.content().text()).toBe('Panel content')
  })

  it('renders multiple children in their original order', () => {
    wrapper = mount(MmPanel, {
      slots: {
        default: `
          <h2>Panel heading</h2>
          <p>Panel description</p>
          <button type="button">Panel action</button>
        `,
      },
    })

    expect(wrapper.findAll('h2, p, button').map((element) => element.text())).toEqual([
      'Panel heading',
      'Panel description',
      'Panel action',
    ])
  })

  it('uses medium padding by default', () => {
    wrapper = mount(MmPanel)

    expect(panel.padding('md').exists()).toBe(true)
  })

  it('supports small padding', () => {
    wrapper = mount(MmPanel, {
      props: { padding: 'sm' },
    })

    expect(panel.padding('sm').exists()).toBe(true)
    expect(panel.padding('md').exists()).toBe(false)
  })

  it('supports explicitly selecting medium padding', () => {
    wrapper = mount(MmPanel, {
      props: { padding: 'md' },
    })

    expect(panel.padding('md').exists()).toBe(true)
  })

  it('inherits an accessible label', () => {
    wrapper = mount(MmPanel, {
      attrs: { 'aria-label': 'Workspace preferences' },
    })

    expect(panel.get().attributes('aria-label')).toBe('Workspace preferences')
  })

  it('supports aria-labelledby', () => {
    wrapper = mount(MmPanel, {
      attrs: { 'aria-labelledby': 'workspace-settings-title' },
    })

    expect(panel.get().attributes('aria-labelledby')).toBe('workspace-settings-title')
  })

  it('inherits an id', () => {
    wrapper = mount(MmPanel, {
      attrs: { id: 'workspace-panel' },
    })

    expect(panel.get().attributes('id')).toBe('workspace-panel')
  })

  it('preserves consumer-provided classes', () => {
    wrapper = mount(MmPanel, {
      attrs: { class: 'service-form' },
    })

    expect(panel.get().classes()).toContain('mm-panel')
    expect(panel.get().classes()).toContain('service-form')
  })

  it('renders without slot content', () => {
    wrapper = mount(MmPanel)

    expect(panel.get().element.tagName).toBe('SECTION')
    expect(panel.get().text()).toBe('')
  })
})
