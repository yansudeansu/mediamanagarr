import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmHeader from './MmHeader.vue'
import { mmHeaderSelectors } from '../../../test/selectors/atoms/mmHeader.selectors'

let wrapper: VueWrapper

const header = mmHeaderSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^header\.header /, ''))
})

function mountHeader(
  props: {
    title?: string
    logo?: string | null
  } = {},
  slots: Record<string, string> = {},
) {
  wrapper = mount(MmHeader, {
    props: {
      title: 'Example App',
      ...props,
    },
    slots,
  })

  return wrapper
}

describe('MmHeader', () => {
  describe('structure and title', () => {
    it('renders a semantic header element', () => {
      mountHeader()

      expect(header.get().element.tagName).toBe('HEADER')
    })

    it('renders the supplied title', () => {
      mountHeader({ title: 'Example App' })

      expect(header.title().text()).toBe('Example App')
    })

    it('renders a different title', () => {
      mountHeader({ title: 'Preferences' })

      expect(header.title().text()).toBe('Preferences')
    })

    it('updates the title when the prop changes', async () => {
      mountHeader()

      await wrapper.setProps({ title: 'Preferences' })

      expect(header.title().text()).toBe('Preferences')
    })

    it('renders the branding container', () => {
      mountHeader()

      expect(header.branding().exists()).toBe(true)
    })
  })

  describe('logo', () => {
    it('does not render a logo by default', () => {
      mountHeader()

      expect(header.logo().exists()).toBe(false)
    })

    it('renders the supplied logo', () => {
      mountHeader({ logo: '/example-logo.svg' })

      const logo = header.logo()

      expect(logo.element.tagName).toBe('IMG')
      expect(logo.attributes('src')).toBe('/example-logo.svg')
      expect(logo.attributes('width')).toBe('28')
      expect(logo.attributes('height')).toBe('28')
    })

    it('treats the logo as decorative', () => {
      mountHeader({ logo: '/example-logo.svg' })

      expect(header.logo().attributes('alt')).toBe('')
    })

    it('does not render a logo when null is supplied', () => {
      mountHeader({ logo: null })

      expect(header.logo().exists()).toBe(false)
    })

    it('renders the logo before the title', () => {
      mountHeader({ logo: '/example-logo.svg' })

      const branding = header.branding().element as HTMLElement
      const children = Array.from(branding.children)

      expect(children).toHaveLength(2)
      expect(children[0]?.tagName).toBe('IMG')
      expect(children[1]?.tagName).toBe('H1')
    })

    it('updates the logo when the prop changes', async () => {
      mountHeader({ logo: '/first-logo.svg' })

      await wrapper.setProps({ logo: '/second-logo.svg' })

      expect(header.logo().attributes('src')).toBe('/second-logo.svg')
    })

    it('removes the logo when the prop becomes null', async () => {
      mountHeader({ logo: '/example-logo.svg' })

      await wrapper.setProps({ logo: null })

      expect(header.logo().exists()).toBe(false)
    })

    it('adds the logo when the prop becomes available', async () => {
      mountHeader()

      await wrapper.setProps({ logo: '/example-logo.svg' })

      expect(header.logo().attributes('src')).toBe('/example-logo.svg')
    })
  })

  describe('actions slot', () => {
    it('does not render an actions container without the slot', () => {
      mountHeader()

      expect(header.actions().exists()).toBe(false)
    })

    it('renders the actions slot when supplied', () => {
      mountHeader(
        {},
        {
          actions: '<button type="button">Open menu</button>',
        },
      )

      expect(header.actions().exists()).toBe(true)
      expect(header.actionButtons().text()).toBe('Open menu')
    })

    it('supports multiple actions', () => {
      mountHeader(
        {},
        {
          actions: `
          <button type="button">Search</button>
          <button type="button">Settings</button>
        `,
        },
      )

      expect(header.actions().findAll('button')).toHaveLength(2)
    })

    it('renders branding before the actions', () => {
      mountHeader(
        {},
        {
          actions: '<button type="button">Settings</button>',
        },
      )

      const children = Array.from((header.get().element as HTMLElement).children)

      expect(children).toHaveLength(2)
      expect(children[0]?.classList.contains('header__branding')).toBe(true)
      expect(children[1]?.classList.contains('header__actions')).toBe(true)
    })

    it('does not emit application-specific navigation events', async () => {
      mountHeader(
        {},
        {
          actions: '<button type="button">Settings</button>',
        },
      )

      await header.actionButtons().trigger('click')

      expect(wrapper.emitted('settings')).toBeUndefined()
      expect(wrapper.emitted('back')).toBeUndefined()
    })
  })
})
