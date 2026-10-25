import { describe, expect, it } from 'vitest'
import { getHostPermission, normalizeServerUrl, resolveServiceConfig } from './service-config'

describe('normalizeServerUrl', () => {
  it('accepts a valid HTTPS URL', () => {
    expect(normalizeServerUrl('https://jellyfin.example.com')).toBe('https://jellyfin.example.com')
  })

  it('removes surrounding whitespace', () => {
    expect(normalizeServerUrl('  https://jellyfin.example.com  ')).toBe(
      'https://jellyfin.example.com',
    )
  })

  it('removes the trailing slash', () => {
    expect(normalizeServerUrl('https://jellyfin.example.com/')).toBe('https://jellyfin.example.com')
  })

  it('preserves a custom port', () => {
    expect(normalizeServerUrl('https://jellyfin.example.com:8920')).toBe(
      'https://jellyfin.example.com:8920',
    )
  })

  it('rejects invalid URLs', () => {
    expect(() => normalizeServerUrl('not-a-url')).toThrow('Enter a valid server URL.')
  })

  it('rejects HTTP URLs', () => {
    expect(() => normalizeServerUrl('http://jellyfin.example.com')).toThrow(
      'Only HTTPS server URLs are supported.',
    )
  })

  it('rejects embedded credentials', () => {
    expect(() => normalizeServerUrl('https://user:password@example.com')).toThrow(
      'Do not include credentials in the URL.',
    )
  })

  it('rejects URL paths', () => {
    expect(() => normalizeServerUrl('https://example.com/jellyfin')).toThrow(
      'Enter only the server origin, without a path or query.',
    )
  })

  it('rejects query strings', () => {
    expect(() => normalizeServerUrl('https://example.com?token=abc')).toThrow(
      'Enter only the server origin, without a path or query.',
    )
  })

  it('rejects fragments', () => {
    expect(() => normalizeServerUrl('https://example.com/#settings')).toThrow(
      'Enter only the server origin, without a path or query.',
    )
  })
})

describe('getHostPermission', () => {
  it('returns a browser host permission pattern', () => {
    expect(getHostPermission('https://jellyfin.example.com')).toBe('https://jellyfin.example.com/*')
  })

  it('preserves custom ports', () => {
    expect(getHostPermission('https://jellyfin.example.com:8920')).toBe(
      'https://jellyfin.example.com:8920/*',
    )
  })

  it('rejects invalid server URLs', () => {
    expect(() => getHostPermission('http://example.com')).toThrow(
      'Only HTTPS server URLs are supported.',
    )
  })
})

describe('resolveServiceConfig', () => {
  const existing = {
    url: 'https://jellyfin.example.com',
    apiKey: 'existing-secret',
  }

  it('accepts a new service configuration', () => {
    expect(
      resolveServiceConfig({
        url: 'https://jellyfin.example.com',
        apiKey: 'new-secret',
      }),
    ).toEqual({
      url: 'https://jellyfin.example.com',
      apiKey: 'new-secret',
    })
  })

  it('requires an API key for a new service', () => {
    expect(() =>
      resolveServiceConfig({
        url: 'https://jellyfin.example.com',
        apiKey: '',
      }),
    ).toThrow('Enter an API key.')
  })

  it('reuses the existing API key when the URL is unchanged', () => {
    expect(
      resolveServiceConfig(
        {
          url: 'https://jellyfin.example.com',
          apiKey: '',
        },
        existing,
      ),
    ).toEqual(existing)
  })

  it('reuses the existing API key when the input URL has a trailing slash', () => {
    expect(
      resolveServiceConfig(
        {
          url: 'https://jellyfin.example.com/',
          apiKey: '',
        },
        existing,
      ),
    ).toEqual(existing)
  })

  it('replaces the API key when a new one is provided', () => {
    expect(
      resolveServiceConfig(
        {
          url: 'https://jellyfin.example.com',
          apiKey: 'replacement-secret',
        },
        existing,
      ),
    ).toEqual({
      url: 'https://jellyfin.example.com',
      apiKey: 'replacement-secret',
    })
  })

  it('requires a new API key when the URL changes', () => {
    expect(() =>
      resolveServiceConfig(
        {
          url: 'https://other.example.com',
          apiKey: '',
        },
        existing,
      ),
    ).toThrow('Enter an API key.')
  })

  it('accepts a new API key when the URL changes', () => {
    expect(
      resolveServiceConfig(
        {
          url: 'https://other.example.com',
          apiKey: 'new-secret',
        },
        existing,
      ),
    ).toEqual({
      url: 'https://other.example.com',
      apiKey: 'new-secret',
    })
  })

  it('trims surrounding whitespace from API keys', () => {
    expect(
      resolveServiceConfig({
        url: 'https://jellyfin.example.com',
        apiKey: '  secret  ',
      }),
    ).toEqual({
      url: 'https://jellyfin.example.com',
      apiKey: 'secret',
    })
  })

  it('rejects whitespace-only API keys', () => {
    expect(() =>
      resolveServiceConfig({
        url: 'https://jellyfin.example.com',
        apiKey: '   ',
      }),
    ).toThrow('Enter an API key.')
  })

  it('does not mutate the existing configuration', () => {
    const original = { ...existing }

    resolveServiceConfig(
      {
        url: 'https://jellyfin.example.com',
        apiKey: 'replacement-secret',
      },
      existing,
    )

    expect(existing).toEqual(original)
  })
})
