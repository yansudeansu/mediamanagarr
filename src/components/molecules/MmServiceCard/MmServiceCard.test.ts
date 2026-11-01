import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmServiceCard from './MmServiceCard.vue'

describe('MmServiceCard', () => {
  function createWrapper(props: Partial<InstanceType<typeof MmServiceCard>['$props']> = {}) {
    return mount(MmServiceCard, {
      props: {
        name: 'Example Service',
        status: 'not-configured',
        ...props,
      },
    })
  }

  describe('rendering', () => {
    it('renders the service name', () => {
      const wrapper = createWrapper()

      expect(wrapper.get('.service-card__name').text()).toBe('Example Service')
    })

    it('renders the connection status', () => {
      const wrapper = createWrapper({
        status: 'connected',
      })

      expect(wrapper.get('.status-badge__label').text()).toBe('Connected')
    })

    it.each([
      ['not-configured', 'Not set', 'neutral'],
      ['configured', 'Configured', 'info'],
      ['connected', 'Connected', 'success'],
      ['failed', 'Failed', 'danger'],
    ] as const)('renders the %s status', (status, label, variant) => {
      const wrapper = createWrapper({ status })

      expect(wrapper.get('.status-badge__label').text()).toBe(label)
      expect(wrapper.get('.status-badge').classes()).toContain(`status-badge--${variant}`)
    })

    it('renders as a native button', () => {
      const wrapper = createWrapper()

      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.attributes('type')).toBe('button')
    })

    it('does not render a service description inside the selector row', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).not.toContain('Service description')
    })

    it('does not render a chevron', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.service-card__chevron').exists()).toBe(false)
    })

    it('reacts to name changes', async () => {
      const wrapper = createWrapper()

      await wrapper.setProps({
        name: 'Another Service',
      })

      expect(wrapper.get('.service-card__name').text()).toBe('Another Service')
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
    it('uses visible content rather than overriding the accessible name', () => {
      const wrapper = createWrapper({
        status: 'connected',
      })

      expect(wrapper.attributes('aria-label')).toBeUndefined()
      expect(wrapper.attributes('aria-labelledby')).toBeUndefined()
    })

    it('includes the service name and visible status in its button content', () => {
      const wrapper = createWrapper({
        status: 'connected',
      })

      expect(wrapper.text()).toContain('Example Service')
      expect(wrapper.text()).toContain('Connected')
    })

    it('includes the visible not-configured label in its button content', () => {
      const wrapper = createWrapper({
        status: 'not-configured',
      })

      expect(wrapper.text()).toContain('Example Service')
      expect(wrapper.text()).toContain('Not set')
    })

    it('updates its visible status when the connection changes', async () => {
      const wrapper = createWrapper({
        status: 'configured',
      })

      expect(wrapper.text()).toContain('Configured')

      await wrapper.setProps({
        status: 'failed',
      })

      expect(wrapper.text()).toContain('Failed')
    })

    it('updates its visible service name when the name changes', async () => {
      const wrapper = createWrapper()

      await wrapper.setProps({
        name: 'Another Service',
      })

      expect(wrapper.text()).toContain('Another Service')
    })

    it('does not add a custom keyboard role to the native button', () => {
      const wrapper = createWrapper()

      expect(wrapper.attributes('role')).toBeUndefined()
    })
  })
})
