import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import App from './App.vue'
import { sendBackgroundMessage } from './utils/background-messaging'
import { openWorkspaceSidebar, closeWorkspaceSidebar } from './utils/workspace-sidebar'
import { getSafeServiceConfigs } from './utils/service-storage'
import { getWorkspaceNavigationState, saveWorkspaceNavigationState } from './utils/workspace-state'
import type { SafeServiceConfigs } from './types/service'

vi.mock('./utils/background-messaging', () => ({
  sendBackgroundMessage: vi.fn(),
}))

vi.mock('./utils/workspace-sidebar', () => ({
  openWorkspaceSidebar: vi.fn(),
  closeWorkspaceSidebar: vi.fn(),
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

vi.mock('./views/SettingsView.vue', () => ({
  default: {
    name: 'MockSettingsView',
    template: '<div data-testid="settings-view">Settings content</div>',
  },
}))

const mockedSendMessage = vi.mocked(sendBackgroundMessage)
const mockedOpenSidebar = vi.mocked(openWorkspaceSidebar)
const mockedCloseSidebar = vi.mocked(closeWorkspaceSidebar)
const mockedGetSafeServices = vi.mocked(getSafeServiceConfigs)
const mockedGetWorkspaceState = vi.mocked(getWorkspaceNavigationState)
const mockedSaveWorkspaceState = vi.mocked(saveWorkspaceNavigationState)

const emptyDownloads = {
  success: true as const,
  downloads: {
    torrents: [],
    downloadSpeed: 0,
    uploadSpeed: 0,
  },
}

const configuredServices: SafeServiceConfigs = {
  jellyfin: {
    url: 'https://media.example.com/jellyfin',
    configured: true,
  },
  sonarr: {
    url: 'https://home.example.com:8989/sonarr',
    configured: true,
  },
}

function mockBackgroundMessages(): void {
  mockedSendMessage.mockImplementation(async () => emptyDownloads)
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
    vi.useFakeTimers()
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

    mockedGetSafeServices.mockResolvedValue({})
    mockedSaveWorkspaceState.mockResolvedValue(undefined)
    mockedOpenSidebar.mockResolvedValue(undefined)
    mockedCloseSidebar.mockResolvedValue(undefined)

    mockBackgroundMessages()
  })

  afterEach(() => {
    window.history.replaceState(null, '', window.location.pathname)
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    storageChangeListeners.clear()
  })

  it('renders the application header', () => {
    const wrapper = mount(App)

    expect(wrapper.get('h1').text()).toBe('MediaManagarr')

    wrapper.unmount()
  })

  it('renders the main navigation', () => {
    const wrapper = mount(App)

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
    expect(wrapper.find('[data-testid="downloads-view"]').exists()).toBe(false)
    expect(getNavigationButton(wrapper, 'Requests').attributes('aria-current')).toBe('page')

    wrapper.unmount()
  })

  it('navigates to Up Next', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await getNavigationButton(wrapper, 'Up Next').trigger('click')

    expect(wrapper.find('[data-testid="up-next-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(false)
    expect(getNavigationButton(wrapper, 'Up Next').attributes('aria-current')).toBe('page')

    wrapper.unmount()
  })

  it('navigates to Calendar', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await getNavigationButton(wrapper, 'Calendar').trigger('click')

    expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(false)
    expect(getNavigationButton(wrapper, 'Calendar').attributes('aria-current')).toBe('page')

    wrapper.unmount()
  })

  it('navigates to Downloads and loads qBittorrent data', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await getNavigationButton(wrapper, 'Downloads').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Monitor and manage torrents from qBittorrent.')

    expect(mockedSendMessage).toHaveBeenCalledWith({
      type: 'GET_QBITTORRENT_DOWNLOADS',
    })

    expect(getNavigationButton(wrapper, 'Downloads').attributes('aria-current')).toBe('page')

    wrapper.unmount()
  })

  it('unmounts the previous view when navigating', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await getNavigationButton(wrapper, 'Downloads').trigger('click')
    await flushPromises()

    expect(wrapper.find('.downloads-template').exists()).toBe(true)

    await getNavigationButton(wrapper, 'Calendar').trigger('click')

    expect(wrapper.find('.downloads-template').exists()).toBe(false)
    expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)

    wrapper.unmount()
  })

  describe('Quick Access service integration', () => {
    it('loads safe service configurations when the app mounts', async () => {
      mockedGetSafeServices.mockResolvedValue(configuredServices)

      const wrapper = mount(App)
      await flushPromises()

      expect(mockedGetSafeServices).toHaveBeenCalledOnce()

      await openQuickAccess(wrapper)

      expect(wrapper.get('#quick-access-menu').text()).toContain('Jellyfin')
      expect(wrapper.get('#quick-access-menu').text()).toContain('Sonarr')

      wrapper.unmount()
    })

    it('preserves custom ports and reverse-proxy paths in service links', async () => {
      mockedGetSafeServices.mockResolvedValue(configuredServices)

      const wrapper = mount(App)
      await flushPromises()

      await openQuickAccess(wrapper)

      const links = wrapper.findAll('#quick-access-menu a')

      expect(links).toHaveLength(2)

      expect(links.map((link) => link.attributes('href'))).toContain(
        'https://media.example.com/jellyfin',
      )

      expect(links.map((link) => link.attributes('href'))).toContain(
        'https://home.example.com:8989/sonarr',
      )

      for (const link of links) {
        expect(link.attributes('target')).toBe('_blank')
        expect(link.attributes('rel')).toContain('noopener')
        expect(link.attributes('rel')).toContain('noreferrer')
      }

      wrapper.unmount()
    })

    it('shows an empty state when no services are configured', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await openQuickAccess(wrapper)

      expect(wrapper.get('#quick-access-menu').text()).toContain('No services configured')
      expect(wrapper.findAll('#quick-access-menu a')).toHaveLength(0)
      expect(wrapper.find('button[aria-label="Open settings"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('refreshes configured services when local service storage changes', async () => {
      const wrapper = mount(App)
      await flushPromises()

      await openQuickAccess(wrapper)

      expect(wrapper.get('#quick-access-menu').text()).toContain('No services configured')

      mockedGetSafeServices.mockResolvedValue(configuredServices)

      emitStorageChange({
        mediaManagarrServices: {
          newValue: configuredServices,
        },
      })

      await flushPromises()

      expect(mockedGetSafeServices).toHaveBeenCalledTimes(2)
      expect(wrapper.get('#quick-access-menu').text()).toContain('Jellyfin')
      expect(wrapper.get('#quick-access-menu').text()).toContain('Sonarr')
      expect(wrapper.get('#quick-access-menu').text()).not.toContain('No services configured')

      wrapper.unmount()
    })

    it('removes services from Quick Access when their configuration is removed', async () => {
      mockedGetSafeServices.mockResolvedValue(configuredServices)

      const wrapper = mount(App)
      await flushPromises()

      await openQuickAccess(wrapper)

      expect(wrapper.findAll('#quick-access-menu a')).toHaveLength(2)

      mockedGetSafeServices.mockResolvedValue({})

      emitStorageChange({
        mediaManagarrServices: {
          oldValue: configuredServices,
          newValue: {},
        },
      })

      await flushPromises()

      expect(wrapper.findAll('#quick-access-menu a')).toHaveLength(0)
      expect(wrapper.get('#quick-access-menu').text()).toContain('No services configured')

      wrapper.unmount()
    })

    it('ignores unrelated local storage changes', async () => {
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

    it('ignores service storage changes outside local storage', async () => {
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

    it('handles service configuration loading errors gracefully', async () => {
      mockedGetSafeServices.mockRejectedValue(new Error('Service storage unavailable.'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      expect(warnSpy).toHaveBeenCalledWith(
        'MediaManagarr: Unable to load safe service configurations:',
        expect.any(Error),
      )

      await openQuickAccess(wrapper)

      expect(wrapper.get('#quick-access-menu').text()).toContain('No services configured')
      expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('does not overwrite newer configurations with stale asynchronous results', async () => {
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

      await openQuickAccess(wrapper)

      expect(wrapper.get('#quick-access-menu').text()).toContain('Jellyfin')

      resolveInitialLoad?.({})
      await flushPromises()

      expect(wrapper.get('#quick-access-menu').text()).toContain('Jellyfin')
      expect(wrapper.get('#quick-access-menu').text()).not.toContain('No services configured')

      wrapper.unmount()
    })

    it('registers and removes the storage listener with the component lifecycle', async () => {
      const wrapper = mount(App)
      await flushPromises()

      expect(addStorageListener).toHaveBeenCalledOnce()
      expect(storageChangeListeners.size).toBe(1)

      wrapper.unmount()

      expect(removeStorageListener).toHaveBeenCalledOnce()
      expect(removeStorageListener).toHaveBeenCalledWith(addStorageListener.mock.calls[0]?.[0])
      expect(storageChangeListeners.size).toBe(0)
    })

    it('does not apply service configurations after the app unmounts', async () => {
      let resolveLoad: ((configs: SafeServiceConfigs) => void) | undefined

      mockedGetSafeServices.mockImplementation(
        () =>
          new Promise<SafeServiceConfigs>((resolve) => {
            resolveLoad = resolve
          }),
      )

      const wrapper = mount(App)
      await flushPromises()

      wrapper.unmount()

      resolveLoad?.(configuredServices)
      await flushPromises()

      expect(removeStorageListener).toHaveBeenCalledOnce()
      expect(storageChangeListeners.size).toBe(0)
    })

    it('keeps the app functional when Chrome storage is unavailable', async () => {
      vi.stubGlobal('chrome', undefined)

      const wrapper = mount(App)
      await flushPromises()

      expect(mockedGetSafeServices).not.toHaveBeenCalled()
      expect(addStorageListener).not.toHaveBeenCalled()

      await openQuickAccess(wrapper)

      expect(wrapper.get('#quick-access-menu').text()).toContain('No services configured')
      expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(true)

      wrapper.unmount()
    })
  })

  it('opens Settings through the workspace menu', async () => {
    const wrapper = mount(App)
    await flushPromises()

    const menuButton = wrapper.get('button[aria-label="Open workspace menu"]')

    expect(menuButton.attributes('aria-expanded')).toBe('false')

    await menuButton.trigger('click')

    expect(menuButton.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('button[aria-label="Open settings"]').exists()).toBe(true)

    await wrapper.get('button[aria-label="Open settings"]').trigger('click')

    expect(wrapper.get('h1').text()).toBe('Settings')
    expect(wrapper.find('[data-testid="settings-view"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('opens settings and hides the active view and navigation', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await openSettings(wrapper)

    expect(wrapper.get('h1').text()).toBe('Settings')
    expect(wrapper.find('[data-testid="settings-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(false)
    expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('returns to the previously selected view after closing settings', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await getNavigationButton(wrapper, 'Calendar').trigger('click')
    await openSettings(wrapper)

    expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(false)

    await wrapper.get('button[aria-label="Back to previous view"]').trigger('click')

    expect(wrapper.get('h1').text()).toBe('MediaManagarr')
    expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)
    expect(getNavigationButton(wrapper, 'Calendar').attributes('aria-current')).toBe('page')

    wrapper.unmount()
  })

  it('stops Downloads polling when navigating away', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await getNavigationButton(wrapper, 'Downloads').trigger('click')
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(5000)

    expect(mockedSendMessage).toHaveBeenCalledTimes(2)

    await getNavigationButton(wrapper, 'Calendar').trigger('click')
    await vi.advanceTimersByTimeAsync(15000)

    expect(mockedSendMessage).toHaveBeenCalledTimes(2)

    wrapper.unmount()
  })

  it('starts a fresh Downloads session when navigating back', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await getNavigationButton(wrapper, 'Downloads').trigger('click')
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledTimes(1)

    await getNavigationButton(wrapper, 'Calendar').trigger('click')
    await getNavigationButton(wrapper, 'Downloads').trigger('click')
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(5000)

    expect(mockedSendMessage).toHaveBeenCalledTimes(3)

    wrapper.unmount()
  })

  it('stops Downloads polling while settings is open', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await getNavigationButton(wrapper, 'Downloads').trigger('click')
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledTimes(1)

    await openSettings(wrapper)
    await vi.advanceTimersByTimeAsync(10000)

    expect(mockedSendMessage).toHaveBeenCalledTimes(1)

    await wrapper.get('button[aria-label="Back to previous view"]').trigger('click')
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledTimes(2)

    wrapper.unmount()
  })

  it('renders the application footer', () => {
    const wrapper = mount(App)

    expect(wrapper.text()).toContain('MediaManagarr')
    expect(wrapper.find('.footer').exists()).toBe(true)

    wrapper.unmount()
  })

  describe('workspace navigation persistence', () => {
    it('restores the previously selected navigation view', async () => {
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

    it('restores Settings when it was previously open', async () => {
      mockedGetWorkspaceState.mockResolvedValue({
        activeView: 'downloads',
        settingsOpen: true,
      })

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('[data-testid="settings-view"]').exists()).toBe(true)
      expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

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

    it('saves the current navigation state before detaching', async () => {
      mockedSendMessage.mockResolvedValue({
        success: true,
        windowId: 42,
      })

      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Calendar').trigger('click')
      await wrapper.get('button[aria-label="Detach workspace into a window"]').trigger('click')
      await flushPromises()

      expect(mockedSaveWorkspaceState).toHaveBeenCalledWith({
        activeView: 'calendar',
        settingsOpen: false,
      })

      expect(mockedSendMessage).toHaveBeenCalledWith({
        type: 'OPEN_DETACHED_WORKSPACE',
      })

      wrapper.unmount()
    })

    it('continues with defaults if restoring navigation state fails', async () => {
      mockedGetWorkspaceState.mockRejectedValue(new Error('Storage unavailable'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(true)
      expect(warnSpy).toHaveBeenCalled()

      wrapper.unmount()
    })

    it('does not attempt storage access when Chrome storage is unavailable', async () => {
      vi.stubGlobal('chrome', undefined)

      const wrapper = mount(App)
      await flushPromises()

      expect(mockedGetWorkspaceState).not.toHaveBeenCalled()

      await getNavigationButton(wrapper, 'Calendar').trigger('click')
      await flushPromises()

      expect(mockedSaveWorkspaceState).not.toHaveBeenCalled()

      wrapper.unmount()
    })
  })

  describe('detachable workspace', () => {
    it('starts in popup mode by default', () => {
      const wrapper = mount(App)

      expect(wrapper.find('.app-shell--detached').exists()).toBe(false)
      expect(wrapper.find('.app-shell--sidebar').exists()).toBe(false)
      expect(wrapper.find('button[aria-label="Detach workspace into a window"]').exists()).toBe(
        true,
      )
      expect(wrapper.find('button[aria-label="Attach workspace to toolbar"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('detects detached mode from the URL query parameter', () => {
      setWorkspaceMode('detached')

      const wrapper = mount(App)

      expect(wrapper.find('.app-shell--detached').exists()).toBe(true)
      expect(wrapper.find('.app-shell--sidebar').exists()).toBe(false)
      expect(wrapper.find('button[aria-label="Attach workspace to toolbar"]').exists()).toBe(true)
      expect(wrapper.find('button[aria-label="Detach workspace into a window"]').exists()).toBe(
        false,
      )

      wrapper.unmount()
    })

    it('does not activate detached mode for unrelated query parameters', () => {
      window.history.replaceState(null, '', `${window.location.pathname}?workspace=other`)

      const wrapper = mount(App)

      expect(wrapper.find('.app-shell--detached').exists()).toBe(false)
      expect(wrapper.find('.app-shell--sidebar').exists()).toBe(false)
      expect(wrapper.find('button[aria-label="Detach workspace into a window"]').exists()).toBe(
        true,
      )

      wrapper.unmount()
    })

    it('requests a detached window when Detach is clicked', async () => {
      mockedSendMessage.mockResolvedValue({
        success: true,
        windowId: 42,
      })

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Detach workspace into a window"]').trigger('click')
      await flushPromises()

      expect(mockedSendMessage).toHaveBeenCalledWith({
        type: 'OPEN_DETACHED_WORKSPACE',
      })

      expect(wrapper.find('[role="alert"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('shows an error if opening the detached window fails', async () => {
      mockedSendMessage.mockResolvedValue({
        success: false,
        error: 'Unable to create workspace window.',
      })

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Detach workspace into a window"]').trigger('click')
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toBe('Unable to create workspace window.')

      wrapper.unmount()
    })

    it('shows an error if the background message rejects', async () => {
      mockedSendMessage.mockRejectedValue(new Error('Extension context unavailable.'))

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Detach workspace into a window"]').trigger('click')
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toBe('Extension context unavailable.')

      wrapper.unmount()
    })

    it('closes the detached window when Attach is clicked', async () => {
      setWorkspaceMode('detached')

      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)

      await wrapper.get('button[aria-label="Attach workspace to toolbar"]').trigger('click')

      expect(closeSpy).toHaveBeenCalledOnce()

      wrapper.unmount()
    })

    it('does not show Attach in popup mode', () => {
      const wrapper = mount(App)

      expect(wrapper.find('button[aria-label="Attach workspace to toolbar"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('keeps navigation available in detached mode', async () => {
      setWorkspaceMode('detached')

      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Calendar').trigger('click')

      expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)
      expect(wrapper.find('.app-shell--detached').exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('native sidebar workspace', () => {
    it('shows the sidebar button in popup mode', () => {
      const wrapper = mount(App)

      expect(wrapper.find('button[aria-label="Open workspace in browser sidebar"]').exists()).toBe(
        true,
      )

      wrapper.unmount()
    })

    it('detects sidebar mode from the URL query parameter', () => {
      setWorkspaceMode('sidebar')

      const wrapper = mount(App)

      expect(wrapper.find('.app-shell--sidebar').exists()).toBe(true)
      expect(wrapper.find('.app-shell--detached').exists()).toBe(false)

      wrapper.unmount()
    })

    it('hides the sidebar button while already in sidebar mode', () => {
      setWorkspaceMode('sidebar')

      const wrapper = mount(App)

      expect(wrapper.find('button[aria-label="Open workspace in browser sidebar"]').exists()).toBe(
        false,
      )

      wrapper.unmount()
    })

    it('shows the close sidebar button in sidebar mode', () => {
      setWorkspaceMode('sidebar')

      const wrapper = mount(App)

      expect(wrapper.find('button[aria-label="Close browser sidebar"]').exists()).toBe(true)

      wrapper.unmount()
    })

    it('hides the close sidebar button in popup mode', () => {
      const wrapper = mount(App)

      expect(wrapper.find('button[aria-label="Close browser sidebar"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('hides detach and attach buttons in sidebar mode', () => {
      setWorkspaceMode('sidebar')

      const wrapper = mount(App)

      expect(wrapper.find('button[aria-label="Detach workspace into a window"]').exists()).toBe(
        false,
      )

      expect(wrapper.find('button[aria-label="Attach workspace to toolbar"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('keeps the sidebar button available in detached mode', () => {
      setWorkspaceMode('detached')

      const wrapper = mount(App)

      expect(wrapper.find('button[aria-label="Open workspace in browser sidebar"]').exists()).toBe(
        true,
      )

      wrapper.unmount()
    })

    it('opens the native sidebar and closes the popup', async () => {
      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Open workspace in browser sidebar"]').trigger('click')
      await flushPromises()

      expect(mockedOpenSidebar).toHaveBeenCalledOnce()
      expect(closeSpy).toHaveBeenCalledOnce()
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('opens the native sidebar and closes the detached window', async () => {
      setWorkspaceMode('detached')

      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Open workspace in browser sidebar"]').trigger('click')
      await flushPromises()

      expect(mockedOpenSidebar).toHaveBeenCalledOnce()
      expect(closeSpy).toHaveBeenCalledOnce()
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('saves navigation state before closing the popup', async () => {
      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Calendar').trigger('click')
      await flushPromises()

      mockedSaveWorkspaceState.mockClear()

      await wrapper.get('button[aria-label="Open workspace in browser sidebar"]').trigger('click')
      await flushPromises()

      expect(mockedSaveWorkspaceState).toHaveBeenCalledWith({
        activeView: 'calendar',
        settingsOpen: false,
      })

      expect(mockedOpenSidebar).toHaveBeenCalledOnce()
      expect(closeSpy).toHaveBeenCalledOnce()

      wrapper.unmount()
    })

    it('starts opening the sidebar before waiting for storage', async () => {
      let resolveSave: (() => void) | undefined

      mockedSaveWorkspaceState.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveSave = resolve
          }),
      )

      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Open workspace in browser sidebar"]').trigger('click')

      expect(mockedOpenSidebar).toHaveBeenCalledOnce()
      expect(closeSpy).not.toHaveBeenCalled()

      resolveSave?.()
      await flushPromises()

      expect(closeSpy).toHaveBeenCalledOnce()

      wrapper.unmount()
    })

    it('continues opening the sidebar if saving navigation fails', async () => {
      mockedSaveWorkspaceState.mockRejectedValue(new Error('Storage unavailable.'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Open workspace in browser sidebar"]').trigger('click')
      await flushPromises()

      expect(mockedOpenSidebar).toHaveBeenCalledOnce()
      expect(closeSpy).toHaveBeenCalledOnce()
      expect(warnSpy).toHaveBeenCalled()
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('does not send a background message when opening the sidebar', async () => {
      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Open workspace in browser sidebar"]').trigger('click')
      await flushPromises()

      expect(mockedOpenSidebar).toHaveBeenCalledOnce()
      expect(mockedSendMessage).not.toHaveBeenCalled()
      expect(closeSpy).toHaveBeenCalledOnce()

      wrapper.unmount()
    })

    it('shows an error and keeps the popup open when opening the sidebar fails', async () => {
      mockedOpenSidebar.mockRejectedValue(new Error('Sidebar unavailable.'))

      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Open workspace in browser sidebar"]').trigger('click')
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toBe('Sidebar unavailable.')
      expect(closeSpy).not.toHaveBeenCalled()

      wrapper.unmount()
    })

    it('shows a fallback error when the sidebar rejects with an unknown value', async () => {
      mockedOpenSidebar.mockRejectedValue('Unknown failure')

      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Open workspace in browser sidebar"]').trigger('click')
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toBe('Unable to open the browser sidebar.')
      expect(closeSpy).not.toHaveBeenCalled()

      wrapper.unmount()
    })

    it('does not start another sidebar request while one is pending', async () => {
      let resolveOpen: (() => void) | undefined

      mockedOpenSidebar.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveOpen = resolve
          }),
      )

      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      const button = wrapper.get('button[aria-label="Open workspace in browser sidebar"]')

      await button.trigger('click')
      await button.trigger('click')

      expect(mockedOpenSidebar).toHaveBeenCalledOnce()
      expect(closeSpy).not.toHaveBeenCalled()

      resolveOpen?.()
      await flushPromises()

      expect(closeSpy).toHaveBeenCalledOnce()

      wrapper.unmount()
    })

    it('allows another sidebar request after a failed attempt', async () => {
      mockedOpenSidebar
        .mockRejectedValueOnce(new Error('Temporary failure.'))
        .mockResolvedValueOnce(undefined)

      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      const button = wrapper.get('button[aria-label="Open workspace in browser sidebar"]')

      await button.trigger('click')
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toBe('Temporary failure.')
      expect(closeSpy).not.toHaveBeenCalled()

      await button.trigger('click')
      await flushPromises()

      expect(mockedOpenSidebar).toHaveBeenCalledTimes(2)
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
      expect(closeSpy).toHaveBeenCalledOnce()

      wrapper.unmount()
    })

    it('closes the native sidebar when Close is clicked', async () => {
      setWorkspaceMode('sidebar')

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Close browser sidebar"]').trigger('click')
      await flushPromises()

      expect(mockedCloseSidebar).toHaveBeenCalledOnce()
      expect(mockedOpenSidebar).not.toHaveBeenCalled()
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('does not close the window when closing the sidebar succeeds', async () => {
      setWorkspaceMode('sidebar')

      const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Close browser sidebar"]').trigger('click')
      await flushPromises()

      expect(mockedCloseSidebar).toHaveBeenCalledOnce()
      expect(closeSpy).not.toHaveBeenCalled()

      wrapper.unmount()
    })

    it('shows an error when closing the sidebar fails', async () => {
      setWorkspaceMode('sidebar')

      mockedCloseSidebar.mockRejectedValue(new Error('Unable to close sidebar.'))

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Close browser sidebar"]').trigger('click')
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toBe('Unable to close sidebar.')
      expect(wrapper.find('.app-shell--sidebar').exists()).toBe(true)

      wrapper.unmount()
    })

    it('shows a fallback error when closing rejects with an unknown value', async () => {
      setWorkspaceMode('sidebar')

      mockedCloseSidebar.mockRejectedValue('Unknown failure')

      const wrapper = mount(App)
      await flushPromises()

      await wrapper.get('button[aria-label="Close browser sidebar"]').trigger('click')
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toBe('Unable to close the browser sidebar.')

      wrapper.unmount()
    })

    it('does not start another close request while one is pending', async () => {
      setWorkspaceMode('sidebar')

      let resolveClose: (() => void) | undefined

      mockedCloseSidebar.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveClose = resolve
          }),
      )

      const wrapper = mount(App)
      await flushPromises()

      const button = wrapper.get('button[aria-label="Close browser sidebar"]')

      await button.trigger('click')
      await button.trigger('click')

      expect(mockedCloseSidebar).toHaveBeenCalledOnce()

      resolveClose?.()
      await flushPromises()

      expect(wrapper.find('[role="alert"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('allows another close request after a failed attempt', async () => {
      setWorkspaceMode('sidebar')

      mockedCloseSidebar
        .mockRejectedValueOnce(new Error('Temporary close failure.'))
        .mockResolvedValueOnce(undefined)

      const wrapper = mount(App)
      await flushPromises()

      const button = wrapper.get('button[aria-label="Close browser sidebar"]')

      await button.trigger('click')
      await flushPromises()

      expect(wrapper.get('[role="alert"]').text()).toBe('Temporary close failure.')

      await button.trigger('click')
      await flushPromises()

      expect(mockedCloseSidebar).toHaveBeenCalledTimes(2)
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)

      wrapper.unmount()
    })

    it('keeps navigation available in sidebar mode', async () => {
      setWorkspaceMode('sidebar')

      const wrapper = mount(App)
      await flushPromises()

      await getNavigationButton(wrapper, 'Calendar').trigger('click')

      expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)
      expect(wrapper.find('.app-shell--sidebar').exists()).toBe(true)

      wrapper.unmount()
    })

    it('keeps settings available in sidebar mode', async () => {
      setWorkspaceMode('sidebar')

      const wrapper = mount(App)
      await flushPromises()

      await openSettings(wrapper)

      expect(wrapper.get('h1').text()).toBe('Settings')
      expect(wrapper.find('[data-testid="settings-view"]').exists()).toBe(true)

      await wrapper.get('button[aria-label="Back to previous view"]').trigger('click')

      expect(wrapper.get('h1').text()).toBe('MediaManagarr')

      wrapper.unmount()
    })

    it('restores navigation state in sidebar mode', async () => {
      setWorkspaceMode('sidebar')

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
  })
})
