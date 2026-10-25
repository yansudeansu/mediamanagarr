import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendBackgroundMessage } from './background-messaging'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('sendBackgroundMessage', () => {
  it('sends a request to the background script', async () => {
    const sendMessage = vi.fn().mockResolvedValue({
      success: true,
      configs: {},
    })

    vi.stubGlobal('chrome', {
      runtime: {
        sendMessage,
      },
    })

    const message = {
      type: 'GET_SERVICE_CONFIGS' as const,
    }

    const response = await sendBackgroundMessage(message)

    expect(sendMessage).toHaveBeenCalledWith(message)
    expect(response).toEqual({
      success: true,
      configs: {},
    })
  })

  it('returns a successful connection response', async () => {
    const sendMessage = vi.fn().mockResolvedValue({
      success: true,
      serviceId: 'jellyfin',
    })

    vi.stubGlobal('chrome', {
      runtime: {
        sendMessage,
      },
    })

    const response = await sendBackgroundMessage({
      type: 'CONNECT_SERVICE',
      serviceId: 'jellyfin',
      config: {
        url: 'http://localhost:8096',
        apiKey: 'test-key',
      },
    })

    expect(response).toEqual({
      success: true,
      serviceId: 'jellyfin',
    })
  })

  it('returns background errors without throwing', async () => {
    const sendMessage = vi.fn().mockResolvedValue({
      success: false,
      error: 'Connection refused.',
    })

    vi.stubGlobal('chrome', {
      runtime: {
        sendMessage,
      },
    })

    const response = await sendBackgroundMessage({
      type: 'GET_SERVICE_CONFIGS',
    })

    expect(response).toEqual({
      success: false,
      error: 'Connection refused.',
    })
  })

  it('throws when background messaging is unavailable', async () => {
    vi.stubGlobal('chrome', undefined)

    await expect(
      sendBackgroundMessage({
        type: 'GET_SERVICE_CONFIGS',
      }),
    ).rejects.toThrow('Background messaging is unavailable.')
  })

  it('propagates runtime messaging failures', async () => {
    const sendMessage = vi.fn().mockRejectedValue(new Error('Receiving end does not exist.'))

    vi.stubGlobal('chrome', {
      runtime: {
        sendMessage,
      },
    })

    await expect(
      sendBackgroundMessage({
        type: 'GET_SERVICE_CONFIGS',
      }),
    ).rejects.toThrow('Receiving end does not exist.')
  })
})
