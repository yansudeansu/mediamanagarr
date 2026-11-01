import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmPanel from './MmPanel.vue'

describe('MmPanel', () => {
  it('renders a section element', () => {
    const wrapper = mount(MmPanel)

    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.classes()).toContain('mm-panel')
  })

  it('renders default slot content', () => {
    const wrapper = mount(MmPanel, {
      slots: {
        default: '<p data-testid="content">Panel content</p>',
      },
    })

    expect(wrapper.get('[data-testid="content"]').text()).toBe('Panel content')
  })

  it('renders multiple children in their original order', () => {
    const wrapper = mount(MmPanel, {
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
    const wrapper = mount(MmPanel)

    expect(wrapper.classes()).toContain('mm-panel--padding-md')
  })

  it('supports small padding', () => {
    const wrapper = mount(MmPanel, {
      props: {
        padding: 'sm',
      },
    })

    expect(wrapper.classes()).toContain('mm-panel--padding-sm')
    expect(wrapper.classes()).not.toContain('mm-panel--padding-md')
  })

  it('supports explicitly selecting medium padding', () => {
    const wrapper = mount(MmPanel, {
      props: {
        padding: 'md',
      },
    })

    expect(wrapper.classes()).toContain('mm-panel--padding-md')
  })

  it('inherits an accessible label', () => {
    const wrapper = mount(MmPanel, {
      attrs: {
        'aria-label': 'Workspace preferences',
      },
    })

    expect(wrapper.attributes('aria-label')).toBe('Workspace preferences')
  })

  it('supports aria-labelledby', () => {
    const wrapper = mount(MmPanel, {
      attrs: {
        'aria-labelledby': 'workspace-settings-title',
      },
    })

    expect(wrapper.attributes('aria-labelledby')).toBe('workspace-settings-title')
  })

  it('inherits an id', () => {
    const wrapper = mount(MmPanel, {
      attrs: {
        id: 'workspace-panel',
      },
    })

    expect(wrapper.attributes('id')).toBe('workspace-panel')
  })

  it('preserves consumer-provided classes', () => {
    const wrapper = mount(MmPanel, {
      attrs: {
        class: 'service-form',
      },
    })

    expect(wrapper.classes()).toContain('mm-panel')
    expect(wrapper.classes()).toContain('service-form')
  })

  it('renders without slot content', () => {
    const wrapper = mount(MmPanel)

    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.text()).toBe('')
  })
})
