import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmServiceSelector from './MmServiceSelector.vue'
import MmServiceCard from '../../molecules/MmServiceCard/MmServiceCard.vue'

const exampleServices = [
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    status: 'not-configured',
  },
  {
    id: 'seerr',
    name: 'Seerr',
    status: 'not-configured',
  },
  {
    id: 'sonarr',
    name: 'Sonarr',
    status: 'not-configured',
  },
  {
    id: 'radarr',
    name: 'Radarr',
    status: 'not-configured',
  },
  {
    id: 'qbittorrent',
    name: 'qBittorrent',
    status: 'not-configured',
  },
] as const

type SelectorProps = Partial<InstanceType<typeof MmServiceSelector>['$props']>

function createWrapper(props: SelectorProps = {}) {
  return mount(MmServiceSelector, {
    props: {
      services: exampleServices.map((service) => ({ ...service })),
      ...props,
    },
  })
}

describe('MmServiceSelector', () => {
  describe('rendering', () => {
    it('renders all five provided services', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards).toHaveLength(5)
    })

    it('renders services in the provided order', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards.map((card) => card.props('name'))).toEqual(
        exampleServices.map((service) => service.name),
      )
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

    it('defaults to an empty list when no services are provided', () => {
      const wrapper = mount(MmServiceSelector)

      expect(wrapper.findAllComponents(MmServiceCard)).toHaveLength(0)
      expect(wrapper.find('[role="group"]').exists()).toBe(true)
    })

    it('passes the provided not-configured status to every card', () => {
      const wrapper = createWrapper()

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards.every((card) => card.props('status') === 'not-configured')).toBe(true)
    })

    it('supports a custom list of services', () => {
      const wrapper = createWrapper({
        services: [
          {
            id: 'alpha',
            name: 'Alpha Server',
            status: 'connected',
          },
          {
            id: 'beta',
            name: 'Beta Server',
            status: 'failed',
          },
        ],
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards).toHaveLength(2)
      expect(cards[0]?.props('name')).toBe('Alpha Server')
      expect(cards[1]?.props('name')).toBe('Beta Server')
    })

    it('reacts when the service list changes', async () => {
      const wrapper = createWrapper()

      await wrapper.setProps({
        services: [
          {
            id: 'new-service',
            name: 'New Service',
            status: 'configured',
          },
        ],
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards).toHaveLength(1)
      expect(cards[0]?.props('name')).toBe('New Service')
      expect(cards[0]?.props('status')).toBe('configured')
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

    it('supports arbitrary string IDs', async () => {
      const wrapper = createWrapper({
        services: [
          {
            id: 'custom-provider',
            name: 'Custom Provider',
            status: 'connected',
          },
        ],
        modelValue: 'custom-provider',
      })

      const card = wrapper.getComponent(MmServiceCard)

      expect(card.props('selected')).toBe(true)

      await card.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['custom-provider'])
    })
  })

  describe('connection statuses', () => {
    it('passes each service status to the matching card', () => {
      const wrapper = createWrapper({
        services: [
          { id: 'jellyfin', name: 'Jellyfin', status: 'connected' },
          { id: 'seerr', name: 'Seerr', status: 'configured' },
          { id: 'sonarr', name: 'Sonarr', status: 'not-configured' },
          { id: 'radarr', name: 'Radarr', status: 'failed' },
          {
            id: 'qbittorrent',
            name: 'qBittorrent',
            status: 'not-configured',
          },
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
      const wrapper = createWrapper({
        services: [
          {
            id: 'jellyfin',
            name: 'Jellyfin',
            status: 'configured',
          },
        ],
      })

      await wrapper.setProps({
        services: [
          {
            id: 'jellyfin',
            name: 'Jellyfin',
            status: 'connected',
          },
        ],
      })

      const cards = wrapper.findAllComponents(MmServiceCard)

      expect(cards[0]?.props('status')).toBe('connected')
    })

    it('renders the statuses supplied by the parent', async () => {
      const wrapper = createWrapper({
        services: [
          {
            id: 'jellyfin',
            name: 'Jellyfin',
            status: 'connected',
          },
        ],
      })

      await wrapper.setProps({
        services: [
          {
            id: 'jellyfin',
            name: 'Jellyfin',
            status: 'not-configured',
          },
        ],
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
