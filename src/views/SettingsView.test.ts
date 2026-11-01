import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import SettingsView from './SettingsView.vue'
import MmServiceSelector from '../components/organisms/MmServiceSelector/MmServiceSelector.vue'
import MmServiceForm from '../components/organisms/MmServiceForm/MmServiceForm.vue'
import { sendBackgroundMessage } from '../utils/background-messaging'

import type { SafeServiceConfigs, ServiceHealthStates } from '../types/service'

vi.mock('../utils/background-messaging', () => ({
  sendBackgroundMessage: vi.fn(),
}))

function serviceStatus(wrapper: ReturnType<typeof mount>, serviceId: string): string | undefined {
  const selector = wrapper.getComponent(MmServiceSelector)

  const services = selector.props('services') as Array<{
    id: string
    name: string
    status: string
  }>

  return services.find((service) => service.id === serviceId)?.status
}

function savedConfigs(): SafeServiceConfigs {
  return {
    jellyfin: {
      url: 'https://jellyfin.example.com',
      configured: true,
    },
    sonarr: {
      url: 'https://sonarr.example.com',
      configured: true,
    },
  }
}

const jellyfinUsers = [
  { id: 'user-1', name: 'Alice' },
  { id: 'user-2', name: 'Bob' },
]

const connectedHealth = {
  status: 'connected' as const,
  lastCheckedAt: '2026-10-31T12:00:00.000Z',
}

const failedHealth = {
  status: 'failed' as const,
  lastCheckedAt: '2026-10-31T11:00:00.000Z',
  error: 'Unable to reach the server.',
}

function mockConfigLoad(
  configs: SafeServiceConfigs = savedConfigs(),
  initialHealth: ServiceHealthStates = {},
) {
  const health: ServiceHealthStates = { ...initialHealth }

  vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
    switch (message.type) {
      case 'GET_SERVICE_CONFIGS':
        return {
          success: true,
          configs,
        }

      case 'GET_SERVICE_HEALTH':
        return {
          success: true,
          health: { ...health },
        }

      case 'GET_JELLYFIN_USERS':
        return {
          success: true,
          users: jellyfinUsers,
          selectedUserId: 'user-1',
        }

      case 'CONNECT_SERVICE':
        health[message.serviceId] = {
          status: 'connected',
          lastCheckedAt: new Date().toISOString(),
        }

        return {
          success: true,
          serviceId: message.serviceId,
        }

      case 'TEST_SERVICE_CONNECTION':
        health[message.serviceId] = {
          status: 'connected',
          lastCheckedAt: new Date().toISOString(),
        }

        return {
          success: true,
          serviceId: message.serviceId,
        }

      case 'REMOVE_SERVICE':
        delete health[message.serviceId]

        return {
          success: true,
          serviceId: message.serviceId,
        }

      case 'SET_JELLYFIN_USER':
        return {
          success: true,
          userId: message.userId,
        }

      default:
        throw new Error(`Unexpected background message: ${message.type}`)
    }
  })
}

function deferredResponse<T>() {
  let resolve!: (value: T) => void

  const promise = new Promise<T>((resolver) => {
    resolve = resolver
  })

  return { promise, resolve }
}

