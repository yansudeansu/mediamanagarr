import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmFooter from './MmFooter.vue'

describe('MmFooter', () => {
  it('renders a semantic footer element', () => {
    const wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
      },
    })

    expect(wrapper.element.tagName).toBe('FOOTER')
  })

  it('displays the provided brand', () => {
    const wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
      },
    })

    expect(wrapper.get('.footer__brand').text()).toBe('Example App')
  })

  it('reacts when the brand changes', async () => {
    const wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
      },
    })

    expect(wrapper.get('.footer__brand').text()).toBe('Example App')

    await wrapper.setProps({
      brand: 'Another App',
    })

    expect(wrapper.get('.footer__brand').text()).toBe('Another App')
  })

  it('does not display a version by default', () => {
    const wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
      },
    })

    expect(wrapper.find('.footer__version').exists()).toBe(false)
  })

  it('displays the provided version', () => {
    const wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
        version: '0.1.0',
      },
    })

    expect(wrapper.get('.footer__version').text()).toBe('v0.1.0')
  })

  it('does not display an empty version', () => {
    const wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
        version: '',
      },
    })

    expect(wrapper.find('.footer__version').exists()).toBe(false)
  })

  it('supports prerelease versions', () => {
    const wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
        version: '1.0.0-beta.2',
      },
    })

    expect(wrapper.get('.footer__version').text()).toBe('v1.0.0-beta.2')
  })

  it('reacts when the version changes', async () => {
    const wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
        version: '0.1.0',
      },
    })

    expect(wrapper.get('.footer__version').text()).toBe('v0.1.0')

    await wrapper.setProps({
      version: '0.2.0',
    })

    expect(wrapper.get('.footer__version').text()).toBe('v0.2.0')
  })

  it('hides the version when it becomes empty', async () => {
    const wrapper = mount(MmFooter, {
      props: {
        brand: 'Example App',
        version: '0.1.0',
      },
    })

    await wrapper.setProps({
      version: '',
    })

    expect(wrapper.find('.footer__version').exists()).toBe(false)
  })
})
