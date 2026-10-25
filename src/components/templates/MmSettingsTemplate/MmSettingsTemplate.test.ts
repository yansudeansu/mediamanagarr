import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmSettingsTemplate from './MmSettingsTemplate.vue'

describe('MmSettingsTemplate', () => {
  function createWrapper() {
    return mount(MmSettingsTemplate, {
      slots: {
        selector: '<div data-testid="selector">Service selector</div>',
        configuration: '<div data-testid="configuration">Service configuration</div>',
      },
    })
  }

  it('renders the Settings layout', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.settings-template').exists()).toBe(true)
  })

  it('renders the Service Connections heading', () => {
    const wrapper = createWrapper()

    expect(wrapper.get('h2').text()).toBe('Service Connections')
  })

  it('renders the selector slot', () => {
    const wrapper = createWrapper()

    expect(wrapper.get('[data-testid="selector"]').text()).toBe('Service selector')
  })

  it('renders the configuration slot', () => {
    const wrapper = createWrapper()

    expect(wrapper.get('[data-testid="configuration"]').text()).toBe('Service configuration')
  })

  it('places the selector above the configuration panel', () => {
    const wrapper = createWrapper()

    const selector = wrapper.get('[data-testid="selector"]').element
    const configuration = wrapper.get('[data-testid="configuration"]').element

    expect(
      selector.compareDocumentPosition(configuration) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('groups the selector under the Service Connections heading', () => {
    const wrapper = createWrapper()

    const section = wrapper.get('section')

    expect(section.attributes('aria-labelledby')).toBe('service-connections-title')
    expect(section.find('[data-testid="selector"]').exists()).toBe(true)
  })

  it('renders without optional slot content', () => {
    const wrapper = mount(MmSettingsTemplate)

    expect(wrapper.get('h2').text()).toBe('Service Connections')
    expect(wrapper.find('[data-testid="selector"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="configuration"]').exists()).toBe(false)
  })
})
