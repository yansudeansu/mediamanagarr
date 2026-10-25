import type { ServiceConfig } from '../types/service'

export function normalizeServerUrl(input: string): string {
  const value = input.trim()

  let url: URL

  try {
    url = new URL(value)
  } catch {
    throw new Error('Enter a valid server URL.')
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS server URLs are supported.')
  }

  if (url.username || url.password) {
    throw new Error('Do not include credentials in the URL.')
  }

  if (url.search || url.hash || value.includes('?') || value.includes('#')) {
    throw new Error('Do not include a query string or fragment in the URL.')
  }

  // Preserve reverse-proxy paths while removing trailing slashes.
  const pathname = url.pathname.replace(/\/+$/, '')

  return `${url.origin}${pathname}`
}

export function getHostPermission(url: string): string {
  const normalizedUrl = normalizeServerUrl(url)
  const parsedUrl = new URL(normalizedUrl)

  return `${parsedUrl.protocol}//${parsedUrl.hostname}/*`
}

export function resolveServiceConfig(
  input: ServiceConfig,
  existing?: ServiceConfig,
): ServiceConfig {
  const url = normalizeServerUrl(input.url)
  const enteredKey = input.apiKey.trim()

  const apiKey = enteredKey || (existing?.url === url ? existing.apiKey : '')

  if (!apiKey) {
    throw new Error('Enter an API key.')
  }

  return {
    url,
    apiKey,
  }
}
