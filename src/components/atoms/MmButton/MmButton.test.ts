import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmButton from './MmButton.vue'

describe('MmButton', () => {
  it('renders its default slot', () => {
    const wrapper = mount(MmButton, {
      slots: {
        default: 'Save settings',
      },
    })

    expect(wrapper.text()).toBe('Save settings')
  })

  it('uses the secondary variant by default', () => {
    const wrapper = mount(MmButton)

    expect(wrapper.classes()).toContain('button--secondary')
  })

  it('applies the selected variant', () => {
    const wrapper = mount(MmButton, {
      props: {
        variant: 'primary',
      },
    })

    expect(wrapper.classes()).toContain('button--primary')
  })

  it('applies the selected size', () => {
    const wrapper = mount(MmButton, {
      props: {
        size: 'small',
      },
    })

    expect(wrapper.classes()).toContain('button--small')
  })

  it('uses type="button" by default', () => {
    const wrapper = mount(MmButton)

    expect(wrapper.attributes('type')).toBe('button')
  })

  it('supports submit buttons', () => {
    const wrapper = mount(MmButton, {
      props: {
        type: 'submit',
      },
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('emits a click event when clicked', async () => {
    const wrapper = mount(MmButton)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit clicks when disabled', async () => {
    const wrapper = mount(MmButton, {
      props: {
        disabled: true,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('shows a spinner when loading', () => {
    const wrapper = mount(MmButton, {
      props: {
        loading: true,
      },
    })

    expect(wrapper.find('.button__spinner').exists()).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('does not show a spinner when not loading', () => {
    const wrapper = mount(MmButton)

    expect(wrapper.find('.button__spinner').exists()).toBe(false)
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('does not emit clicks while loading', async () => {
    const wrapper = mount(MmButton, {
      props: {
        loading: true,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('supports full-width layout', () => {
    const wrapper = mount(MmButton, {
      props: {
        block: true,
      },
    })

    expect(wrapper.classes()).toContain('button--block')
  })

  it('renders without an icon by default', () => {
    const wrapper = mount(MmButton, {
      slots: {
        default: 'Save',
      },
    })

    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.text()).toBe('Save')
  })

  it('renders an icon alongside its label', () => {
    const wrapper = mount(MmButton, {
      props: {
        icon: 'refresh',
      },
      slots: {
        default: 'Refresh',
      },
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.text()).toBe('Refresh')
    expect(wrapper.find('.button__content').exists()).toBe(true)
  })

  it('supports icon-only layout', () => {
    const wrapper = mount(MmButton, {
      props: {
        iconOnly: true,
        icon: 'settings',
      },
      attrs: {
        'aria-label': 'Open settings',
      },
    })

    expect(wrapper.classes()).toContain('button--icon-only')
    expect(wrapper.attributes('aria-label')).toBe('Open settings')
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.button__content').exists()).toBe(false)
  })

  it('does not use icon-only layout by default', () => {
    const wrapper = mount(MmButton)

    expect(wrapper.classes()).not.toContain('button--icon-only')
  })

  it('supports small icon-only buttons', () => {
    const wrapper = mount(MmButton, {
      props: {
        iconOnly: true,
        icon: 'refresh',
        size: 'small',
      },
      attrs: {
        'aria-label': 'Refresh',
      },
    })

    expect(wrapper.classes()).toContain('button--icon-only')
    expect(wrapper.classes()).toContain('button--small')
    expect(wrapper.get('svg').attributes('width')).toBe('16')
    expect(wrapper.get('svg').attributes('height')).toBe('16')
  })

  it('uses the correct icon size for standard buttons', () => {
    const wrapper = mount(MmButton, {
      props: {
        icon: 'refresh',
        size: 'medium',
      },
      slots: {
        default: 'Refresh',
      },
    })

    expect(wrapper.get('svg').attributes('width')).toBe('16')
    expect(wrapper.get('svg').attributes('height')).toBe('16')
  })

  it('uses the correct icon size for medium icon-only buttons', () => {
    const wrapper = mount(MmButton, {
      props: {
        icon: 'settings',
        iconOnly: true,
        size: 'medium',
      },
    })

    expect(wrapper.get('svg').attributes('width')).toBe('18')
    expect(wrapper.get('svg').attributes('height')).toBe('18')
  })

  it('hides the icon while loading', () => {
    const wrapper = mount(MmButton, {
      props: {
        icon: 'refresh',
        loading: true,
      },
      slots: {
        default: 'Refreshing...',
      },
    })

    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.find('.button__spinner').exists()).toBe(true)
    expect(wrapper.text()).toBe('Refreshing...')
  })

  it('shows only the spinner when an icon-only button is loading', () => {
    const wrapper = mount(MmButton, {
      props: {
        icon: 'refresh',
        iconOnly: true,
        loading: true,
      },
      attrs: {
        'aria-label': 'Refreshing',
      },
    })

    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.find('.button__spinner').exists()).toBe(true)
    expect(wrapper.find('.button__content').exists()).toBe(false)
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('reacts when its props change', async () => {
    const wrapper = mount(MmButton, {
      props: {
        variant: 'secondary',
      },
    })

    expect(wrapper.classes()).toContain('button--secondary')

    await wrapper.setProps({
      variant: 'danger',
    })

    expect(wrapper.classes()).toContain('button--danger')
    expect(wrapper.classes()).not.toContain('button--secondary')
  })

  it('reacts when icon-only changes', async () => {
    const wrapper = mount(MmButton, {
      props: {
        iconOnly: false,
        icon: 'settings',
      },
    })

    expect(wrapper.classes()).not.toContain('button--icon-only')
    expect(wrapper.find('.button__content').exists()).toBe(true)

    await wrapper.setProps({
      iconOnly: true,
    })

    expect(wrapper.classes()).toContain('button--icon-only')
    expect(wrapper.find('.button__content').exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('reacts when the icon changes', async () => {
    const wrapper = mount(MmButton, {
      props: {
        icon: 'settings',
      },
    })

    const initialMarkup = wrapper.get('svg').html()

    await wrapper.setProps({
      icon: 'refresh',
    })

    expect(wrapper.get('svg').html()).not.toBe(initialMarkup)
  })

  it('forwards accessibility attributes to the native button', () => {
    const wrapper = mount(MmButton, {
      attrs: {
        'aria-current': 'page',
        'aria-label': 'Requests',
      },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('aria-current')).toBe('page')
    expect(wrapper.attributes('aria-label')).toBe('Requests')
  })
})
