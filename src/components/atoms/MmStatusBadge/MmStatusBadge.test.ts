import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmStatusBadge from './MmStatusBadge.vue'

describe('MmStatusBadge', () => {
  const variants = [
    { variant: 'neutral', label: 'Not set' },
    { variant: 'info', label: 'Configured' },
    { variant: 'success', label: 'Connected' },
    { variant: 'danger', label: 'Failed' },
  ] as const

  it.each(variants)('renders the $variant variant', ({ variant, label }) => {
    const wrapper = mount(MmStatusBadge, {
      props: { variant, label },
    })

    expect(wrapper.get('.status-badge__label').text()).toBe(label)
    expect(wrapper.get('.status-badge').classes()).toContain(`status-badge--${variant}`)
  })

  it('renders a status indicator dot', () => {
    const wrapper = mount(MmStatusBadge, {
      props: { variant: 'success', label: 'Connected' },
    })

    expect(wrapper.find('.status-badge__dot').exists()).toBe(true)
  })

  it('hides the decorative dot from screen readers', () => {
    const wrapper = mount(MmStatusBadge, {
      props: { variant: 'success', label: 'Connected' },
    })

    expect(wrapper.get('.status-badge__dot').attributes('aria-hidden')).toBe('true')
  })

  it('exposes the label as readable text', () => {
    const wrapper = mount(MmStatusBadge, {
      props: { variant: 'success', label: 'Connected' },
    })

    expect(wrapper.text()).toBe('Connected')
  })

  it('updates when the variant and label change', async () => {
    const wrapper = mount(MmStatusBadge, {
      props: { variant: 'info', label: 'Configured' },
    })

    expect(wrapper.text()).toBe('Configured')

    await wrapper.setProps({
      variant: 'success',
      label: 'Connected',
    })

    expect(wrapper.text()).toBe('Connected')
    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--success')
    expect(wrapper.get('.status-badge').classes()).not.toContain('status-badge--info')
  })

  it('renders as an inline element', () => {
    const wrapper = mount(MmStatusBadge, {
      props: { variant: 'danger', label: 'Failed' },
    })

    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('does not render an interactive control', () => {
    const wrapper = mount(MmStatusBadge, {
      props: { variant: 'neutral', label: 'Not set' },
    })

    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('supports custom labels independent of the visual variant', () => {
    const wrapper = mount(MmStatusBadge, {
      props: {
        variant: 'info',
        label: 'Not checked yet',
      },
    })

    expect(wrapper.get('.status-badge__label').text()).toBe('Not checked yet')
    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--info')
  })

  it('preserves the variant styling with a descriptive label', () => {
    const wrapper = mount(MmStatusBadge, {
      props: {
        variant: 'danger',
        label: 'Connection failed',
      },
    })

    expect(wrapper.get('.status-badge__label').text()).toBe('Connection failed')
    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--danger')
    expect(wrapper.get('.status-badge__dot').attributes('aria-hidden')).toBe('true')
  })

  it('updates when the label changes', async () => {
    const wrapper = mount(MmStatusBadge, {
      props: {
        variant: 'info',
        label: 'Not checked yet',
      },
    })

    expect(wrapper.get('.status-badge__label').text()).toBe('Not checked yet')

    await wrapper.setProps({
      label: 'Checking connection',
    })

    expect(wrapper.get('.status-badge__label').text()).toBe('Checking connection')
    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--info')
  })

  it('updates the label independently of the variant', async () => {
    const wrapper = mount(MmStatusBadge, {
      props: {
        variant: 'info',
        label: 'Pending',
      },
    })

    await wrapper.setProps({
      label: 'Ready',
    })

    expect(wrapper.get('.status-badge__label').text()).toBe('Ready')
    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--info')
  })
})
