import { describe, expect, it } from 'vitest'
import { getHostPermission, normalizeServerUrl, resolveServiceConfig } from './service-config'

describe('normalizeServerUrl', () => {
  it('accepts HTTPS URLs', () => {
    expect(normalizeServerUrl('https://media.example.com')).toBe('https://media.example.com')
  })

  it('accepts HTTP URLs', () => {
    expect(normalizeServerUrl('http://media.example.com')).toBe('http://media.example.com')
  })

  it('accepts localhost servers', () => {
    expect(normalizeServerUrl('http://localhost:8096')).toBe('http://localhost:8096')
  })

  it('accepts local network IP addresses', () => {
    expect(normalizeServerUrl('http://192.168.1.100:8989')).toBe('http://192.168.1.100:8989')
  })

  it('trims surrounding whitespace', () => {
    expect(normalizeServerUrl('  https://media.example.com/  ')).toBe('https://media.example.com')
  })

  it('removes trailing slashes', () => {
    expect(normalizeServerUrl('https://media.example.com///')).toBe('https://media.example.com')
  })

  it('preserves reverse-proxy base paths', () => {
    expect(normalizeServerUrl('https://media.example.com/jellyfin')).toBe(
      'https://media.example.com/jellyfin',
    )
  })

  it('removes trailing slashes from reverse-proxy paths', () => {
    expect(normalizeServerUrl('https://media.example.com/sonarr///')).toBe(
      'https://media.example.com/sonarr',
    )
  })

  it('preserves nested reverse-proxy paths', () => {
    expect(normalizeServerUrl('https://media.example.com/apps/radarr/')).toBe(
      'https://media.example.com/apps/radarr',
    )
  })

  it('preserves custom ports', () => {
    expect(normalizeServerUrl('https://media.example.com:8443/jellyfin')).toBe(
      'https://media.example.com:8443/jellyfin',
    )
  })

  it('rejects empty URLs', () => {
    expect(() => normalizeServerUrl('')).toThrow('Enter a valid server URL.')
  })

  it('rejects malformed URLs', () => {
    expect(() => normalizeServerUrl('not-a-url')).toThrow('Enter a valid server URL.')
  })

  it('rejects unsupported protocols', () => {
    expect(() => normalizeServerUrl('ftp://media.example.com')).toThrow(
      'Only HTTP and HTTPS server URLs are supported.',
    )
  })

  it('rejects URLs containing usernames', () => {
    expect(() => normalizeServerUrl('https://admin@media.example.com')).toThrow(
      'Do not include credentials in the URL.',
    )
  })

  it('rejects URLs containing passwords', () => {
    expect(() => normalizeServerUrl('https://admin:secret@media.example.com')).toThrow(
      'Do not include credentials in the URL.',
    )
  })

  it('rejects query strings', () => {
    expect(() => normalizeServerUrl('https://media.example.com?token=secret')).toThrow(
      'Do not include a query string or fragment in the URL.',
    )
  })

  it('rejects fragments', () => {
    expect(() => normalizeServerUrl('https://media.example.com/#settings')).toThrow(
      'Do not include a query string or fragment in the URL.',
    )
  })

  it('rejects empty query strings', () => {
    expect(() => normalizeServerUrl('https://media.example.com?')).toThrow(
      'Do not include a query string or fragment in the URL.',
    )
  })

  it('rejects empty fragments', () => {
    expect(() => normalizeServerUrl('https://media.example.com#')).toThrow(
      'Do not include a query string or fragment in the URL.',
    )
  })
})

describe('getHostPermission', () => {
  it('creates an HTTPS host permission', () => {
    expect(getHostPermission('https://media.example.com')).toBe('https://media.example.com/*')
  })

  it('creates an HTTP host permission', () => {
    expect(getHostPermission('http://localhost:8096')).toBe('http://localhost:8096/*')
  })

  it('excludes reverse-proxy paths', () => {
    expect(getHostPermission('https://media.example.com/jellyfin')).toBe(
      'https://media.example.com/*',
    )
  })

  it('preserves the correct hostname for nested paths', () => {
    expect(getHostPermission('https://media.example.com/apps/sonarr')).toBe(
      'https://media.example.com/*',
    )
  })
})

describe('resolveServiceConfig', () => {
  const existing = {
    url: 'https://media.example.com/jellyfin',
    apiKey: 'saved-secret',
  }

  it('accepts a new API key', () => {
    expect(
      resolveServiceConfig({
        url: 'https://media.example.com/jellyfin',
        apiKey: 'new-secret',
      }),
    ).toEqual({
      url: 'https://media.example.com/jellyfin',
      apiKey: 'new-secret',
    })
  })

  it('trims API keys', () => {
    expect(
      resolveServiceConfig({
        url: 'https://media.example.com/jellyfin',
        apiKey: '  new-secret  ',
      }),
    ).toEqual({
      url: 'https://media.example.com/jellyfin',
      apiKey: 'new-secret',
    })
  })

  it('reuses a saved API key when the URL is unchanged', () => {
    expect(
      resolveServiceConfig(
        {
          url: 'https://media.example.com/jellyfin',
          apiKey: '',
        },
        existing,
      ),
    ).toEqual(existing)
  })

  it('does not reuse a saved API key for a different URL', () => {
    expect(() =>
      resolveServiceConfig(
        {
          url: 'https://media.example.com/sonarr',
          apiKey: '',
        },
        existing,
      ),
    ).toThrow('Enter an API key.')
  })

  it('does not reuse a saved API key when switching protocols', () => {
    expect(() =>
      resolveServiceConfig(
        {
          url: 'http://media.example.com/jellyfin',
          apiKey: '',
        },
        existing,
      ),
    ).toThrow('Enter an API key.')
  })

  it('rejects missing API keys for new configurations', () => {
    expect(() =>
      resolveServiceConfig({
        url: 'http://localhost:8096',
        apiKey: '',
      }),
    ).toThrow('Enter an API key.')
  })

  it('supports HTTP configurations', () => {
    expect(
      resolveServiceConfig({
        url: 'http://localhost:8096',
        apiKey: 'local-secret',
      }),
    ).toEqual({
      url: 'http://localhost:8096',
      apiKey: 'local-secret',
    })
  })

  it('supports reverse-proxy paths', () => {
    expect(
      resolveServiceConfig({
        url: 'https://media.example.com/apps/jellyfin/',
        apiKey: 'secret',
      }),
    ).toEqual({
      url: 'https://media.example.com/apps/jellyfin',
      apiKey: 'secret',
    })
  })
})
