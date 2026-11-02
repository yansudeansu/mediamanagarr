import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmTorrentConfirmation from './MmTorrentConfirmation.vue'
import type { ConfirmationItem } from './MmTorrentConfirmation.vue'
import { mmTorrentConfirmationSelectors } from '../../../test/selectors/molecules/mmTorrentConfirmation.selectors'
import { mmCardSelectors } from '../../../test/selectors/atoms/mmCard.selectors'
import { mmCheckboxSelectors } from '../../../test/selectors/atoms/mmCheckbox.selectors'

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

let wrapper: VueWrapper

const query = (selector: string) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector)
}

const confirmation = mmTorrentConfirmationSelectors(query)
const card = mmCardSelectors(query)
const checkbox = mmCheckboxSelectors(query)

function mountConfirmation(overrides: ConfirmationOverrides = {}) {
  wrapper = mount(MmTorrentConfirmation, {
    props: {
      item,
      ...overrides,
    },
  })
  return wrapper
}

describe('MmTorrentConfirmation', () => {
  it('does not render when no item is selected', () => {
    mountConfirmation({ item: null })

    expect(confirmation.get().exists()).toBe(false)
  })

  it('renders using the shared card component', () => {
    mountConfirmation()

    expect(card.get().exists()).toBe(true)
  })

  it('renders an accessible confirmation section', () => {
    mountConfirmation()

    const section = confirmation.get()
    const heading = confirmation.title()

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

    const parent = mount(Parent)
    const sections = parent.findAll('section.torrent-confirmation')
    const headings = parent.findAll('h3.torrent-confirmation__title')

    expect(headings).toHaveLength(2)
    expect(headings[0]!.attributes('id')).toBeTruthy()
    expect(headings[1]!.attributes('id')).toBeTruthy()
    expect(headings[0]!.attributes('id')).not.toBe(headings[1]!.attributes('id'))
    expect(sections[0]!.attributes('aria-labelledby')).toBe(headings[0]!.attributes('id'))
    expect(sections[1]!.attributes('aria-labelledby')).toBe(headings[1]!.attributes('id'))
  })

  it('displays the selected item name', () => {
    mountConfirmation()

    expect(confirmation.name().text()).toBe('Example Download')
    expect(confirmation.name().attributes('title')).toBe('Example Download')
  })

  it('explains that associated files are kept by default', () => {
    mountConfirmation()

    expect(confirmation.description().text()).toContain(
      'Its associated files will be kept unless you choose to delete them below.',
    )
  })

  it('supports a custom title and description', () => {
    mountConfirmation({
      title: 'Remove download?',
      description: 'The download will be removed from the service.',
    })

    expect(confirmation.title().text()).toBe('Remove download?')
    expect(confirmation.description().text()).toBe('The download will be removed from the service.')
  })

  it('renders an unchecked delete-files checkbox by default', () => {
    mountConfirmation()

    expect(checkbox.unchecked().exists()).toBe(true)
  })

  it('uses a clear label for the destructive checkbox', () => {
    mountConfirmation()

    expect(checkbox.label().text()).toContain('Also delete associated files')
    expect(checkbox.hint().text()).toContain('Permanently delete the associated files from disk.')
  })

  it('supports custom checkbox text', () => {
    mountConfirmation({
      deleteFilesLabel: 'Also delete downloaded files',
      deleteFilesHint: 'Permanently delete downloaded data.',
    })

    expect(checkbox.label().text()).toContain('Also delete downloaded files')
    expect(checkbox.hint().text()).toContain('Permanently delete downloaded data.')
  })

  it('does not show the stronger warning by default', () => {
    mountConfirmation()

    expect(confirmation.warning().exists()).toBe(false)
  })

  it('shows a stronger warning when file deletion is selected', async () => {
    mountConfirmation()

    await checkbox.control().setValue(true)

    expect(confirmation.alert().exists()).toBe(true)
    expect(confirmation.alert().text()).toContain('This cannot be undone.')
  })

  it('supports a custom destructive-action warning', async () => {
    mountConfirmation({
      deleteFilesWarning: 'Warning: These files will be permanently deleted.',
    })

    await checkbox.control().setValue(true)

    expect(confirmation.warning().text()).toBe('Warning: These files will be permanently deleted.')
  })

  it('changes the confirm button label when file deletion is selected', async () => {
    mountConfirmation()

    expect(confirmation.confirm().text()).toContain('Remove item')

    await checkbox.control().setValue(true)

    expect(confirmation.confirm().text()).toContain('Remove + files')
  })

  it('supports custom confirmation button labels', async () => {
    mountConfirmation({
      confirmLabel: 'Remove torrent',
      confirmWithFilesLabel: 'Remove torrent + files',
    })

    expect(confirmation.confirm().text()).toBe('Remove torrent')

    await checkbox.control().setValue(true)

    expect(confirmation.confirm().text()).toBe('Remove torrent + files')
  })

  it('emits confirmation without deleting files by default', async () => {
    mountConfirmation()

    await confirmation.confirm().trigger('click')

    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ id: item.id, deleteFiles: false }])
  })

  it('emits confirmation with file deletion only when explicitly checked', async () => {
    mountConfirmation()

    await checkbox.control().setValue(true)
    await confirmation.confirm().trigger('click')

    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ id: item.id, deleteFiles: true }])
  })

  it('emits cancel when the cancel button is clicked', async () => {
    mountConfirmation()

    await confirmation.cancel().trigger('click')

    expect(wrapper.emitted('cancel')?.[0]).toEqual([])
  })

  it('resets file deletion when switching items', async () => {
    mountConfirmation()

    await checkbox.control().setValue(true)
    await wrapper.setProps({ item: anotherItem })

    expect(checkbox.unchecked().exists()).toBe(true)

    await confirmation.confirm().trigger('click')

    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ id: anotherItem.id, deleteFiles: false }])
  })

  it('resets file deletion when closed and reopened for the same item', async () => {
    mountConfirmation()

    await checkbox.control().setValue(true)
    await wrapper.setProps({ item: null })
    await wrapper.setProps({ item })

    expect(checkbox.unchecked().exists()).toBe(true)

    await confirmation.confirm().trigger('click')

    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ id: item.id, deleteFiles: false }])
  })

  it('resets file deletion when cancelled', async () => {
    mountConfirmation()

    await checkbox.control().setValue(true)
    await confirmation.cancel().trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(checkbox.unchecked().exists()).toBe(true)
  })

  it('disables controls while loading', () => {
    mountConfirmation({ loading: true })

    expect(checkbox.disabled().exists()).toBe(true)
    expect(confirmation.cancelDisabled().exists()).toBe(true)
    expect(confirmation.confirmDisabled().exists()).toBe(true)
  })

  it('marks the confirm button as busy while loading', () => {
    mountConfirmation({ loading: true })

    expect(confirmation.confirmLoading().exists()).toBe(true)
  })

  it('does not emit confirmation while loading', async () => {
    mountConfirmation({ loading: true })

    await confirmation.confirm().trigger('click')

    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('does not emit cancellation while loading', async () => {
    mountConfirmation({ loading: true })

    await confirmation.cancel().trigger('click')

    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  it('preserves the destructive selection when loading begins', async () => {
    mountConfirmation()

    await checkbox.control().setValue(true)
    await wrapper.setProps({ loading: true })

    expect(checkbox.checked().exists()).toBe(true)
    expect(confirmation.warning().exists()).toBe(true)
  })
})
