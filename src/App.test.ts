import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import App from './App.vue'
import { sendBackgroundMessage } from './utils/background-messaging'
import { openWorkspaceSidebar } from './utils/workspace-sidebar'
import { getSafeServiceConfigs } from './utils/service-storage'
import { getWorkspaceNavigationState, saveWorkspaceNavigationState } from './utils/workspace-state'
import type { SafeServiceConfigs } from './types/service'
import type { WorkspaceNavigationState } from './utils/workspace-state'
import type { BackgroundResponse, BackgroundMessage } from './types/messages'

vi.mock('./utils/background-messaging', () => ({
  sendBackgroundMessage: vi.fn(),
}))

vi.mock('./utils/workspace-sidebar', () => ({
  openWorkspaceSidebar: vi.fn(),
}))

vi.mock('./utils/service-storage', () => ({
  getSafeServiceConfigs: vi.fn(),
}))

vi.mock('./utils/workspace-state', () => ({
  getWorkspaceNavigationState: vi.fn(),
  saveWorkspaceNavigationState: vi.fn(),
}))

vi.mock('./views/MmRequestView.vue', () => ({
  default: {
    name: 'MockRequestView',
    template: '<div data-testid="requests-view">Requests content</div>',
  },
}))

vi.mock('./views/MmUpNextView.vue', () => ({
  default: {
    name: 'MockUpNextView',
    template: '<div data-testid="up-next-view">Up Next content</div>',
  },
}))

vi.mock('./views/MmCalendarView.vue', () => ({
  default: {
    name: 'MockCalendarView',
    template: '<div data-testid="calendar-view">Calendar content</div>',
  },
}))

vi.mock('./views/MmDownloadsView.vue', () => ({
  default: {
    name: 'MockDownloadsView',
    template: '<div data-testid="downloads-view">Downloads content</div>',
  },
}))

vi.mock('./views/SettingsView.vue', () => ({
  default: {
    name: 'MockSettingsView',
    emits: ['open-sidebar', 'open-detached'],
    template: `
      <div data-testid="settings-view">
        <span>Settings content</span>
        <button
          type="button"
          data-testid="request-sidebar"
          @click="$emit('open-sidebar')"
        >
          Open Sidebar
        </button>
        <button
          type="button"
          data-testid="request-detached"
          @click="$emit('open-detached')"
        >
          Open Detached Window
        </button>
      </div>
    `,
  },
}))

vi.mock('./views/MmUpNextView.vue', () => ({
  default: {
    name: 'MockUpNextView',
    props: ['jellyfinUrl'],
    template: '<div data-testid="up-next-view">Up Next content</div>',
  },
}))

const mockedSendMessage = vi.mocked(sendBackgroundMessage)
const mockedOpenSidebar = vi.mocked(openWorkspaceSidebar)
const mockedGetSafeServices = vi.mocked(getSafeServiceConfigs)
const mockedGetWorkspaceState = vi.mocked(getWorkspaceNavigationState)
const mockedSaveWorkspaceState = vi.mocked(saveWorkspaceNavigationState)

const configuredServices: SafeServiceConfigs = {
  jellyfin: {
    url: 'https://media.example.com/jellyfin',
    configured: true,
  },
  seerr: {
    url: 'https://seerr.example.com',
    configured: true,
  },
  sonarr: {
    url: 'https://home.example.com:8989/sonarr',
    configured: true,
  },
  radarr: {
    url: 'https://radarr.example.com',
    configured: true,
  },
  qbittorrent: {
    url: 'https://qbittorrent.example.com',
    configured: true,
  },
}

const detachedSuccess = {
  success: true as const,
  windowId: 123,
}

function getNavigationButton(wrapper: ReturnType<typeof mount>, label: string) {
  const button = wrapper
    .findAll('nav[aria-label="Main navigation"] button')
    .find((item) => item.text() === label)

  if (!button) {
    throw new Error(`Navigation button "${label}" was not found.`)
  }

  return button
}

