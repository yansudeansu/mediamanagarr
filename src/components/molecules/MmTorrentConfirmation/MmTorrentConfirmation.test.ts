import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import MmTorrentConfirmation from './MmTorrentConfirmation.vue'
import type { ConfirmationItem } from './MmTorrentConfirmation.vue'

const item: ConfirmationItem = {
  id: 'a'.repeat(40),
  name: 'Example Download',
}

const anotherItem: ConfirmationItem = {
  id: 'b'.repeat(40),
  name: 'Another Download',
}

interface ConfirmationOverrides {
  item?: ConfirmationItem | null
  loading?: boolean
  title?: string
  description?: string
  deleteFilesLabel?: string
  deleteFilesHint?: string
  deleteFilesWarning?: string
  confirmLabel?: string
  confirmWithFilesLabel?: string
}

function mountConfirmation(overrides: ConfirmationOverrides = {}) {
  return mount(MmTorrentConfirmation, {
    props: {
      item,
      ...overrides,
    },
  })
}

describe('MmTorrentConfirmation', () => {
  it('does not render when no item is selected', () => {
    const wrapper = mountConfirmation({ item: null })

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
    expect(heading.attributes('id')).toBeTruthy()
    expect(heading.text()).toBe('Remove item?')
  })

  it('uses unique heading IDs within the same Vue app', () => {
    const Parent = defineComponent({
      setup() {
        return () =>
          h('div', [
            h(MmTorrentConfirmation, { item }),
            h(MmTorrentConfirmation, { item: anotherItem }),
          ])
      },
    })

    const wrapper = mount(Parent)

    const headings = wrapper.findAll('h3')

    expect(headings).toHaveLength(2)
    expect(headings[0]!.attributes('id')).toBeTruthy()
    expect(headings[1]!.attributes('id')).toBeTruthy()
    expect(headings[0]!.attributes('id')).not.toBe(headings[1]!.attributes('id'))

    const sections = wrapper.findAll('section')

    expect(sections[0]!.attributes('aria-labelledby')).toBe(headings[0]!.attributes('id'))
    expect(sections[1]!.attributes('aria-labelledby')).toBe(headings[1]!.attributes('id'))
  })

  it('displays the selected item name', () => {
    const wrapper = mountConfirmation()

    expect(wrapper.text()).toContain('Example Download')
    expect(wrapper.get('.torrent-confirmation__name').attributes('title')).toBe('Example Download')
  })

  it('explains that associated files are kept by default', () => {
    const wrapper = mountConfirmation()

    expect(wrapper.text()).toContain(
      'Its associated files will be kept unless you choose to delete them below.',
    )
  })

  it('supports a custom title and description', () => {
    const wrapper = mountConfirmation({
      title: 'Remove download?',
      description: 'The download will be removed from the service.',
    })

    expect(wrapper.get('h3').text()).toBe('Remove download?')
    expect(wrapper.get('.torrent-confirmation__description').text()).toBe(
      'The download will be removed from the service.',
    )
  })

  it('renders an unchecked delete-files checkbox by default', () => {
    const wrapper = mountConfirmation()

    expect((wrapper.get('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(false)
  })

  it('uses a clear label for the destructive checkbox', () => {
    const wrapper = mountConfirmation()

    expect(wrapper.text()).toContain('Also delete associated files')
    expect(wrapper.text()).toContain('Permanently delete the associated files from disk.')
  })

  it('supports custom checkbox text', () => {
    const wrapper = mountConfirmation({
      deleteFilesLabel: 'Also delete downloaded files',
      deleteFilesHint: 'Permanently delete downloaded data.',
    })

    expect(wrapper.text()).toContain('Also delete downloaded files')
    expect(wrapper.text()).toContain('Permanently delete downloaded data.')
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

  it('supports a custom destructive-action warning', async () => {
    const wrapper = mountConfirmation({
      deleteFilesWarning: 'Warning: These files will be permanently deleted.',
    })

    await wrapper.get('input[type="checkbox"]').setValue(true)

    expect(wrapper.get('.torrent-confirmation__warning').text()).toBe(
      'Warning: These files will be permanently deleted.',
    )
  })

  it('changes the confirm button label when file deletion is selected', async () => {
    const wrapper = mountConfirmation()

    expect(wrapper.get('button.button--danger').text()).toContain('Remove item')

    await wrapper.get('input[type="checkbox"]').setValue(true)

    expect(wrapper.get('button.button--danger').text()).toContain('Remove + files')
  })

  it('supports custom confirmation button labels', async () => {
    const wrapper = mountConfirmation({
      confirmLabel: 'Remove torrent',
      confirmWithFilesLabel: 'Remove torrent + files',
    })

    expect(wrapper.get('button.button--danger').text()).toBe('Remove torrent')

    await wrapper.get('input[type="checkbox"]').setValue(true)

    expect(wrapper.get('button.button--danger').text()).toBe('Remove torrent + files')
  })

  it('emits confirmation without deleting files by default', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('button.button--danger').trigger('click')

    expect(wrapper.emitted('confirm')?.[0]).toEqual([
      {
        id: item.id,
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
        id: item.id,
        deleteFiles: true,
      },
    ])
  })

  it('emits cancel when the cancel button is clicked', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('button.button--secondary').trigger('click')

    expect(wrapper.emitted('cancel')?.[0]).toEqual([])
  })

  it('resets file deletion when switching items', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('input[type="checkbox"]').setValue(true)
    await wrapper.setProps({ item: anotherItem })

    expect((wrapper.get('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(false)

    await wrapper.get('button.button--danger').trigger('click')

    expect(wrapper.emitted('confirm')?.[0]).toEqual([
      {
        id: anotherItem.id,
        deleteFiles: false,
      },
    ])
  })

  it('resets file deletion when closed and reopened for the same item', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('input[type="checkbox"]').setValue(true)
    await wrapper.setProps({ item: null })
    await wrapper.setProps({ item })

    expect((wrapper.get('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(false)

    await wrapper.get('button.button--danger').trigger('click')

    expect(wrapper.emitted('confirm')?.[0]).toEqual([
      {
        id: item.id,
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
    const wrapper = mountConfirmation({ loading: true })

    expect(wrapper.get('input[type="checkbox"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button.button--secondary').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button.button--danger').attributes('disabled')).toBeDefined()
  })

  it('marks the confirm button as busy while loading', () => {
    const wrapper = mountConfirmation({ loading: true })

    expect(wrapper.get('button.button--danger').attributes('aria-busy')).toBe('true')
  })

  it('does not emit confirmation while loading', async () => {
    const wrapper = mountConfirmation({ loading: true })

    await wrapper.get('button.button--danger').trigger('click')

    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('does not emit cancellation while loading', async () => {
    const wrapper = mountConfirmation({ loading: true })

    await wrapper.get('button.button--secondary').trigger('click')

    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  it('preserves the destructive selection when loading begins', async () => {
    const wrapper = mountConfirmation()

    await wrapper.get('input[type="checkbox"]').setValue(true)
    await wrapper.setProps({ loading: true })

    expect((wrapper.get('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(true)

    expect(wrapper.find('.torrent-confirmation__warning').exists()).toBe(true)
  })
})
