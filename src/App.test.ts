import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import App from './App.vue'
import { sendBackgroundMessage } from './utils/background-messaging'

vi.mock('./utils/background-messaging', () => ({
  sendBackgroundMessage: vi.fn(),
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

const emptyDownloads = {
  success: true as const,
  downloads: {
    torrents: [],
    downloadSpeed: 0,
    uploadSpeed: 0,
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

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    mockBackgroundMessages()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
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

  it('starts on the Requests view', () => {
    const wrapper = mount(App)

    expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="downloads-view"]').exists()).toBe(false)

    expect(getNavigationButton(wrapper, 'Requests').attributes('aria-current')).toBe('page')

    wrapper.unmount()
  })

  it('navigates to Up Next', async () => {
    const wrapper = mount(App)

    await getNavigationButton(wrapper, 'Up Next').trigger('click')

    expect(wrapper.find('[data-testid="up-next-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(false)

    expect(getNavigationButton(wrapper, 'Up Next').attributes('aria-current')).toBe('page')

    wrapper.unmount()
  })

  it('navigates to Calendar', async () => {
    const wrapper = mount(App)

    await getNavigationButton(wrapper, 'Calendar').trigger('click')

    expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(false)

    expect(getNavigationButton(wrapper, 'Calendar').attributes('aria-current')).toBe('page')

    wrapper.unmount()
  })

  it('navigates to Downloads and loads qBittorrent data', async () => {
    const wrapper = mount(App)

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

    await getNavigationButton(wrapper, 'Downloads').trigger('click')
    await flushPromises()

    expect(wrapper.find('.downloads-template').exists()).toBe(true)

    await getNavigationButton(wrapper, 'Calendar').trigger('click')

    expect(wrapper.find('.downloads-template').exists()).toBe(false)
    expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('opens settings and hides the active view and navigation', async () => {
    const wrapper = mount(App)

    await wrapper.get('button[aria-label="Open settings"]').trigger('click')

    expect(wrapper.get('h1').text()).toBe('Settings')
    expect(wrapper.find('[data-testid="settings-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="requests-view"]').exists()).toBe(false)
    expect(wrapper.find('nav[aria-label="Main navigation"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('returns to the previously selected view after closing settings', async () => {
    const wrapper = mount(App)

    await getNavigationButton(wrapper, 'Calendar').trigger('click')

    await wrapper.get('button[aria-label="Open settings"]').trigger('click')

    expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(false)

    await wrapper.get('button[aria-label="Back to previous view"]').trigger('click')

    expect(wrapper.get('h1').text()).toBe('MediaManagarr')
    expect(wrapper.find('[data-testid="calendar-view"]').exists()).toBe(true)

    expect(getNavigationButton(wrapper, 'Calendar').attributes('aria-current')).toBe('page')

    wrapper.unmount()
  })

  it('stops Downloads polling when navigating away', async () => {
    const wrapper = mount(App)

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

    await getNavigationButton(wrapper, 'Downloads').trigger('click')
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledTimes(1)

    await wrapper.get('button[aria-label="Open settings"]').trigger('click')

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
})
