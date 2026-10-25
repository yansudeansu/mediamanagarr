import { handleBackgroundMessage } from './messages'
import { handleJellyfinScanAlarm, initializeJellyfinScanner } from './services/jellyfin-scanner'

chrome.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) {
    return false
  }

  void handleBackgroundMessage(message).then(sendResponse)

  return true
})

chrome.alarms.onAlarm.addListener((alarm) => {
  void handleJellyfinScanAlarm(alarm)
})

chrome.runtime.onInstalled.addListener(() => {
  void initializeJellyfinScanner()
})

chrome.runtime.onStartup.addListener(() => {
  void initializeJellyfinScanner()
})

void initializeJellyfinScanner()
