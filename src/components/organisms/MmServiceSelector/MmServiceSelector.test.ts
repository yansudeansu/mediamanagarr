import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmServiceSelector from './MmServiceSelector.vue'
import MmServiceCard from '../../molecules/MmServiceCard/MmServiceCard.vue'
import { mmServiceSelectorSelectors } from '../../../test/selectors/organisms/mmServiceSelector.selectors'

const exampleServices = [
  { id: 'jellyfin', name: 'Jellyfin', status: 'not-configured' },
  { id: 'seerr', name: 'Seerr', status: 'not-configured' },
  { id: 'sonarr', name: 'Sonarr', status: 'not-configured' },
  { id: 'radarr', name: 'Radarr', status: 'not-configured' },
  { id: 'qbittorrent', name: 'qBittorrent', status: 'not-configured' },
] as const

type SelectorProps = Partial<InstanceType<typeof MmServiceSelector>['$props']>

let wrapper: VueWrapper

const query = (selector: string) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.service-selector /, ''))
}

const selector = mmServiceSelectorSelectors(query)

function createWrapper(props: SelectorProps = {}) {
  wrapper = mount(MmServiceSelector, {
    props: {
      services: exampleServices.map((service) => ({ ...service })),
      ...props,
    },
  })
  return wrapper
}

