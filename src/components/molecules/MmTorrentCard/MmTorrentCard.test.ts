import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmTorrentCard from './MmTorrentCard.vue'
import type { TorrentCardData } from './MmTorrentCard.vue'

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

function createWrapper(
  overrides: Partial<TorrentCardData> = {},
  props: {
    pendingAction?: 'primary' | 'remove' | null
    disabled?: boolean
  } = {},
) {
  return mount(MmTorrentCard, {
    props: {
      torrent: { ...torrent, ...overrides },
      ...props,
    },
  })
}

describe('MmTorrentCard', () => {
  it('renders the torrent name', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.torrent-card__name').text()).toBe('Example Download (2026)')
  })

  it('preserves the full torrent name in the title attribute', () => {
    const name = 'A Very Long Download Name That Should Be Truncated Visually'
    const wrapper = createWrapper({ name })

    expect(wrapper.find('.torrent-card__name').attributes('title')).toBe(name)
  })

  it('displays the supplied status label', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.torrent-card__status').text()).toBe('Downloading')
  })

  it('applies the supplied status variant', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.torrent-card__status').classes()).toContain(
      'torrent-card__status--downloading',
    )
  })

  it('renders an error status with error styling', () => {
    const wrapper = createWrapper({
      statusLabel: 'Error',
      statusVariant: 'error',
    })

    expect(wrapper.find('.torrent-card__status').text()).toBe('Error')
    expect(wrapper.find('.torrent-card__status').classes()).toContain('torrent-card__status--error')
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
      const wrapper = createWrapper({ statusVariant: variant })

      expect(wrapper.find('.torrent-card__status').classes()).toContain(
        `torrent-card__status--${variant}`,
      )

      wrapper.unmount()
    }
  })

  it('displays the supplied progress label', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.torrent-card__percentage').text()).toBe('42.5%')
  })

  it('passes the percentage to the progress bar', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('42.5')
  })

  it('displays the supplied size label', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.torrent-card__size').text()).toBe('4.0 MiB / 10 MiB')
  })

  it('displays transfer speeds and ETA', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('1.0 MiB/s')
    expect(wrapper.text()).toContain('512 KiB/s')
    expect(wrapper.text()).toContain('ETA: 1h 0m')
  })

  it('emits the primary action with the item ID', async () => {
    const wrapper = createWrapper()

    await wrapper.get('button[aria-label="Stop Example Download (2026)"]').trigger('click')

    expect(wrapper.emitted('primaryAction')).toEqual([[torrent.id]])
  })

  it('supports a configurable primary action label', async () => {
    const wrapper = createWrapper({
      primaryActionLabel: 'Start',
      statusLabel: 'Stopped',
      statusVariant: 'stopped',
    })

    await wrapper.get('button[aria-label="Start Example Download (2026)"]').trigger('click')

    expect(wrapper.emitted('primaryAction')).toEqual([[torrent.id]])
  })

  it('emits remove without performing deletion', async () => {
    const wrapper = createWrapper()

    await wrapper.get('button[aria-label="Remove Example Download (2026)"]').trigger('click')

    expect(wrapper.emitted('remove')).toEqual([[torrent.id]])
  })

  it('disables actions when the card is disabled', async () => {
    const wrapper = createWrapper({}, { disabled: true })
    const buttons = wrapper.findAll('button')

    expect(buttons).toHaveLength(2)
    expect(buttons.every((button) => button.attributes('disabled') !== undefined)).toBe(true)

    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')

    expect(wrapper.emitted('primaryAction')).toBeUndefined()
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('shows a loading state during a primary action', () => {
    const wrapper = createWrapper({}, { pendingAction: 'primary' })

    expect(
      wrapper.get('button[aria-label="Stop Example Download (2026)"]').attributes('aria-busy'),
    ).toBe('true')

    expect(
      wrapper.findAll('button').every((button) => button.attributes('disabled') !== undefined),
    ).toBe(true)
  })

  it('shows a loading state during removal', () => {
    const wrapper = createWrapper({}, { pendingAction: 'remove' })

    expect(
      wrapper.get('button[aria-label="Remove Example Download (2026)"]').attributes('aria-busy'),
    ).toBe('true')

    expect(
      wrapper.findAll('button').every((button) => button.attributes('disabled') !== undefined),
    ).toBe(true)
  })

  it('does not emit actions while another action is pending', async () => {
    const wrapper = createWrapper({}, { pendingAction: 'primary' })

    await wrapper.get('button[aria-label="Remove Example Download (2026)"]').trigger('click')

    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('does not emit a primary action while removal is pending', async () => {
    const wrapper = createWrapper({}, { pendingAction: 'remove' })

    await wrapper.get('button[aria-label="Stop Example Download (2026)"]').trigger('click')

    expect(wrapper.emitted('primaryAction')).toBeUndefined()
  })

  it('clamps non-finite progress to zero', () => {
    const wrapper = createWrapper({ progress: Number.NaN })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
  })

  it('clamps progress below zero', () => {
    const wrapper = createWrapper({ progress: -25 })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
  })

  it('clamps progress above 100', () => {
    const wrapper = createWrapper({ progress: 125 })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
  })

  it('updates when the display data changes', async () => {
    const wrapper = createWrapper()

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

    expect(wrapper.find('.torrent-card__status').text()).toBe('Stopped')
    expect(wrapper.find('.torrent-card__status').classes()).toContain(
      'torrent-card__status--stopped',
    )
    expect(wrapper.find('.torrent-card__percentage').text()).toBe('50%')
    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('50')
    expect(wrapper.find('button[aria-label="Start Example Download (2026)"]').exists()).toBe(true)
  })

  it('provides an accessible progress label', () => {
    const wrapper = createWrapper()

    expect(wrapper.get('[role="progressbar"]').attributes('aria-label')).toBe(
      'Example Download (2026) download progress',
    )
  })
})
