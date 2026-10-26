import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmTorrentConfirmation from './MmTorrentConfirmation.vue'
import type { QBittorrentTorrent } from '../../../types/qbittorrent'

const torrent: QBittorrentTorrent = {
  hash: 'a'.repeat(40),
  name: 'Example Download',
  progress: 0.5,
  state: 'downloading',
  downloadSpeed: 1024 * 1024,
  uploadSpeed: 0,
  eta: 3600,
  size: 1024 ** 3,
  downloaded: 512 * 1024 ** 2,
}

const anotherTorrent: QBittorrentTorrent = {
  ...torrent,
  hash: 'b'.repeat(40),
  name: 'Another Download',
}

function mountConfirmation(
  overrides: {
    torrent?: QBittorrentTorrent | null
    loading?: boolean
  } = {},
) {
  return mount(MmTorrentConfirmation, {
    props: {
      torrent,
      ...overrides,
    },
  })
}

describe('MmTorrentConfirmation', () => {
  it('does not render when no torrent is selected', () => {
    const wrapper = mountConfirmation({
      torrent: null,
    })

    expect(wrapper.find('.torrent-confirmation').exists()).toBe(false)
  })

  it('renders using the shared card component', () => {
    const wrapper = mountConfirmation()

    expect(wrapper.find('.mm-card').exists()).toBe(true)
  })

  it('renders an accessible confirmation section', () => {
    const wrapper = mountConfirmation()

    const section = wrapper.get('section')
    const heading = wrapper.get('h3')

    expect(section.attributes('aria-labelledby')).toBe(heading.attributes('id'))
    expect(heading.text()).toBe('Remove torrent?')
  })

  it('displays the selected torrent name', () => {
    const wrapper = mountConfirmation()

    expect(wrapper.text()).toContain('Example Download')
  })

  it('explains that downloaded files are kept by default', () => {
    const wrapper = mountConfirmation()

    expect(wrapper.text()).toContain(
      'Your downloaded files will be kept unless you choose to delete them below.',
    )
  })

  it('renders an unchecked delete-files checkbox by default', () => {
    const wrapper = mountConfirmation()

    const checkbox = wrapper.get('input[type="checkbox"]')

    expect((checkbox.element as HTMLInputElement).checked).toBe(false)
  })

  it('uses a clear label for the destructive checkbox', () => {
    const wrapper = mountConfirmation()

    expect(wrapper.text()).toContain('Also delete downloaded files')
    expect(wrapper.text()).toContain('Permanently delete the downloaded data from disk.')
  })

  it('does not show the stronger warning by default', () => {
    const wrapper = mountConfirmation()

    expect(wrapper.find('.torrent-confirmation__warning').exists()).toBe(false)
  })

  it('shows a stronger warning when file deletion is selected', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('input[type="checkbox"]').setValue(true)

    const warning = wrapper.get('.torrent-confirmation__warning')

    expect(warning.attributes('role')).toBe('alert')
    expect(warning.text()).toContain('This cannot be undone.')
  })

  it('changes the confirm button label when file deletion is selected', async () => {
    const wrapper = mountConfirmation()

    expect(wrapper.text()).toContain('Remove torrent')

    await wrapper.get('input[type="checkbox"]').setValue(true)

    expect(wrapper.text()).toContain('Remove + files')
  })

  it('emits confirmation without deleting files by default', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('button.button--danger').trigger('click')

    expect(wrapper.emitted('confirm')?.[0]).toEqual([
      {
        hash: torrent.hash,
        deleteFiles: false,
      },
    ])
  })

  it('emits confirmation with file deletion only when explicitly checked', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('input[type="checkbox"]').setValue(true)
    await wrapper.get('button.button--danger').trigger('click')

    expect(wrapper.emitted('confirm')?.[0]).toEqual([
      {
        hash: torrent.hash,
        deleteFiles: true,
      },
    ])
  })

  it('emits cancel when the cancel button is clicked', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('button.button--secondary').trigger('click')

    expect(wrapper.emitted('cancel')?.[0]).toEqual([])
  })

  it('resets file deletion when switching torrents', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('input[type="checkbox"]').setValue(true)

    await wrapper.setProps({
      torrent: anotherTorrent,
    })

    const checkbox = wrapper.get('input[type="checkbox"]')

    expect((checkbox.element as HTMLInputElement).checked).toBe(false)

    await wrapper.get('button.button--danger').trigger('click')

    expect(wrapper.emitted('confirm')?.[0]).toEqual([
      {
        hash: anotherTorrent.hash,
        deleteFiles: false,
      },
    ])
  })

  it('resets file deletion when closed and reopened for the same torrent', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('input[type="checkbox"]').setValue(true)

    await wrapper.setProps({
      torrent: null,
    })

    await wrapper.setProps({
      torrent,
    })

    const checkbox = wrapper.get('input[type="checkbox"]')

    expect((checkbox.element as HTMLInputElement).checked).toBe(false)

    await wrapper.get('button.button--danger').trigger('click')

    expect(wrapper.emitted('confirm')?.[0]).toEqual([
      {
        hash: torrent.hash,
        deleteFiles: false,
      },
    ])
  })

  it('resets file deletion when cancelled', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('input[type="checkbox"]').setValue(true)
    await wrapper.get('button.button--secondary').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect((wrapper.get('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(false)
  })

  it('disables controls while loading', () => {
    const wrapper = mountConfirmation({
      loading: true,
    })

    expect(wrapper.get('input[type="checkbox"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button.button--secondary').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button.button--danger').attributes('disabled')).toBeDefined()
  })

  it('marks the confirm button as busy while loading', () => {
    const wrapper = mountConfirmation({
      loading: true,
    })

    expect(wrapper.get('button.button--danger').attributes('aria-busy')).toBe('true')
  })

  it('does not emit confirmation while loading', async () => {
    const wrapper = mountConfirmation({
      loading: true,
    })

    await wrapper.get('button.button--danger').trigger('click')

    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('does not emit cancellation while loading', async () => {
    const wrapper = mountConfirmation({
      loading: true,
    })

    await wrapper.get('button.button--secondary').trigger('click')

    expect(wrapper.emitted('cancel')).toBeUndefined()
  })
})
