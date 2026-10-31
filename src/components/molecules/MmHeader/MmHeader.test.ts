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
    windowMode?: 'popup' | 'detached' | 'sidebar'
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
    it('renders three action buttons in popup main and settings modes', () => {
      const main = mountHeader()
      const settings = mountHeader({ mode: 'settings' })

      expect(main.findAll('button')).toHaveLength(3)
      expect(settings.findAll('button')).toHaveLength(3)
    })

    it('renders three action buttons in detached mode', () => {
      const wrapper = mountHeader({ windowMode: 'detached' })

      expect(wrapper.findAll('button')).toHaveLength(3)
    })

    it('renders two action buttons in sidebar main mode', () => {
      const wrapper = mountHeader({ windowMode: 'sidebar' })

      expect(wrapper.findAll('button')).toHaveLength(2)
      expect(wrapper.find('[aria-label="Close browser sidebar"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Open workspace menu"]').exists()).toBe(true)
    })

    it('renders two action buttons in sidebar settings mode', () => {
      const wrapper = mountHeader({
        mode: 'settings',
        windowMode: 'sidebar',
      })

      expect(wrapper.findAll('button')).toHaveLength(2)
      expect(wrapper.find('[aria-label="Close browser sidebar"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Back to previous view"]').exists()).toBe(true)
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

  describe('detachable workspace', () => {
    it('renders the detach button by default', () => {
      const wrapper = mountHeader()

      const button = wrapper.get('[aria-label="Detach workspace into a window"]')

      expect(button.attributes('title')).toBe('Detach workspace into a window')
      expect(button.classes()).toContain('button--icon-only')
      expect(button.classes()).toContain('button--secondary')
      expect(button.find('svg').exists()).toBe(true)
    })

    it('renders the attach button in detached mode', () => {
      const wrapper = mountHeader({ windowMode: 'detached' })

      const button = wrapper.get('[aria-label="Attach workspace to toolbar"]')

      expect(button.attributes('title')).toBe('Attach workspace to toolbar')
      expect(button.classes()).toContain('button--icon-only')
      expect(button.classes()).toContain('button--secondary')
      expect(button.find('svg').exists()).toBe(true)
    })

    it('emits detach when the detach button is clicked', async () => {
      const wrapper = mountHeader()

      await wrapper.get('[aria-label="Detach workspace into a window"]').trigger('click')

      expect(wrapper.emitted('detach')).toHaveLength(1)
      expect(wrapper.emitted('attach')).toBeUndefined()
    })

    it('emits attach when the attach button is clicked', async () => {
      const wrapper = mountHeader({ windowMode: 'detached' })

      await wrapper.get('[aria-label="Attach workspace to toolbar"]').trigger('click')

      expect(wrapper.emitted('attach')).toHaveLength(1)
      expect(wrapper.emitted('detach')).toBeUndefined()
    })

    it('updates the workspace button when switching window modes', async () => {
      const wrapper = mountHeader()

      expect(wrapper.find('[aria-label="Detach workspace into a window"]').exists()).toBe(true)

      await wrapper.setProps({ windowMode: 'detached' })

      expect(wrapper.find('[aria-label="Attach workspace to toolbar"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Detach workspace into a window"]').exists()).toBe(false)
    })

    it('keeps the workspace button visible in settings mode', () => {
      const wrapper = mountHeader({ mode: 'settings' })

      expect(wrapper.find('[aria-label="Detach workspace into a window"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Back to previous view"]').exists()).toBe(true)
    })

    it('renders different icons for detach and attach', async () => {
      const wrapper = mountHeader()

      const detachIcon = wrapper.get('[aria-label="Detach workspace into a window"] svg').html()

      await wrapper.setProps({ windowMode: 'detached' })

      const attachIcon = wrapper.get('[aria-label="Attach workspace to toolbar"] svg').html()

      expect(attachIcon).not.toBe(detachIcon)
    })

    it('keeps quick access when switching window modes', async () => {
      const wrapper = mountHeader()

      await wrapper.setProps({ windowMode: 'detached' })

      expect(wrapper.find('[aria-label="Open workspace menu"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Attach workspace to toolbar"]').exists()).toBe(true)
    })
  })

  describe('native sidebar workspace', () => {
    it('renders the sidebar button in popup mode', () => {
      const wrapper = mountHeader()

      const button = wrapper.get('[aria-label="Open workspace in browser sidebar"]')

      expect(button.attributes('title')).toBe('Open workspace in browser sidebar')
      expect(button.classes()).toContain('button--icon-only')
      expect(button.classes()).toContain('button--secondary')
      expect(button.find('svg').exists()).toBe(true)
    })

    it('renders the sidebar button in detached mode', () => {
      const wrapper = mountHeader({ windowMode: 'detached' })

      expect(wrapper.find('[aria-label="Open workspace in browser sidebar"]').exists()).toBe(true)
    })

    it('renders the close sidebar button in sidebar mode', () => {
      const wrapper = mountHeader({ windowMode: 'sidebar' })

      const button = wrapper.get('[aria-label="Close browser sidebar"]')

      expect(button.attributes('title')).toBe('Close browser sidebar')
      expect(button.classes()).toContain('button--icon-only')
      expect(button.classes()).toContain('button--secondary')
      expect(button.find('svg').exists()).toBe(true)
    })

    it('hides the open sidebar button in sidebar mode', () => {
      const wrapper = mountHeader({ windowMode: 'sidebar' })

      expect(wrapper.find('[aria-label="Open workspace in browser sidebar"]').exists()).toBe(false)
    })

    it('hides the close sidebar button outside sidebar mode', () => {
      const popup = mountHeader()
      const detached = mountHeader({ windowMode: 'detached' })

      expect(popup.find('[aria-label="Close browser sidebar"]').exists()).toBe(false)
      expect(detached.find('[aria-label="Close browser sidebar"]').exists()).toBe(false)
    })

    it('hides detach and attach buttons in sidebar mode', () => {
      const wrapper = mountHeader({ windowMode: 'sidebar' })

      expect(wrapper.find('[aria-label="Detach workspace into a window"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Attach workspace to toolbar"]').exists()).toBe(false)
    })

    it('emits sidebar when the sidebar button is clicked', async () => {
      const wrapper = mountHeader()

      await wrapper.get('[aria-label="Open workspace in browser sidebar"]').trigger('click')

      expect(wrapper.emitted('sidebar')).toHaveLength(1)
      expect(wrapper.emitted('sidebarClose')).toBeUndefined()
      expect(wrapper.emitted('detach')).toBeUndefined()
      expect(wrapper.emitted('attach')).toBeUndefined()
    })

    it('emits sidebarClose when the close sidebar button is clicked', async () => {
      const wrapper = mountHeader({ windowMode: 'sidebar' })

      await wrapper.get('[aria-label="Close browser sidebar"]').trigger('click')

      expect(wrapper.emitted('sidebarClose')).toHaveLength(1)
      expect(wrapper.emitted('sidebar')).toBeUndefined()
      expect(wrapper.emitted('detach')).toBeUndefined()
      expect(wrapper.emitted('attach')).toBeUndefined()
    })

    it('keeps the sidebar button available in settings mode', () => {
      const wrapper = mountHeader({ mode: 'settings' })

      expect(wrapper.find('[aria-label="Open workspace in browser sidebar"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Back to previous view"]').exists()).toBe(true)
    })

    it('keeps the close sidebar button available in sidebar settings mode', () => {
      const wrapper = mountHeader({
        mode: 'settings',
        windowMode: 'sidebar',
      })

      expect(wrapper.find('[aria-label="Close browser sidebar"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Back to previous view"]').exists()).toBe(true)
    })

    it('updates workspace buttons when switching to sidebar mode', async () => {
      const wrapper = mountHeader()

      expect(wrapper.find('[aria-label="Detach workspace into a window"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Open workspace in browser sidebar"]').exists()).toBe(true)

      await wrapper.setProps({ windowMode: 'sidebar' })

      expect(wrapper.find('[aria-label="Detach workspace into a window"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Open workspace in browser sidebar"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Close browser sidebar"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Open workspace menu"]').exists()).toBe(true)
    })

    it('restores workspace buttons when switching from sidebar to popup mode', async () => {
      const wrapper = mountHeader({ windowMode: 'sidebar' })

      await wrapper.setProps({ windowMode: 'popup' })

      expect(wrapper.find('[aria-label="Detach workspace into a window"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Open workspace in browser sidebar"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Close browser sidebar"]').exists()).toBe(false)
    })

    it('renders a different icon for sidebar and detach', () => {
      const wrapper = mountHeader()

      const detachIcon = wrapper.get('[aria-label="Detach workspace into a window"] svg').html()
      const sidebarIcon = wrapper.get('[aria-label="Open workspace in browser sidebar"] svg').html()

      expect(sidebarIcon).not.toBe(detachIcon)
    })

    it('renders different icons for opening and closing the sidebar', async () => {
      const wrapper = mountHeader()

      const openIcon = wrapper.get('[aria-label="Open workspace in browser sidebar"] svg').html()

      await wrapper.setProps({ windowMode: 'sidebar' })

      const closeIcon = wrapper.get('[aria-label="Close browser sidebar"] svg').html()

      expect(closeIcon).not.toBe(openIcon)
    })

    it('hides decorative sidebar icons from assistive technology', async () => {
      const wrapper = mountHeader()

      const openIcon = wrapper.get('[aria-label="Open workspace in browser sidebar"] svg')

      expect(openIcon.attributes('aria-hidden')).toBe('true')
      expect(openIcon.attributes('focusable')).toBe('false')

      await wrapper.setProps({ windowMode: 'sidebar' })

      const closeIcon = wrapper.get('[aria-label="Close browser sidebar"] svg')

      expect(closeIcon.attributes('aria-hidden')).toBe('true')
      expect(closeIcon.attributes('focusable')).toBe('false')
    })
  })
})
