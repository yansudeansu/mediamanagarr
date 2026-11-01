import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MmQuickAccess from './MmQuickAccess.vue'
import type { QuickAccessItem } from './MmQuickAccess.vue'

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

function mountMenu(items: QuickAccessItem[] = defaultItems) {
  return mount(MmQuickAccess, {
    props: { items },
    attachTo: document.body,
  })
}

type MenuWrapper = ReturnType<typeof mountMenu>

async function openMenu(wrapper: MenuWrapper): Promise<void> {
  await wrapper.get('button[aria-label="Open workspace menu"]').trigger('click')
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('MmQuickAccess', () => {
  describe('trigger', () => {
    it('renders an accessible menu trigger', () => {
      const wrapper = mountMenu()

      const trigger = wrapper.get('button[aria-label="Open workspace menu"]')

      expect(trigger.attributes('type')).toBe('button')
      expect(trigger.attributes('aria-expanded')).toBe('false')
      expect(trigger.attributes('aria-controls')).toBeUndefined()
      expect(trigger.find('svg').exists()).toBe(true)

      wrapper.unmount()
    })

    it('starts with the menu closed', () => {
      const wrapper = mountMenu()

      expect(wrapper.find('#quick-access-menu').exists()).toBe(false)

      wrapper.unmount()
    })

    it('opens when the trigger is clicked', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      expect(wrapper.get('#quick-access-menu').isVisible()).toBe(true)

      const trigger = wrapper.get('button[aria-label="Open workspace menu"]')

      expect(trigger.attributes('aria-expanded')).toBe('true')
      expect(trigger.attributes('aria-controls')).toBe('quick-access-menu')

      wrapper.unmount()
    })

    it('closes when the trigger is clicked again', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)
      await wrapper.get('button[aria-label="Open workspace menu"]').trigger('click')

      expect(wrapper.find('#quick-access-menu').exists()).toBe(false)

      const trigger = wrapper.get('button[aria-label="Open workspace menu"]')

      expect(trigger.attributes('aria-expanded')).toBe('false')
      expect(trigger.attributes('aria-controls')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('items', () => {
    it('displays the supplied links in order', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      const links = wrapper.findAll('.quick-access__services a')

      expect(links).toHaveLength(3)
      expect(links.map((link) => link.text())).toEqual(['Dashboard', 'Reports', 'Documentation'])

      wrapper.unmount()
    })

    it('displays only the items supplied by the parent', async () => {
      const wrapper = mountMenu([defaultItems[0]!])

      await openMenu(wrapper)

      expect(wrapper.text()).toContain('Dashboard')
      expect(wrapper.text()).not.toContain('Reports')
      expect(wrapper.text()).not.toContain('Documentation')

      wrapper.unmount()
    })

    it('shows an empty state when no links are supplied', async () => {
      const wrapper = mountMenu([])

      await openMenu(wrapper)

      expect(wrapper.text()).toContain('No links available')
      expect(wrapper.findAll('.quick-access__services a')).toHaveLength(0)
      expect(wrapper.text()).toContain('Settings')

      wrapper.unmount()
    })

    it('preserves the supplied link URLs', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      const links = wrapper.findAll('.quick-access__services a')

      expect(links[0]?.attributes('href')).toBe('https://example.com/dashboard')
      expect(links[1]?.attributes('href')).toBe('https://example.com:5055/reports')
      expect(links[2]?.attributes('href')).toBe('https://docs.example.com/guide')

      wrapper.unmount()
    })

    it('opens links in new tabs safely', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      for (const link of wrapper.findAll('.quick-access__services a')) {
        expect(link.attributes('target')).toBe('_blank')
        expect(link.attributes('rel')).toBe('noopener noreferrer')
        expect(link.attributes('aria-label')).toMatch(/^Open .+ in a new tab$/)
      }

      wrapper.unmount()
    })

    it('renders an external-link icon for every item', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      for (const link of wrapper.findAll('.quick-access__services a')) {
        expect(link.findAll('svg')).toHaveLength(1)
        expect(link.get('svg').attributes('aria-hidden')).toBe('true')
      }

      wrapper.unmount()
    })

    it('updates when the items prop changes', async () => {
      const wrapper = mountMenu([])

      await openMenu(wrapper)

      expect(wrapper.findAll('.quick-access__services a')).toHaveLength(0)

      await wrapper.setProps({
        items: [defaultItems[0]!],
      })

      expect(wrapper.findAll('.quick-access__services a')).toHaveLength(1)
      expect(wrapper.text()).toContain('Dashboard')
      expect(wrapper.text()).not.toContain('No links available')

      wrapper.unmount()
    })
  })

  describe('interactions', () => {
    it('moves focus to the first link when opened', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      expect(document.activeElement).toBe(wrapper.get('.quick-access__services a').element)

      wrapper.unmount()
    })

    it('moves focus to Settings when there are no links', async () => {
      const wrapper = mountMenu([])

      await openMenu(wrapper)

      const settingsButton = wrapper.get('button[aria-label="Open settings"]')

      expect(document.activeElement).toBe(settingsButton.element)

      wrapper.unmount()
    })

    it('closes when Escape is pressed and restores trigger focus', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
        }),
      )

      await nextTick()

      expect(wrapper.find('#quick-access-menu').exists()).toBe(false)
      expect(document.activeElement).toBe(
        wrapper.get('button[aria-label="Open workspace menu"]').element,
      )

      wrapper.unmount()
    })

    it('closes when clicking outside', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      document.body.dispatchEvent(
        new Event('pointerdown', {
          bubbles: true,
        }),
      )

      await nextTick()

      expect(wrapper.find('#quick-access-menu').exists()).toBe(false)

      wrapper.unmount()
    })

    it('does not close when clicking inside the menu', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      wrapper.get('.quick-access__heading').element.dispatchEvent(
        new Event('pointerdown', {
          bubbles: true,
        }),
      )

      await nextTick()

      expect(wrapper.find('#quick-access-menu').exists()).toBe(true)

      wrapper.unmount()
    })

    it('closes when a link is selected', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)
      await wrapper.get('.quick-access__services a').trigger('click')

      expect(wrapper.find('#quick-access-menu').exists()).toBe(false)

      wrapper.unmount()
    })

    it('emits settings and closes when Settings is selected', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)
      await wrapper.get('button[aria-label="Open settings"]').trigger('click')

      expect(wrapper.emitted('settings')).toHaveLength(1)
      expect(wrapper.find('#quick-access-menu').exists()).toBe(false)

      wrapper.unmount()
    })

    it('does not emit settings when opening or closing the menu', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)
      await wrapper.get('button[aria-label="Open workspace menu"]').trigger('click')

      expect(wrapper.emitted('settings')).toBeUndefined()

      wrapper.unmount()
    })

    it('closes when keyboard focus leaves the component', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      const firstLink = wrapper.get('.quick-access__services a').element

      firstLink.dispatchEvent(
        new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: document.body,
        }),
      )

      await nextTick()

      expect(wrapper.find('#quick-access-menu').exists()).toBe(false)

      wrapper.unmount()
    })

    it('stays open when focus moves between menu items', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      const links = wrapper.findAll('.quick-access__services a')

      links[0]!.element.dispatchEvent(
        new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: links[1]!.element,
        }),
      )

      await nextTick()

      expect(wrapper.find('#quick-access-menu').exists()).toBe(true)

      wrapper.unmount()
    })

    it('stays open when focus returns to the trigger', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      const trigger = wrapper.get('button[aria-label="Open workspace menu"]').element

      wrapper.get('.quick-access__services a').element.dispatchEvent(
        new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: trigger,
        }),
      )

      await nextTick()

      expect(wrapper.find('#quick-access-menu').exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('cleanup', () => {
    it('removes document listeners when the component unmounts', async () => {
      const removeEventListener = vi.spyOn(document, 'removeEventListener')
      const wrapper = mountMenu()

      await openMenu(wrapper)
      wrapper.unmount()

      expect(removeEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function))
      expect(removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('removes document listeners when the menu closes', async () => {
      const removeEventListener = vi.spyOn(document, 'removeEventListener')
      const wrapper = mountMenu()

      await openMenu(wrapper)
      await wrapper.get('button[aria-label="Open workspace menu"]').trigger('click')

      expect(removeEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function))
      expect(removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))

      wrapper.unmount()
    })
  })
})
