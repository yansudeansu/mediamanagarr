import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MmHeader from './MmHeader.vue'
import mmLogo from '../../../assets/mm-logo.svg'
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

function mountHeader(
  props: {
    mode?: 'main' | 'settings'
    services?: SafeServiceConfigs
  } = {},
) {
  return mount(MmHeader, {
    props,
  })
}

async function openQuickAccess(wrapper: ReturnType<typeof mountHeader>): Promise<void> {
  await wrapper.get('[aria-label="Open workspace menu"]').trigger('click')
  await nextTick()
}

describe('MmHeader', () => {
  describe('structure and branding', () => {
    it('renders a semantic header element', () => {
      const wrapper = mountHeader()

      expect(wrapper.element.tagName).toBe('HEADER')
    })

    it('uses main mode by default', () => {
      const wrapper = mountHeader()

      expect(wrapper.get('h1').text()).toBe('MediaManagarr')
    })

    it('renders the settings title in settings mode', () => {
      const wrapper = mountHeader({ mode: 'settings' })

      expect(wrapper.get('h1').text()).toBe('Settings')
    })

    it.each(['main', 'settings'] as const)(
      'renders branding before the action buttons in %s mode',
      (mode) => {
        const wrapper = mountHeader({ mode })

        const header = wrapper.element as HTMLElement
        const children = Array.from(header.children)

        expect(children).toHaveLength(2)
        expect(children[0]?.classList.contains('header__branding')).toBe(true)
        expect(children[1]?.classList.contains('header__actions')).toBe(true)
      },
    )

    it('renders the MM logo in main mode', () => {
      const wrapper = mountHeader()

      const logo = wrapper.get('.header__logo')

      expect(logo.element.tagName).toBe('IMG')
      expect(logo.attributes('src')).toBe(mmLogo)
      expect(logo.attributes('width')).toBe('28')
      expect(logo.attributes('height')).toBe('28')
    })

    it('renders the MM logo in settings mode', () => {
      const wrapper = mountHeader({ mode: 'settings' })

      expect(wrapper.find('.header__logo').exists()).toBe(true)
    })

    it('treats the MM logo as decorative', () => {
      const wrapper = mountHeader()

      expect(wrapper.get('.header__logo').attributes('alt')).toBe('')
    })

    it('renders the logo before the title', () => {
      const wrapper = mountHeader()

      const children = Array.from(wrapper.get('.header__branding').element.children)

      expect(children).toHaveLength(2)
      expect(children[0]?.tagName).toBe('IMG')
      expect(children[1]?.tagName).toBe('H1')
    })

    it('keeps the logo when switching between modes', async () => {
      const wrapper = mountHeader()

      expect(wrapper.findAll('.header__logo')).toHaveLength(1)

      await wrapper.setProps({ mode: 'settings' })

      expect(wrapper.findAll('.header__logo')).toHaveLength(1)
      expect(wrapper.get('h1').text()).toBe('Settings')

      await wrapper.setProps({ mode: 'main' })

      expect(wrapper.findAll('.header__logo')).toHaveLength(1)
      expect(wrapper.get('h1').text()).toBe('MediaManagarr')
    })

    it('hides decorative button icons from assistive technology', () => {
      const wrapper = mountHeader()

      for (const svg of wrapper.findAll('button svg')) {
        expect(svg.attributes('aria-hidden')).toBe('true')
        expect(svg.attributes('focusable')).toBe('false')
      }
    })
  })

  describe('header actions', () => {
    it('renders only the quick access trigger in main mode', () => {
      const wrapper = mountHeader()

      expect(wrapper.findAll('button')).toHaveLength(1)
      expect(wrapper.find('[aria-label="Open workspace menu"]').exists()).toBe(true)
    })

    it('renders only the back button in settings mode', () => {
      const wrapper = mountHeader({ mode: 'settings' })

      expect(wrapper.findAll('button')).toHaveLength(1)
      expect(wrapper.find('[aria-label="Back to previous view"]').exists()).toBe(true)
    })

    it('does not render workspace controls', () => {
      const wrapper = mountHeader()

      expect(wrapper.find('[aria-label="Detach workspace into a window"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Attach workspace to toolbar"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Open workspace in browser sidebar"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Close browser sidebar"]').exists()).toBe(false)
    })
  })

  describe('quick access', () => {
    it('renders the quick access trigger in main mode', () => {
      const wrapper = mountHeader()

      const button = wrapper.get('[aria-label="Open workspace menu"]')

      expect(button.classes()).toContain('button--icon-only')
      expect(button.classes()).toContain('button--secondary')
      expect(button.attributes('aria-expanded')).toBe('false')
      expect(button.find('svg').exists()).toBe(true)
    })

    it('does not render the old standalone settings button', () => {
      const wrapper = mountHeader()

      expect(wrapper.find('[aria-label="Open settings"]').exists()).toBe(false)
    })

    it('hides quick access in settings mode', () => {
      const wrapper = mountHeader({ mode: 'settings' })

      expect(wrapper.find('[aria-label="Open workspace menu"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Back to previous view"]').exists()).toBe(true)
    })

    it('opens the menu when the trigger is clicked', async () => {
      const wrapper = mountHeader()

      await openQuickAccess(wrapper)

      expect(wrapper.find('#quick-access-menu').exists()).toBe(true)
      expect(wrapper.get('[aria-label="Open workspace menu"]').attributes('aria-expanded')).toBe(
        'true',
      )
    })

    it('shows configured services supplied by the parent', async () => {
      const wrapper = mountHeader({
        services: configuredServices,
      })

      await openQuickAccess(wrapper)

      const links = wrapper.findAll('.quick-access__services a')

      expect(links).toHaveLength(3)
      expect(links.map((link) => link.text())).toEqual(['Jellyfin', 'Seerr', 'Sonarr'])
    })

    it('shows an empty state when no services are supplied', async () => {
      const wrapper = mountHeader()

      await openQuickAccess(wrapper)

      expect(wrapper.text()).toContain('No services configured')
      expect(wrapper.findAll('.quick-access__services a')).toHaveLength(0)
    })

    it('does not display unconfigured services', async () => {
      const wrapper = mountHeader({
        services: {
          jellyfin: configuredServices.jellyfin,
          radarr: {
            url: 'http://localhost:7878',
            configured: false,
          },
        },
      })

      await openQuickAccess(wrapper)

      expect(wrapper.text()).toContain('Jellyfin')
      expect(wrapper.text()).not.toContain('Radarr')
    })

    it('preserves configured service URLs', async () => {
      const wrapper = mountHeader({
        services: configuredServices,
      })

      await openQuickAccess(wrapper)

      const links = wrapper.findAll('.quick-access__services a')

      expect(links[0]?.attributes('href')).toBe('https://media.example.com/jellyfin')
      expect(links[1]?.attributes('href')).toBe('https://requests.example.com:5055')
      expect(links[2]?.attributes('href')).toBe('http://localhost:8989/sonarr')
    })

    it('emits settings when Settings is selected from quick access', async () => {
      const wrapper = mountHeader()

      await openQuickAccess(wrapper)

      const settingsButton = wrapper
        .findAll('button')
        .find((button) => button.text() === 'Settings')

      expect(settingsButton).toBeDefined()

      await settingsButton!.trigger('click')

      expect(wrapper.emitted('settings')).toHaveLength(1)
      expect(wrapper.emitted('back')).toBeUndefined()
      expect(wrapper.find('#quick-access-menu').exists()).toBe(false)
    })

    it('does not emit settings when opening the menu', async () => {
      const wrapper = mountHeader()

      await openQuickAccess(wrapper)

      expect(wrapper.emitted('settings')).toBeUndefined()
    })

    it('updates the menu when service configurations change', async () => {
      const wrapper = mountHeader()

      await openQuickAccess(wrapper)

      expect(wrapper.findAll('.quick-access__services a')).toHaveLength(0)

      await wrapper.setProps({
        services: {
          jellyfin: configuredServices.jellyfin,
        },
      })

      expect(wrapper.findAll('.quick-access__services a')).toHaveLength(1)
      expect(wrapper.text()).toContain('Jellyfin')
    })

    it('closes the menu when switching to settings mode', async () => {
      const wrapper = mountHeader()

      await openQuickAccess(wrapper)

      await wrapper.setProps({ mode: 'settings' })

      expect(wrapper.find('#quick-access-menu').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Open workspace menu"]').exists()).toBe(false)
    })
  })

  describe('settings navigation', () => {
    it('renders the back button in settings mode', () => {
      const wrapper = mountHeader({ mode: 'settings' })

      const button = wrapper.get('[aria-label="Back to previous view"]')

      expect(button.classes()).toContain('button--icon-only')
      expect(button.classes()).toContain('button--secondary')
      expect(button.find('svg').exists()).toBe(true)
    })

    it('emits back when the back button is clicked', async () => {
      const wrapper = mountHeader({ mode: 'settings' })

      await wrapper.get('[aria-label="Back to previous view"]').trigger('click')

      expect(wrapper.emitted('back')).toHaveLength(1)
      expect(wrapper.emitted('settings')).toBeUndefined()
    })

    it('updates the title and actions when switching to settings mode', async () => {
      const wrapper = mountHeader()

      expect(wrapper.get('h1').text()).toBe('MediaManagarr')
      expect(wrapper.find('[aria-label="Open workspace menu"]').exists()).toBe(true)

      await wrapper.setProps({ mode: 'settings' })

      expect(wrapper.get('h1').text()).toBe('Settings')
      expect(wrapper.find('[aria-label="Back to previous view"]').exists()).toBe(true)
    })

    it('restores quick access when returning to main mode', async () => {
      const wrapper = mountHeader({ mode: 'settings' })

      await wrapper.setProps({ mode: 'main' })

      expect(wrapper.get('h1').text()).toBe('MediaManagarr')
      expect(wrapper.find('[aria-label="Open workspace menu"]').exists()).toBe(true)
    })

    it('emits the correct events after switching modes', async () => {
      const wrapper = mountHeader()

      await openQuickAccess(wrapper)

      const settingsButton = wrapper
        .findAll('button')
        .find((button) => button.text() === 'Settings')

      await settingsButton!.trigger('click')

      expect(wrapper.emitted('settings')).toHaveLength(1)

      await wrapper.setProps({ mode: 'settings' })

      await wrapper.get('[aria-label="Back to previous view"]').trigger('click')

      expect(wrapper.emitted('back')).toHaveLength(1)
      expect(wrapper.emitted('settings')).toHaveLength(1)
    })

    it('renders different icons for quick access and back', async () => {
      const wrapper = mountHeader()

      const menuIcon = wrapper.get('[aria-label="Open workspace menu"] svg').html()

      await wrapper.setProps({ mode: 'settings' })

      const backIcon = wrapper.get('[aria-label="Back to previous view"] svg').html()

      expect(backIcon).not.toBe(menuIcon)
    })
  })
})
