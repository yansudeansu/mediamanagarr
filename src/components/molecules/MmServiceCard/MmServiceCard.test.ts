import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmServiceCard from './MmServiceCard.vue'
import { SERVICE_INFO } from '../../../types/service'
import type { ServiceState } from '../../../types/service'

describe('MmServiceCard', () => {
  const jellyfin = SERVICE_INFO.jellyfin

  function createWrapper(props: Partial<InstanceType<typeof MmServiceCard>['$props']> = {}) {
    return mount(MmServiceCard, {
      props: {
        service: jellyfin,
        status: 'not-configured',
        ...props,
      },
    })
  }

  describe('rendering', () => {
    it('renders the service name', () => {
      const wrapper = createWrapper()

      expect(wrapper.get('.service-card__name').text()).toBe('Jellyfin')
    })

    it('renders the connection status', () => {
      const wrapper = createWrapper({
        status: 'connected',
      })

      expect(wrapper.get('.status-badge__label').text()).toBe('Connected')
    })

    it.each([
      ['not-configured', 'Not set'],
      ['configured', 'Configured'],
      ['connected', 'Connected'],
      ['failed', 'Failed'],
    ] as const)('renders the %s status', (status: ServiceState, label: string) => {
      const wrapper = createWrapper({ status })

      expect(wrapper.get('.status-badge__label').text()).toBe(label)
    })

    it('renders as a native button', () => {
      const wrapper = createWrapper()

      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.attributes('type')).toBe('button')
    })

    it('does not render the service description inside the selector row', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).not.toContain('Recently added movies and episodes')
    })

    it('does not render a chevron', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.service-card__chevron').exists()).toBe(false)
    })

    it('reacts to service changes', async () => {
      const wrapper = createWrapper()

      await wrapper.setProps({
        service: SERVICE_INFO.sonarr,
      })

      expect(wrapper.get('.service-card__name').text()).toBe('Sonarr')
    })

    it('reacts to status changes', async () => {
      const wrapper = createWrapper({
        status: 'configured',
      })

      expect(wrapper.get('.status-badge__label').text()).toBe('Configured')

      await wrapper.setProps({
        status: 'connected',
      })

      expect(wrapper.get('.status-badge__label').text()).toBe('Connected')
    })
  })

  describe('interaction', () => {
    it('emits select when clicked', async () => {
      const wrapper = createWrapper()

      await wrapper.trigger('click')

      expect(wrapper.emitted('select')).toHaveLength(1)
    })

    it('does not emit select before interaction', () => {
      const wrapper = createWrapper()

      expect(wrapper.emitted('select')).toBeUndefined()
    })

    it('emits select on repeated clicks', async () => {
      const wrapper = createWrapper()

      await wrapper.trigger('click')
      await wrapper.trigger('click')

      expect(wrapper.emitted('select')).toHaveLength(2)
    })

    it('does not emit select when disabled', async () => {
      const wrapper = createWrapper({
        disabled: true,
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('select')).toBeUndefined()
    })
  })

  describe('selected state', () => {
    it('supports the selected state', () => {
      const wrapper = createWrapper({
        selected: true,
      })

      expect(wrapper.classes()).toContain('service-card--selected')
      expect(wrapper.attributes('aria-current')).toBe('true')
    })

    it('does not mark unselected cards as current', () => {
      const wrapper = createWrapper()

      expect(wrapper.classes()).not.toContain('service-card--selected')
      expect(wrapper.attributes('aria-current')).toBeUndefined()
    })

    it('reacts when the selected state changes', async () => {
      const wrapper = createWrapper()

      await wrapper.setProps({
        selected: true,
      })

      expect(wrapper.classes()).toContain('service-card--selected')
      expect(wrapper.attributes('aria-current')).toBe('true')

      await wrapper.setProps({
        selected: false,
      })

      expect(wrapper.classes()).not.toContain('service-card--selected')
      expect(wrapper.attributes('aria-current')).toBeUndefined()
    })
  })

  describe('disabled state', () => {
    it('supports the disabled state', () => {
      const wrapper = createWrapper({
        disabled: true,
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('is enabled by default', () => {
      const wrapper = createWrapper()

      expect(wrapper.attributes('disabled')).toBeUndefined()
    })
  })

  describe('accessibility', () => {
    it('has an accessible label containing the service name', () => {
      const wrapper = createWrapper()

      expect(wrapper.attributes('aria-label')).toContain('Jellyfin')
    })

    it('includes the connection state in its accessible label', () => {
      const wrapper = createWrapper({
        status: 'connected',
      })

      expect(wrapper.attributes('aria-label')).toBe('Jellyfin: connected')
    })

    it('updates its accessible label when the status changes', async () => {
      const wrapper = createWrapper({
        status: 'configured',
      })

      expect(wrapper.attributes('aria-label')).toBe('Jellyfin: configured')

      await wrapper.setProps({
        status: 'failed',
      })

      expect(wrapper.attributes('aria-label')).toBe('Jellyfin: failed')
    })

    it('updates its accessible label when the service changes', async () => {
      const wrapper = createWrapper()

      await wrapper.setProps({
        service: SERVICE_INFO.radarr,
      })

      expect(wrapper.attributes('aria-label')).toContain('Radarr')
    })

    it('exposes the status badge text', () => {
      const wrapper = createWrapper({
        status: 'connected',
      })

      expect(wrapper.text()).toContain('Connected')
    })

    it('does not add a custom keyboard role to the native button', () => {
      const wrapper = createWrapper()

      expect(wrapper.attributes('role')).toBeUndefined()
    })
  })
})
