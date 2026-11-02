import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import MmQuickAccess from './MmQuickAccess.vue'
import type { QuickAccessItem } from './MmQuickAccess.vue'
import { mmQuickAccessSelectors } from '../../../test/selectors/molecules/mmQuickAccess.selectors'

const defaultItems: QuickAccessItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: 'https://example.com/dashboard',
  },
  {
    id: 'reports',
    label: 'Reports',
    href: 'https://example.com:5055/reports',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    href: 'https://docs.example.com/guide',
  },
]

let wrapper: VueWrapper

const menu = mmQuickAccessSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.quick-access /, ''))
})

function mountMenu(items: QuickAccessItem[] = defaultItems) {
  wrapper = mount(MmQuickAccess, {
    props: { items },
    attachTo: document.body,
  })
  return wrapper
}

async function openMenu(): Promise<void> {
  await menu.trigger().trigger('click')
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('MmQuickAccess', () => {
  describe('trigger', () => {
    it('renders an accessible menu trigger', () => {
      mountMenu()

      expect(menu.trigger().attributes('type')).toBe('button')
      expect(menu.trigger().attributes('aria-expanded')).toBe('false')
      expect(menu.trigger().attributes('aria-controls')).toBeUndefined()
      expect(menu.triggerIcon().exists()).toBe(true)

      wrapper.unmount()
    })

    it('starts with the menu closed', () => {
      mountMenu()

      expect(menu.menu().exists()).toBe(false)

      wrapper.unmount()
    })

    it('opens when the trigger is clicked', async () => {
      mountMenu()

      await openMenu()

      expect(menu.menu().isVisible()).toBe(true)
      expect(menu.opened().exists()).toBe(true)
      expect(menu.trigger().attributes('aria-expanded')).toBe('true')
      expect(menu.trigger().attributes('aria-controls')).toBe('quick-access-menu')

      wrapper.unmount()
    })

    it('closes when the trigger is clicked again', async () => {
      mountMenu()

      await openMenu()
      await menu.trigger().trigger('click')

      expect(menu.menu().exists()).toBe(false)
      expect(menu.closed().exists()).toBe(true)
      expect(menu.trigger().attributes('aria-controls')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('items', () => {
    it('displays the supplied links in order', async () => {
      mountMenu()

      await openMenu()

      expect(wrapper.findAll('.quick-access__services a')).toHaveLength(3)
      expect(menu.link(0).text()).toBe('Dashboard')
      expect(menu.link(1).text()).toBe('Reports')
      expect(menu.link(2).text()).toBe('Documentation')

      wrapper.unmount()
    })

    it('displays only the items supplied by the parent', async () => {
      mountMenu([defaultItems[0]!])

      await openMenu()

      expect(menu.linkNamed('Dashboard').exists()).toBe(true)
      expect(menu.linkNamed('Reports').exists()).toBe(false)
      expect(menu.linkNamed('Documentation').exists()).toBe(false)

      wrapper.unmount()
    })

    it('shows an empty state when no links are supplied', async () => {
      mountMenu([])

      await openMenu()

      expect(menu.empty().text()).toBe('No links available')
      expect(menu.links().exists()).toBe(false)
      expect(menu.settings().text()).toBe('Settings')

      wrapper.unmount()
    })

    it('preserves the supplied link URLs', async () => {
      mountMenu()

      await openMenu()

      expect(menu.link(0).attributes('href')).toBe('https://example.com/dashboard')
      expect(menu.link(1).attributes('href')).toBe('https://example.com:5055/reports')
      expect(menu.link(2).attributes('href')).toBe('https://docs.example.com/guide')

      wrapper.unmount()
    })

    it('opens links in new tabs safely', async () => {
      mountMenu()

      await openMenu()

      for (const link of wrapper.findAll('.quick-access__services a')) {
        expect(link.attributes('target')).toBe('_blank')
        expect(link.attributes('rel')).toBe('noopener noreferrer')
        expect(link.attributes('aria-label')).toMatch(/^Open .+ in a new tab$/)
      }

      wrapper.unmount()
    })

    it('renders an external-link icon for every item', async () => {
      mountMenu()

      await openMenu()

      for (const link of wrapper.findAll('.quick-access__services a')) {
        expect(link.findAll('svg')).toHaveLength(1)
        expect(link.get('svg').attributes('aria-hidden')).toBe('true')
      }

      expect(menu.decorativeIcons().exists()).toBe(true)

      wrapper.unmount()
    })

    it('updates when the items prop changes', async () => {
      mountMenu([])

      await openMenu()

      expect(menu.links().exists()).toBe(false)

      await wrapper.setProps({ items: [defaultItems[0]!] })

      expect(menu.link(0).exists()).toBe(true)
      expect(menu.link(1).exists()).toBe(false)
      expect(menu.link(0).text()).toBe('Dashboard')
      expect(menu.empty().exists()).toBe(false)

      wrapper.unmount()
    })
  })

  describe('interactions', () => {
    it('moves focus to the first link when opened', async () => {
      mountMenu()

      await openMenu()

      expect(document.activeElement).toBe(menu.link(0).element)

      wrapper.unmount()
    })

    it('moves focus to Settings when there are no links', async () => {
      mountMenu([])

      await openMenu()

      expect(document.activeElement).toBe(menu.settings().element)

      wrapper.unmount()
    })

    it('closes when Escape is pressed and restores trigger focus', async () => {
      mountMenu()

      await openMenu()

      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
        }),
      )

      await nextTick()

      expect(menu.menu().exists()).toBe(false)
      expect(document.activeElement).toBe(menu.trigger().element)

      wrapper.unmount()
    })

    it('closes when clicking outside', async () => {
      mountMenu()

      await openMenu()

      document.body.dispatchEvent(
        new Event('pointerdown', {
          bubbles: true,
        }),
      )

      await nextTick()

      expect(menu.menu().exists()).toBe(false)

      wrapper.unmount()
    })

    it('does not close when clicking inside the menu', async () => {
      mountMenu()

      await openMenu()

      menu.heading().element.dispatchEvent(
        new Event('pointerdown', {
          bubbles: true,
        }),
      )

      await nextTick()

      expect(menu.menu().exists()).toBe(true)

      wrapper.unmount()
    })

    it('closes when a link is selected', async () => {
      mountMenu()

      await openMenu()
      await menu.link(0).trigger('click')

      expect(menu.menu().exists()).toBe(false)

      wrapper.unmount()
    })

    it('emits settings and closes when Settings is selected', async () => {
      mountMenu()

      await openMenu()
      await menu.settings().trigger('click')

      expect(wrapper.emitted('settings')).toHaveLength(1)
      expect(menu.menu().exists()).toBe(false)

      wrapper.unmount()
    })

    it('does not emit settings when opening or closing the menu', async () => {
      mountMenu()

      await openMenu()
      await menu.trigger().trigger('click')

      expect(wrapper.emitted('settings')).toBeUndefined()

      wrapper.unmount()
    })

    it('closes when keyboard focus leaves the component', async () => {
      mountMenu()

      await openMenu()

      menu.link(0).element.dispatchEvent(
        new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: document.body,
        }),
      )

      await nextTick()

      expect(menu.menu().exists()).toBe(false)

      wrapper.unmount()
    })

    it('stays open when focus moves between menu items', async () => {
      mountMenu()

      await openMenu()

      menu.link(0).element.dispatchEvent(
        new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: menu.link(1).element,
        }),
      )

      await nextTick()

      expect(menu.menu().exists()).toBe(true)

      wrapper.unmount()
    })

    it('stays open when focus returns to the trigger', async () => {
      mountMenu()

      await openMenu()

      menu.link(0).element.dispatchEvent(
        new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: menu.trigger().element,
        }),
      )

      await nextTick()

      expect(menu.menu().exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('cleanup', () => {
    it('removes document listeners when the component unmounts', async () => {
      const removeEventListener = vi.spyOn(document, 'removeEventListener')
      mountMenu()

      await openMenu()
      wrapper.unmount()

      expect(removeEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function))
      expect(removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('removes document listeners when the menu closes', async () => {
      const removeEventListener = vi.spyOn(document, 'removeEventListener')
      mountMenu()

      await openMenu()
      await menu.trigger().trigger('click')

      expect(removeEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function))
      expect(removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))

      wrapper.unmount()
    })
  })
})
