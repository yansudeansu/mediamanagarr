import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmServiceForm from './MmServiceForm.vue'
import MmInput from '../../atoms/MmInput/MmInput.vue'
import MmSelect from '../../atoms/MmSelect/MmSelect.vue'
import MmServiceHealth from '../../molecules/MmServiceHealth/MmServiceHealth.vue'

type FormProps = Partial<InstanceType<typeof MmServiceForm>['$props']>

const users = [
  { label: 'Alice', value: 'user-1' },
  { label: 'Bob', value: 'user-2' },
]

function createWrapper(props: FormProps = {}) {
  return mount(MmServiceForm, {
    props: {
      name: 'Jellyfin',
      description: 'Recently added movies and episodes',
      ...props,
    },
  })
}

function findButton(wrapper: ReturnType<typeof createWrapper>, label: string) {
  return wrapper.findAll('button').find((button) => button.text() === label)
}

function configuredProps(): FormProps {
  return {
    configured: true,
    url: 'https://jellyfin.example.com',
    canReuseSavedKey: true,
  }
}

function userProps(): FormProps {
  return {
    ...configuredProps(),
    userSelectionLabel: 'Jellyfin User',
    userSelectionHint: 'Choose the Jellyfin user whose library you want to view.',
    userOptions: users,
    selectedUserId: 'user-2',
  }
}

