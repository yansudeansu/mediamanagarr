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

function mockConfigLoad() {
  vi.mocked(sendBackgroundMessage).mockResolvedValue({
    success: true,
    configs: savedConfigs,
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
    vi.mocked(sendBackgroundMessage)
      .mockResolvedValueOnce({
        success: true,
        configs: {},
      })
      .mockResolvedValueOnce({
        success: true,
        serviceId: 'jellyfin',
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
    vi.mocked(sendBackgroundMessage)
      .mockResolvedValueOnce({
        success: true,
        configs: {},
      })
      .mockResolvedValueOnce({
        success: true,
        serviceId: 'jellyfin',
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
    vi.mocked(sendBackgroundMessage)
      .mockResolvedValueOnce({
        success: true,
        configs: savedConfigs,
      })
      .mockResolvedValueOnce({
        success: false,
        error: 'Authentication failed.',
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
    vi.mocked(sendBackgroundMessage)
      .mockResolvedValueOnce({
        success: true,
        configs: {},
      })
      .mockResolvedValueOnce({
        success: false,
        error: 'Connection failed.',
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
})
