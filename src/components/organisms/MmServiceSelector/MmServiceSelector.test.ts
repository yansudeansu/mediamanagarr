import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmServiceSelector from './MmServiceSelector.vue'
import MmServiceCard from '../../molecules/MmServiceCard/MmServiceCard.vue'
import { SERVICES } from '../../../types/service'

describe('MmServiceSelector', () => {
  function createWrapper(props: Partial<InstanceType<typeof MmServiceSelector>['$props']> = {}) {
    return mount(MmServiceSelector, {
      props,
    })
  }

  describe('rendering', () => {
    it('renders all five services', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards).toHaveLength(5)
    })

    it('renders services in the expected order', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards.map((card) => card.props('service').id)).toEqual([...SERVICES])
    })

    it('renders a grouped service list', () => {
      const wrapper = createWrapper()

      const group = wrapper.get('[role="group"]')

      expect(group.attributes('aria-label')).toBe('Service connections')
    })

    it('renders the service names', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).toContain('Jellyfin')
      expect(wrapper.text()).toContain('Seerr')
      expect(wrapper.text()).toContain('Sonarr')
      expect(wrapper.text()).toContain('Radarr')
      expect(wrapper.text()).toContain('qBittorrent')
    })

    it('defaults every service to not configured', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards.every((card) => card.props('status') === 'not-configured')).toBe(true)
    })
  })

  describe('selection', () => {
    it('does not select a service by default', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards.every((card) => card.props('selected') === false)).toBe(true)
    })

    it('highlights the selected service', () => {
      const wrapper = createWrapper({
        modelValue: 'jellyfin',
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards[0]?.props('selected')).toBe(true)
      expect(cards[1]?.props('selected')).toBe(false)
    })

    it('emits the selected service ID when clicked', async () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAllComponents(MmServiceCard)

      await cards[2]!.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['sonarr'])
    })

    it('emits a new selection when another service is clicked', async () => {
      const wrapper = createWrapper({
        modelValue: 'jellyfin',
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      await cards[3]!.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['radarr'])
    })

    it('reacts when the selected service changes', async () => {
      const wrapper = createWrapper({
        modelValue: 'jellyfin',
      })

      await wrapper.setProps({
        modelValue: 'seerr',
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards[0]?.props('selected')).toBe(false)
      expect(cards[1]?.props('selected')).toBe(true)
    })

    it('does not change selection internally without a prop update', async () => {
      const wrapper = createWrapper({
        modelValue: 'jellyfin',
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      await cards[1]!.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['seerr'])

      // The parent still controls the selected value.
      expect(cards[0]?.props('selected')).toBe(true)
      expect(cards[1]?.props('selected')).toBe(false)
    })
  })

  describe('connection statuses', () => {
    it('passes configured statuses to the matching cards', () => {
      const wrapper = createWrapper({
        statuses: {
          jellyfin: 'connected',
          seerr: 'configured',
          radarr: 'failed',
        },
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards[0]?.props('status')).toBe('connected')
      expect(cards[1]?.props('status')).toBe('configured')
      expect(cards[2]?.props('status')).toBe('not-configured')
      expect(cards[3]?.props('status')).toBe('failed')
      expect(cards[4]?.props('status')).toBe('not-configured')
    })

    it('reacts when connection statuses change', async () => {
      const wrapper = createWrapper({
        statuses: {
          jellyfin: 'configured',
        },
      })

      await wrapper.setProps({
        statuses: {
          jellyfin: 'connected',
        },
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards[0]?.props('status')).toBe('connected')
    })

    it('resets unspecified statuses to not configured', async () => {
      const wrapper = createWrapper({
        statuses: {
          jellyfin: 'connected',
        },
      })

      await wrapper.setProps({
        statuses: {},
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards[0]?.props('status')).toBe('not-configured')
    })
  })

  describe('disabled state', () => {
    it('passes the disabled state to all service cards', () => {
      const wrapper = createWrapper({
        disabled: true,
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards.every((card) => card.props('disabled') === true)).toBe(true)
    })

    it('does not emit a selection when disabled', async () => {
      const wrapper = createWrapper({
        disabled: true,
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      await cards[0]!.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('reacts when disabled changes', async () => {
      const wrapper = createWrapper({
        disabled: true,
      })

      await wrapper.setProps({
        disabled: false,
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards.every((card) => card.props('disabled') === false)).toBe(true)
    })
  })
})
