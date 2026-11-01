import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmHeader from './MmHeader.vue'

function mountHeader(
  props: {
    title?: string
    logo?: string | null
  } = {},
  slots: Record<string, string> = {},
) {
  return mount(MmHeader, {
    props: {
      title: 'Example App',
      ...props,
    },
    slots,
  })
}

describe('MmHeader', () => {
  describe('structure and title', () => {
    it('renders a semantic header element', () => {
      const wrapper = mountHeader()

      expect(wrapper.element.tagName).toBe('HEADER')
    })

    it('renders the supplied title', () => {
      const wrapper = mountHeader({
        title: 'Example App',
      })

      expect(wrapper.get('h1').text()).toBe('Example App')
    })

    it('renders a different title', () => {
      const wrapper = mountHeader({
        title: 'Preferences',
      })

      expect(wrapper.get('h1').text()).toBe('Preferences')
    })

    it('updates the title when the prop changes', async () => {
      const wrapper = mountHeader()

      await wrapper.setProps({
        title: 'Preferences',
      })

      expect(wrapper.get('h1').text()).toBe('Preferences')
    })

    it('renders the branding container', () => {
      const wrapper = mountHeader()

      expect(wrapper.find('.header__branding').exists()).toBe(true)
    })
  })

  describe('logo', () => {
    it('does not render a logo by default', () => {
      const wrapper = mountHeader()

      expect(wrapper.find('.header__logo').exists()).toBe(false)
    })

    it('renders the supplied logo', () => {
      const wrapper = mountHeader({
        logo: '/example-logo.svg',
      })

      const logo = wrapper.get('.header__logo')

      expect(logo.element.tagName).toBe('IMG')
      expect(logo.attributes('src')).toBe('/example-logo.svg')
      expect(logo.attributes('width')).toBe('28')
      expect(logo.attributes('height')).toBe('28')
    })

    it('treats the logo as decorative', () => {
      const wrapper = mountHeader({
        logo: '/example-logo.svg',
      })

      expect(wrapper.get('.header__logo').attributes('alt')).toBe('')
    })

    it('does not render a logo when null is supplied', () => {
      const wrapper = mountHeader({
        logo: null,
      })

      expect(wrapper.find('.header__logo').exists()).toBe(false)
    })

    it('renders the logo before the title', () => {
      const wrapper = mountHeader({
        logo: '/example-logo.svg',
      })

      const branding = wrapper.get('.header__branding').element as HTMLElement
      const children = Array.from(branding.children)

      expect(children).toHaveLength(2)
      expect(children[0]?.tagName).toBe('IMG')
      expect(children[1]?.tagName).toBe('H1')
    })

    it('updates the logo when the prop changes', async () => {
      const wrapper = mountHeader({
        logo: '/first-logo.svg',
      })

      await wrapper.setProps({
        logo: '/second-logo.svg',
      })

      expect(wrapper.get('.header__logo').attributes('src')).toBe('/second-logo.svg')
    })

    it('removes the logo when the prop becomes null', async () => {
      const wrapper = mountHeader({
        logo: '/example-logo.svg',
      })

      await wrapper.setProps({
        logo: null,
      })

      expect(wrapper.find('.header__logo').exists()).toBe(false)
    })

    it('adds the logo when the prop becomes available', async () => {
      const wrapper = mountHeader()

      await wrapper.setProps({
        logo: '/example-logo.svg',
      })

      expect(wrapper.get('.header__logo').attributes('src')).toBe('/example-logo.svg')
    })
  })

  describe('actions slot', () => {
    it('does not render an actions container without the slot', () => {
      const wrapper = mountHeader()

      expect(wrapper.find('.header__actions').exists()).toBe(false)
    })

    it('renders the actions slot when supplied', () => {
      const wrapper = mountHeader(
        {},
        {
          actions: '<button type="button">Open menu</button>',
        },
      )

      expect(wrapper.find('.header__actions').exists()).toBe(true)
      expect(wrapper.get('.header__actions button').text()).toBe('Open menu')
    })

    it('supports multiple actions', () => {
      const wrapper = mountHeader(
        {},
        {
          actions: `
          <button type="button">Search</button>
          <button type="button">Settings</button>
        `,
        },
      )

      expect(wrapper.findAll('.header__actions button')).toHaveLength(2)
    })

    it('renders branding before the actions', () => {
      const wrapper = mountHeader(
        {},
        {
          actions: '<button type="button">Settings</button>',
        },
      )

      const header = wrapper.element as HTMLElement
      const children = Array.from(header.children)

      expect(children).toHaveLength(2)
      expect(children[0]?.classList.contains('header__branding')).toBe(true)
      expect(children[1]?.classList.contains('header__actions')).toBe(true)
    })

    it('does not emit application-specific navigation events', async () => {
      const wrapper = mountHeader(
        {},
        {
          actions: '<button type="button">Settings</button>',
        },
      )

      await wrapper.get('.header__actions button').trigger('click')

      expect(wrapper.emitted('settings')).toBeUndefined()
      expect(wrapper.emitted('back')).toBeUndefined()
    })
  })
})
