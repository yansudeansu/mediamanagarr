import { describe, expect, it } from 'vitest'
import {
  formatBytes,
  formatEta,
  formatProgress,
  formatSpeed,
  formatTorrentStatus,
  isTorrentStopped,
} from './qbittorrent-format'

describe('formatBytes', () => {
  it('formats bytes', () => {
    expect(formatBytes(500)).toBe('500 B')
  })

  it('formats kibibytes', () => {
    expect(formatBytes(1024)).toBe('1.0 KiB')
  })

  it('formats mebibytes', () => {
    expect(formatBytes(1024 ** 2)).toBe('1.0 MiB')
  })

  it('formats gibibytes', () => {
    expect(formatBytes(1024 ** 3)).toBe('1.0 GiB')
  })

  it('formats larger values without decimals', () => {
    expect(formatBytes(15 * 1024 ** 2)).toBe('15 MiB')
  })

  it('handles zero and negative values', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(-100)).toBe('0 B')
  })

  it('handles invalid numbers', () => {
    expect(formatBytes(Number.NaN)).toBe('0 B')
    expect(formatBytes(Infinity)).toBe('0 B')
  })
})

describe('formatSpeed', () => {
  it('formats download and upload speeds', () => {
    expect(formatSpeed(1024)).toBe('1.0 KiB/s')
    expect(formatSpeed(1024 ** 2)).toBe('1.0 MiB/s')
  })

  it('handles zero speed', () => {
    expect(formatSpeed(0)).toBe('0 B/s')
  })
})

describe('formatEta', () => {
  it('formats completed downloads', () => {
    expect(formatEta(0)).toBe('Complete')
  })

  it('formats minutes', () => {
    expect(formatEta(120)).toBe('2m')
  })

  it('rounds short durations up to one minute', () => {
    expect(formatEta(30)).toBe('1m')
  })

  it('formats hours and minutes', () => {
    expect(formatEta(5400)).toBe('1h 30m')
  })

  it('formats days and hours', () => {
    expect(formatEta(90000)).toBe('1d 1h')
  })

  it('handles unknown durations', () => {
    expect(formatEta(-1)).toBe('Unknown')
    expect(formatEta(Number.NaN)).toBe('Unknown')
    expect(formatEta(Infinity)).toBe('Unknown')
    expect(formatEta(8_640_000)).toBe('Unknown')
  })
})

describe('formatTorrentStatus', () => {
  it('formats downloading states', () => {
    expect(formatTorrentStatus('downloading')).toBe('Downloading')
    expect(formatTorrentStatus('forcedDL')).toBe('Downloading')
  })

  it('formats seeding states', () => {
    expect(formatTorrentStatus('uploading')).toBe('Seeding')
    expect(formatTorrentStatus('stalledUP')).toBe('Seeding')
  })

  it('formats stopped states', () => {
    expect(formatTorrentStatus('pausedDL')).toBe('Stopped')
    expect(formatTorrentStatus('stoppedDL')).toBe('Stopped')
  })

  it('formats error states', () => {
    expect(formatTorrentStatus('error')).toBe('Error')
    expect(formatTorrentStatus('missingFiles')).toBe('Missing files')
  })

  it('preserves unknown states', () => {
    expect(formatTorrentStatus('customState')).toBe('customState')
  })
})

describe('isTorrentStopped', () => {
  it('recognizes stopped download states', () => {
    expect(isTorrentStopped('pausedDL')).toBe(true)
    expect(isTorrentStopped('stoppedDL')).toBe(true)
  })

  it('recognizes stopped upload states', () => {
    expect(isTorrentStopped('pausedUP')).toBe(true)
    expect(isTorrentStopped('stoppedUP')).toBe(true)
  })

  it('does not treat active torrents as stopped', () => {
    expect(isTorrentStopped('downloading')).toBe(false)
    expect(isTorrentStopped('uploading')).toBe(false)
    expect(isTorrentStopped('stalledDL')).toBe(false)
  })
})

describe('formatProgress', () => {
  it('formats fractional progress as a percentage', () => {
    expect(formatProgress(0.456)).toBe('45.6%')
  })

  it('formats completed progress', () => {
    expect(formatProgress(1)).toBe('100.0%')
  })

  it('clamps progress below zero', () => {
    expect(formatProgress(-0.5)).toBe('0.0%')
  })

  it('clamps progress above 100%', () => {
    expect(formatProgress(1.5)).toBe('100.0%')
  })

  it('handles invalid progress', () => {
    expect(formatProgress(Number.NaN)).toBe('0.0%')
    expect(formatProgress(Infinity)).toBe('0.0%')
  })
})
