import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('renders its default slot', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Save settings',
      },
    })

    expect(wrapper.text()).toBe('Save settings')
  })

  it('uses the secondary variant by default', () => {
    const wrapper = mount(Button)

    expect(wrapper.classes()).toContain('button--secondary')
  })

  it('applies the selected variant', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'primary',
      },
    })

    expect(wrapper.classes()).toContain('button--primary')
  })

  it('applies the selected size', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'small',
      },
    })

    expect(wrapper.classes()).toContain('button--small')
  })

  it('uses type="button" by default', () => {
    const wrapper = mount(Button)

    expect(wrapper.attributes('type')).toBe('button')
  })

  it('supports submit buttons', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'submit',
      },
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('emits a click event when clicked', async () => {
    const wrapper = mount(Button)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit clicks when disabled', async () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('shows a spinner when loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
    })

    expect(wrapper.find('.button__spinner').exists()).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('does not show a spinner when not loading', () => {
    const wrapper = mount(Button)

    expect(wrapper.find('.button__spinner').exists()).toBe(false)
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('does not emit clicks while loading', async () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('supports full-width layout', () => {
    const wrapper = mount(Button, {
      props: {
        block: true,
      },
    })

    expect(wrapper.classes()).toContain('button--block')
  })

  it('reacts when its props change', async () => {
    const wrapper = mount(Button, {
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
})
