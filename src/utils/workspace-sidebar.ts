interface FirefoxSidebarAction {
  open(): Promise<void>
}

interface FirefoxBrowser {
  sidebarAction?: FirefoxSidebarAction
}

function getFirefoxBrowser(): FirefoxBrowser | undefined {
  const browserGlobal = globalThis as typeof globalThis & {
    browser?: FirefoxBrowser
  }

  return browserGlobal.browser
}

export async function openWorkspaceSidebar(): Promise<void> {
  const firefoxBrowser = getFirefoxBrowser()

  if (firefoxBrowser?.sidebarAction?.open) {
    await firefoxBrowser.sidebarAction.open()
    return
  }

  if (typeof chrome !== 'undefined' && chrome.sidePanel?.open) {
    const currentWindow = await chrome.windows.getCurrent()

    if (currentWindow.id === undefined) {
      throw new Error('Unable to determine the current browser window.')
    }

    await chrome.sidePanel.open({
      windowId: currentWindow.id,
    })

    return
  }

  throw new Error('Native sidebar support is unavailable in this browser.')
}
