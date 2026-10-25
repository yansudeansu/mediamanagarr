import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsView from './SettingsView.vue'
import MmServiceSelector from '../components/organisms/MmServiceSelector/MmServiceSelector.vue'
import MmServiceForm from '../components/organisms/MmServiceForm/MmServiceForm.vue'

describe('SettingsView', () => {
  it('renders the service selector and configuration form', () => {
    const wrapper = mount(SettingsView)

    expect(wrapper.findComponent(MmServiceSelector).exists()).toBe(true)
    expect(wrapper.findComponent(MmServiceForm).exists()).toBe(true)
  })

  it('selects Jellyfin by default', () => {
    const wrapper = mount(SettingsView)

    expect(wrapper.getComponent(MmServiceForm).props('serviceId')).toBe('jellyfin')
  })

  it('updates the form when another service is selected', async () => {
    const wrapper = mount(SettingsView)

    const selector = wrapper.getComponent(MmServiceSelector)

    selector.vm.$emit('update:modelValue', 'sonarr')
    await wrapper.vm.$nextTick()

    expect(wrapper.getComponent(MmServiceForm).props('serviceId')).toBe('sonarr')
  })

  it('passes the selected service URL to the form', async () => {
    const wrapper = mount(SettingsView, {
      props: {
        urls: {
          jellyfin: 'https://jellyfin.example.com',
          sonarr: 'https://sonarr.example.com',
        },
      },
    })

    expect(wrapper.getComponent(MmServiceForm).props('url')).toBe('https://jellyfin.example.com')

    wrapper.getComponent(MmServiceSelector).vm.$emit('update:modelValue', 'sonarr')
    await wrapper.vm.$nextTick()

    expect(wrapper.getComponent(MmServiceForm).props('url')).toBe('https://sonarr.example.com')
  })

  it('marks a configured service correctly', () => {
    const wrapper = mount(SettingsView, {
      props: {
        statuses: {
          jellyfin: 'configured',
        },
      },
    })

    expect(wrapper.getComponent(MmServiceForm).props('configured')).toBe(true)
  })

  it('forwards connection requests to the parent', async () => {
    const wrapper = mount(SettingsView)

    const payload = {
      serviceId: 'jellyfin' as const,
      url: 'https://jellyfin.example.com',
      apiKey: 'secret',
    }

    wrapper.getComponent(MmServiceForm).vm.$emit('connect', payload)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('connect')?.[0]).toEqual([payload])
  })
})