async function openQuickAccess(wrapper: ReturnType<typeof mount>): Promise<void> {
  await wrapper.get('button[aria-label="Open workspace menu"]').trigger('click')
}

async function openSettings(wrapper: ReturnType<typeof mount>): Promise<void> {
  await openQuickAccess(wrapper)

  await wrapper.get('button[aria-label="Open settings"]').trigger('click')
}

async function requestSidebar(wrapper: ReturnType<typeof mount>): Promise<void> {
  await wrapper.get('[data-testid="request-sidebar"]').trigger('click')
}

async function requestDetached(wrapper: ReturnType<typeof mount>): Promise<void> {
  await wrapper.get('[data-testid="request-detached"]').trigger('click')
}

function setWorkspaceMode(mode: 'popup' | 'detached' | 'sidebar'): void {
  const url = new URL(window.location.href)

  if (mode === 'popup') {
    url.searchParams.delete('workspace')
  } else {
    url.searchParams.set('workspace', mode)
  }

  window.history.replaceState(null, '', url.toString())
}

describe('App', () => {
  const storageChangeListeners = new Set<
    (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => void
  >()

  const addStorageListener = vi.fn(
    (
      listener: (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => void,
    ) => {
      storageChangeListeners.add(listener)
    },
  )

  const removeStorageListener = vi.fn(
    (
      listener: (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => void,
    ) => {
      storageChangeListeners.delete(listener)
    },
  )

  function emitStorageChange(
    changes: Record<string, chrome.storage.StorageChange>,
    areaName = 'local',
  ): void {
    for (const listener of [...storageChangeListeners]) {
      listener(changes, areaName)
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    storageChangeListeners.clear()

    window.history.replaceState(null, '', window.location.pathname)

    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get: vi.fn(),
          set: vi.fn(),
        },
        session: {
          get: vi.fn(),
          set: vi.fn(),
        },
        onChanged: {
          addListener: addStorageListener,
          removeListener: removeStorageListener,
        },
      },
    })

    mockedGetWorkspaceState.mockResolvedValue({
      activeView: 'requests',
      settingsOpen: false,
    })

    mockedGetSafeServices.mockResolvedValue(configuredServices)
    mockedSaveWorkspaceState.mockResolvedValue(undefined)
    mockedOpenSidebar.mockResolvedValue(undefined)
    mockedSendMessage.mockResolvedValue(detachedSuccess)
  })

  afterEach(() => {
    window.history.replaceState(null, '', window.location.pathname)

    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    storageChangeListeners.clear()
  })

  describe('application layout', () => {
    it('renders the application header', () => {
      const wrapper = mount(App)

      expect(wrapper.get('h1').text()).toBe('MediaManagarr')

      wrapper.unmount()
    })

    it('renders the application footer', () => {
      const wrapper = mount(App)

      expect(wrapper.find('footer').exists()).toBe(true)

      wrapper.unmount()
    })

    it('starts in popup mode', () => {
      const wrapper = mount(App)

      expect(wrapper.get('.app-shell').classes()).not.toContain('app-shell--detached')

      expect(wrapper.get('.app-shell').classes()).not.toContain('app-shell--sidebar')

      wrapper.unmount()
    })

    it('detects detached workspace mode', () => {
      setWorkspaceMode('detached')

      const wrapper = mount(App)

      expect(wrapper.get('.app-shell').classes()).toContain('app-shell--detached')

      wrapper.unmount()
    })

    it('detects sidebar workspace mode', () => {
      setWorkspaceMode('sidebar')

      const wrapper = mount(App)

      expect(wrapper.get('.app-shell').classes()).toContain('app-shell--sidebar')

      wrapper.unmount()
    })
  })

  describe('navigation', () => {
    it('renders all navigation items when all services are configured', async () => {
      const wrapper = mount(App)
      await flushPromises()

      const navigation = wrapper.get('nav[aria-label="Main navigation"]')

      expect(navigation.text()).toContain('Requests')
      expect(navigation.text()).toContain('Up Next')
      expect(navigation.text()).toContain('Calendar')
      expect(navigation.text()).toContain('Downloads')

      wrapper.unmount()
    })

    it('starts on the Requests view', async () => {
      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(true)

      expect(getNavigationButton(wrapper, 'Requests').attributes('aria-current')).toBe('page')

      wrapper.unmount()
    })

    it('navigates to Up Next', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Up Next').trigger('click')

      expect(wrapper.find('[data-testid="up-next-view"]').exists()).toBe(true)

      expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('navigates to Calendar', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Calendar').trigger('click')

      expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('navigates to Downloads', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Downloads').trigger('click')

      expect(wrapper.find('[data-testid="downloads-view"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('unmounts the previous view when navigating', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Downloads').trigger('click')

      expect(wrapper.find('[data-testid="downloads-view"]').exists()).toBe(true)

      await getNavigationButton(wrapper, 'Calendar').trigger('click')

      expect(wrapper.find('[data-testid="downloads-view"]').exists()).toBe(false)

      expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('dynamic navigation', () => {
    it('shows only capabilities supported by configured services', async () => {
      mockedGetSafeServices.mockResolvedValue({
        jellyfin: {
          url: 'https://jellyfin.example.com',
          configured: true,
        },
        sonarr: {
          url: 'https://sonarr.example.com',
          configured: true,
        },
      })

      const wrapper = mount(App)
      await flushPromises()

      const navigation = wrapper.get('nav[aria-label="Main navigation"]')

      expect(navigation.text()).toContain('Up Next')
      expect(navigation.text()).toContain('Calendar')
      expect(navigation.text()).not.toContain('Requests')
      expect(navigation.text()).not.toContain('Downloads')

      expect(wrapper.find('[data-testid="up-next-view"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('shows Calendar without navigation for Sonarr and Radarr', async () => {
      mockedGetSafeServices.mockResolvedValue({
        sonarr: {
          url: 'https://sonarr.example.com',
          configured: true,
        },
        radarr: {
          url: 'https://radarr.example.com',
          configured: true,
        },
      })

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)
      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('shows Up Next without navigation when only Jellyfin is configured', async () => {
      mockedGetSafeServices.mockResolvedValue({
        jellyfin: {
          url: 'https://jellyfin.example.com',
          configured: true,
        },
      })

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('[data-testid="up-next-view"]').exists()).toBe(true)
      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('ignores services marked unconfigured', async () => {
      mockedGetSafeServices.mockResolvedValue({
        jellyfin: {
          url: '',
          configured: false,
        },
        seerr: {
          url: 'https://seerr.example.com',
          configured: true,
        },
      })

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="up-next-view"]').exists()).toBe(false)
      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('shows the setup state when no services are configured', async () => {
      mockedGetSafeServices.mockResolvedValue({})

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

      expect(wrapper.text()).toContain('No services configured yet.')

      expect(wrapper.text()).toContain('Configure a service in Settings to get started.')

      wrapper.unmount()
    })

    it('opens Settings from the empty setup state', async () => {
      mockedGetSafeServices.mockResolvedValue({})

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('.empty-navigation button').trigger('click')

      expect(wrapper.find('[data-testid="settings-view"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('restores a saved view when available', async () => {
      mockedGetWorkspaceState.mockResolvedValue({
        activeView: 'calendar',
        settingsOpen: false,
      })

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)

      expect(getNavigationButton(wrapper, 'Calendar').attributes('aria-current')).toBe('page')

      wrapper.unmount()
    })

    it('falls back when the saved view is unavailable', async () => {
      mockedGetWorkspaceState.mockResolvedValue({
        activeView: 'downloads',
        settingsOpen: false,
      })

      mockedGetSafeServices.mockResolvedValue({
        jellyfin: {
          url: 'https://jellyfin.example.com',
          configured: true,
        },
      })

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('[data-testid="up-next-view"]').exists()).toBe(true)

      expect(wrapper.find('[data-testid="downloads-view"]').exists()).toBe(false)

      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('waits for services before displaying navigation', async () => {
      let resolveServices: ((configs: SafeServiceConfigs) => void) | undefined

      mockedGetSafeServices.mockImplementation(
        () =>
          new Promise<SafeServiceConfigs>((resolve) => {
            resolveServices = resolve
          }),
      )

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

      expect(wrapper.find('.empty-navigation').exists()).toBe(false)

      resolveServices?.(configuredServices)
      await flushPromises()

      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('waits for workspace state before selecting a view', async () => {
      let resolveState: ((state: WorkspaceNavigationState) => void) | undefined

      mockedGetWorkspaceState.mockImplementation(
        () =>
          new Promise<WorkspaceNavigationState>((resolve) => {
            resolveState = resolve
          }),
      )

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

      resolveState?.({
        activeView: 'calendar',
        settingsOpen: false,
      })

      await flushPromises()

      expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('updates navigation when service configuration changes', async () => {
      const wrapper = mount(App)
      await flushPromises()

      expect(getNavigationButton(wrapper, 'Downloads').exists()).toBe(true)

      mockedGetSafeServices.mockResolvedValue({
        seerr: {
          url: 'https://seerr.example.com',
          configured: true,
        },
      })

      emitStorageChange({
        mediaManagarrServices: {
          oldValue: configuredServices,
          newValue: {},
        },
      })

      await flushPromises()

      expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="downloads-view"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="up-next-view"]').exists()).toBe(false)
      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('falls back when the active service is removed', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Downloads').trigger('click')

      expect(wrapper.find('[data-testid="downloads-view"]').exists()).toBe(true)

      mockedGetSafeServices.mockResolvedValue({
        jellyfin: {
          url: 'https://jellyfin.example.com',
          configured: true,
        },
      })

      emitStorageChange({
        mediaManagarrServices: {
          oldValue: configuredServices,
          newValue: {},
        },
      })

      await flushPromises()

      expect(wrapper.find('[data-testid="downloads-view"]').exists()).toBe(false)

      expect(wrapper.find('[data-testid="up-next-view"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('ignores unrelated storage changes', async () => {
      const wrapper = mount(App)
      await flushPromises()

      expect(mockedGetSafeServices).toHaveBeenCalledOnce()

      emitStorageChange({
        unrelatedSetting: {
          newValue: true,
        },
      })

      await flushPromises()

      expect(mockedGetSafeServices).toHaveBeenCalledOnce()

      wrapper.unmount()
    })

    it('ignores service changes outside local storage', async () => {
      const wrapper = mount(App)
      await flushPromises()

      emitStorageChange(
        {
          mediaManagarrServices: {
            newValue: configuredServices,
          },
        },
        'session',
      )

      await flushPromises()

      expect(mockedGetSafeServices).toHaveBeenCalledOnce()

      wrapper.unmount()
    })

    it('does not overwrite newer configurations with stale results', async () => {
      let resolveInitialLoad: ((configs: SafeServiceConfigs) => void) | undefined

      mockedGetSafeServices
        .mockImplementationOnce(
          () =>
            new Promise<SafeServiceConfigs>((resolve) => {
              resolveInitialLoad = resolve
            }),
        )
        .mockResolvedValueOnce(configuredServices)

      const wrapper = mount(App)
      await flushPromises()

      emitStorageChange({
        mediaManagarrServices: {
          newValue: configuredServices,
        },
      })

      await flushPromises()

      resolveInitialLoad?.({})
      await flushPromises()

      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(true)

      expect(getNavigationButton(wrapper, 'Downloads').exists()).toBe(true)

      wrapper.unmount()
    })

    it('handles service loading errors gracefully', async () => {
      mockedGetSafeServices.mockRejectedValue(new Error('Service storage unavailable.'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      expect(warnSpy).toHaveBeenCalledWith(
        'MediaManagarr: Unable to load safe service configurations:',
        expect.any(Error),
      )

      expect(wrapper.text()).toContain('No services configured yet.')

      wrapper.unmount()
    })
  })

  describe('Quick Access', () => {
    it('loads configured services on mount', async () => {
      const wrapper = mount(App)
      await flushPromises()

      expect(mockedGetSafeServices).toHaveBeenCalledOnce()

      await openQuickAccess(wrapper)

      expect(wrapper.get('#quick-access-menu').text()).toContain('Jellyfin')

      expect(wrapper.get('#quick-access-menu').text()).toContain('Sonarr')

      wrapper.unmount()
    })

    it('preserves reverse-proxy paths and custom ports', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await openQuickAccess(wrapper)

      const links = wrapper.findAll('#quick-access-menu a')
      const hrefs = links.map((link) => link.attributes('href'))

      expect(hrefs).toContain('https://media.example.com/jellyfin')

      expect(hrefs).toContain('https://home.example.com:8989/sonarr')

      for (const link of links) {
        expect(link.attributes('target')).toBe('_blank')
        expect(link.attributes('rel')).toContain('noopener')
        expect(link.attributes('rel')).toContain('noreferrer')
      }

      wrapper.unmount()
    })

    it('shows an empty state without configured services', async () => {
      mockedGetSafeServices.mockResolvedValue({})

      const wrapper = mount(App)
      await flushPromises()

      await openQuickAccess(wrapper)

      expect(wrapper.get('#quick-access-menu').text()).toContain('No links available')

      expect(wrapper.findAll('#quick-access-menu a')).toHaveLength(0)

      wrapper.unmount()
    })

    it('refreshes Quick Access when services change', async () => {
      mockedGetSafeServices.mockResolvedValue({})

      const wrapper = mount(App)
      await flushPromises()

      await openQuickAccess(wrapper)

      mockedGetSafeServices.mockResolvedValue(configuredServices)

      emitStorageChange({
        mediaManagarrServices: {
          newValue: configuredServices,
        },
      })

      await flushPromises()

      expect(wrapper.get('#quick-access-menu').text()).toContain('Jellyfin')

      wrapper.unmount()
    })

    it('registers and removes the storage listener', async () => {
      const wrapper = mount(App)
      await flushPromises()

      expect(addStorageListener).toHaveBeenCalledOnce()
      expect(storageChangeListeners.size).toBe(1)

      wrapper.unmount()

      expect(removeStorageListener).toHaveBeenCalledOnce()
      expect(storageChangeListeners.size).toBe(0)
    })
  })

  describe('Settings', () => {
    it('opens Settings through Quick Access', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)

      expect(wrapper.find('[data-testid="settings-view"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('hides navigation while Settings is open', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)

      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

      expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('returns to the selected view after closing Settings', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Calendar').trigger('click')
      await openSettings(wrapper)

      await wrapper.get('button[aria-label="Back to previous view"]').trigger('click')

      expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('workspace navigation persistence', () => {
    it('restores the selected view', async () => {
      mockedGetWorkspaceState.mockResolvedValue({
        activeView: 'calendar',
        settingsOpen: false,
      })

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('restores Settings when previously open', async () => {
      mockedGetWorkspaceState.mockResolvedValue({
        activeView: 'calendar',
        settingsOpen: true,
      })

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('[data-testid="settings-view"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('saves navigation changes', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Calendar').trigger('click')
      await flushPromises()

      expect(mockedSaveWorkspaceState).toHaveBeenCalledWith({
        activeView: 'calendar',
        settingsOpen: false,
      })

      wrapper.unmount()
    })

    it('saves Settings being opened', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await flushPromises()

      expect(mockedSaveWorkspaceState).toHaveBeenCalledWith({
        activeView: 'requests',
        settingsOpen: true,
      })

      wrapper.unmount()
    })

    it('saves Settings being closed', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)

      await wrapper.get('button[aria-label="Back to previous view"]').trigger('click')

      await flushPromises()

      expect(mockedSaveWorkspaceState).toHaveBeenCalledWith({
        activeView: 'requests',
        settingsOpen: false,
      })

      wrapper.unmount()
    })

    it('continues with defaults when restoration fails', async () => {
      mockedGetWorkspaceState.mockRejectedValue(new Error('Session unavailable.'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      expect(warnSpy).toHaveBeenCalled()

      expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('detached workspace', () => {
    it('opens a detached workspace from Settings', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestDetached(wrapper)
      await flushPromises()

      expect(mockedSendMessage).toHaveBeenCalledWith({
        type: 'OPEN_DETACHED_WORKSPACE',
      })

      wrapper.unmount()
    })

    it('saves navigation state before opening a detached workspace', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Calendar').trigger('click')
      await openSettings(wrapper)
      await requestDetached(wrapper)
      await flushPromises()

      expect(mockedSaveWorkspaceState).toHaveBeenCalledWith({
        activeView: 'calendar',
        settingsOpen: true,
      })

      wrapper.unmount()
    })

    it('shows errors when detached workspace opening fails', async () => {
      mockedSendMessage.mockResolvedValue({
        success: false,
        error: 'Unable to create window.',
      })

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestDetached(wrapper)
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toContain('Unable to create window.')

      wrapper.unmount()
    })

    it('handles rejected detached requests', async () => {
      mockedSendMessage.mockRejectedValue(new Error('Background unavailable.'))

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestDetached(wrapper)
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toContain('Background unavailable.')

      wrapper.unmount()
    })

    it('prevents concurrent detached requests', async () => {
      let resolveRequest: ((response: BackgroundResponse<BackgroundMessage>) => void) | undefined

      mockedSendMessage.mockImplementation(
        () =>
          new Promise<BackgroundResponse<BackgroundMessage>>((resolve) => {
            resolveRequest = resolve
          }),
      )

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestDetached(wrapper)
      await requestDetached(wrapper)

      expect(mockedSendMessage).toHaveBeenCalledTimes(1)

      resolveRequest?.(detachedSuccess)
      await flushPromises()

      wrapper.unmount()
    })

    it('allows retrying after a failed detached request', async () => {
      mockedSendMessage
        .mockResolvedValueOnce({
          success: false,
          error: 'Unable to create window.',
        })
        .mockResolvedValueOnce(detachedSuccess)

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)

      await requestDetached(wrapper)
      await flushPromises()

      await requestDetached(wrapper)
      await flushPromises()

      expect(mockedSendMessage).toHaveBeenCalledTimes(2)

      wrapper.unmount()
    })
  })

  describe('native sidebar workspace', () => {
    it('opens the sidebar from Settings', async () => {
      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestSidebar(wrapper)
      await flushPromises()

      expect(mockedOpenSidebar).toHaveBeenCalledOnce()
      expect(closeSpy).toHaveBeenCalledOnce()

      wrapper.unmount()
    })

    it('opens the sidebar from a detached workspace', async () => {
      setWorkspaceMode('detached')

      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestSidebar(wrapper)
      await flushPromises()

      expect(mockedOpenSidebar).toHaveBeenCalledOnce()
      expect(closeSpy).toHaveBeenCalledOnce()

      wrapper.unmount()
    })

    it('starts the sidebar operation before awaiting storage', async () => {
      let resolveSave: (() => void) | undefined

      mockedSaveWorkspaceState.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveSave = resolve
          }),
      )

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestSidebar(wrapper)

      expect(mockedOpenSidebar).toHaveBeenCalledOnce()

      resolveSave?.()
      await flushPromises()

      wrapper.unmount()
    })

    it('continues opening the sidebar when saving state fails', async () => {
      mockedSaveWorkspaceState.mockRejectedValue(new Error('Session unavailable.'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestSidebar(wrapper)
      await flushPromises()

      expect(warnSpy).toHaveBeenCalled()
      expect(mockedOpenSidebar).toHaveBeenCalledOnce()
      expect(closeSpy).toHaveBeenCalledOnce()

      wrapper.unmount()
    })

    it('shows an error if opening the sidebar fails', async () => {
      mockedOpenSidebar.mockRejectedValue(new Error('Sidebar unavailable.'))

      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestSidebar(wrapper)
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toContain('Sidebar unavailable.')

      expect(closeSpy).not.toHaveBeenCalled()

      wrapper.unmount()
    })

    it('shows a fallback message for unknown sidebar errors', async () => {
      mockedOpenSidebar.mockRejectedValue(null)

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestSidebar(wrapper)
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toContain('Unable to open the browser sidebar.')

      wrapper.unmount()
    })

    it('prevents concurrent sidebar requests', async () => {
      let resolveSidebar: (() => void) | undefined

      mockedOpenSidebar.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveSidebar = resolve
          }),
      )

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestSidebar(wrapper)
      await requestSidebar(wrapper)

      expect(mockedOpenSidebar).toHaveBeenCalledTimes(1)

      resolveSidebar?.()
      await flushPromises()

      wrapper.unmount()
    })

    it('allows retrying after a failed sidebar request', async () => {
      mockedOpenSidebar
        .mockRejectedValueOnce(new Error('Sidebar unavailable.'))
        .mockResolvedValueOnce(undefined)

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)

      await requestSidebar(wrapper)
      await flushPromises()

      await requestSidebar(wrapper)
      await flushPromises()

      expect(mockedOpenSidebar).toHaveBeenCalledTimes(2)

      wrapper.unmount()
    })

    it('does not open the sidebar while a detached request is pending', async () => {
      let resolveRequest: ((response: BackgroundResponse<BackgroundMessage>) => void) | undefined

      mockedSendMessage.mockImplementation(
        () =>
          new Promise<BackgroundResponse<BackgroundMessage>>((resolve) => {
            resolveRequest = resolve
          }),
      )

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)
      await requestDetached(wrapper)
      await requestSidebar(wrapper)

      expect(mockedOpenSidebar).not.toHaveBeenCalled()

      resolveRequest?.(detachedSuccess)
      await flushPromises()

      wrapper.unmount()
    })

    it('preserves navigation state when opening the sidebar', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Calendar').trigger('click')
      await openSettings(wrapper)
      await requestSidebar(wrapper)
      await flushPromises()

      expect(mockedSaveWorkspaceState).toHaveBeenCalledWith({
        activeView: 'calendar',
        settingsOpen: true,
      })

      wrapper.unmount()
    })
  })

  describe('Up Next direct media link configuration', () => {
    it('passes the configured Jellyfin URL to Up Next', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Up Next').trigger('click')

      expect(wrapper.getComponent({ name: 'MockUpNextView' }).props('jellyfinUrl')).toBe(
        'https://media.example.com/jellyfin',
      )

      wrapper.unmount()
    })

    it('passes the Jellyfin URL when Up Next is the only available view', async () => {
      mockedGetSafeServices.mockResolvedValue({
        jellyfin: {
          url: 'https://jellyfin.example.com',
          configured: true,
        },
      })

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.getComponent({ name: 'MockUpNextView' }).props('jellyfinUrl')).toBe(
        'https://jellyfin.example.com',
      )

      wrapper.unmount()
    })

    it('updates the Jellyfin URL when service settings change', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Up Next').trigger('click')

      const upNext = wrapper.getComponent({ name: 'MockUpNextView' })

      expect(upNext.props('jellyfinUrl')).toBe('https://media.example.com/jellyfin')

      const updatedServices: SafeServiceConfigs = {
        ...configuredServices,
        jellyfin: {
          url: 'https://new-media.example.com/jellyfin',
          configured: true,
        },
      }

      mockedGetSafeServices.mockResolvedValue(updatedServices)

      emitStorageChange({
        mediaManagarrServices: {
          oldValue: configuredServices,
          newValue: updatedServices,
        },
      })

      await flushPromises()

      expect(upNext.props('jellyfinUrl')).toBe('https://new-media.example.com/jellyfin')

      wrapper.unmount()
    })

    it('does not pass a Jellyfin URL when Jellyfin is not configured', async () => {
      mockedGetSafeServices.mockResolvedValue({
        sonarr: {
          url: 'https://sonarr.example.com',
          configured: true,
        },
      })

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.findComponent({ name: 'MockUpNextView' }).exists()).toBe(false)

      wrapper.unmount()
    })
  })
})