describe('MmServiceForm', () => {
  it('renders the supplied service name and description', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Jellyfin')
    expect(wrapper.text()).toContain('Recently added movies and episodes')
    expect(wrapper.get('.service-form').attributes('aria-label')).toBe('Jellyfin configuration')
  })

  it('renders URL and API key inputs', () => {
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

  it('never prefills the API key', () => {
    const wrapper = createWrapper(configuredProps())

    expect((wrapper.get('input[type="password"]').element as HTMLInputElement).value).toBe('')
  })

  it('shows the saved-key hint for configured services', () => {
    const wrapper = createWrapper(configuredProps())

    expect(wrapper.text()).toContain('Leave blank to reuse your saved API key.')
  })

  it('emits trimmed connection details without service-specific identifiers', async () => {
    const wrapper = createWrapper()

    await wrapper.get('input[type="url"]').setValue(' https://jellyfin.example.com/ ')
    await wrapper.get('input[type="password"]').setValue('  secret-key  ')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')?.[0]).toEqual([
      {
        url: 'https://jellyfin.example.com/',
        apiKey: 'secret-key',
      },
    ])
  })

  it('allows a blank key when the parent permits saved-key reuse', async () => {
    const wrapper = createWrapper(configuredProps())

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')?.[0]).toEqual([
      {
        url: 'https://jellyfin.example.com',
        apiKey: '',
      },
    ])
  })

  it('rejects a missing URL', async () => {
    const wrapper = createWrapper()

    await wrapper.get('input[type="password"]').setValue('secret')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toBe('Enter a server URL.')
  })

  it('rejects a missing API key for a new connection', async () => {
    const wrapper = createWrapper()

    await wrapper.get('input[type="url"]').setValue('https://jellyfin.example.com')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toBe('Enter an API key.')
  })

  it('rejects blank keys when the parent disallows reuse', async () => {
    const wrapper = createWrapper({
      ...configuredProps(),
      canReuseSavedKey: false,
    })

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toBe('Enter an API key.')
  })

  it('requires a new API key when changing the saved URL', async () => {
    const wrapper = createWrapper(configuredProps())

    await wrapper.get('input[type="url"]').setValue('https://other.example.com')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toBe('Enter an API key.')
  })

  it('does not perform service-specific URL normalization', async () => {
    const wrapper = createWrapper()

    await wrapper.get('input[type="url"]').setValue('https://jellyfin.example.com/')
    await wrapper.get('input[type="password"]').setValue('secret')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')?.[0]).toEqual([
      {
        url: 'https://jellyfin.example.com/',
        apiKey: 'secret',
      },
    ])
  })

  it('resets draft fields when the supplied service changes', async () => {
    const wrapper = createWrapper({
      url: 'https://jellyfin.example.com',
    })

    await wrapper.get('input[type="password"]').setValue('temporary-secret')

    await wrapper.setProps({
      name: 'Sonarr',
      description: 'TV series management',
      url: 'https://sonarr.example.com',
    })

    expect(wrapper.text()).toContain('Sonarr')
    expect((wrapper.get('input[type="url"]').element as HTMLInputElement).value).toBe(
      'https://sonarr.example.com',
    )
    expect((wrapper.get('input[type="password"]').element as HTMLInputElement).value).toBe('')
  })

  it('disables inputs while loading', () => {
    const wrapper = createWrapper({ loading: true })

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
      success: 'Connected successfully.',
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Connected successfully.')
  })

  it('hides success feedback while loading', () => {
    const wrapper = createWrapper({
      loading: true,
      success: 'Connected successfully.',
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('hides success feedback when an error exists', () => {
    const wrapper = createWrapper({
      error: 'Authentication failed.',
      success: 'Connected successfully.',
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.get('[role="alert"]').text()).toBe('Authentication failed.')
  })

  it('emits edit when the URL changes', async () => {
    const wrapper = createWrapper()

    await wrapper.get('input[type="url"]').setValue('https://jellyfin.example.com')

    expect(wrapper.emitted('edit')).toHaveLength(1)
  })

  it('emits edit when the API key changes', async () => {
    const wrapper = createWrapper()

    await wrapper.get('input[type="password"]').setValue('new-secret')

    expect(wrapper.emitted('edit')).toHaveLength(1)
  })

  // Connection health

  it('hides health for unconfigured services', () => {
    const wrapper = createWrapper({
      configured: false,
      healthStatus: 'connected',
    })

    expect(wrapper.findComponent(MmServiceHealth).exists()).toBe(false)
  })

  it('shows an unchecked state by default', () => {
    const wrapper = createWrapper({ configured: true })
    const health = wrapper.getComponent(MmServiceHealth)

    expect(health.props('status')).toBe('not-checked')
    expect(health.props('lastCheckedLabel')).toBe('')
    expect(health.props('error')).toBe('')
    expect(health.get('.status-badge__label').text()).toBe('Not checked yet')
    expect(health.find('.service-health__time').exists()).toBe(false)
  })

  it('shows connected health', () => {
    const wrapper = createWrapper({
      configured: true,
      healthStatus: 'connected',
    })

    const health = wrapper.getComponent(MmServiceHealth)

    expect(health.props('status')).toBe('connected')
    expect(health.get('.status-badge').classes()).toContain('status-badge--success')
    expect(health.get('.status-badge__label').text()).toBe('Connected')
  })

  it('shows failed health and its error', () => {
    const wrapper = createWrapper({
      configured: true,
      healthStatus: 'failed',
      healthError: 'Service is unavailable.',
    })

    const health = wrapper.getComponent(MmServiceHealth)

    expect(health.props('status')).toBe('failed')
    expect(health.props('error')).toBe('Service is unavailable.')
    expect(health.get('.status-badge').classes()).toContain('status-badge--danger')
    expect(health.get('.status-badge__label').text()).toBe('Connection failed')
    expect(health.get('.service-health__error').text()).toBe('Service is unavailable.')
    expect(health.get('[role="alert"]').text()).toBe('Service is unavailable.')
  })

  it('displays the supplied last-checked label', () => {
    const label = 'October 31, 2026 at 12:00'

    const wrapper = createWrapper({
      configured: true,
      healthStatus: 'connected',
      healthLastCheckedLabel: label,
    })

    const health = wrapper.getComponent(MmServiceHealth)

    expect(health.props('lastCheckedLabel')).toBe(label)
    expect(health.get('.service-health__time').text()).toBe(label)
  })

  it('does not display a timestamp when no label is supplied', () => {
    const wrapper = createWrapper({
      configured: true,
      healthStatus: 'connected',
    })

    expect(wrapper.getComponent(MmServiceHealth).find('.service-health__time').exists()).toBe(false)
  })

  it('passes health updates through to the health component', async () => {
    const wrapper = createWrapper({
      configured: true,
      healthStatus: 'connected',
    })

    await wrapper.setProps({
      name: 'Sonarr',
      healthStatus: 'failed',
      healthLastCheckedLabel: 'Just now',
      healthError: 'Sonarr is unavailable.',
    })

    const health = wrapper.getComponent(MmServiceHealth)

    expect(health.props('status')).toBe('failed')
    expect(health.props('lastCheckedLabel')).toBe('Just now')
    expect(health.props('error')).toBe('Sonarr is unavailable.')
  })

  // Test saved connection

  it('hides Test Connection for unconfigured services', () => {
    const wrapper = createWrapper()

    expect(findButton(wrapper, 'Test Connection')).toBeUndefined()
  })

  it('enables Test Connection for an unchanged saved URL', () => {
    const wrapper = createWrapper(configuredProps())

    expect(findButton(wrapper, 'Test Connection')?.attributes('disabled')).toBeUndefined()
  })

  it('emits testConnection without submitting the form', async () => {
    const wrapper = createWrapper(configuredProps())
    const button = findButton(wrapper, 'Test Connection')

    expect(button).toBeDefined()
    await button!.trigger('click')

    expect(wrapper.emitted('testConnection')?.[0]).toEqual([])
    expect(wrapper.emitted('connect')).toBeUndefined()
  })

  it('disables Test Connection when the URL changes', async () => {
    const wrapper = createWrapper(configuredProps())

    await wrapper.get('input[type="url"]').setValue('https://other.example.com')

    const button = findButton(wrapper, 'Test Connection')

    expect(button?.attributes('disabled')).toBeDefined()

    await button!.trigger('click')

    expect(wrapper.emitted('testConnection')).toBeUndefined()
  })

  it('disables Test Connection when a new API key is entered', async () => {
    const wrapper = createWrapper(configuredProps())

    await wrapper.get('input[type="password"]').setValue('new-key')

    const button = findButton(wrapper, 'Test Connection')

    expect(button?.attributes('disabled')).toBeDefined()

    await button!.trigger('click')

    expect(wrapper.emitted('testConnection')).toBeUndefined()
  })

  it('reenables Test Connection after reverting unsaved changes', async () => {
    const wrapper = createWrapper(configuredProps())

    await wrapper.get('input[type="url"]').setValue('https://other.example.com')
    await wrapper.get('input[type="password"]').setValue('new-key')

    expect(findButton(wrapper, 'Test Connection')?.attributes('disabled')).toBeDefined()

    await wrapper.get('input[type="url"]').setValue('https://jellyfin.example.com')
    await wrapper.get('input[type="password"]').setValue('')

    expect(findButton(wrapper, 'Test Connection')?.attributes('disabled')).toBeUndefined()
  })

  it('disables form actions while testing', async () => {
    const wrapper = createWrapper({
      ...configuredProps(),
      testing: true,
    })

    expect(wrapper.get('input[type="url"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('input[type="password"]').attributes('disabled')).toBeDefined()
    expect(findButton(wrapper, 'Connect & Test')?.attributes('disabled')).toBeDefined()
    expect(findButton(wrapper, 'Test Connection')?.attributes('disabled')).toBeDefined()
    expect(findButton(wrapper, 'Remove server')?.attributes('disabled')).toBeDefined()

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(wrapper.emitted('testConnection')).toBeUndefined()
  })

  it('hides stale success feedback while testing', () => {
    const wrapper = createWrapper({
      ...configuredProps(),
      testing: true,
      success: 'Previously connected.',
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('does not test a configured service without a saved URL', async () => {
    const wrapper = createWrapper({
      configured: true,
      url: '',
    })

    const button = findButton(wrapper, 'Test Connection')

    expect(button?.attributes('disabled')).toBeDefined()

    await button!.trigger('click')

    expect(wrapper.emitted('testConnection')).toBeUndefined()
  })

  // Optional user selection

  it('renders a configured user selector with supplied options', () => {
    const wrapper = createWrapper(userProps())

    const select = wrapper.getComponent(MmSelect)

    expect(wrapper.text()).toContain('Jellyfin User')
    expect(select.props('options')).toEqual(users)
    expect(select.props('modelValue')).toBe('user-2')
  })

  it('hides user selection when unconfigured', () => {
    const wrapper = createWrapper({
      ...userProps(),
      configured: false,
    })

    expect(wrapper.findComponent(MmSelect).exists()).toBe(false)
  })

  it('hides user selection when no label is provided', () => {
    const wrapper = createWrapper(configuredProps())

    expect(wrapper.findComponent(MmSelect).exists()).toBe(false)
  })

  it('hides user selection when editing a different URL', async () => {
    const wrapper = createWrapper(userProps())

    await wrapper.get('input[type="url"]').setValue('https://other.example.com')

    expect(wrapper.findComponent(MmSelect).exists()).toBe(false)
  })

  it('restores user selection when returning to the saved URL', async () => {
    const wrapper = createWrapper(userProps())

    await wrapper.get('input[type="url"]').setValue('https://other.example.com')

    expect(wrapper.findComponent(MmSelect).exists()).toBe(false)

    await wrapper.get('input[type="url"]').setValue('https://jellyfin.example.com')

    expect(wrapper.findComponent(MmSelect).exists()).toBe(true)
  })

  it('emits the selected user ID', () => {
    const wrapper = createWrapper(userProps())

    wrapper.getComponent(MmSelect).vm.$emit('update:modelValue', 'user-1')

    expect(wrapper.emitted('selectUser')?.[0]).toEqual(['user-1'])
  })

  it('disables user selection when no options are available', () => {
    const wrapper = createWrapper({
      ...userProps(),
      userOptions: [],
    })

    expect(wrapper.getComponent(MmSelect).props('disabled')).toBe(true)
  })

  // Removal confirmation

  it('hides Remove server for unconfigured services', () => {
    const wrapper = createWrapper()

    expect(findButton(wrapper, 'Remove server')).toBeUndefined()
  })

  it('shows Remove server for configured services', () => {
    const wrapper = createWrapper({ configured: true })

    expect(findButton(wrapper, 'Remove server')).toBeDefined()
  })

  it('requests confirmation before removal', async () => {
    const wrapper = createWrapper({ configured: true })

    await findButton(wrapper, 'Remove server')!.trigger('click')

    expect(wrapper.text()).toContain('Remove Jellyfin server?')
    expect(wrapper.text()).toContain('Confirm removal')
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('renders the parent-supplied removal note', async () => {
    const wrapper = createWrapper({
      configured: true,
      removalNote: 'The selected library user will also be cleared.',
    })

    await findButton(wrapper, 'Remove server')!.trigger('click')

    expect(wrapper.text()).toContain('The selected library user will also be cleared.')
  })

  it('allows cancelling removal', async () => {
    const wrapper = createWrapper({ configured: true })

    await findButton(wrapper, 'Remove server')!.trigger('click')
    await findButton(wrapper, 'Cancel')!.trigger('click')

    expect(wrapper.text()).not.toContain('Remove Jellyfin server?')
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('emits remove only after confirmation', async () => {
    const wrapper = createWrapper({
      name: 'Sonarr',
      configured: true,
    })

    await findButton(wrapper, 'Remove server')!.trigger('click')
    await findButton(wrapper, 'Confirm removal')!.trigger('click')

    expect(wrapper.emitted('remove')?.[0]).toEqual([])
  })

  it('prevents repeated confirmation while removing', async () => {
    const wrapper = createWrapper({ configured: true })

    await findButton(wrapper, 'Remove server')!.trigger('click')
    await wrapper.setProps({ removing: true })
    await findButton(wrapper, 'Confirm removal')!.trigger('click')

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

  it('resets confirmation when switching services', async () => {
    const wrapper = createWrapper({
      ...configuredProps(),
    })

    await findButton(wrapper, 'Remove server')!.trigger('click')

    expect(wrapper.text()).toContain('Remove Jellyfin server?')

    await wrapper.setProps({
      name: 'Sonarr',
      url: 'https://sonarr.example.com',
    })

    expect(wrapper.text()).not.toContain('Remove Sonarr server?')
    expect(findButton(wrapper, 'Remove server')).toBeDefined()
  })

  it('closes confirmation when the service becomes unconfigured', async () => {
    const wrapper = createWrapper({ configured: true })

    await findButton(wrapper, 'Remove server')!.trigger('click')
    await wrapper.setProps({ configured: false })

    expect(findButton(wrapper, 'Confirm removal')).toBeUndefined()
    expect(findButton(wrapper, 'Remove server')).toBeUndefined()
  })

  // Optional user feedback

  it('shows accessible saving feedback', () => {
    const wrapper = createWrapper({
      ...userProps(),
      userSaving: true,
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Saving user…')
  })

  it('shows success feedback after saving a user', () => {
    const wrapper = createWrapper({
      ...userProps(),
      userSuccess: 'Jellyfin user saved successfully.',
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Jellyfin user saved successfully.')
  })

  it('does not show success while saving is in progress', () => {
    const wrapper = createWrapper({
      ...userProps(),
      userSaving: true,
      userSuccess: 'Jellyfin user saved successfully.',
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Saving user…')
  })

  it('hides user success when a save error exists', () => {
    const wrapper = createWrapper({
      ...userProps(),
      usersError: 'Unable to save user.',
      userSuccess: 'User saved.',
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('hides user feedback when editing a different URL', async () => {
    const wrapper = createWrapper({
      ...userProps(),
      userSuccess: 'User saved.',
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(true)

    await wrapper.get('input[type="url"]').setValue('https://other.example.com')

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })
})
