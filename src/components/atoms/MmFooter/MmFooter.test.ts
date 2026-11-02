import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmFooter from './MmFooter.vue'
import { mmFooterSelectors } from '../../../test/selectors/atoms/mmFooter.selectors'

let wrapper: VueWrapper

const footer = mmFooterSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector)
})

describe('MmFooter', () => {
  it('renders a semantic footer element', () => {
    wrapper = mount(MmFooter, {
      props: { brand: 'Example App' },
    })

    expect(footer.get().element.tagName).toBe('FOOTER')
  })

  it('displays the provided brand', () => {
    wrapper = mount(MmFooter, {
      props: { brand: 'Example App' },
    })

    expect(footer.brand().text()).toBe('Example App')
  })

  it('reacts when the brand changes', async () => {
    wrapper = mount(MmFooter, {
      props: { brand: 'Example App' },
    })

    expect(footer.brand().text()).toBe('Example App')

    await wrapper.setProps({ brand: 'Another App' })

    expect(footer.brand().text()).toBe('Another App')
  })

  it('does not display a version by default', () => {
    wrapper = mount(MmFooter, {
      props: { brand: 'Example App' },
    })

    expect(footer.version().exists()).toBe(false)
  })

  it('displays the provided version', () => {
    wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
        version: '0.1.0',
      },
    })

    expect(footer.version().text()).toBe('v0.1.0')
  })

  it('does not display an empty version', () => {
    wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
        version: '',
      },
    })

    expect(footer.version().exists()).toBe(false)
  })

  it('supports prerelease versions', () => {
    wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
        version: '1.0.0-beta.2',
      },
    })

    expect(footer.version().text()).toBe('v1.0.0-beta.2')
  })

  it('reacts when the version changes', async () => {
    wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
        version: '0.1.0',
      },
    })

    expect(footer.version().text()).toBe('v0.1.0')

    await wrapper.setProps({ version: '0.2.0' })

    expect(footer.version().text()).toBe('v0.2.0')
  })

  it('hides the version when it becomes empty', async () => {
    wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
        version: '0.1.0',
      },
    })

    await wrapper.setProps({ version: '' })

    expect(footer.version().exists()).toBe(false)
  })
})
