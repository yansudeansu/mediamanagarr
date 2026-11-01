import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmSettingsTemplate from './MmSettingsTemplate.vue'

describe('MmSettingsTemplate', () => {
  function createWrapper() {
    return mount(MmSettingsTemplate, {
      slots: {
        navigation: `
          <nav data-testid="navigation" aria-label="Settings navigation">
            <button type="button">Connections</button>
            <button type="button">Workspace</button>
          </nav>
        `,
        default: `
          <section data-testid="content" aria-label="Settings content">
            <h2>Service Connections</h2>
            <p>Configure your services here.</p>
          </section>
        `,
      },
    })
  }

  it('renders the Settings layout', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.settings-template').exists()).toBe(true)
    expect(wrapper.find('.settings-template__content').exists()).toBe(true)
  })

  it('renders the navigation slot', () => {
    const wrapper = createWrapper()

    const navigation = wrapper.get('[data-testid="navigation"]')

    expect(navigation.text()).toContain('Connections')
    expect(navigation.text()).toContain('Workspace')
  })

  it('renders the default content slot', () => {
    const wrapper = createWrapper()

    const content = wrapper.get('[data-testid="content"]')

    expect(content.get('h2').text()).toBe('Service Connections')
    expect(content.text()).toContain('Configure your services here.')
  })

  it('places navigation above the content', () => {
    const wrapper = createWrapper()

    const navigation = wrapper.get('[data-testid="navigation"]').element
    const content = wrapper.get('[data-testid="content"]').element

    expect(
      navigation.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('renders navigation outside the content container', () => {
    const wrapper = createWrapper()

    const contentContainer = wrapper.get('.settings-template__content')

    expect(contentContainer.find('[data-testid="navigation"]').exists()).toBe(false)
    expect(contentContainer.find('[data-testid="content"]').exists()).toBe(true)
  })

  it('supports arbitrary content', () => {
    const wrapper = mount(MmSettingsTemplate, {
      slots: {
        default: `
          <div data-testid="custom-content">
            <label for="example">Example setting</label>
            <input id="example" type="text" />
          </div>
        `,
      },
    })

    expect(wrapper.find('[data-testid="custom-content"]').exists()).toBe(true)
    expect(wrapper.get('label').text()).toBe('Example setting')
    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('renders content without a navigation slot', () => {
    const wrapper = mount(MmSettingsTemplate, {
      slots: {
        default: '<p data-testid="content-only">Content without navigation</p>',
      },
    })

    expect(wrapper.get('[data-testid="content-only"]').text()).toBe('Content without navigation')

    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('renders navigation without content', () => {
    const wrapper = mount(MmSettingsTemplate, {
      slots: {
        navigation: '<nav aria-label="Settings navigation">Navigation only</nav>',
      },
    })

    expect(wrapper.get('nav').text()).toBe('Navigation only')
    expect(wrapper.get('.settings-template__content').text()).toBe('')
  })

  it('renders without any slots', () => {
    const wrapper = mount(MmSettingsTemplate)

    expect(wrapper.find('.settings-template').exists()).toBe(true)
    expect(wrapper.find('.settings-template__content').exists()).toBe(true)
    expect(wrapper.text()).toBe('')
  })

  it('does not introduce application-specific headings', () => {
    const wrapper = mount(MmSettingsTemplate)

    expect(wrapper.find('h1, h2, h3').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Service Connections')
    expect(wrapper.text()).not.toContain('Workspace')
  })
})
