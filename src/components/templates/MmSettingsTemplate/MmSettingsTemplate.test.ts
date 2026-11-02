import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmSettingsTemplate from './MmSettingsTemplate.vue'
import { mmSettingsTemplateSelectors } from '../../../test/selectors/templates/mmSettingsTemplate.selectors'

let wrapper: VueWrapper

const template = mmSettingsTemplateSelectors((selector) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(
    selector.replace(/^\.settings-template\s*>\s*/, '').replace(/^\.settings-template /, ''),
  )
})

function createWrapper() {
  wrapper = mount(MmSettingsTemplate, {
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
  return wrapper
}

describe('MmSettingsTemplate', () => {
  it('renders the Settings layout', () => {
    createWrapper()

    expect(template.get().exists()).toBe(true)
    expect(template.content().exists()).toBe(true)
  })

  it('renders the navigation slot', () => {
    createWrapper()

    expect(template.labelledNavigation('Settings navigation').text()).toContain('Connections')
    expect(template.labelledNavigation('Settings navigation').text()).toContain('Workspace')
  })

  it('renders the default content slot', () => {
    createWrapper()

    const content = template.labelledSection('Settings content')

    expect(content.find('h2').text()).toBe('Service Connections')
    expect(content.text()).toContain('Configure your services here.')
  })

  it('places navigation above the content', () => {
    createWrapper()

    const navigation = template.navigation().element
    const content = template.content().element

    expect(
      navigation.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('renders navigation outside the content container', () => {
    createWrapper()

    expect(template.content().find('nav').exists()).toBe(false)
    expect(template.labelledSection('Settings content').exists()).toBe(true)
  })

  it('supports arbitrary content', () => {
    wrapper = mount(MmSettingsTemplate, {
      slots: {
        default: `
          <div data-testid="custom-content">
            <label for="example">Example setting</label>
            <input id="example" type="text" />
          </div>
        `,
      },
    })

    expect(template.content().find('[data-testid="custom-content"]').exists()).toBe(true)
    expect(template.labels().text()).toBe('Example setting')
    expect(template.inputs().attributes('type')).toBe('text')
  })

  it('renders content without a navigation slot', () => {
    wrapper = mount(MmSettingsTemplate, {
      slots: {
        default: '<p data-testid="content-only">Content without navigation</p>',
      },
    })

    expect(template.content().text()).toBe('Content without navigation')
    expect(template.navigation().exists()).toBe(false)
  })

  it('renders navigation without content', () => {
    wrapper = mount(MmSettingsTemplate, {
      slots: {
        navigation: '<nav aria-label="Settings navigation">Navigation only</nav>',
      },
    })

    expect(template.labelledNavigation('Settings navigation').text()).toBe('Navigation only')
    expect(template.content().text()).toBe('')
  })

  it('renders without any slots', () => {
    wrapper = mount(MmSettingsTemplate)

    expect(template.get().exists()).toBe(true)
    expect(template.content().exists()).toBe(true)
    expect(template.get().text()).toBe('')
  })

  it('does not introduce application-specific headings', () => {
    wrapper = mount(MmSettingsTemplate)

    expect(template.headings().exists()).toBe(false)
    expect(template.get().text()).not.toContain('Service Connections')
    expect(template.get().text()).not.toContain('Workspace')
  })
})
