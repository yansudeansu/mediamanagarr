import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmServiceForm from './MmServiceForm.vue'
import MmInput from '../../atoms/MmInput/MmInput.vue'
import MmSelect from '../../atoms/MmSelect/MmSelect.vue'
import MmServiceHealth from '../../molecules/MmServiceHealth/MmServiceHealth.vue'
import { mmServiceFormSelectors } from '../../../test/selectors/organisms/mmServiceForm.selectors'
import { mmServiceHealthSelectors } from '../../../test/selectors/molecules/mmServiceHealth.selectors'
import { mmStatusBadgeSelectors } from '../../../test/selectors/atoms/mmStatusBadge.selectors'

type FormProps = Partial<InstanceType<typeof MmServiceForm>['$props']>

const users = [
  { label: 'Alice', value: 'user-1' },
  { label: 'Bob', value: 'user-2' },
]

let wrapper: VueWrapper

const query = (selector: string) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.service-form /, ''))
}

const service = mmServiceFormSelectors(query)
const health = mmServiceHealthSelectors(query)
const badge = mmStatusBadgeSelectors(query)

function createWrapper(props: FormProps = {}) {
  wrapper = mount(MmServiceForm, {
    props: {
      name: 'Jellyfin',
      description: 'Recently added movies and episodes',
      ...props,
    },
  })
  return wrapper
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
    createWrapper()

    expect(service.title().text()).toBe('Jellyfin')
    expect(service.description().text()).toBe('Recently added movies and episodes')
    expect(service.labelled('Jellyfin').exists()).toBe(true)
  })

  it('renders URL and API key inputs', () => {
    createWrapper()

    expect(wrapper.findAllComponents(MmInput)).toHaveLength(2)
    expect(service.url().exists()).toBe(true)
    expect(service.apiKey().exists()).toBe(true)
  })

  it('populates the URL from props', () => {
    createWrapper({ url: 'https://jellyfin.example.com' })

    expect((service.url().element as HTMLInputElement).value).toBe('https://jellyfin.example.com')
  })

  it('never prefills the API key', () => {
    createWrapper(configuredProps())

    expect((service.apiKey().element as HTMLInputElement).value).toBe('')
  })

  it('shows the saved-key hint for configured services', () => {
    createWrapper(configuredProps())

    expect(wrapper.text()).toContain('Leave blank to reuse your saved API key.')
  })

  it('emits trimmed connection details without service-specific identifiers', async () => {
    createWrapper()

    await service.url().setValue(' https://jellyfin.example.com/ ')
    await service.apiKey().setValue('  secret-key  ')
    await service.fields().trigger('submit')

    expect(wrapper.emitted('connect')?.[0]).toEqual([
      { url: 'https://jellyfin.example.com/', apiKey: 'secret-key' },
    ])
  })

  it('allows a blank key when the parent permits saved-key reuse', async () => {
    createWrapper(configuredProps())

    await service.fields().trigger('submit')

    expect(wrapper.emitted('connect')?.[0]).toEqual([
      { url: 'https://jellyfin.example.com', apiKey: '' },
    ])
  })

  it('rejects a missing URL', async () => {
    createWrapper()

    await service.apiKey().setValue('secret')
    await service.fields().trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(service.error().text()).toBe('Enter a server URL.')
  })

  it('rejects a missing API key for a new connection', async () => {
    createWrapper()

    await service.url().setValue('https://jellyfin.example.com')
    await service.fields().trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(service.error().text()).toBe('Enter an API key.')
  })

  it('rejects blank keys when the parent disallows reuse', async () => {
    createWrapper({ ...configuredProps(), canReuseSavedKey: false })

    await service.fields().trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(service.error().text()).toBe('Enter an API key.')
  })

  it('requires a new API key when changing the saved URL', async () => {
    createWrapper(configuredProps())

    await service.url().setValue('https://other.example.com')
    await service.fields().trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(service.error().text()).toBe('Enter an API key.')
  })

  it('does not perform service-specific URL normalization', async () => {
    createWrapper()

    await service.url().setValue('https://jellyfin.example.com/')
    await service.apiKey().setValue('secret')
    await service.fields().trigger('submit')

    expect(wrapper.emitted('connect')?.[0]).toEqual([
      { url: 'https://jellyfin.example.com/', apiKey: 'secret' },
    ])
  })

  it('resets draft fields when the supplied service changes', async () => {
    createWrapper({ url: 'https://jellyfin.example.com' })

    await service.apiKey().setValue('temporary-secret')
    await wrapper.setProps({
      name: 'Sonarr',
      description: 'TV series management',
      url: 'https://sonarr.example.com',
    })

    expect(service.title().text()).toBe('Sonarr')
    expect((service.url().element as HTMLInputElement).value).toBe('https://sonarr.example.com')
    expect((service.apiKey().element as HTMLInputElement).value).toBe('')
  })

  it('disables inputs while loading', () => {
    createWrapper({ loading: true })

    expect(service.url().attributes('disabled')).toBeDefined()
    expect(service.apiKey().attributes('disabled')).toBeDefined()
  })

  it('displays connection errors', () => {
    createWrapper({ error: 'Could not reach the server.' })

    expect(service.error().text()).toBe('Could not reach the server.')
  })

  it('displays accessible success feedback', () => {
    createWrapper({ success: 'Connected successfully.' })

    expect(service.success().text()).toBe('Connected successfully.')
  })

  it('hides success feedback while loading', () => {
    createWrapper({ loading: true, success: 'Connected successfully.' })

    expect(service.success().exists()).toBe(false)
  })

  it('hides success feedback when an error exists', () => {
    createWrapper({
      error: 'Authentication failed.',
      success: 'Connected successfully.',
    })

    expect(service.success().exists()).toBe(false)
    expect(service.error().text()).toBe('Authentication failed.')
  })

  it('emits edit when the URL changes', async () => {
    createWrapper()

    await service.url().setValue('https://jellyfin.example.com')

    expect(wrapper.emitted('edit')).toHaveLength(1)
  })

  it('emits edit when the API key changes', async () => {
    createWrapper()

    await service.apiKey().setValue('new-secret')

    expect(wrapper.emitted('edit')).toHaveLength(1)
  })

  // Connection health

  it('hides health for unconfigured services', () => {
    createWrapper({ configured: false, healthStatus: 'connected' })

    expect(health.get().exists()).toBe(false)
  })

  it('shows an unchecked state by default', () => {
    createWrapper({ configured: true })

    const component = wrapper.getComponent(MmServiceHealth)

    expect(component.props('status')).toBe('not-checked')
    expect(component.props('lastCheckedLabel')).toBe('')
    expect(component.props('error')).toBe('')
    expect(badge.label().text()).toBe('Not checked yet')
    expect(health.time().exists()).toBe(false)
  })

  it('shows connected health', () => {
    createWrapper({ configured: true, healthStatus: 'connected' })

    const component = wrapper.getComponent(MmServiceHealth)

    expect(component.props('status')).toBe('connected')
    expect(badge.get().classes()).toContain('status-badge--success')
    expect(badge.label().text()).toBe('Connected')
  })

  it('shows failed health and its error', () => {
    createWrapper({
      configured: true,
      healthStatus: 'failed',
      healthError: 'Service is unavailable.',
    })

    const component = wrapper.getComponent(MmServiceHealth)

    expect(component.props('status')).toBe('failed')
    expect(component.props('error')).toBe('Service is unavailable.')
    expect(badge.get().classes()).toContain('status-badge--danger')
    expect(badge.label().text()).toBe('Connection failed')
    expect(health.error().text()).toBe('Service is unavailable.')
    expect(health.alert().text()).toBe('Service is unavailable.')
  })

  it('displays the supplied last-checked label', () => {
    const label = 'October 31, 2026 at 12:00'
    createWrapper({
      configured: true,
      healthStatus: 'connected',
      healthLastCheckedLabel: label,
    })

    const component = wrapper.getComponent(MmServiceHealth)

    expect(component.props('lastCheckedLabel')).toBe(label)
    expect(health.time().text()).toBe(label)
  })

  it('does not display a timestamp when no label is supplied', () => {
    createWrapper({ configured: true, healthStatus: 'connected' })

    expect(health.time().exists()).toBe(false)
  })

  it('passes health updates through to the health component', async () => {
    createWrapper({ configured: true, healthStatus: 'connected' })

    await wrapper.setProps({
      name: 'Sonarr',
      healthStatus: 'failed',
      healthLastCheckedLabel: 'Just now',
      healthError: 'Sonarr is unavailable.',
    })

    const component = wrapper.getComponent(MmServiceHealth)

    expect(component.props('status')).toBe('failed')
    expect(component.props('lastCheckedLabel')).toBe('Just now')
    expect(component.props('error')).toBe('Sonarr is unavailable.')
  })

  // Test saved connection

  it('hides Test Connection for unconfigured services', () => {
    createWrapper()

    expect(service.testConnection().exists()).toBe(false)
  })

  it('enables Test Connection for an unchanged saved URL', () => {
    createWrapper(configuredProps())

    expect(service.testConnection().attributes('disabled')).toBeUndefined()
  })

  it('emits testConnection without submitting the form', async () => {
    createWrapper(configuredProps())

    expect(service.testConnection().exists()).toBe(true)
    await service.testConnection().trigger('click')

    expect(wrapper.emitted('testConnection')?.[0]).toEqual([])
    expect(wrapper.emitted('connect')).toBeUndefined()
  })

  it('disables Test Connection when the URL changes', async () => {
    createWrapper(configuredProps())

    await service.url().setValue('https://other.example.com')

    expect(service.testConnection().attributes('disabled')).toBeDefined()
    await service.testConnection().trigger('click')

    expect(wrapper.emitted('testConnection')).toBeUndefined()
  })

  it('disables Test Connection when a new API key is entered', async () => {
    createWrapper(configuredProps())

    await service.apiKey().setValue('new-key')

    expect(service.testConnection().attributes('disabled')).toBeDefined()
    await service.testConnection().trigger('click')

    expect(wrapper.emitted('testConnection')).toBeUndefined()
  })

  it('reenables Test Connection after reverting unsaved changes', async () => {
    createWrapper(configuredProps())

    await service.url().setValue('https://other.example.com')
    await service.apiKey().setValue('new-key')

    expect(service.testConnection().attributes('disabled')).toBeDefined()

    await service.url().setValue('https://jellyfin.example.com')
    await service.apiKey().setValue('')

    expect(service.testConnection().attributes('disabled')).toBeUndefined()
  })

  it('disables form actions while testing', async () => {
    createWrapper({ ...configuredProps(), testing: true })

    expect(service.url().attributes('disabled')).toBeDefined()
    expect(service.apiKey().attributes('disabled')).toBeDefined()
    expect(service.connect().attributes('disabled')).toBeDefined()
    expect(service.testConnection().attributes('disabled')).toBeDefined()
    expect(service.requestRemoval().attributes('disabled')).toBeDefined()

    await service.fields().trigger('submit')

    expect(wrapper.emitted('connect')).toBeUndefined()
    expect(wrapper.emitted('testConnection')).toBeUndefined()
  })

  it('hides stale success feedback while testing', () => {
    createWrapper({
      ...configuredProps(),
      testing: true,
      success: 'Previously connected.',
    })

    expect(service.success().exists()).toBe(false)
  })

  it('does not test a configured service without a saved URL', async () => {
    createWrapper({ configured: true, url: '' })

    expect(service.testConnection().attributes('disabled')).toBeDefined()
    await service.testConnection().trigger('click')

    expect(wrapper.emitted('testConnection')).toBeUndefined()
  })

  // Optional user selection

  it('renders a configured user selector with supplied options', () => {
    createWrapper(userProps())

    const select = wrapper.getComponent(MmSelect)

    expect(service.userSelection().exists()).toBe(true)
    expect(wrapper.text()).toContain('Jellyfin User')
    expect(select.props('options')).toEqual(users)
    expect(select.props('modelValue')).toBe('user-2')
  })

  it('hides user selection when unconfigured', () => {
    createWrapper({ ...userProps(), configured: false })

    expect(service.userSelection().exists()).toBe(false)
  })

  it('hides user selection when no label is provided', () => {
    createWrapper(configuredProps())

    expect(service.userSelection().exists()).toBe(false)
  })

  it('hides user selection when editing a different URL', async () => {
    createWrapper(userProps())

    await service.url().setValue('https://other.example.com')

    expect(service.userSelection().exists()).toBe(false)
  })

  it('restores user selection when returning to the saved URL', async () => {
    createWrapper(userProps())

    await service.url().setValue('https://other.example.com')

    expect(service.userSelection().exists()).toBe(false)

    await service.url().setValue('https://jellyfin.example.com')

    expect(service.userSelection().exists()).toBe(true)
  })

  it('emits the selected user ID', () => {
    createWrapper(userProps())

    wrapper.getComponent(MmSelect).vm.$emit('update:modelValue', 'user-1')

    expect(wrapper.emitted('selectUser')?.[0]).toEqual(['user-1'])
  })

  it('disables user selection when no options are available', () => {
    createWrapper({ ...userProps(), userOptions: [] })

    expect(wrapper.getComponent(MmSelect).props('disabled')).toBe(true)
  })

  // Removal confirmation

  it('hides Remove server for unconfigured services', () => {
    createWrapper()

    expect(service.requestRemoval().exists()).toBe(false)
  })

  it('shows Remove server for configured services', () => {
    createWrapper({ configured: true })

    expect(service.requestRemoval().exists()).toBe(true)
  })

  it('requests confirmation before removal', async () => {
    createWrapper({ configured: true })

    await service.requestRemoval().trigger('click')

    expect(service.confirmationTitle().text()).toBe('Remove Jellyfin server?')
    expect(service.confirmRemoval().exists()).toBe(true)
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('renders the parent-supplied removal note', async () => {
    createWrapper({
      configured: true,
      removalNote: 'The selected library user will also be cleared.',
    })

    await service.requestRemoval().trigger('click')

    expect(service.confirmationDescription().text()).toContain(
      'The selected library user will also be cleared.',
    )
  })

  it('allows cancelling removal', async () => {
    createWrapper({ configured: true })

    await service.requestRemoval().trigger('click')
    await service.cancelRemoval().trigger('click')

    expect(service.confirmation().exists()).toBe(false)
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('emits remove only after confirmation', async () => {
    createWrapper({ name: 'Sonarr', configured: true })

    await service.requestRemoval().trigger('click')
    await service.confirmRemoval().trigger('click')

    expect(wrapper.emitted('remove')?.[0]).toEqual([])
  })

  it('prevents repeated confirmation while removing', async () => {
    createWrapper({ configured: true })

    await service.requestRemoval().trigger('click')
    await wrapper.setProps({ removing: true })
    await service.confirmRemoval().trigger('click')

    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('disables inputs while removing', () => {
    createWrapper({ configured: true, removing: true })

    expect(service.url().attributes('disabled')).toBeDefined()
    expect(service.apiKey().attributes('disabled')).toBeDefined()
  })

  it('resets confirmation when switching services', async () => {
    createWrapper(configuredProps())

    await service.requestRemoval().trigger('click')

    expect(service.confirmationTitle().text()).toBe('Remove Jellyfin server?')

    await wrapper.setProps({
      name: 'Sonarr',
      url: 'https://sonarr.example.com',
    })

    expect(service.confirmation().exists()).toBe(false)
    expect(service.requestRemoval().exists()).toBe(true)
  })

  it('closes confirmation when the service becomes unconfigured', async () => {
    createWrapper({ configured: true })

    await service.requestRemoval().trigger('click')
    await wrapper.setProps({ configured: false })

    expect(service.confirmRemoval().exists()).toBe(false)
    expect(service.requestRemoval().exists()).toBe(false)
  })

  // Optional user feedback

  it('shows accessible saving feedback', () => {
    createWrapper({ ...userProps(), userSaving: true })

    expect(service.userFeedback().text()).toBe('Saving user…')
  })

  it('shows success feedback after saving a user', () => {
    createWrapper({
      ...userProps(),
      userSuccess: 'Jellyfin user saved successfully.',
    })

    expect(service.userSuccess().text()).toBe('Jellyfin user saved successfully.')
  })

  it('does not show success while saving is in progress', () => {
    createWrapper({
      ...userProps(),
      userSaving: true,
      userSuccess: 'Jellyfin user saved successfully.',
    })

    expect(service.userFeedback().text()).toBe('Saving user…')
    expect(service.userSuccess().exists()).toBe(false)
  })

  it('hides user success when a save error exists', () => {
    createWrapper({
      ...userProps(),
      usersError: 'Unable to save user.',
      userSuccess: 'User saved.',
    })

    expect(service.userSuccess().exists()).toBe(false)
  })

  it('hides user feedback when editing a different URL', async () => {
    createWrapper({
      ...userProps(),
      userSuccess: 'User saved.',
    })

    expect(service.userSuccess().exists()).toBe(true)

    await service.url().setValue('https://other.example.com')

    expect(service.userSuccess().exists()).toBe(false)
  })
})
