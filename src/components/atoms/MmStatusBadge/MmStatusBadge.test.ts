import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmStatusBadge from './MmStatusBadge.vue'
import { mmStatusBadgeSelectors } from '../../../test/selectors/atoms/mmStatusBadge.selectors'

let wrapper: VueWrapper

const badge = mmStatusBadgeSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^span\.status-badge /, ''))
})

describe('MmStatusBadge', () => {
  const variants = [
    { variant: 'neutral', label: 'Not set' },
    { variant: 'info', label: 'Configured' },
    { variant: 'success', label: 'Connected' },
    { variant: 'danger', label: 'Failed' },
  ] as const

  it.each(variants)('renders the $variant variant', ({ variant, label }) => {
    wrapper = mount(MmStatusBadge, {
      props: { variant, label },
    })

    expect(badge.label().text()).toBe(label)
    expect(badge.variant(variant).exists()).toBe(true)
  })

  it('renders a status indicator dot', () => {
    wrapper = mount(MmStatusBadge, {
      props: { variant: 'success', label: 'Connected' },
    })

    expect(badge.dot().exists()).toBe(true)
  })

  it('hides the decorative dot from screen readers', () => {
    wrapper = mount(MmStatusBadge, {
      props: { variant: 'success', label: 'Connected' },
    })

    expect(badge.decorativeDot().exists()).toBe(true)
    expect(badge.dot().attributes('aria-hidden')).toBe('true')
  })

  it('exposes the label as readable text', () => {
    wrapper = mount(MmStatusBadge, {
      props: { variant: 'success', label: 'Connected' },
    })

    expect(badge.get().text()).toBe('Connected')
  })

  it('updates when the variant and label change', async () => {
    wrapper = mount(MmStatusBadge, {
      props: { variant: 'info', label: 'Configured' },
    })

    expect(badge.get().text()).toBe('Configured')

    await wrapper.setProps({
      variant: 'success',
      label: 'Connected',
    })

    expect(badge.get().text()).toBe('Connected')
    expect(badge.variant('success').exists()).toBe(true)
    expect(badge.variant('info').exists()).toBe(false)
  })

  it('renders as an inline element', () => {
    wrapper = mount(MmStatusBadge, {
      props: { variant: 'danger', label: 'Failed' },
    })

    expect(badge.get().element.tagName).toBe('SPAN')
  })

  it('does not render an interactive control', () => {
    wrapper = mount(MmStatusBadge, {
      props: { variant: 'neutral', label: 'Not set' },
    })

    expect(badge.buttons().exists()).toBe(false)
    expect(badge.links().exists()).toBe(false)
  })

  it('supports custom labels independent of the visual variant', () => {
    wrapper = mount(MmStatusBadge, {
      props: {
        variant: 'info',
        label: 'Not checked yet',
      },
    })

    expect(badge.label().text()).toBe('Not checked yet')
    expect(badge.variant('info').exists()).toBe(true)
  })

  it('preserves the variant styling with a descriptive label', () => {
    wrapper = mount(MmStatusBadge, {
      props: {
        variant: 'danger',
        label: 'Connection failed',
      },
    })

    expect(badge.label().text()).toBe('Connection failed')
    expect(badge.variant('danger').exists()).toBe(true)
    expect(badge.decorativeDot().exists()).toBe(true)
  })

  it('updates when the label changes', async () => {
    wrapper = mount(MmStatusBadge, {
      props: {
        variant: 'info',
        label: 'Not checked yet',
      },
    })

    expect(badge.label().text()).toBe('Not checked yet')

    await wrapper.setProps({
      label: 'Checking connection',
    })

    expect(badge.label().text()).toBe('Checking connection')
    expect(badge.variant('info').exists()).toBe(true)
  })

  it('updates the label independently of the variant', async () => {
    wrapper = mount(MmStatusBadge, {
      props: {
        variant: 'info',
        label: 'Pending',
      },
    })

    await wrapper.setProps({
      label: 'Ready',
    })

    expect(badge.label().text()).toBe('Ready')
    expect(badge.variant('info').exists()).toBe(true)
  })
})
