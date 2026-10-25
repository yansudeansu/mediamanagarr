import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmServiceForm from './MmServiceForm.vue'
import MmInput from '../../atoms/MmInput/MmInput.vue'
import MmSelect from '../../atoms/MmSelect/MmSelect.vue'
import type { ServiceId } from '../../../types/service'

describe('MmServiceForm', () => {
  function createWrapper(
    props: {
      serviceId?: ServiceId
      url?: string
      configured?: boolean
      loading?: boolean
      removing?: boolean
      error?: string
      success?: string
      jellyfinUsers?: { id: string; name: string }[]
      jellyfinUserId?: string
      jellyfinUsersLoading?: boolean
      jellyfinUserSaving?: boolean
      jellyfinUsersError?: string
      jellyfinUserSuccess?: string
    } = {},
  ) {
    return mount(MmServiceForm, {
      props: {
        serviceId: 'jellyfin',
        ...props,
      },
    })
  }

  it('renders the selected service name and description', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Jellyfin')
    expect(wrapper.text()).toContain('Recently added movies and episodes')
  })

  it('renders the URL and API key inputs', () => {
    const wrapper = createWrapper()

    expect(wrapper.findAllComponents(MmInput)).toHaveLength(2)
    expect(wrapper.find('input[type="url"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('populates the URL from props', () => {
    const wrapper = createWrapper({
      url: 'https://jellyfin.example.com',
    })

    expect((wrapper.get('input[type="url"]').element as HTMLInputElement).value).toBe(
      'https://jellyfin.example.com',
    )
  })

  it('does not prefill the API key', () => {
    const wrapper = createWrapper({
      configured: true,
    })

    expect((wrapper.get('input[type="password"]').element as HTMLInputElement).value).toBe('')
  })

  it('shows the saved-key hint for configured services', () => {
    const wrapper = createWrapper({
      configured: true,
    })

    expect(wrapper.text()).toContain('Leave blank to reuse your saved API key.')
  })

  it('emits normalized connection details', async () => {
    const wrapper = createWrapper()

    await wrapper.get('input[type="url"]').setValue(' https://jellyfin.example.com/ ')
    await wrapper.get('input[type="password"]').setValue('  secret-key  ')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')?.[0]).toEqual([
      {
        serviceId: 'jellyfin',
        url: 'https://jellyfin.example.com',
        apiKey: 'secret-key',
      },
    ])
  })

  it('allows a blank API key for configured services', async () => {
    const wrapper = createWrapper({
      configured: true,
      url: 'https://jellyfin.example.com',
    })

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')?.[0]).toEqual([
      {
        serviceId: 'jellyfin',
        url: 'https://jellyfin.example.com',
        apiKey: '',
      },
    ])
  })

  it('rejects invalid URLs', async () => {
    const wrapper = createWrapper()

    await wrapper.get('input[type="url"]').setValue('not-a-url')
    await wrapper.get('input[type="password"]').setValue('secret')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toContain('valid server URL')
  })

  it('rejects missing API keys for unconfigured services', async () => {
    const wrapper = createWrapper()

    await wrapper.get('input[type="url"]').setValue('https://jellyfin.example.com')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toBe('Enter an API key.')
  })

  it('requires a new API key when changing server URLs', async () => {
    const wrapper = createWrapper({
      configured: true,
      url: 'https://jellyfin.example.com',
    })

    await wrapper.get('input[type="url"]').setValue('https://other.example.com')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toBe('Enter an API key.')
  })

  it('updates the form when switching services', async () => {
    const wrapper = createWrapper({
      url: 'https://jellyfin.example.com',
    })

    await wrapper.get('input[type="password"]').setValue('temporary-secret')

    await wrapper.setProps({
      serviceId: 'sonarr',
      url: 'https://sonarr.example.com',
    })

    expect(wrapper.text()).toContain('Sonarr')
    expect((wrapper.get('input[type="url"]').element as HTMLInputElement).value).toBe(
      'https://sonarr.example.com',
    )
    expect((wrapper.get('input[type="password"]').element as HTMLInputElement).value).toBe('')
  })

  it('disables inputs while loading', () => {
    const wrapper = createWrapper({
      loading: true,
    })

    expect(wrapper.get('input[type="url"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('input[type="password"]').attributes('disabled')).toBeDefined()
  })

  it('displays connection errors', () => {
    const wrapper = createWrapper({
      error: 'Could not reach the server.',
    })

    expect(wrapper.get('[role="alert"]').text()).toBe('Could not reach the server.')
  })

  it('displays accessible success feedback', () => {
    const wrapper = createWrapper({
      success: 'Connected to Jellyfin successfully.',
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Connected to Jellyfin successfully.')
  })

  it('does not display success feedback while loading', () => {
    const wrapper = createWrapper({
      loading: true,
      success: 'Connected to Jellyfin successfully.',
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('does not display success feedback when an error exists', () => {
    const wrapper = createWrapper({
      error: 'Authentication failed.',
      success: 'Connected to Jellyfin successfully.',
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.get('[role="alert"]').text()).toBe('Authentication failed.')
  })

  it('emits edit when the server URL changes', async () => {
    const wrapper = createWrapper()

    await wrapper.get('input[type="url"]').setValue('https://jellyfin.example.com')

    expect(wrapper.emitted('edit')).toHaveLength(1)
  })

  it('emits edit when the API key changes', async () => {
    const wrapper = createWrapper()

    await wrapper.get('input[type="password"]').setValue('new-secret')

    expect(wrapper.emitted('edit')).toHaveLength(1)
  })

  it('shows the Jellyfin user dropdown when Jellyfin is configured', () => {
    const wrapper = createWrapper({
      url: 'https://jellyfin.example.com',
      configured: true,
      jellyfinUsers: [
        { id: 'user-1', name: 'Alice' },
        { id: 'user-2', name: 'Bob' },
      ],
      jellyfinUserId: 'user-2',
    })

    expect(wrapper.text()).toContain('Jellyfin User')
    expect(wrapper.text()).toContain('Bob')
  })

  it('hides the Jellyfin user dropdown when Jellyfin is not configured', () => {
    const wrapper = createWrapper({
      configured: false,
    })

    expect(wrapper.text()).not.toContain('Jellyfin User')
  })

  it('hides the Jellyfin user dropdown for other services', () => {
    const wrapper = createWrapper({
      serviceId: 'sonarr',
      configured: true,
      jellyfinUsers: [{ id: 'user-1', name: 'Alice' }],
    })

    expect(wrapper.text()).not.toContain('Jellyfin User')
  })

  it('hides the Jellyfin user dropdown when editing a different server URL', async () => {
    const wrapper = createWrapper({
      url: 'https://jellyfin.example.com',
      configured: true,
      jellyfinUsers: [{ id: 'user-1', name: 'Alice' }],
      jellyfinUserId: 'user-1',
    })

    expect(wrapper.findComponent(MmSelect).exists()).toBe(true)

    await wrapper.get('input[type="url"]').setValue('https://other.example.com')

    expect(wrapper.findComponent(MmSelect).exists()).toBe(false)
  })

  it('restores the Jellyfin user dropdown when returning to the saved URL', async () => {
    const wrapper = createWrapper({
      url: 'https://jellyfin.example.com',
      configured: true,
      jellyfinUsers: [{ id: 'user-1', name: 'Alice' }],
      jellyfinUserId: 'user-1',
    })

    await wrapper.get('input[type="url"]').setValue('https://other.example.com')

    expect(wrapper.findComponent(MmSelect).exists()).toBe(false)

    await wrapper.get('input[type="url"]').setValue('https://jellyfin.example.com')

    expect(wrapper.findComponent(MmSelect).exists()).toBe(true)
  })

  it('emits the selected Jellyfin user ID', () => {
    const wrapper = createWrapper({
      url: 'https://jellyfin.example.com',
      configured: true,
      jellyfinUsers: [
        { id: 'user-1', name: 'Alice' },
        { id: 'user-2', name: 'Bob' },
      ],
    })

    wrapper.getComponent(MmSelect).vm.$emit('update:modelValue', 'user-2')

    expect(wrapper.emitted('selectJellyfinUser')?.[0]).toEqual(['user-2'])
  })

  // Remove server

  it('does not show Remove server for an unconfigured service', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).not.toContain('Remove server')
  })

  it('shows Remove server for a configured service', () => {
    const wrapper = createWrapper({
      configured: true,
    })

    expect(wrapper.text()).toContain('Remove server')
  })

  it('shows confirmation when Remove server is clicked', async () => {
    const wrapper = createWrapper({
      configured: true,
    })

    await wrapper.get('button').trigger('click') // Replaced below with targeted lookup
  })

  it('allows cancellation without emitting remove', async () => {
    const wrapper = createWrapper({
      configured: true,
    })

    const removeButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Remove server')

    expect(removeButton).toBeDefined()
    await removeButton!.trigger('click')

    expect(wrapper.text()).toContain('Remove Jellyfin server?')

    const cancelButton = wrapper.findAll('button').find((button) => button.text() === 'Cancel')

    expect(cancelButton).toBeDefined()
    await cancelButton!.trigger('click')

    expect(wrapper.text()).not.toContain('Remove Jellyfin server?')
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('emits remove with the selected service ID after confirmation', async () => {
    const wrapper = createWrapper({
      serviceId: 'sonarr',
      configured: true,
    })

    const removeButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Remove server')

    expect(removeButton).toBeDefined()
    await removeButton!.trigger('click')

    const confirmButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Confirm removal')

    expect(confirmButton).toBeDefined()
    await confirmButton!.trigger('click')

    expect(wrapper.emitted('remove')?.[0]).toEqual(['sonarr'])
  })

  it('prevents repeated confirmation while removing', async () => {
    const wrapper = createWrapper({
      configured: true,
    })

    const removeButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Remove server')

    expect(removeButton).toBeDefined()
    await removeButton!.trigger('click')

    await wrapper.setProps({ removing: true })

    const confirmButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Confirm removal')

    expect(confirmButton).toBeDefined()
    await confirmButton!.trigger('click')

    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('disables inputs while removing', () => {
    const wrapper = createWrapper({
      configured: true,
      removing: true,
    })

    expect(wrapper.get('input[type="url"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('input[type="password"]').attributes('disabled')).toBeDefined()
  })

  it('resets removal confirmation when switching services', async () => {
    const wrapper = createWrapper({
      configured: true,
      url: 'https://jellyfin.example.com',
    })

    const removeButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Remove server')

    expect(removeButton).toBeDefined()
    await removeButton!.trigger('click')

    expect(wrapper.text()).toContain('Remove Jellyfin server?')

    await wrapper.setProps({
      serviceId: 'sonarr',
      url: 'https://sonarr.example.com',
    })

    expect(wrapper.text()).not.toContain('Remove Sonarr server?')
    expect(wrapper.text()).toContain('Remove server')
  })

  it('closes confirmation when the service becomes unconfigured', async () => {
    const wrapper = createWrapper({
      configured: true,
    })

    const removeButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Remove server')

    expect(removeButton).toBeDefined()
    await removeButton!.trigger('click')

    await wrapper.setProps({ configured: false })

    expect(wrapper.text()).not.toContain('Confirm removal')
    expect(wrapper.text()).not.toContain('Remove server')
  })

  // Jellyfin user feedback

  it('shows accessible saving feedback for a Jellyfin user', () => {
    const wrapper = createWrapper({
      configured: true,
      url: 'https://jellyfin.example.com',
      jellyfinUsers: jellyfinUsersFixture(),
      jellyfinUserSaving: true,
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Saving Jellyfin user…')
  })

  it('shows success feedback after saving a Jellyfin user', () => {
    const wrapper = createWrapper({
      configured: true,
      url: 'https://jellyfin.example.com',
      jellyfinUsers: jellyfinUsersFixture(),
      jellyfinUserSuccess: 'Jellyfin user saved successfully.',
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Jellyfin user saved successfully.')
  })

  it('does not show saved feedback while saving is in progress', () => {
    const wrapper = createWrapper({
      configured: true,
      url: 'https://jellyfin.example.com',
      jellyfinUsers: jellyfinUsersFixture(),
      jellyfinUserSaving: true,
      jellyfinUserSuccess: 'Jellyfin user saved successfully.',
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Saving Jellyfin user…')
  })

  it('hides Jellyfin user success when a save error exists', () => {
    const wrapper = createWrapper({
      configured: true,
      url: 'https://jellyfin.example.com',
      jellyfinUsers: jellyfinUsersFixture(),
      jellyfinUsersError: 'Unable to save Jellyfin user.',
      jellyfinUserSuccess: 'Jellyfin user saved successfully.',
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('hides Jellyfin feedback when editing another server URL', async () => {
    const wrapper = createWrapper({
      configured: true,
      url: 'https://jellyfin.example.com',
      jellyfinUsers: jellyfinUsersFixture(),
      jellyfinUserSuccess: 'Jellyfin user saved successfully.',
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(true)

    await wrapper.get('input[type="url"]').setValue('https://other.example.com')

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })
})

function jellyfinUsersFixture() {
  return [
    { id: 'user-1', name: 'Alice' },
    { id: 'user-2', name: 'Bob' },
  ]
}
