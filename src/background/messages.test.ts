import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handleBackgroundMessage } from './messages'
import {
  getSafeServiceConfigs,
  getServiceConfig,
  saveServiceConfig,
} from '../utils/service-storage'
import { testServiceConnection } from './services/connection'

vi.mock('../utils/service-storage', () => ({
  getSafeServiceConfigs: vi.fn(),
  getServiceConfig: vi.fn(),
  saveServiceConfig: vi.fn(),
}))

vi.mock('./services/connection', () => ({
  testServiceConnection: vi.fn(),
}))

describe('handleBackgroundMessage', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.stubGlobal('chrome', {
      permissions: {
        contains: vi.fn().mockResolvedValue(true),
      },
    })
  })

  it('returns safe service configurations', async () => {
    vi.mocked(getSafeServiceConfigs).mockResolvedValue({
      jellyfin: {
        url: 'https://jellyfin.example.com',
        configured: true,
      },
    })

    await expect(handleBackgroundMessage({ type: 'GET_SERVICE_CONFIGS' })).resolves.toEqual({
      success: true,
      configs: {
        jellyfin: {
          url: 'https://jellyfin.example.com',
          configured: true,
        },
      },
    })
  })

  it('rejects malformed messages', async () => {
    await expect(handleBackgroundMessage(null)).resolves.toEqual({
      success: false,
      error: 'Invalid background message.',
    })

    await expect(
      handleBackgroundMessage({
        type: 'CONNECT_SERVICE',
        serviceId: 'unknown',
        config: {
          url: 'https://example.com',
          apiKey: 'secret',
        },
      }),
    ).resolves.toEqual({
      success: false,
      error: 'Invalid background message.',
    })
  })

  it('tests and saves a valid connection', async () => {
    vi.mocked(getServiceConfig).mockResolvedValue(undefined)

    const result = await handleBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId: 'sonarr',
      config: {
        url: 'https://sonarr.example.com/',
        apiKey: 'test-key',
      },
    })

    expect(chrome.permissions.contains).toHaveBeenCalledWith({
      origins: ['https://sonarr.example.com/*'],
    })

    expect(testServiceConnection).toHaveBeenCalledWith('sonarr', {
      url: 'https://sonarr.example.com',
      apiKey: 'test-key',
    })

    expect(saveServiceConfig).toHaveBeenCalledWith('sonarr', {
      url: 'https://sonarr.example.com',
      apiKey: 'test-key',
    })

    expect(result).toEqual({
      success: true,
      serviceId: 'sonarr',
    })
  })

  it('does not test or save when host permission is missing', async () => {
    vi.mocked(getServiceConfig).mockResolvedValue(undefined)
    vi.stubGlobal('chrome', {
      permissions: {
        contains: vi.fn().mockResolvedValue(false),
      },
    })

    const result = await handleBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId: 'radarr',
      config: {
        url: 'https://radarr.example.com',
        apiKey: 'test-key',
      },
    })

    expect(result).toEqual({
      success: false,
      error: 'Server access has not been granted. Please allow access and try again.',
    })

    expect(testServiceConnection).not.toHaveBeenCalled()
    expect(saveServiceConfig).not.toHaveBeenCalled()
  })

  it('reuses the saved API key for the same URL', async () => {
    vi.mocked(getServiceConfig).mockResolvedValue({
      url: 'https://jellyfin.example.com',
      apiKey: 'saved-key',
    })

    await handleBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId: 'jellyfin',
      config: {
        url: 'https://jellyfin.example.com/',
        apiKey: '',
      },
    })

    expect(testServiceConnection).toHaveBeenCalledWith('jellyfin', {
      url: 'https://jellyfin.example.com',
      apiKey: 'saved-key',
    })
  })

  it('does not save when the connection test fails', async () => {
    vi.mocked(getServiceConfig).mockResolvedValue(undefined)
    vi.mocked(testServiceConnection).mockRejectedValue(new Error('Authentication failed.'))

    const result = await handleBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId: 'seerr',
      config: {
        url: 'https://seerr.example.com',
        apiKey: 'wrong-key',
      },
    })

    expect(result).toEqual({
      success: false,
      error: 'Authentication failed.',
    })

    expect(saveServiceConfig).not.toHaveBeenCalled()
  })

  it('rejects an empty API key when no saved key is available', async () => {
    vi.mocked(getServiceConfig).mockResolvedValue(undefined)

    const result = await handleBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId: 'sonarr',
      config: {
        url: 'https://sonarr.example.com',
        apiKey: '',
      },
    })

    expect(result).toEqual({
      success: false,
      error: 'Enter an API key.',
    })

    expect(testServiceConnection).not.toHaveBeenCalled()
  })
})
