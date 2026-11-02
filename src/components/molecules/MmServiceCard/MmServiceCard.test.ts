import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmServiceCard from './MmServiceCard.vue'
import { mmServiceCardSelectors } from '../../../test/selectors/molecules/mmServiceCard.selectors'
import { mmStatusBadgeSelectors } from '../../../test/selectors/atoms/mmStatusBadge.selectors'

let wrapper: VueWrapper

const query = (selector: string) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^button\.service-card /, ''))
}

const service = mmServiceCardSelectors(query)
const badge = mmStatusBadgeSelectors(query)

function createWrapper(props: Partial<InstanceType<typeof MmServiceCard>['$props']> = {}) {
  wrapper = mount(MmServiceCard, {
    props: {
      name: 'Example Service',
      status: 'not-configured',
      ...props,
    },
  })
  return wrapper
}

describe('MmServiceCard', () => {
  describe('rendering', () => {
    it('renders the service name', () => {
      createWrapper()

      expect(service.name().text()).toBe('Example Service')
    })

    it('renders the connection status', () => {
      createWrapper({ status: 'connected' })

      expect(badge.label().text()).toBe('Connected')
    })

    it.each([
      ['not-configured', 'Not set', 'neutral'],
      ['configured', 'Configured', 'info'],
      ['connected', 'Connected', 'success'],
      ['failed', 'Failed', 'danger'],
    ] as const)('renders the %s status', (status, label, variant) => {
      createWrapper({ status })

      expect(badge.label().text()).toBe(label)
      expect(badge.variant(variant).exists()).toBe(true)
    })

    it('renders as a native button', () => {
      createWrapper()

      expect(service.get().element.tagName).toBe('BUTTON')
      expect(service.get().attributes('type')).toBe('button')
    })

    it('does not render a service description inside the selector row', () => {
      createWrapper()

      expect(service.get().text()).not.toContain('Service description')
    })

    it('does not render a chevron', () => {
      createWrapper()

      expect(service.chevron().exists()).toBe(false)
    })

    it('reacts to name changes', async () => {
      createWrapper()

      await wrapper.setProps({ name: 'Another Service' })

      expect(service.name().text()).toBe('Another Service')
    })

    it('reacts to status changes', async () => {
      createWrapper({ status: 'configured' })

      expect(badge.label().text()).toBe('Configured')

      await wrapper.setProps({ status: 'connected' })

      expect(badge.label().text()).toBe('Connected')
    })
  })

  describe('interaction', () => {
    it('emits select when clicked', async () => {
      createWrapper()

      await service.get().trigger('click')

      expect(wrapper.emitted('select')).toHaveLength(1)
    })

    it('does not emit select before interaction', () => {
      createWrapper()

      expect(wrapper.emitted('select')).toBeUndefined()
    })

    it('emits select on repeated clicks', async () => {
      createWrapper()

      await service.get().trigger('click')
      await service.get().trigger('click')

      expect(wrapper.emitted('select')).toHaveLength(2)
    })

    it('does not emit select when disabled', async () => {
      createWrapper({ disabled: true })

      expect(service.disabled().exists()).toBe(true)

      await service.get().trigger('click')

      expect(wrapper.emitted('select')).toBeUndefined()
    })
  })

  describe('selected state', () => {
    it('supports the selected state', () => {
      createWrapper({ selected: true })

      expect(service.selected().exists()).toBe(true)
      expect(service.get().classes()).toContain('service-card--selected')
      expect(service.get().attributes('aria-current')).toBe('true')
    })

    it('does not mark unselected cards as current', () => {
      createWrapper()

      expect(service.unselected().exists()).toBe(true)
      expect(service.get().classes()).not.toContain('service-card--selected')
      expect(service.get().attributes('aria-current')).toBeUndefined()
    })

    it('reacts when the selected state changes', async () => {
      createWrapper()

      await wrapper.setProps({ selected: true })

      expect(service.selected().exists()).toBe(true)
      expect(service.get().attributes('aria-current')).toBe('true')

      await wrapper.setProps({ selected: false })

      expect(service.unselected().exists()).toBe(true)
      expect(service.get().attributes('aria-current')).toBeUndefined()
    })
  })

  describe('disabled state', () => {
    it('supports the disabled state', () => {
      createWrapper({ disabled: true })

      expect(service.disabled().exists()).toBe(true)
      expect(service.get().attributes('disabled')).toBeDefined()
    })

    it('is enabled by default', () => {
      createWrapper()

      expect(service.enabled().exists()).toBe(true)
      expect(service.get().attributes('disabled')).toBeUndefined()
    })
  })

  describe('accessibility', () => {
    it('uses visible content rather than overriding the accessible name', () => {
      createWrapper({ status: 'connected' })

      expect(service.customLabel().exists()).toBe(false)
      expect(service.labelledBy().exists()).toBe(false)
    })

    it('includes the service name and visible status in its button content', () => {
      createWrapper({ status: 'connected' })

      expect(service.get().text()).toContain('Example Service')
      expect(service.get().text()).toContain('Connected')
    })

    it('includes the visible not-configured label in its button content', () => {
      createWrapper({ status: 'not-configured' })

      expect(service.get().text()).toContain('Example Service')
      expect(service.get().text()).toContain('Not set')
    })

    it('updates its visible status when the connection changes', async () => {
      createWrapper({ status: 'configured' })

      expect(badge.label().text()).toBe('Configured')

      await wrapper.setProps({ status: 'failed' })

      expect(badge.label().text()).toBe('Failed')
    })

    it('updates its visible service name when the name changes', async () => {
      createWrapper()

      await wrapper.setProps({ name: 'Another Service' })

      expect(service.name().text()).toBe('Another Service')
    })

    it('does not add a custom keyboard role to the native button', () => {
      createWrapper()

      expect(service.customRole().exists()).toBe(false)
    })
  })
})
