import { handleBackgroundMessage } from './messages'
import { handleJellyfinScanAlarm, initializeJellyfinScanner } from './services/jellyfin-scanner'
import { handleServiceHealthAlarm, initializeServiceHealthMonitor } from './services/service-health'
import { initializeWorkspace } from './workspace'

chrome.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) {
    return false
  }

  void handleBackgroundMessage(message).then(sendResponse)

  return true
})

chrome.alarms.onAlarm.addListener((alarm) => {
  void handleJellyfinScanAlarm(alarm)
  void handleServiceHealthAlarm(alarm)
})

chrome.runtime.onInstalled.addListener(() => {
  void initializeJellyfinScanner()
  void initializeServiceHealthMonitor()
  void initializeWorkspace()
})

chrome.runtime.onStartup.addListener(() => {
  void initializeJellyfinScanner()
  void initializeServiceHealthMonitor()
  void initializeWorkspace()
})

void initializeJellyfinScanner()
void initializeServiceHealthMonitor()
void initializeWorkspace()
