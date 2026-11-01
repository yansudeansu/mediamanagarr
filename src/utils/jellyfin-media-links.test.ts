import { describe, expect, it } from 'vitest'
import { getJellyfinMediaUrl } from './jellyfin-media-links'

describe('getJellyfinMediaUrl', () => {
  const movieId = '0123456789abcdef0123456789abcdef'
  const episodeId = 'abcdef0123456789abcdef0123456789'

  it('creates a direct link for a movie', () => {
    expect(getJellyfinMediaUrl('https://media.example.com', movieId)).toBe(
      `https://media.example.com/web/#/details?id=${movieId}`,
    )
  })

  it('creates a direct link for an episode', () => {
    expect(getJellyfinMediaUrl('http://localhost:8096', episodeId)).toBe(
      `http://localhost:8096/web/#/details?id=${episodeId}`,
    )
  })

  it('supports local network addresses', () => {
    expect(getJellyfinMediaUrl('http://192.168.1.100:8096', movieId)).toBe(
      `http://192.168.1.100:8096/web/#/details?id=${movieId}`,
    )
  })

  it('preserves reverse-proxy base paths', () => {
    expect(getJellyfinMediaUrl('https://media.example.com/jellyfin', movieId)).toBe(
      `https://media.example.com/jellyfin/web/#/details?id=${movieId}`,
    )
  })

  it('preserves nested reverse-proxy paths', () => {
    expect(getJellyfinMediaUrl('https://media.example.com/apps/jellyfin', episodeId)).toBe(
      `https://media.example.com/apps/jellyfin/web/#/details?id=${episodeId}`,
    )
  })

  it('preserves custom ports', () => {
    expect(getJellyfinMediaUrl('https://media.example.com:8443/jellyfin', movieId)).toBe(
      `https://media.example.com:8443/jellyfin/web/#/details?id=${movieId}`,
    )
  })

  it('normalizes surrounding whitespace and trailing slashes', () => {
    expect(getJellyfinMediaUrl('  https://media.example.com/jellyfin///  ', movieId)).toBe(
      `https://media.example.com/jellyfin/web/#/details?id=${movieId}`,
    )
  })

  it('trims surrounding whitespace from item IDs', () => {
    expect(getJellyfinMediaUrl('https://media.example.com', `  ${movieId}  `)).toBe(
      `https://media.example.com/web/#/details?id=${movieId}`,
    )
  })

  it('accepts uppercase hexadecimal item IDs', () => {
    const uppercaseId = movieId.toUpperCase()

    expect(getJellyfinMediaUrl('https://media.example.com', uppercaseId)).toBe(
      `https://media.example.com/web/#/details?id=${uppercaseId}`,
    )
  })

  it('returns null when the server URL is missing', () => {
    expect(getJellyfinMediaUrl(undefined, movieId)).toBeNull()
    expect(getJellyfinMediaUrl(null, movieId)).toBeNull()
    expect(getJellyfinMediaUrl('', movieId)).toBeNull()
  })

  it('returns null when the item ID is missing', () => {
    expect(getJellyfinMediaUrl('https://media.example.com', undefined)).toBeNull()
    expect(getJellyfinMediaUrl('https://media.example.com', null)).toBeNull()
    expect(getJellyfinMediaUrl('https://media.example.com', '')).toBeNull()
    expect(getJellyfinMediaUrl('https://media.example.com', '   ')).toBeNull()
  })

  it('rejects malformed item IDs', () => {
    expect(getJellyfinMediaUrl('https://media.example.com', 'invalid-id')).toBeNull()
    expect(getJellyfinMediaUrl('https://media.example.com', '1234')).toBeNull()
    expect(getJellyfinMediaUrl('https://media.example.com', 'g'.repeat(32))).toBeNull()
  })

  it('rejects unsupported URL protocols', () => {
    expect(getJellyfinMediaUrl('ftp://media.example.com', movieId)).toBeNull()
    expect(getJellyfinMediaUrl('javascript:alert(1)', movieId)).toBeNull()
  })

  it('rejects URLs containing credentials', () => {
    expect(getJellyfinMediaUrl('https://admin:secret@media.example.com', movieId)).toBeNull()
  })

  it('rejects URLs containing query strings', () => {
    expect(getJellyfinMediaUrl('https://media.example.com?token=secret', movieId)).toBeNull()
  })

  it('rejects URLs containing fragments', () => {
    expect(getJellyfinMediaUrl('https://media.example.com/#settings', movieId)).toBeNull()
  })

  it('returns null for malformed server URLs', () => {
    expect(getJellyfinMediaUrl('not-a-url', movieId)).toBeNull()
  })
})
