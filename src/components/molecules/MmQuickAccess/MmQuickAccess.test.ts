import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MmQuickAccess from './MmQuickAccess.vue'
import type { SafeServiceConfigs } from '../../../types/service'

const configuredServices: SafeServiceConfigs = {
  jellyfin: {
    url: 'https://media.example.com/jellyfin',
    configured: true,
  },
  seerr: {
    url: 'https://requests.example.com:5055',
    configured: true,
  },
  sonarr: {
    url: 'http://localhost:8989/sonarr',
    configured: true,
  },
}

function mountMenu(services: SafeServiceConfigs = configuredServices) {
  return mount(MmQuickAccess, {
    props: {
      services,
    },
    attachTo: document.body,
  })
}

async function openMenu(wrapper: ReturnType<typeof mountMenu>): Promise<void> {
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
      expect(trigger.attributes('aria-controls')).toBe('quick-access-menu')
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
      expect(
        wrapper.get('button[aria-label="Open workspace menu"]').attributes('aria-expanded'),
      ).toBe('true')

      wrapper.unmount()
    })

    it('closes when the trigger is clicked again', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)
      await wrapper.get('button[aria-label="Open workspace menu"]').trigger('click')

      expect(wrapper.find('#quick-access-menu').exists()).toBe(false)
      expect(
        wrapper.get('button[aria-label="Open workspace menu"]').attributes('aria-expanded'),
      ).toBe('false')

      wrapper.unmount()
    })
  })

  describe('configured services', () => {
    it('displays configured services using registry names', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      const links = wrapper.findAll('.quick-access__services a')

      expect(links).toHaveLength(3)
      expect(links.map((link) => link.text())).toEqual(['Jellyfin', 'Seerr', 'Sonarr'])

      wrapper.unmount()
    })

    it('does not display unconfigured services', async () => {
      const wrapper = mountMenu({
        jellyfin: configuredServices.jellyfin,
        radarr: {
          url: 'http://localhost:7878',
          configured: false,
        },
      })

      await openMenu(wrapper)

      expect(wrapper.text()).toContain('Jellyfin')
      expect(wrapper.text()).not.toContain('Radarr')
      expect(wrapper.text()).not.toContain('qBittorrent')

      wrapper.unmount()
    })

    it('shows an empty state when no services are configured', async () => {
      const wrapper = mountMenu({})

      await openMenu(wrapper)

      expect(wrapper.text()).toContain('No services configured')
      expect(wrapper.findAll('.quick-access__services a')).toHaveLength(0)
      expect(wrapper.text()).toContain('Settings')

      wrapper.unmount()
    })

    it('ignores malformed service URLs', async () => {
      const wrapper = mountMenu({
        jellyfin: {
          url: 'not-a-url',
          configured: true,
        },
        seerr: configuredServices.seerr,
      })

      await openMenu(wrapper)

      const links = wrapper.findAll('.quick-access__services a')

      expect(links).toHaveLength(1)
      expect(links[0]?.text()).toBe('Seerr')

      wrapper.unmount()
    })

    it.each([
      'javascript:alert(1)',
      'ftp://example.com',
      'https://user:password@example.com',
      'https://example.com/?token=secret',
      'https://example.com/#fragment',
    ])('rejects unsafe service URL %s', async (url) => {
      const wrapper = mountMenu({
        jellyfin: {
          url,
          configured: true,
        },
      })

      await openMenu(wrapper)

      expect(wrapper.findAll('.quick-access__services a')).toHaveLength(0)
      expect(wrapper.text()).toContain('No services configured')

      wrapper.unmount()
    })

    it('preserves custom ports and reverse-proxy paths', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      const links = wrapper.findAll('.quick-access__services a')

      expect(links[0]?.attributes('href')).toBe('https://media.example.com/jellyfin')
      expect(links[1]?.attributes('href')).toBe('https://requests.example.com:5055')
      expect(links[2]?.attributes('href')).toBe('http://localhost:8989/sonarr')

      wrapper.unmount()
    })

    it('opens service links in new tabs safely', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      for (const link of wrapper.findAll('.quick-access__services a')) {
        expect(link.attributes('target')).toBe('_blank')
        expect(link.attributes('rel')).toBe('noopener noreferrer')
        expect(link.attributes('aria-label')).toMatch(/^Open .+ in a new tab$/)
      }

      wrapper.unmount()
    })

    it('renders an external-link icon for every service', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      for (const link of wrapper.findAll('.quick-access__services a')) {
        expect(link.findAll('svg')).toHaveLength(1)
        expect(link.get('svg').attributes('aria-hidden')).toBe('true')
      }

      wrapper.unmount()
    })

    it('updates when the service configuration changes', async () => {
      const wrapper = mountMenu({})

      await openMenu(wrapper)

      expect(wrapper.findAll('.quick-access__services a')).toHaveLength(0)

      await wrapper.setProps({
        services: {
          jellyfin: configuredServices.jellyfin,
        },
      })

      expect(wrapper.findAll('.quick-access__services a')).toHaveLength(1)
      expect(wrapper.text()).toContain('Jellyfin')

      wrapper.unmount()
    })
  })

  describe('interactions', () => {
    it('moves focus to the first service when opened', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      expect(document.activeElement).toBe(wrapper.get('.quick-access__services a').element)

      wrapper.unmount()
    })

    it('moves focus to Settings when no services are configured', async () => {
      const wrapper = mountMenu({})

      await openMenu(wrapper)

      const settingsButton = wrapper
        .findAll('button')
        .find((button) => button.text() === 'Settings')

      expect(settingsButton).toBeDefined()
      expect(document.activeElement).toBe(settingsButton?.element)

      wrapper.unmount()
    })

    it('closes when Escape is pressed', async () => {
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

    it('closes when a service shortcut is selected', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)
      await wrapper.get('.quick-access__services a').trigger('click')

      expect(wrapper.find('#quick-access-menu').exists()).toBe(false)

      wrapper.unmount()
    })

    it('emits settings and closes the menu when Settings is selected', async () => {
      const wrapper = mountMenu()

      await openMenu(wrapper)

      const settingsButton = wrapper
        .findAll('button')
        .find((button) => button.text() === 'Settings')

      expect(settingsButton).toBeDefined()

      await settingsButton!.trigger('click')

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
