import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SettingsView from './SettingsView.vue'
import MmServiceSelector from '../components/organisms/MmServiceSelector/MmServiceSelector.vue'
import MmServiceForm from '../components/organisms/MmServiceForm/MmServiceForm.vue'
import { sendBackgroundMessage } from '../utils/background-messaging'

vi.mock('../utils/background-messaging', () => ({
  sendBackgroundMessage: vi.fn(),
}))

const savedConfigs = {
  jellyfin: {
    url: 'https://jellyfin.example.com',
    configured: true,
  },
  sonarr: {
    url: 'https://sonarr.example.com',
    configured: true,
  },
}

const jellyfinUsers = [
  { id: 'user-1', name: 'Alice' },
  { id: 'user-2', name: 'Bob' },
]

function mockConfigLoad() {
  vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
    switch (message.type) {
      case 'GET_SERVICE_CONFIGS':
        return {
          success: true,
          configs: savedConfigs,
        }

      case 'GET_JELLYFIN_USERS':
        return {
          success: true,
          users: jellyfinUsers,
          selectedUserId: 'user-1',
        }

      case 'CONNECT_SERVICE':
        return {
          success: true,
          serviceId: message.serviceId,
        }

      case 'SET_JELLYFIN_USER':
        return {
          success: true,
          userId: message.userId,
        }
    }
  })
}

