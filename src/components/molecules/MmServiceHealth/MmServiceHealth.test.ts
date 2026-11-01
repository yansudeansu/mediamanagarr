import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmServiceHealth from './MmServiceHealth.vue'

describe('MmServiceHealth', () => {
  function createWrapper(props: Partial<InstanceType<typeof MmServiceHealth>['$props']> = {}) {
    return mount(MmServiceHealth, {
      props,
    })
  }

  it('renders connected health using the status badge', () => {
    const wrapper = createWrapper({
      status: 'connected',
    })

    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--success')
    expect(wrapper.get('.status-badge__label').text()).toBe('Connected')
  })

  it('renders failed health using the status badge', () => {
    const wrapper = createWrapper({
      status: 'failed',
    })

    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--danger')
    expect(wrapper.get('.status-badge__label').text()).toBe('Connection failed')
  })

  it('renders not-checked health as not checked yet', () => {
    const wrapper = createWrapper({
      status: 'not-checked',
    })

    expect(wrapper.get('.status-badge').classes()).toContain('status-badge--info')
    expect(wrapper.get('.status-badge__label').text()).toBe('Not checked yet')
  })

  it('defaults to not checked when no props are provided', () => {
    const wrapper = createWrapper()

    expect(wrapper.get('.status-badge__label').text()).toBe('Not checked yet')
    expect(wrapper.find('.service-health__time').exists()).toBe(false)
    expect(wrapper.find('.service-health__error').exists()).toBe(false)
  })

  it('displays the supplied last checked label', () => {
    const wrapper = createWrapper({
      status: 'connected',
      lastCheckedLabel: '31 Oct 2026, 13:00',
    })

    expect(wrapper.get('.service-health__time').text()).toBe('31 Oct 2026, 13:00')
  })

  it('hides the timestamp when no label is provided', () => {
    const wrapper = createWrapper({
      status: 'not-checked',
    })

    expect(wrapper.find('.service-health__time').exists()).toBe(false)
  })

  it('hides the timestamp when the label is empty', () => {
    const wrapper = createWrapper({
      status: 'connected',
      lastCheckedLabel: '',
    })

    expect(wrapper.find('.service-health__time').exists()).toBe(false)
  })

  it('displays the error message for a failed connection', () => {
    const wrapper = createWrapper({
      status: 'failed',
      error: 'Unable to reach the server.',
    })

    const error = wrapper.get('.service-health__error')

    expect(error.text()).toBe('Unable to reach the server.')
    expect(error.attributes('role')).toBe('alert')
  })

  it('hides errors when the connection is healthy', () => {
    const wrapper = createWrapper({
      status: 'connected',
      error: 'An old connection error.',
    })

    expect(wrapper.find('.service-health__error').exists()).toBe(false)
  })

  it('hides the error element when a failed connection has no error details', () => {
    const wrapper = createWrapper({
      status: 'failed',
    })

    expect(wrapper.find('.service-health__error').exists()).toBe(false)
  })

  it('updates when the health status changes', async () => {
    const wrapper = createWrapper({
      status: 'not-checked',
    })

    expect(wrapper.get('.status-badge__label').text()).toBe('Not checked yet')

    await wrapper.setProps({
      status: 'failed',
      error: 'Unable to reach the server.',
    })

    expect(wrapper.get('.status-badge__label').text()).toBe('Connection failed')
    expect(wrapper.get('.service-health__error').text()).toBe('Unable to reach the server.')

    await wrapper.setProps({
      status: 'connected',
    })

    expect(wrapper.get('.status-badge__label').text()).toBe('Connected')
    expect(wrapper.find('.service-health__error').exists()).toBe(false)
  })

  it('updates when the last checked label changes', async () => {
    const wrapper = createWrapper({
      status: 'connected',
      lastCheckedLabel: 'Earlier',
    })

    expect(wrapper.get('.service-health__time').text()).toBe('Earlier')

    await wrapper.setProps({
      lastCheckedLabel: 'Just now',
    })

    expect(wrapper.get('.service-health__time').text()).toBe('Just now')
  })

  it('exposes readable status without creating a landmark', () => {
    const wrapper = createWrapper({
      status: 'connected',
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.get('.service-health').attributes('role')).toBeUndefined()
    expect(wrapper.find('section').exists()).toBe(false)
    expect(wrapper.find('[aria-labelledby]').exists()).toBe(false)
    expect(wrapper.get('.status-badge__label').text()).toBe('Connected')
  })

  it('keeps the decorative status dot hidden from screen readers', () => {
    const wrapper = createWrapper({
      status: 'connected',
    })

    expect(wrapper.get('.status-badge__dot').attributes('aria-hidden')).toBe('true')
  })

  it('does not introduce interactive controls', () => {
    const wrapper = createWrapper({
      status: 'failed',
      error: 'Unable to reach the server.',
    })

    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
  })
})
