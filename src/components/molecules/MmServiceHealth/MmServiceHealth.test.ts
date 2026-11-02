import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmServiceHealth from './MmServiceHealth.vue'
import { mmServiceHealthSelectors } from '../../../test/selectors/molecules/mmServiceHealth.selectors'
import { mmStatusBadgeSelectors } from '../../../test/selectors/atoms/mmStatusBadge.selectors'

let wrapper: VueWrapper

const query = (selector: string) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.service-health /, ''))
}

const health = mmServiceHealthSelectors(query)
const badge = mmStatusBadgeSelectors(query)

function createWrapper(props: Partial<InstanceType<typeof MmServiceHealth>['$props']> = {}) {
  wrapper = mount(MmServiceHealth, { props })
  return wrapper
}

describe('MmServiceHealth', () => {
  it('renders connected health using the status badge', () => {
    createWrapper({ status: 'connected' })

    expect(badge.variant('success').exists()).toBe(true)
    expect(badge.label().text()).toBe('Connected')
  })

  it('renders failed health using the status badge', () => {
    createWrapper({ status: 'failed' })

    expect(badge.variant('danger').exists()).toBe(true)
    expect(badge.label().text()).toBe('Connection failed')
  })

  it('renders not-checked health as not checked yet', () => {
    createWrapper({ status: 'not-checked' })

    expect(badge.variant('info').exists()).toBe(true)
    expect(badge.label().text()).toBe('Not checked yet')
  })

  it('defaults to not checked when no props are provided', () => {
    createWrapper()

    expect(badge.label().text()).toBe('Not checked yet')
    expect(health.time().exists()).toBe(false)
    expect(health.error().exists()).toBe(false)
  })

  it('displays the supplied last checked label', () => {
    createWrapper({
      status: 'connected',
      lastCheckedLabel: '31 Oct 2026, 13:00',
    })

    expect(health.time().text()).toBe('31 Oct 2026, 13:00')
  })

  it('hides the timestamp when no label is provided', () => {
    createWrapper({ status: 'not-checked' })

    expect(health.time().exists()).toBe(false)
  })

  it('hides the timestamp when the label is empty', () => {
    createWrapper({
      status: 'connected',
      lastCheckedLabel: '',
    })

    expect(health.time().exists()).toBe(false)
  })

  it('displays the error message for a failed connection', () => {
    createWrapper({
      status: 'failed',
      error: 'Unable to reach the server.',
    })

    expect(health.alert().text()).toBe('Unable to reach the server.')
    expect(health.error().attributes('role')).toBe('alert')
  })

  it('hides errors when the connection is healthy', () => {
    createWrapper({
      status: 'connected',
      error: 'An old connection error.',
    })

    expect(health.error().exists()).toBe(false)
  })

  it('hides the error element when a failed connection has no error details', () => {
    createWrapper({ status: 'failed' })

    expect(health.error().exists()).toBe(false)
  })

  it('updates when the health status changes', async () => {
    createWrapper({ status: 'not-checked' })

    expect(badge.label().text()).toBe('Not checked yet')

    await wrapper.setProps({
      status: 'failed',
      error: 'Unable to reach the server.',
    })

    expect(badge.label().text()).toBe('Connection failed')
    expect(health.error().text()).toBe('Unable to reach the server.')

    await wrapper.setProps({ status: 'connected' })

    expect(badge.label().text()).toBe('Connected')
    expect(health.error().exists()).toBe(false)
  })

  it('updates when the last checked label changes', async () => {
    createWrapper({
      status: 'connected',
      lastCheckedLabel: 'Earlier',
    })

    expect(health.time().text()).toBe('Earlier')

    await wrapper.setProps({ lastCheckedLabel: 'Just now' })

    expect(health.time().text()).toBe('Just now')
  })

  it('exposes readable status without creating a landmark', () => {
    createWrapper({ status: 'connected' })

    expect(health.get().element.tagName).toBe('DIV')
    expect(health.get().attributes('role')).toBeUndefined()
    expect(health.section().exists()).toBe(false)
    expect(health.labelledBy().exists()).toBe(false)
    expect(badge.label().text()).toBe('Connected')
  })

  it('keeps the decorative status dot hidden from screen readers', () => {
    createWrapper({ status: 'connected' })

    expect(badge.decorativeDot().exists()).toBe(true)
    expect(badge.dot().attributes('aria-hidden')).toBe('true')
  })

  it('does not introduce interactive controls', () => {
    createWrapper({
      status: 'failed',
      error: 'Unable to reach the server.',
    })

    expect(health.buttons().exists()).toBe(false)
    expect(health.links().exists()).toBe(false)
  })
})
