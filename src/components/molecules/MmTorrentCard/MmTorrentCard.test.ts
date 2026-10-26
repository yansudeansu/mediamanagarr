import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { QBittorrentTorrent } from '../../../types/qbittorrent'
import MmTorrentCard from './MmTorrentCard.vue'

const torrent: QBittorrentTorrent = {
  hash: 'a'.repeat(40),
  name: 'Example Movie (2026)',
  progress: 0.425,
  state: 'downloading',
  downloadSpeed: 1024 * 1024,
  uploadSpeed: 512 * 1024,
  eta: 3600,
  size: 10 * 1024 * 1024,
  downloaded: 4 * 1024 * 1024,
}

describe('MmTorrentCard', () => {
  it('renders the torrent name', () => {
    const wrapper = mount(MmTorrentCard, {
      props: { torrent },
    })

    expect(wrapper.find('.torrent-card__name').text()).toBe('Example Movie (2026)')
  })

  it('preserves the full torrent name in the title attribute', () => {
    const wrapper = mount(MmTorrentCard, {
      props: {
        torrent: {
          ...torrent,
          name: 'A Very Long Torrent Name That Should Be Truncated Visually',
        },
      },
    })

    expect(wrapper.find('.torrent-card__name').attributes('title')).toBe(
      'A Very Long Torrent Name That Should Be Truncated Visually',
    )
  })

  it('displays a readable torrent status', () => {
    const wrapper = mount(MmTorrentCard, {
      props: { torrent },
    })

    expect(wrapper.find('.torrent-card__status').text()).toBe('Downloading')
  })

  it('displays the progress percentage', () => {
    const wrapper = mount(MmTorrentCard, {
      props: { torrent },
    })

    expect(wrapper.find('.torrent-card__percentage').text()).toBe('42.5%')
  })

  it('passes the percentage to the progress bar', () => {
    const wrapper = mount(MmTorrentCard, {
      props: { torrent },
    })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('42.5')
  })

  it('displays downloaded and total sizes', () => {
    const wrapper = mount(MmTorrentCard, {
      props: { torrent },
    })

    expect(wrapper.find('.torrent-card__size').text()).toBe('4.0 MiB / 10 MiB')
  })

  it('displays transfer speeds and ETA', () => {
    const wrapper = mount(MmTorrentCard, {
      props: { torrent },
    })

    expect(wrapper.text()).toContain('1.0 MiB/s')
    expect(wrapper.text()).toContain('512 KiB/s')
    expect(wrapper.text()).toContain('ETA: 1h 0m')
  })

  it('emits stop when an active torrent is stopped', async () => {
    const wrapper = mount(MmTorrentCard, {
      props: { torrent },
    })

    await wrapper.get('button[aria-label="Stop Example Movie (2026)"]').trigger('click')

    expect(wrapper.emitted('stop')).toEqual([[torrent.hash]])
    expect(wrapper.emitted('start')).toBeUndefined()
  })

  it('emits start when a stopped torrent is started', async () => {
    const wrapper = mount(MmTorrentCard, {
      props: {
        torrent: {
          ...torrent,
          state: 'stoppedDL',
        },
      },
    })

    await wrapper.get('button[aria-label="Start Example Movie (2026)"]').trigger('click')

    expect(wrapper.emitted('start')).toEqual([[torrent.hash]])
    expect(wrapper.emitted('stop')).toBeUndefined()
  })

  it('supports older paused states', async () => {
    const wrapper = mount(MmTorrentCard, {
      props: {
        torrent: {
          ...torrent,
          state: 'pausedUP',
        },
      },
    })

    await wrapper.get('button[aria-label="Start Example Movie (2026)"]').trigger('click')

    expect(wrapper.emitted('start')).toEqual([[torrent.hash]])
  })

  it('emits remove without performing deletion', async () => {
    const wrapper = mount(MmTorrentCard, {
      props: { torrent },
    })

    await wrapper.get('button[aria-label="Remove Example Movie (2026)"]').trigger('click')

    expect(wrapper.emitted('remove')).toEqual([[torrent.hash]])
  })

  it('disables actions when the card is disabled', async () => {
    const wrapper = mount(MmTorrentCard, {
      props: {
        torrent,
        disabled: true,
      },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons).toHaveLength(2)
    expect(buttons.every((button) => button.attributes('disabled') !== undefined)).toBe(true)

    await buttons[0].trigger('click')
    await buttons[1].trigger('click')

    expect(wrapper.emitted('stop')).toBeUndefined()
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('shows a loading state during a stop operation', () => {
    const wrapper = mount(MmTorrentCard, {
      props: {
        torrent,
        pendingAction: 'stop',
      },
    })

    expect(
      wrapper.get('button[aria-label="Stop Example Movie (2026)"]').attributes('aria-busy'),
    ).toBe('true')

    expect(
      wrapper.findAll('button').every((button) => button.attributes('disabled') !== undefined),
    ).toBe(true)
  })

  it('shows a loading state during removal', () => {
    const wrapper = mount(MmTorrentCard, {
      props: {
        torrent,
        pendingAction: 'remove',
      },
    })

    expect(
      wrapper.get('button[aria-label="Remove Example Movie (2026)"]').attributes('aria-busy'),
    ).toBe('true')
  })

  it('does not emit actions while another action is pending', async () => {
    const wrapper = mount(MmTorrentCard, {
      props: {
        torrent,
        pendingAction: 'stop',
      },
    })

    await wrapper.get('button[aria-label="Remove Example Movie (2026)"]').trigger('click')

    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('clamps invalid progress values', () => {
    const wrapper = mount(MmTorrentCard, {
      props: {
        torrent: {
          ...torrent,
          progress: Number.NaN,
        },
      },
    })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
    expect(wrapper.find('.torrent-card__percentage').text()).toBe('0.0%')
  })

  it('updates when the torrent state changes', async () => {
    const wrapper = mount(MmTorrentCard, {
      props: { torrent },
    })

    await wrapper.setProps({
      torrent: {
        ...torrent,
        state: 'stoppedDL',
      },
    })

    expect(wrapper.find('.torrent-card__status').text()).toBe('Stopped')
    expect(wrapper.find('button[aria-label="Start Example Movie (2026)"]').exists()).toBe(true)
  })

  it('renders error states with error styling', () => {
    const wrapper = mount(MmTorrentCard, {
      props: {
        torrent: {
          ...torrent,
          state: 'error',
        },
      },
    })

    expect(wrapper.find('.torrent-card__status').classes()).toContain('torrent-card__status--error')
  })
})
