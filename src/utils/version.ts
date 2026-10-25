interface ExtensionRuntime {
  runtime?: {
    getManifest: () => {
      version: string
    }
  }
}

export function getAppVersion(): string {
  const extension = globalThis as typeof globalThis & {
    browser?: ExtensionRuntime
    chrome?: ExtensionRuntime
  }

  return (
    extension.browser?.runtime?.getManifest()?.version ??
    extension.chrome?.runtime?.getManifest()?.version ??
    import.meta.env.VITE_APP_VERSION
  )
}
