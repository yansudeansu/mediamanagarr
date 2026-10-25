import type { BackgroundMessage, BackgroundResponse } from '../types/messages'

export async function sendBackgroundMessage<T extends BackgroundMessage>(
  message: T,
): Promise<BackgroundResponse<T>> {
  if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
    throw new Error('Background messaging is unavailable.')
  }

  return chrome.runtime.sendMessage(message) as Promise<BackgroundResponse<T>>
}