describe('MmServiceSelector', () => {
  describe('rendering', () => {
    it('renders all five provided services', () => {
      createWrapper()

      expect(selector.cards().exists()).toBe(true)
      expect(wrapper.findAllComponents(MmServiceCard)).toHaveLength(5)
    })

    it('renders services in the provided order', () => {
      createWrapper()

      expect(wrapper.findAllComponents(MmServiceCard).map((item) => item.props('name'))).toEqual(
        exampleServices.map((service) => service.name),
      )
      expect(selector.name(0).text()).toBe('Jellyfin')
      expect(selector.name(4).text()).toBe('qBittorrent')
    })

    it('renders a grouped service list', () => {
      createWrapper()

      expect(selector.labelled('Service connections').exists()).toBe(true)
      expect(selector.group().attributes('aria-label')).toBe('Service connections')
    })

    it('renders the service names', () => {
      createWrapper()

      expect(selector.name(0).text()).toBe('Jellyfin')
      expect(selector.name(1).text()).toBe('Seerr')
      expect(selector.name(2).text()).toBe('Sonarr')
      expect(selector.name(3).text()).toBe('Radarr')
      expect(selector.name(4).text()).toBe('qBittorrent')
    })

    it('defaults to an empty list when no services are provided', () => {
      wrapper = mount(MmServiceSelector)

      expect(selector.cards().exists()).toBe(false)
      expect(selector.group().exists()).toBe(true)
      expect(wrapper.findAllComponents(MmServiceCard)).toHaveLength(0)
    })

    it('passes the provided not-configured status to every card', () => {
      createWrapper()

      expect(
        wrapper
          .findAllComponents(MmServiceCard)
          .every((item) => item.props('status') === 'not-configured'),
      ).toBe(true)
    })

    it('supports a custom list of services', () => {
      createWrapper({
        services: [
          { id: 'alpha', name: 'Alpha Server', status: 'connected' },
          { id: 'beta', name: 'Beta Server', status: 'failed' },
        ],
      })

      expect(wrapper.findAllComponents(MmServiceCard)).toHaveLength(2)
      expect(selector.name(0).text()).toBe('Alpha Server')
      expect(selector.name(1).text()).toBe('Beta Server')
    })

    it('reacts when the service list changes', async () => {
      createWrapper()

      await wrapper.setProps({
        services: [{ id: 'new-service', name: 'New Service', status: 'configured' }],
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards).toHaveLength(1)
      expect(selector.name(0).text()).toBe('New Service')
      expect(cards[0]?.props('status')).toBe('configured')
    })
  })

  describe('selection', () => {
    it('does not select a service by default', () => {
      createWrapper()

      expect(selector.selected().exists()).toBe(false)
      expect(
        wrapper.findAllComponents(MmServiceCard).every((item) => item.props('selected') === false),
      ).toBe(true)
    })

    it('highlights the selected service', () => {
      createWrapper({ modelValue: 'jellyfin' })

      expect(selector.selected().exists()).toBe(true)
      expect(selector.selected().text()).toContain('Jellyfin')
      expect(wrapper.findAllComponents(MmServiceCard)[0]?.props('selected')).toBe(true)
      expect(wrapper.findAllComponents(MmServiceCard)[1]?.props('selected')).toBe(false)
    })

    it('emits the selected service ID when clicked', async () => {
      createWrapper()

      await selector.card(2).trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['sonarr'])
    })

    it('emits a new selection when another service is clicked', async () => {
      createWrapper({ modelValue: 'jellyfin' })

      await selector.card(3).trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['radarr'])
    })

    it('reacts when the selected service changes', async () => {
      createWrapper({ modelValue: 'jellyfin' })

      await wrapper.setProps({ modelValue: 'seerr' })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards[0]?.props('selected')).toBe(false)
      expect(cards[1]?.props('selected')).toBe(true)
      expect(selector.selected().text()).toContain('Seerr')
    })

    it('does not change selection internally without a prop update', async () => {
      createWrapper({ modelValue: 'jellyfin' })

      await selector.card(1).trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['seerr'])

      // The parent still controls the selected value.
      expect(selector.selected().text()).toContain('Jellyfin')
      expect(wrapper.findAllComponents(MmServiceCard)[0]?.props('selected')).toBe(true)
      expect(wrapper.findAllComponents(MmServiceCard)[1]?.props('selected')).toBe(false)
    })

    it('supports arbitrary string IDs', async () => {
      createWrapper({
        services: [{ id: 'custom-provider', name: 'Custom Provider', status: 'connected' }],
        modelValue: 'custom-provider',
      })

      expect(wrapper.getComponent(MmServiceCard).props('selected')).toBe(true)
      expect(selector.selected().text()).toContain('Custom Provider')

      await selector.card(0).trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['custom-provider'])
    })
  })

  describe('connection statuses', () => {
    it('passes each service status to the matching card', () => {
      createWrapper({
        services: [
          { id: 'jellyfin', name: 'Jellyfin', status: 'connected' },
          { id: 'seerr', name: 'Seerr', status: 'configured' },
          { id: 'sonarr', name: 'Sonarr', status: 'not-configured' },
          { id: 'radarr', name: 'Radarr', status: 'failed' },
          { id: 'qbittorrent', name: 'qBittorrent', status: 'not-configured' },
        ],
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards[0]?.props('status')).toBe('connected')
      expect(cards[1]?.props('status')).toBe('configured')
      expect(cards[2]?.props('status')).toBe('not-configured')
      expect(cards[3]?.props('status')).toBe('failed')
      expect(cards[4]?.props('status')).toBe('not-configured')
    })

    it('reacts when connection statuses change', async () => {
      createWrapper({
        services: [{ id: 'jellyfin', name: 'Jellyfin', status: 'configured' }],
      })

      await wrapper.setProps({
        services: [{ id: 'jellyfin', name: 'Jellyfin', status: 'connected' }],
      })

      expect(wrapper.getComponent(MmServiceCard).props('status')).toBe('connected')
    })

    it('renders the statuses supplied by the parent', async () => {
      createWrapper({
        services: [{ id: 'jellyfin', name: 'Jellyfin', status: 'connected' }],
      })

      await wrapper.setProps({
        services: [{ id: 'jellyfin', name: 'Jellyfin', status: 'not-configured' }],
      })

      expect(wrapper.getComponent(MmServiceCard).props('status')).toBe('not-configured')
    })
  })

  describe('disabled state', () => {
    it('passes the disabled state to all service cards', () => {
      createWrapper({ disabled: true })

      expect(selector.enabled().exists()).toBe(false)
      expect(selector.disabled().exists()).toBe(true)
      expect(
        wrapper.findAllComponents(MmServiceCard).every((item) => item.props('disabled') === true),
      ).toBe(true)
    })

    it('does not emit a selection when disabled', async () => {
      createWrapper({ disabled: true })

      await selector.card(0).trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('reacts when disabled changes', async () => {
      createWrapper({ disabled: true })

      await wrapper.setProps({ disabled: false })

      expect(selector.disabled().exists()).toBe(false)
      expect(selector.enabled().exists()).toBe(true)
      expect(
        wrapper.findAllComponents(MmServiceCard).every((item) => item.props('disabled') === false),
      ).toBe(true)
    })
  })
})
