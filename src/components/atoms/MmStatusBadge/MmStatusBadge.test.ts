import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmStatusBadge from './MmStatusBadge.vue'
import type { ServiceState } from '../../../types/service'

describe('MmStatusBadge', () => {
  const statuses: {
    status: ServiceState
    label: string
  }[] = [
    { status: 'not-configured', label: 'Not set' },
    { status: 'configured', label: 'Configured' },
    { status: 'connected', label: 'Connected' },
    { status: 'failed', label: 'Failed' },
  ]

  it.each(statuses)('renders the $status status', ({ status, label }) => {
    const wrapper = mount(MmStatusBadge, {
      props: { status },
    })

    expect(wrapper.get('.status-badge__label').text()).toBe(label)
    expect(wrapper.get('.status-badge').classes()).toContain(`status-badge--${status}`)
  })

  it('renders a status indicator dot', () => {
    const wrapper = mount(MmStatusBadge, {
      props: { status: 'connected' },
    })

    expect(wrapper.find('.status-badge__dot').exists()).toBe(true)
  })

  it('hides the decorative dot from screen readers', () => {
    const wrapper = mount(MmStatusBadge, {
      props: { status: 'connected' },
    })

    expect(wrapper.get('.status-badge__dot').attributes('aria-hidden')).toBe('true')
  })

  it('exposes the status as readable text', () => {
    const wrapper = mount(MmStatusBadge, {
      props: { status: 'connected' },
    })

    expect(wrapper.text()).toBe('Connected')
  })

  it('updates when the status changes', async () => {
    const wrapper = mount(MmStatusBadge, {
      props: { status: 'configured' },
    })

    expect(wrapper.text()).toBe('Configured')

    await wrapper.setProps({
      status: 'connected',
    })

    expect(wrapper.text()).toBe('Connected')
    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--connected')
    expect(wrapper.get('.status-badge').classes()).not.toContain('status-badge--configured')
  })

  it('renders as an inline element', () => {
    const wrapper = mount(MmStatusBadge, {
      props: { status: 'failed' },
    })

    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('does not render an interactive control', () => {
    const wrapper = mount(MmStatusBadge, {
      props: { status: 'not-configured' },
    })

    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
  })
})
