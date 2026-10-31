import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmServiceHealth from './MmServiceHealth.vue'
import type { ServiceHealth } from '../../../types/service'

describe('MmServiceHealth', () => {
  const connectedHealth: ServiceHealth = {
    status: 'connected',
    lastCheckedAt: '2026-10-31T12:00:00.000Z',
  }

  const failedHealth: ServiceHealth = {
    status: 'failed',
    lastCheckedAt: '2026-10-31T12:00:00.000Z',
    error: 'Unable to reach the server.',
  }

  const unknownHealth: ServiceHealth = {
    status: 'unknown',
    lastCheckedAt: null,
  }

  it('renders connected health using the existing status badge', () => {
    const wrapper = mount(MmServiceHealth, {
      props: { health: connectedHealth },
    })

    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--connected')
    expect(wrapper.get('.status-badge__label').text()).toBe('Connected')
  })

  it('renders failed health using the existing status badge', () => {
    const wrapper = mount(MmServiceHealth, {
      props: { health: failedHealth },
    })

    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--failed')
    expect(wrapper.get('.status-badge__label').text()).toBe('Connection failed')
  })

  it('renders unknown health as not checked yet', () => {
    const wrapper = mount(MmServiceHealth, {
      props: { health: unknownHealth },
    })

    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--configured')
    expect(wrapper.get('.status-badge__label').text()).toBe('Not checked yet')
  })

  it('defaults to unknown health when no health is provided', () => {
    const wrapper = mount(MmServiceHealth)

    expect(wrapper.get('.status-badge__label').text()).toBe('Not checked yet')
    expect(wrapper.find('.service-health__time').exists()).toBe(false)
    expect(wrapper.find('.service-health__error').exists()).toBe(false)
  })

  it('displays the last checked time in the local format', () => {
    const wrapper = mount(MmServiceHealth, {
      props: { health: connectedHealth },
    })

    expect(wrapper.get('.service-health__time').text()).toBe(
      new Date(connectedHealth.lastCheckedAt!).toLocaleString(),
    )
  })

  it('hides the timestamp when it is null', () => {
    const wrapper = mount(MmServiceHealth, {
      props: { health: unknownHealth },
    })

    expect(wrapper.find('.service-health__time').exists()).toBe(false)
  })

  it('hides an invalid timestamp', () => {
    const wrapper = mount(MmServiceHealth, {
      props: {
        health: {
          status: 'connected',
          lastCheckedAt: 'not-a-date',
        },
      },
    })

    expect(wrapper.find('.service-health__time').exists()).toBe(false)
  })

  it('displays the error message for a failed connection', () => {
    const wrapper = mount(MmServiceHealth, {
      props: { health: failedHealth },
    })

    const error = wrapper.get('.service-health__error')

    expect(error.text()).toBe('Unable to reach the server.')
    expect(error.attributes('role')).toBe('alert')
  })

  it('hides errors when the connection is healthy', () => {
    const wrapper = mount(MmServiceHealth, {
      props: {
        health: {
          status: 'connected',
          lastCheckedAt: connectedHealth.lastCheckedAt,
          error: 'An old connection error.',
        },
      },
    })

    expect(wrapper.find('.service-health__error').exists()).toBe(false)
  })

  it('hides the error element when a failed connection has no error details', () => {
    const wrapper = mount(MmServiceHealth, {
      props: {
        health: {
          status: 'failed',
          lastCheckedAt: null,
        },
      },
    })

    expect(wrapper.find('.service-health__error').exists()).toBe(false)
  })

  it('updates when the health status changes', async () => {
    const wrapper = mount(MmServiceHealth, {
      props: { health: unknownHealth },
    })

    expect(wrapper.get('.status-badge__label').text()).toBe('Not checked yet')

    await wrapper.setProps({ health: failedHealth })

    expect(wrapper.get('.status-badge__label').text()).toBe('Connection failed')
    expect(wrapper.get('.service-health__error').text()).toBe('Unable to reach the server.')

    await wrapper.setProps({ health: connectedHealth })

    expect(wrapper.get('.status-badge__label').text()).toBe('Connected')
    expect(wrapper.find('.service-health__error').exists()).toBe(false)
  })

  it('exposes readable status without creating a landmark', () => {
    const wrapper = mount(MmServiceHealth, {
      props: { health: connectedHealth },
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.get('.service-health').attributes('role')).toBeUndefined()
    expect(wrapper.find('section').exists()).toBe(false)
    expect(wrapper.find('[aria-labelledby]').exists()).toBe(false)
    expect(wrapper.get('.status-badge__label').text()).toBe('Connected')
  })

  it('keeps the decorative status dot hidden from screen readers', () => {
    const wrapper = mount(MmServiceHealth, {
      props: { health: connectedHealth },
    })

    expect(wrapper.get('.status-badge__dot').attributes('aria-hidden')).toBe('true')
  })

  it('does not introduce interactive controls', () => {
    const wrapper = mount(MmServiceHealth, {
      props: { health: failedHealth },
    })

    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
  })
})