function overrideBackgroundResponse(type: string, response: Record<string, unknown>) {
  const original = vi.mocked(sendBackgroundMessage).getMockImplementation()

  vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
    if (message.type === type) {
      return response as never
    }

    if (!original) {
      throw new Error('Missing background mock.')
    }

    return original(message)
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

    expect(wrapper.getComponent(MmServiceSelector).props('modelValue')).toBe('jellyfin')

    expect(wrapper.getComponent(MmServiceForm).props('name')).toBe('Jellyfin')
  })

  it('loads saved URLs from the background', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'GET_SERVICE_CONFIGS',
    })

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('url')).toBe('https://jellyfin.example.com')
    expect(form.props('configured')).toBe(true)
  })

  it('loads persisted service health when Settings opens', async () => {
    mockConfigLoad(savedConfigs(), {
      jellyfin: connectedHealth,
      sonarr: failedHealth,
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'GET_SERVICE_HEALTH',
    })

    expect(serviceStatus(wrapper, 'jellyfin')).toBe('connected')
    expect(serviceStatus(wrapper, 'sonarr')).toBe('failed')

    const health = wrapper.get('.service-health')

    expect(health.element.tagName).toBe('DIV')
    expect(health.attributes('role')).toBeUndefined()
    expect(health.get('.status-badge__label').text()).toBe('Connected')
  })

  it('shows configured status when no health check has been recorded', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    expect(serviceStatus(wrapper, 'jellyfin')).toBe('configured')

    expect(wrapper.get('.service-health .status-badge__label').text()).toBe('Not checked yet')
  })

  it('shows persisted connection failures', async () => {
    mockConfigLoad(savedConfigs(), {
      jellyfin: failedHealth,
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    const health = wrapper.get('.service-health')

    expect(serviceStatus(wrapper, 'jellyfin')).toBe('failed')

    expect(health.get('.status-badge__label').text()).toBe('Connection failed')
    expect(health.text()).toContain('Unable to reach the server.')
    expect(health.get('[role="alert"]').text()).toBe('Unable to reach the server.')
  })

  it('shows a formatted last successful health check time', async () => {
    mockConfigLoad(savedConfigs(), {
      jellyfin: connectedHealth,
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    const time = wrapper.get('.service-health__time').text()

    expect(time).toBeTruthy()
    expect(time).toContain('2026')
    expect(time).not.toBe('Invalid Date')
  })

  it('does not display invalid health timestamps', async () => {
    mockConfigLoad(savedConfigs(), {
      jellyfin: {
        status: 'connected',
        lastCheckedAt: 'invalid-date',
      },
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    expect(wrapper.find('.service-health__time').exists()).toBe(false)
  })

  it('does not show health for an unconfigured service', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceSelector).vm.$emit('update:modelValue', 'radarr')

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.service-health').exists()).toBe(false)
  })

  it('keeps health scoped to the selected service', async () => {
    mockConfigLoad(savedConfigs(), {
      jellyfin: connectedHealth,
      sonarr: failedHealth,
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    const selector = wrapper.getComponent(MmServiceSelector)

    expect(wrapper.get('.service-health .status-badge__label').text()).toBe('Connected')

    selector.vm.$emit('update:modelValue', 'sonarr')
    await wrapper.vm.$nextTick()

    expect(wrapper.get('.service-health .status-badge__label').text()).toBe('Connection failed')

    selector.vm.$emit('update:modelValue', 'jellyfin')
    await wrapper.vm.$nextTick()

    expect(wrapper.get('.service-health .status-badge__label').text()).toBe('Connected')
  })

  it('keeps Settings usable when loading health fails', async () => {
    overrideBackgroundResponse('GET_SERVICE_HEALTH', {
      success: false,
      error: 'Health storage unavailable.',
    })

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    try {
      const wrapper = mount(SettingsView)
      await flushPromises()

      const form = wrapper.getComponent(MmServiceForm)

      expect(form.props('configured')).toBe(true)
      expect(form.props('url')).toBe('https://jellyfin.example.com')

      expect(serviceStatus(wrapper, 'jellyfin')).toBe('configured')

      expect(warn).toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })

  it('updates the form when another service is selected', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceSelector).vm.$emit('update:modelValue', 'sonarr')

    await wrapper.vm.$nextTick()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('name')).toBe('Sonarr')
    expect(form.props('url')).toBe('https://sonarr.example.com')
  })

  it('marks services without saved credentials as not configured', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceSelector).vm.$emit('update:modelValue', 'radarr')

    await wrapper.vm.$nextTick()

    expect(wrapper.getComponent(MmServiceForm).props('configured')).toBe(false)
  })

  it('requests host permission before connecting', async () => {
    mockConfigLoad({})

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
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
    mockConfigLoad({})

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      url: 'https://jellyfin.example.com',
      apiKey: 'secret',
    })

    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('configured')).toBe(true)
    expect(form.props('url')).toBe('https://jellyfin.example.com')

    expect(serviceStatus(wrapper, 'jellyfin')).toBe('connected')
  })

  it('refreshes health after connecting', async () => {
    mockConfigLoad({})

    const wrapper = mount(SettingsView)
    await flushPromises()

    const countHealthRequests = () =>
      vi
        .mocked(sendBackgroundMessage)
        .mock.calls.filter(([message]) => message.type === 'GET_SERVICE_HEALTH').length

    const initialCount = countHealthRequests()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      url: 'https://jellyfin.example.com',
      apiKey: 'secret',
    })

    await flushPromises()

    expect(countHealthRequests()).toBe(initialCount + 1)

    expect(wrapper.get('.service-health .status-badge__label').text()).toBe('Connected')
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

  it('preserves saved configuration after a failed connection edit', async () => {
    overrideBackgroundResponse('CONNECT_SERVICE', {
      success: false,
      error: 'Authentication failed.',
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      url: 'https://different.example.com',
      apiKey: 'wrong-key',
    })

    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('url')).toBe('https://jellyfin.example.com')
    expect(form.props('configured')).toBe(true)
    expect(form.props('error')).toBe('Authentication failed.')
  })

  it('preserves persisted health after a failed connection edit', async () => {
    mockConfigLoad(savedConfigs(), {
      jellyfin: connectedHealth,
    })

    overrideBackgroundResponse('CONNECT_SERVICE', {
      success: false,
      error: 'Replacement authentication failed.',
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      url: 'https://different.example.com',
      apiKey: 'wrong-key',
    })

    await flushPromises()

    expect(serviceStatus(wrapper, 'jellyfin')).toBe('connected')

    expect(wrapper.get('.service-health .status-badge__label').text()).toBe('Connected')

    expect(wrapper.getComponent(MmServiceForm).props('error')).toBe(
      'Replacement authentication failed.',
    )
  })

  it('keeps errors scoped to their service', async () => {
    mockConfigLoad({})

    overrideBackgroundResponse('CONNECT_SERVICE', {
      success: false,
      error: 'Connection failed.',
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      url: 'https://jellyfin.example.com',
      apiKey: 'secret',
    })

    await flushPromises()

    expect(wrapper.getComponent(MmServiceForm).props('error')).toBe('Connection failed.')

    wrapper.getComponent(MmServiceSelector).vm.$emit('update:modelValue', 'sonarr')

    await wrapper.vm.$nextTick()

    expect(wrapper.getComponent(MmServiceForm).props('error')).toBe('')
  })

  it('tests a configured service using its saved connection', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    form.vm.$emit('testConnection')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'TEST_SERVICE_CONNECTION',
      serviceId: 'jellyfin',
    })

    expect(sendBackgroundMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'CONNECT_SERVICE',
      }),
    )

    expect(chrome.permissions.request).not.toHaveBeenCalled()
    expect(form.props('configured')).toBe(true)
  })

  it('updates status after a successful connection test', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(serviceStatus(wrapper, 'jellyfin')).toBe('configured')

    form.vm.$emit('testConnection')
    await flushPromises()

    expect(serviceStatus(wrapper, 'jellyfin')).toBe('connected')
    expect(form.props('success')).toBe('Connected to Jellyfin successfully.')
    expect(form.props('error')).toBe('')
  })

  it('refreshes persisted health after a successful manual test', async () => {
    mockConfigLoad(savedConfigs(), {
      jellyfin: failedHealth,
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('testConnection')
    await flushPromises()

    expect(serviceStatus(wrapper, 'jellyfin')).toBe('connected')

    const health = wrapper.get('.service-health')

    expect(health.get('.status-badge__label').text()).toBe('Connected')
    expect(health.text()).not.toContain('Unable to reach the server.')
  })

  it('reports a failed test without removing saved configuration', async () => {
    const original = vi.mocked(sendBackgroundMessage).getMockImplementation()

    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      if (message.type === 'TEST_SERVICE_CONNECTION') {
        return {
          success: false,
          error: 'The service is receiving too many requests. Please try again later.',
        }
      }

      if (message.type === 'GET_SERVICE_HEALTH') {
        return {
          success: true,
          health: {
            jellyfin: {
              status: 'failed',
              lastCheckedAt: '2026-10-31T12:00:00.000Z',
              error: 'The service is receiving too many requests. Please try again later.',
            },
          },
        }
      }

      if (!original) {
        throw new Error('Missing background mock.')
      }

      return original(message)
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('testConnection')
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(serviceStatus(wrapper, 'jellyfin')).toBe('failed')

    expect(form.props('error')).toBe(
      'The service is receiving too many requests. Please try again later.',
    )

    expect(form.props('success')).toBe('')
    expect(form.props('configured')).toBe(true)
    expect(form.props('url')).toBe('https://jellyfin.example.com')
  })

  it('does not test a service without saved credentials', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceSelector).vm.$emit('update:modelValue', 'radarr')

    await wrapper.vm.$nextTick()

    wrapper.getComponent(MmServiceForm).vm.$emit('testConnection')
    await flushPromises()

    expect(sendBackgroundMessage).not.toHaveBeenCalledWith({
      type: 'TEST_SERVICE_CONNECTION',
      serviceId: 'radarr',
    })
  })

  it('shows testing state and prevents duplicate test requests', async () => {
    const pending = deferredResponse<{
      success: true
      serviceId: 'jellyfin'
    }>()

    const original = vi.mocked(sendBackgroundMessage).getMockImplementation()

    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      if (message.type === 'TEST_SERVICE_CONNECTION') {
        return pending.promise
      }

      if (!original) {
        throw new Error('Missing background mock.')
      }

      return original(message)
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    form.vm.$emit('testConnection')
    await wrapper.vm.$nextTick()

    expect(form.props('testing')).toBe(true)

    form.vm.$emit('testConnection')
    await wrapper.vm.$nextTick()

    const requests = vi
      .mocked(sendBackgroundMessage)
      .mock.calls.filter(([message]) => message.type === 'TEST_SERVICE_CONNECTION')

    expect(requests).toHaveLength(1)

    pending.resolve({
      success: true,
      serviceId: 'jellyfin',
    })

    await flushPromises()

    expect(form.props('testing')).toBe(false)
    expect(form.props('success')).toBe('Connected to Jellyfin successfully.')
  })

  it('prevents connection edits and removal while testing', async () => {
    const pending = deferredResponse<{
      success: true
      serviceId: 'jellyfin'
    }>()

    const original = vi.mocked(sendBackgroundMessage).getMockImplementation()

    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      if (message.type === 'TEST_SERVICE_CONNECTION') {
        return pending.promise
      }

      if (!original) {
        throw new Error('Missing background mock.')
      }

      return original(message)
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    form.vm.$emit('testConnection')
    await wrapper.vm.$nextTick()

    form.vm.$emit('connect', {
      url: 'https://different.example.com',
      apiKey: 'new-key',
    })

    form.vm.$emit('remove')
    await wrapper.vm.$nextTick()

    expect(sendBackgroundMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CONNECT_SERVICE' }),
    )

    expect(sendBackgroundMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'REMOVE_SERVICE' }),
    )

    pending.resolve({
      success: true,
      serviceId: 'jellyfin',
    })

    await flushPromises()

    expect(form.props('testing')).toBe(false)
    expect(form.props('configured')).toBe(true)
  })

  it('keeps connection feedback scoped to the tested service', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    const selector = wrapper.getComponent(MmServiceSelector)

    wrapper.getComponent(MmServiceForm).vm.$emit('testConnection')
    await flushPromises()

    expect(wrapper.getComponent(MmServiceForm).props('success')).toBe(
      'Connected to Jellyfin successfully.',
    )

    selector.vm.$emit('update:modelValue', 'sonarr')
    await wrapper.vm.$nextTick()

    expect(wrapper.getComponent(MmServiceForm).props('success')).toBe('')

    selector.vm.$emit('update:modelValue', 'jellyfin')
    await wrapper.vm.$nextTick()

    expect(wrapper.getComponent(MmServiceForm).props('success')).toBe(
      'Connected to Jellyfin successfully.',
    )
  })

  it('loads Jellyfin users when a saved configuration exists', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'GET_JELLYFIN_USERS',
    })

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('userOptions')).toEqual(
      jellyfinUsers.map((user) => ({
        value: user.id,
        label: user.name,
      })),
    )

    expect(form.props('selectedUserId')).toBe('user-1')
  })

  it('saves a selected Jellyfin user', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('selectUser', 'user-2')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'SET_JELLYFIN_USER',
      userId: 'user-2',
    })

    expect(wrapper.getComponent(MmServiceForm).props('selectedUserId')).toBe('user-2')
  })

  it('keeps the previous user selection when saving fails', async () => {
    overrideBackgroundResponse('SET_JELLYFIN_USER', {
      success: false,
      error: 'Unable to save Jellyfin user.',
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('selectUser', 'user-2')
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('selectedUserId')).toBe('user-1')
    expect(form.props('usersError')).toBe('Unable to save Jellyfin user.')
  })

  it('shows a Jellyfin user-loading error without failing the connection', async () => {
    overrideBackgroundResponse('GET_JELLYFIN_USERS', {
      success: false,
      error: 'Unable to reach Jellyfin.',
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('configured')).toBe(true)
    expect(form.props('error')).toBe('')
    expect(form.props('usersError')).toBe('Unable to reach Jellyfin.')
  })

  it('refreshes Jellyfin users after a successful connection', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    const countRequests = () =>
      vi
        .mocked(sendBackgroundMessage)
        .mock.calls.filter(([message]) => message.type === 'GET_JELLYFIN_USERS').length

    const initialCount = countRequests()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      url: 'https://jellyfin.example.com',
      apiKey: '',
    })

    await flushPromises()

    expect(countRequests()).toBe(initialCount + 1)
  })

  it('does not request Jellyfin users when Jellyfin is unconfigured', async () => {
    mockConfigLoad({})

    mount(SettingsView)
    await flushPromises()

    expect(sendBackgroundMessage).not.toHaveBeenCalledWith({
      type: 'GET_JELLYFIN_USERS',
    })
  })

  it('shows success feedback after a successful connection', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      url: 'https://jellyfin.example.com',
      apiKey: '',
    })

    await flushPromises()

    expect(wrapper.getComponent(MmServiceForm).props('success')).toBe(
      'Connected to Jellyfin successfully.',
    )

    expect(wrapper.text()).toContain('Connected to Jellyfin successfully.')
  })

  it('clears connection success feedback when the form is edited', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    form.vm.$emit('connect', {
      url: 'https://jellyfin.example.com',
      apiKey: '',
    })

    await flushPromises()

    expect(form.props('success')).toBe('Connected to Jellyfin successfully.')

    form.vm.$emit('edit')
    await wrapper.vm.$nextTick()

    expect(form.props('success')).toBe('')
  })

  it('does not show success feedback after a failed connection', async () => {
    overrideBackgroundResponse('CONNECT_SERVICE', {
      success: false,
      error: 'Authentication failed.',
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', {
      url: 'https://jellyfin.example.com',
      apiKey: 'wrong-key',
    })

    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('success')).toBe('')
    expect(form.props('error')).toBe('Authentication failed.')
  })

  it('removes a configured server after confirmation', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('remove')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'REMOVE_SERVICE',
      serviceId: 'jellyfin',
    })

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('configured')).toBe(false)
    expect(form.props('url')).toBe('')
    expect(form.props('success')).toBe('Jellyfin server removed successfully.')
    expect(form.props('error')).toBe('')
    expect(wrapper.find('.service-health').exists()).toBe(false)
  })

  it('clears persisted health after removing a service', async () => {
    mockConfigLoad(savedConfigs(), {
      jellyfin: failedHealth,
      sonarr: connectedHealth,
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('remove')
    await flushPromises()

    expect(serviceStatus(wrapper, 'jellyfin')).toBe('not-configured')
    expect(serviceStatus(wrapper, 'sonarr')).toBe('connected')
    expect(wrapper.find('.service-health').exists()).toBe(false)
  })

  it('clears Jellyfin users after removing Jellyfin', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    expect(wrapper.getComponent(MmServiceForm).props('selectedUserId')).toBe('user-1')

    wrapper.getComponent(MmServiceForm).vm.$emit('remove')
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('userOptions')).toEqual([])
    expect(form.props('selectedUserId')).toBe('')
    expect(form.props('usersError')).toBe('')
    expect(form.props('userSuccess')).toBe('')
  })

  it('preserves saved configuration when removal fails', async () => {
    overrideBackgroundResponse('REMOVE_SERVICE', {
      success: false,
      error: 'Unable to remove server.',
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('remove')
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('configured')).toBe(true)
    expect(form.props('url')).toBe('https://jellyfin.example.com')
    expect(form.props('selectedUserId')).toBe('user-1')
    expect(form.props('error')).toBe('Unable to remove server.')
    expect(form.props('success')).toBe('')
  })

  it('shows removal loading state and prevents duplicate requests', async () => {
    const pending = deferredResponse<{
      success: true
      serviceId: 'jellyfin'
    }>()

    const original = vi.mocked(sendBackgroundMessage).getMockImplementation()

    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      if (message.type === 'REMOVE_SERVICE') {
        return pending.promise
      }

      if (!original) {
        throw new Error('Missing background mock.')
      }

      return original(message)
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    form.vm.$emit('remove')
    await wrapper.vm.$nextTick()

    expect(form.props('removing')).toBe(true)

    form.vm.$emit('remove')
    await wrapper.vm.$nextTick()

    const requests = vi
      .mocked(sendBackgroundMessage)
      .mock.calls.filter(([message]) => message.type === 'REMOVE_SERVICE')

    expect(requests).toHaveLength(1)

    pending.resolve({
      success: true,
      serviceId: 'jellyfin',
    })

    await flushPromises()

    expect(form.props('removing')).toBe(false)
    expect(form.props('configured')).toBe(false)
  })

  it('removes only the selected service', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    const selector = wrapper.getComponent(MmServiceSelector)

    selector.vm.$emit('update:modelValue', 'sonarr')
    await wrapper.vm.$nextTick()

    wrapper.getComponent(MmServiceForm).vm.$emit('remove')
    await flushPromises()

    expect(sendBackgroundMessage).toHaveBeenCalledWith({
      type: 'REMOVE_SERVICE',
      serviceId: 'sonarr',
    })

    expect(wrapper.getComponent(MmServiceForm).props('configured')).toBe(false)
    expect(wrapper.getComponent(MmServiceForm).props('url')).toBe('')

    selector.vm.$emit('update:modelValue', 'jellyfin')
    await wrapper.vm.$nextTick()

    const jellyfinForm = wrapper.getComponent(MmServiceForm)

    expect(jellyfinForm.props('configured')).toBe(true)
    expect(jellyfinForm.props('url')).toBe('https://jellyfin.example.com')
    expect(jellyfinForm.props('selectedUserId')).toBe('user-1')
  })

  it('shows saving feedback while a Jellyfin user is stored', async () => {
    const pending = deferredResponse<{
      success: true
      userId: string
    }>()

    const original = vi.mocked(sendBackgroundMessage).getMockImplementation()

    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      if (message.type === 'SET_JELLYFIN_USER') {
        return pending.promise
      }

      if (!original) {
        throw new Error('Missing background mock.')
      }

      return original(message)
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    form.vm.$emit('selectUser', 'user-2')
    await wrapper.vm.$nextTick()

    expect(form.props('userSaving')).toBe(true)
    expect(wrapper.text()).toContain('Saving user…')
    expect(form.props('selectedUserId')).toBe('user-1')

    pending.resolve({
      success: true,
      userId: 'user-2',
    })

    await flushPromises()

    expect(form.props('userSaving')).toBe(false)
    expect(form.props('selectedUserId')).toBe('user-2')
    expect(form.props('userSuccess')).toBe('Jellyfin user saved successfully.')
  })

  it('shows success feedback after saving a Jellyfin user', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('selectUser', 'user-2')
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('userSuccess')).toBe('Jellyfin user saved successfully.')
    expect(form.props('usersError')).toBe('')
    expect(wrapper.text()).toContain('Jellyfin user saved successfully.')
  })

  it('clears previous user success feedback during another save', async () => {
    const wrapper = mount(SettingsView)
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    form.vm.$emit('selectUser', 'user-2')
    await flushPromises()

    expect(form.props('userSuccess')).toBe('Jellyfin user saved successfully.')

    const pending = deferredResponse<{
      success: true
      userId: string
    }>()

    const original = vi.mocked(sendBackgroundMessage).getMockImplementation()

    vi.mocked(sendBackgroundMessage).mockImplementation(async (message) => {
      if (message.type === 'SET_JELLYFIN_USER') {
        return pending.promise
      }

      if (!original) {
        throw new Error('Missing background mock.')
      }

      return original(message)
    })

    form.vm.$emit('selectUser', 'user-1')
    await wrapper.vm.$nextTick()

    expect(form.props('userSuccess')).toBe('')
    expect(form.props('userSaving')).toBe(true)

    pending.resolve({
      success: true,
      userId: 'user-1',
    })

    await flushPromises()

    expect(form.props('userSuccess')).toBe('Jellyfin user saved successfully.')
  })

  it('does not show Jellyfin success feedback after a failed save', async () => {
    overrideBackgroundResponse('SET_JELLYFIN_USER', {
      success: false,
      error: 'Unable to save Jellyfin user.',
    })

    const wrapper = mount(SettingsView)
    await flushPromises()

    wrapper.getComponent(MmServiceForm).vm.$emit('selectUser', 'user-2')
    await flushPromises()

    const form = wrapper.getComponent(MmServiceForm)

    expect(form.props('selectedUserId')).toBe('user-1')
    expect(form.props('usersError')).toBe('Unable to save Jellyfin user.')
    expect(form.props('userSuccess')).toBe('')

    expect(wrapper.text()).not.toContain('Jellyfin user saved successfully.')
  })
})