describe('SettingsView', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.stubGlobal('chrome', {
      permissions: {
        request: vi.fn().mockResolvedValue(true),
      },
    })

    mockConfigLoad()
  })

  it('renders the service selector and configuration form', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    expect(wrapper.findComponent(MmServiceSelector).exists()).toBe(true)
    expect(wrapper.findComponent(MmServiceForm).exists()).toBe(true)
  })

  it('selects Jellyfin by default', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    expect(wrapper.getComponent(MmServiceForm).props('serviceId')).toBe('jellyfin')
  })

  it('loads saved URLs from the background', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'GET_SERVICE_CONFIGS',
    })

    expect(wrapper.getComponent(MmServiceForm).props('url')).toBe('https://jellyfin.example.com')
    expect(wrapper.getComponent(MmServiceForm).props('configured')).toBe(true)
  })

  it('updates the form when another service is selected', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceSelector).vm.$emit('update:modelValue', 'sonarr')
    await wrapper.vm.$nextTick()

    expect(wrapper.getComponent(MmServiceForm).props('serviceId')).toBe('sonarr')
    expect(wrapper.getComponent(MmServiceForm).props('url')).toBe('https://sonarr.example.com')
  })

  it('marks a service without saved credentials as not configured', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceSelector).vm.$emit('update:modelValue', 'radarr')
    await wrapper.vm.$nextTick()

    expect(wrapper.getComponent(MmServiceForm).props('configured')).toBe(false)
  })

  it('requests host permission before connecting', async () => {
    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      switch (message.type) {
        case 'GET_SERVICE_CONFIGS':
          return { success: true, configs: {} }

        case 'GET_JELLYFIN_USERS':
          return {
            success: true,
            users: jellyfinUsers,
            selectedUserId: '',
          }

        case 'CONNECT_SERVICE':
          return {
            success: true,
            serviceId: message.serviceId,
          }

        case 'SET_JELLYFIN_USER':
          return {
            success: true,
            userId: message.userId,
          }
      }
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      serviceId: 'jellyfin',
      url: 'http://localhost:8096/',
      apiKey: 'secret',
    })

    await flushPromises()

    expect(chrome.permissions.request).toHaveBeenCalledWith({
      origins: ['http://localhost/*'],
    })

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'CONNECT_SERVICE',
      serviceId: 'jellyfin',
      config: {
        url: 'http://localhost:8096',
        apiKey: 'secret',
      },
    })
  })

  it('updates the service after a successful connection', async () => {
    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      switch (message.type) {
        case 'GET_SERVICE_CONFIGS':
          return { success: true, configs: {} }

        case 'GET_JELLYFIN_USERS':
          return {
            success: true,
            users: jellyfinUsers,
            selectedUserId: '',
          }

        case 'CONNECT_SERVICE':
          return {
            success: true,
            serviceId: message.serviceId,
          }

        case 'SET_JELLYFIN_USER':
          return {
            success: true,
            userId: message.userId,
          }
      }
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      serviceId: 'jellyfin',
      url: 'https://jellyfin.example.com',
      apiKey: 'secret',
    })

    await flushPromises()

    expect(wrapper.getComponent(MmServiceForm).props('configured')).toBe(true)
    expect(wrapper.getComponent(MmServiceForm).props('url')).toBe('https://jellyfin.example.com')
  })

  it('does not connect when permission is denied', async () => {
    vi.stubGlobal('chrome', {
      permissions: {
        request: vi.fn().mockResolvedValue(false),
      },
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      serviceId: 'jellyfin',
      url: 'https://jellyfin.example.com',
      apiKey: 'secret',
    })

    await flushPromises()

    expect(sendBackgroundMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'CONNECT_SERVICE',
      }),
    )

    expect(wrapper.getComponent(MmServiceForm).props('error')).toBe(
      'Server access was not granted.',
    )
  })

  it('does not overwrite saved configuration after a failed connection', async () => {
    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      switch (message.type) {
        case 'GET_SERVICE_CONFIGS':
          return {
            success: true,
            configs: savedConfigs,
          }

        case 'GET_JELLYFIN_USERS':
          return {
            success: true,
            users: jellyfinUsers,
            selectedUserId: 'user-1',
          }

        case 'CONNECT_SERVICE':
          return {
            success: false,
            error: 'Authentication failed.',
          }

        case 'SET_JELLYFIN_USER':
          return {
            success: true,
            userId: message.userId,
          }
      }
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      serviceId: 'jellyfin',
      url: 'https://different.example.com',
      apiKey: 'wrong-key',
    })

    await flushPromises()

    expect(wrapper.getComponent(MmServiceForm).props('url')).toBe('https://jellyfin.example.com')
    expect(wrapper.getComponent(MmServiceForm).props('configured')).toBe(true)
    expect(wrapper.getComponent(MmServiceForm).props('error')).toBe('Authentication failed.')
  })

  it('keeps errors scoped to their service', async () => {
    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      switch (message.type) {
        case 'GET_SERVICE_CONFIGS':
          return { success: true, configs: {} }

        case 'GET_JELLYFIN_USERS':
          return {
            success: true,
            users: jellyfinUsers,
            selectedUserId: '',
          }

        case 'CONNECT_SERVICE':
          return {
            success: false,
            error: 'Connection failed.',
          }

        case 'SET_JELLYFIN_USER':
          return {
            success: true,
            userId: message.userId,
          }
      }
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      serviceId: 'jellyfin',
      url: 'https://jellyfin.example.com',
      apiKey: 'secret',
    })

    await flushPromises()

    expect(wrapper.getComponent(MmServiceForm).props('error')).toBe('Connection failed.')

    wrapper.getComponent(MmServiceSelector).vm.$emit('update:modelValue', 'sonarr')
    await wrapper.vm.$nextTick()

    expect(wrapper.getComponent(MmServiceForm).props('error')).toBe('')
  })

  it('loads Jellyfin users when a saved configuration exists', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'GET_JELLYFIN_USERS',
    })

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('jellyfinUsers')).toEqual(jellyfinUsers)
    expect(form.props('jellyfinUserId')).toBe('user-1')
  })

  it('saves a selected Jellyfin user', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('selectJellyfinUser', 'user-2')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'SET_JELLYFIN_USER',
      userId: 'user-2',
    })

    expect(wrapper.getComponent(MmServiceForm).props('jellyfinUserId')).toBe('user-2')
  })

  it('keeps the previous selection when saving fails', async () => {
    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      switch (message.type) {
        case 'GET_SERVICE_CONFIGS':
          return {
            success: true,
            configs: savedConfigs,
          }

        case 'GET_JELLYFIN_USERS':
          return {
            success: true,
            users: jellyfinUsers,
            selectedUserId: 'user-1',
          }

        case 'CONNECT_SERVICE':
          return {
            success: true,
            serviceId: message.serviceId,
          }

        case 'SET_JELLYFIN_USER':
          return {
            success: false,
            error: 'Unable to save Jellyfin user.',
          }
      }
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('selectJellyfinUser', 'user-2')
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('jellyfinUserId')).toBe('user-1')
    expect(form.props('jellyfinUsersError')).toBe('Unable to save Jellyfin user.')
  })

  it('shows a Jellyfin user-loading error without failing the service connection', async () => {
    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      switch (message.type) {
        case 'GET_SERVICE_CONFIGS':
          return {
            success: true,
            configs: savedConfigs,
          }

        case 'GET_JELLYFIN_USERS':
          return {
            success: false,
            error: 'Unable to reach Jellyfin.',
          }

        case 'CONNECT_SERVICE':
          return {
            success: true,
            serviceId: message.serviceId,
          }

        case 'SET_JELLYFIN_USER':
          return {
            success: true,
            userId: message.userId,
          }
      }
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('configured')).toBe(true)
    expect(form.props('error')).toBe('')
    expect(form.props('jellyfinUsersError')).toBe('Unable to reach Jellyfin.')
  })

  it('refreshes Jellyfin users after a successful connection', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    const initialRequests = vi
      .mocked(sendBackgroundMessage)
      .mock.calls.filter(([message]) => message.type === 'GET_JELLYFIN_USERS').length

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      serviceId: 'jellyfin',
      url: 'https://jellyfin.example.com',
      apiKey: '',
    })

    await flushPromises()

    const finalRequests = vi
      .mocked(sendBackgroundMessage)
      .mock.calls.filter(([message]) => message.type === 'GET_JELLYFIN_USERS').length

    expect(finalRequests).toBe(initialRequests + 1)
  })

  it('does not request Jellyfin users when Jellyfin is not configured', async () => {
    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      switch (message.type) {
        case 'GET_SERVICE_CONFIGS':
          return {
            success: true,
            configs: {},
          }

        case 'GET_JELLYFIN_USERS':
          return {
            success: true,
            users: jellyfinUsers,
            selectedUserId: '',
          }

        case 'CONNECT_SERVICE':
          return {
            success: true,
            serviceId: message.serviceId,
          }

        case 'SET_JELLYFIN_USER':
          return {
            success: true,
            userId: message.userId,
          }
      }
    })

    mount(SettingsView)
    await flushPromises()

    expect(sendBackgroundMessage).not.toHaveBeenCalledWith({
      type: 'GET_JELLYFIN_USERS',
    })
  })
})
