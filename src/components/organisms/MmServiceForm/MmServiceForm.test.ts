import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmServiceForm from './MmServiceForm.vue'
import MmInput from '../../atoms/MmInput/MmInput.vue'
import type { ServiceId } from '../../../types/service'

describe('MmServiceForm', () => {
  function createWrapper(
    props: {
      serviceId?: ServiceId
      url?: string
      configured?: boolean
      loading?: boolean
      error?: string
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
})
