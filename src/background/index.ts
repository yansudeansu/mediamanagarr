import { handleBackgroundMessage } from './messages'

chrome.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) {
    return false
  }

  void handleBackgroundMessage(message).then(sendResponse)

  return true
})
