import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmButton from './MmButton.vue'
import { mmButtonSelectors } from '../../../test/selectors/atoms/mmButton.selectors'

let wrapper: VueWrapper

const button = mmButtonSelectors((selector) => {
  if (wrapper.element.matches(selector)) {
    return wrapper
  }

  return wrapper.find(selector)
})

describe('MmButton', () => {
  it('renders its default slot', () => {
    wrapper = mount(MmButton, {
      slots: {
        default: 'Save settings',
      },
    })

    expect(wrapper.text()).toBe('Save settings')
  })

  it('uses the secondary variant by default', () => {
    wrapper = mount(MmButton)

    expect(button.variant('secondary').exists()).toBe(true)
  })

  it('applies the selected variant', () => {
    wrapper = mount(MmButton, {
      props: {
        variant: 'primary',
      },
    })

    expect(button.variant('primary').exists()).toBe(true)
  })

  it('supports the pagination variant', () => {
    wrapper = mount(MmButton, {
      props: {
        variant: 'pagination',
        size: 'small',
      },
      slots: {
        default: '3',
      },
    })

    expect(button.variant('pagination').exists()).toBe(true)
    expect(button.size('small').exists()).toBe(true)
    expect(wrapper.text()).toBe('3')
  })

  it('supports an active pagination button', () => {
    wrapper = mount(MmButton, {
      props: {
        variant: 'pagination',
        disabled: true,
      },
      attrs: {
        'aria-current': 'page',
        'aria-label': 'Page 3',
      },
      slots: {
        default: '3',
      },
    })

    expect(button.variant('pagination').exists()).toBe(true)
    expect(button.currentPage().exists()).toBe(true)
    expect(button.disabled().exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('Page 3')
  })

  it('does not emit clicks from an active pagination button', async () => {
    wrapper = mount(MmButton, {
      props: {
        variant: 'pagination',
        disabled: true,
      },
      attrs: {
        'aria-current': 'page',
      },
      slots: {
        default: '3',
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('applies the selected size', () => {
    wrapper = mount(MmButton, {
      props: {
        size: 'small',
      },
    })

    expect(button.size('small').exists()).toBe(true)
  })

  it('uses type="button" by default', () => {
    wrapper = mount(MmButton)

    expect(wrapper.attributes('type')).toBe('button')
  })

  it('supports submit buttons', () => {
    wrapper = mount(MmButton, {
      props: {
        type: 'submit',
      },
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('emits a click event when clicked', async () => {
    wrapper = mount(MmButton)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit clicks when disabled', async () => {
    wrapper = mount(MmButton, {
      props: {
        disabled: true,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(button.disabled().exists()).toBe(true)
  })

  it('shows a spinner when loading', () => {
    wrapper = mount(MmButton, {
      props: {
        loading: true,
      },
    })

    expect(button.spinner().exists()).toBe(true)
    expect(button.loading().exists()).toBe(true)
  })

  it('does not show a spinner when not loading', () => {
    wrapper = mount(MmButton)

    expect(button.spinner().exists()).toBe(false)
    expect(button.loading().exists()).toBe(false)
  })

  it('does not emit clicks while loading', async () => {
    wrapper = mount(MmButton, {
      props: {
        loading: true,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(button.disabled().exists()).toBe(true)
  })

  it('supports full-width layout', () => {
    wrapper = mount(MmButton, {
      props: {
        block: true,
      },
    })

    expect(wrapper.classes()).toContain('button--block')
  })

  it('renders without an icon by default', () => {
    wrapper = mount(MmButton, {
      slots: {
        default: 'Save',
      },
    })

    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.text()).toBe('Save')
  })

  it('renders an icon alongside its label', () => {
    wrapper = mount(MmButton, {
      props: {
        icon: 'refresh',
      },
      slots: {
        default: 'Refresh',
      },
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.text()).toBe('Refresh')
    expect(button.content().exists()).toBe(true)
  })

  it('supports icon-only layout', () => {
    wrapper = mount(MmButton, {
      props: {
        iconOnly: true,
        icon: 'settings',
      },
      attrs: {
        'aria-label': 'Open settings',
      },
    })

    expect(button.iconOnly().exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('Open settings')
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
    expect(button.content().exists()).toBe(false)
  })

  it('does not use icon-only layout by default', () => {
    wrapper = mount(MmButton)

    expect(button.iconOnly().exists()).toBe(false)
  })

  it('supports small icon-only buttons', () => {
    wrapper = mount(MmButton, {
      props: {
        iconOnly: true,
        icon: 'refresh',
        size: 'small',
      },
      attrs: {
        'aria-label': 'Refresh',
      },
    })

    expect(button.iconOnly().exists()).toBe(true)
    expect(button.size('small').exists()).toBe(true)
    expect(wrapper.get('svg').attributes('width')).toBe('16')
    expect(wrapper.get('svg').attributes('height')).toBe('16')
  })

  it('uses the correct icon size for standard buttons', () => {
    wrapper = mount(MmButton, {
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
    wrapper = mount(MmButton, {
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
    wrapper = mount(MmButton, {
      props: {
        icon: 'refresh',
        loading: true,
      },
      slots: {
        default: 'Refreshing...',
      },
    })

    expect(wrapper.find('svg').exists()).toBe(false)
    expect(button.spinner().exists()).toBe(true)
    expect(wrapper.text()).toBe('Refreshing...')
  })

  it('shows only the spinner when an icon-only button is loading', () => {
    wrapper = mount(MmButton, {
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
    expect(button.spinner().exists()).toBe(true)
    expect(button.content().exists()).toBe(false)
    expect(button.loading().exists()).toBe(true)
  })

  it('reacts when its props change', async () => {
    wrapper = mount(MmButton, {
      props: {
        variant: 'secondary',
      },
    })

    expect(button.variant('secondary').exists()).toBe(true)

    await wrapper.setProps({
      variant: 'danger',
    })

    expect(button.variant('danger').exists()).toBe(true)
    expect(button.variant('secondary').exists()).toBe(false)
  })

  it('reacts when icon-only changes', async () => {
    wrapper = mount(MmButton, {
      props: {
        iconOnly: false,
        icon: 'settings',
      },
    })

    expect(button.iconOnly().exists()).toBe(false)
    expect(button.content().exists()).toBe(true)

    await wrapper.setProps({
      iconOnly: true,
    })

    expect(button.iconOnly().exists()).toBe(true)
    expect(button.content().exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('reacts when the icon changes', async () => {
    wrapper = mount(MmButton, {
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
    wrapper = mount(MmButton, {
      attrs: {
        'aria-current': 'page',
        'aria-label': 'Requests',
      },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(button.currentPage().exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('Requests')
  })
})
