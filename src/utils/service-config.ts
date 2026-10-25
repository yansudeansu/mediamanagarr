import type { ServiceConfig } from '../types/service'

export function normalizeServerUrl(input: string): string {
  let url: URL

  try {
    url = new URL(input.trim())
  } catch {
    throw new Error('Enter a valid server URL.')
  }

  if (url.protocol !== 'https:') {
    throw new Error('Only HTTPS server URLs are supported.')
  }

  if (url.username || url.password) {
    throw new Error('Do not include credentials in the URL.')
  }

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error('Enter only the server origin, without a path or query.')
  }

  return url.origin
}

export function getHostPermission(url: string): string {
  const normalizedUrl = normalizeServerUrl(url)

  return `${normalizedUrl}/*`
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
