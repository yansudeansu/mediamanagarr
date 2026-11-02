import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmTorrentCard from './MmTorrentCard.vue'
import type { TorrentCardData } from './MmTorrentCard.vue'
import { mmTorrentCardSelectors } from '../../../test/selectors/molecules/mmTorrentCard.selectors'
import { mmProgressBarSelectors } from '../../../test/selectors/atoms/mmProgressBar.selectors'

const torrent: TorrentCardData = {
  id: 'a'.repeat(40),
  name: 'Example Download (2026)',
  statusLabel: 'Downloading',
  statusVariant: 'downloading',
  progress: 42.5,
  progressLabel: '42.5%',
  sizeLabel: '4.0 MiB / 10 MiB',
  downloadSpeedLabel: '1.0 MiB/s',
  uploadSpeedLabel: '512 KiB/s',
  etaLabel: '1h 0m',
  primaryActionLabel: 'Stop',
}

let wrapper: VueWrapper

const query = (selector: string) => wrapper.find(selector)
const card = mmTorrentCardSelectors(query)
const progress = mmProgressBarSelectors(query)

function createWrapper(
  overrides: Partial<TorrentCardData> = {},
  props: { pendingAction?: 'primary' | 'remove' | null; disabled?: boolean } = {},
) {
  wrapper = mount(MmTorrentCard, {
    props: {
      torrent: { ...torrent, ...overrides },
      ...props,
    },
  })
  return wrapper
}

describe('MmTorrentCard', () => {
  it('renders the torrent name', () => {
    createWrapper()

    expect(card.name().text()).toBe('Example Download (2026)')
  })

  it('preserves the full torrent name in the title attribute', () => {
    const name = 'A Very Long Download Name That Should Be Truncated Visually'
    createWrapper({ name })

    expect(card.name().attributes('title')).toBe(name)
  })

  it('displays the supplied status label', () => {
    createWrapper()

    expect(card.status().text()).toBe('Downloading')
  })

  it('applies the supplied status variant', () => {
    createWrapper()

    expect(card.statusVariant('downloading').exists()).toBe(true)
  })

  it('renders an error status with error styling', () => {
    createWrapper({
      statusLabel: 'Error',
      statusVariant: 'error',
    })

    expect(card.status().text()).toBe('Error')
    expect(card.statusVariant('error').exists()).toBe(true)
  })

  it('supports all status variants', () => {
    const variants: TorrentCardData['statusVariant'][] = [
      'downloading',
      'seeding',
      'stopped',
      'error',
      'neutral',
    ]

    for (const variant of variants) {
      createWrapper({ statusVariant: variant })

      expect(card.statusVariant(variant).exists()).toBe(true)

      wrapper.unmount()
    }
  })

  it('displays the supplied progress label', () => {
    createWrapper()

    expect(card.percentage().text()).toBe('42.5%')
  })

  it('passes the percentage to the progress bar', () => {
    createWrapper()

    expect(progress.track().attributes('aria-valuenow')).toBe('42.5')
  })

  it('displays the supplied size label', () => {
    createWrapper()

    expect(card.size().text()).toBe('4.0 MiB / 10 MiB')
  })

  it('displays transfer speeds and ETA', () => {
    createWrapper()

    expect(card.download().text()).toContain('1.0 MiB/s')
    expect(card.upload().text()).toContain('512 KiB/s')
    expect(card.eta().text()).toContain('ETA: 1h 0m')
  })

  it('emits the primary action with the item ID', async () => {
    createWrapper()

    await card.primaryLabelled('Stop Example Download (2026)').trigger('click')

    expect(wrapper.emitted('primaryAction')).toEqual([[torrent.id]])
  })

  it('supports a configurable primary action label', async () => {
    createWrapper({
      primaryActionLabel: 'Start',
      statusLabel: 'Stopped',
      statusVariant: 'stopped',
    })

    await card.primaryLabelled('Start Example Download (2026)').trigger('click')

    expect(wrapper.emitted('primaryAction')).toEqual([[torrent.id]])
  })

  it('emits remove without performing deletion', async () => {
    createWrapper()

    await card.removeLabelled('Remove Example Download (2026)').trigger('click')

    expect(wrapper.emitted('remove')).toEqual([[torrent.id]])
  })

  it('disables actions when the card is disabled', async () => {
    createWrapper({}, { disabled: true })

    expect(wrapper.findAll('button')).toHaveLength(2)
    expect(card.primaryDisabled().exists()).toBe(true)
    expect(card.removeDisabled().exists()).toBe(true)

    await card.primary().trigger('click')
    await card.remove().trigger('click')

    expect(wrapper.emitted('primaryAction')).toBeUndefined()
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('shows a loading state during a primary action', () => {
    createWrapper({}, { pendingAction: 'primary' })

    expect(card.primaryLoading().exists()).toBe(true)
    expect(card.primaryDisabled().exists()).toBe(true)
    expect(card.removeDisabled().exists()).toBe(true)
  })

  it('shows a loading state during removal', () => {
    createWrapper({}, { pendingAction: 'remove' })

    expect(card.removeLoading().exists()).toBe(true)
    expect(card.primaryDisabled().exists()).toBe(true)
    expect(card.removeDisabled().exists()).toBe(true)
  })

  it('does not emit actions while another action is pending', async () => {
    createWrapper({}, { pendingAction: 'primary' })

    await card.remove().trigger('click')

    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('does not emit a primary action while removal is pending', async () => {
    createWrapper({}, { pendingAction: 'remove' })

    await card.primary().trigger('click')

    expect(wrapper.emitted('primaryAction')).toBeUndefined()
  })

  it('clamps non-finite progress to zero', () => {
    createWrapper({ progress: Number.NaN })

    expect(progress.track().attributes('aria-valuenow')).toBe('0')
  })

  it('clamps progress below zero', () => {
    createWrapper({ progress: -25 })

    expect(progress.track().attributes('aria-valuenow')).toBe('0')
  })

  it('clamps progress above 100', () => {
    createWrapper({ progress: 125 })

    expect(progress.track().attributes('aria-valuenow')).toBe('100')
  })

  it('updates when the display data changes', async () => {
    createWrapper()

    await wrapper.setProps({
      torrent: {
        ...torrent,
        statusLabel: 'Stopped',
        statusVariant: 'stopped',
        primaryActionLabel: 'Start',
        progress: 50,
        progressLabel: '50%',
      },
    })

    expect(card.status().text()).toBe('Stopped')
    expect(card.statusVariant('stopped').exists()).toBe(true)
    expect(card.percentage().text()).toBe('50%')
    expect(progress.track().attributes('aria-valuenow')).toBe('50')
    expect(card.primaryLabelled('Start Example Download (2026)').exists()).toBe(true)
  })

  it('provides an accessible progress label', () => {
    createWrapper()

    expect(progress.track().attributes('aria-label')).toBe(
      'Example Download (2026) download progress',
    )
  })
})
