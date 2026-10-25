import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmHeader from './MmHeader.vue'
import mmLogo from '../../../assets/mm-logo.svg'

describe('MmHeader', () => {
  it('renders a semantic header element', () => {
    const wrapper = mount(MmHeader)

    expect(wrapper.element.tagName).toBe('HEADER')
  })

  it('uses main mode by default', () => {
    const wrapper = mount(MmHeader)

    expect(wrapper.get('h1').text()).toBe('MediaManagarr')
  })

  it('renders the settings button in main mode', () => {
    const wrapper = mount(MmHeader)

    const button = wrapper.get('button')

    expect(button.attributes('aria-label')).toBe('Open settings')
    expect(button.classes()).toContain('button--icon-only')
    expect(button.classes()).toContain('button--secondary')
    expect(button.find('svg').exists()).toBe(true)
  })

  it('renders the settings title in settings mode', () => {
    const wrapper = mount(MmHeader, {
      props: {
        mode: 'settings',
      },
    })

    expect(wrapper.get('h1').text()).toBe('Settings')
  })

  it('renders the back button in settings mode', () => {
    const wrapper = mount(MmHeader, {
      props: {
        mode: 'settings',
      },
    })

    const button = wrapper.get('button')

    expect(button.attributes('aria-label')).toBe('Back to previous view')
    expect(button.classes()).toContain('button--icon-only')
    expect(button.classes()).toContain('button--secondary')
    expect(button.find('svg').exists()).toBe(true)
  })

  it('renders exactly one action button in both modes', () => {
    const main = mount(MmHeader)
    const settings = mount(MmHeader, {
      props: {
        mode: 'settings',
      },
    })

    expect(main.findAll('button')).toHaveLength(1)
    expect(settings.findAll('button')).toHaveLength(1)
  })

  it.each(['main', 'settings'] as const)(
    'renders branding before the action button in %s mode',
    (mode) => {
      const wrapper = mount(MmHeader, {
        props: { mode },
      })

      const header = wrapper.element as HTMLElement
      const children = Array.from(header.children)

      expect(children).toHaveLength(2)
      expect(children[0]?.classList.contains('header__branding')).toBe(true)
      expect(children[1]?.tagName).toBe('BUTTON')
    },
  )

  it('renders the MM logo in main mode', () => {
    const wrapper = mount(MmHeader)

    const logo = wrapper.get('.header__logo')

    expect(logo.element.tagName).toBe('IMG')
    expect(logo.attributes('src')).toBe(mmLogo)
    expect(logo.attributes('width')).toBe('28')
    expect(logo.attributes('height')).toBe('28')
  })

  it('renders the MM logo in settings mode', () => {
    const wrapper = mount(MmHeader, {
      props: {
        mode: 'settings',
      },
    })

    expect(wrapper.find('.header__logo').exists()).toBe(true)
  })

  it('treats the MM logo as decorative', () => {
    const wrapper = mount(MmHeader)

    const logo = wrapper.get('.header__logo')

    expect(logo.attributes('alt')).toBe('')
  })

  it('renders the logo before the title', () => {
    const wrapper = mount(MmHeader)

    const branding = wrapper.get('.header__branding')
    const children = Array.from((branding.element as HTMLElement).children)

    expect(children).toHaveLength(2)
    expect(children[0]?.tagName).toBe('IMG')
    expect(children[1]?.tagName).toBe('H1')
  })

  it('keeps the logo when switching between modes', async () => {
    const wrapper = mount(MmHeader)

    expect(wrapper.findAll('.header__logo')).toHaveLength(1)

    await wrapper.setProps({
      mode: 'settings',
    })

    expect(wrapper.findAll('.header__logo')).toHaveLength(1)
    expect(wrapper.get('h1').text()).toBe('Settings')

    await wrapper.setProps({
      mode: 'main',
    })

    expect(wrapper.findAll('.header__logo')).toHaveLength(1)
    expect(wrapper.get('h1').text()).toBe('MediaManagarr')
  })

  it('hides decorative button icons from assistive technology', () => {
    const wrapper = mount(MmHeader)

    const svg = wrapper.get('button svg')

    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('focusable')).toBe('false')
  })

  it('emits settings when the settings button is clicked', async () => {
    const wrapper = mount(MmHeader)

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('settings')).toHaveLength(1)
    expect(wrapper.emitted('back')).toBeUndefined()
  })

  it('emits back when the back button is clicked', async () => {
    const wrapper = mount(MmHeader, {
      props: {
        mode: 'settings',
      },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('back')).toHaveLength(1)
    expect(wrapper.emitted('settings')).toBeUndefined()
  })

  it('updates the title and button when switching to settings mode', async () => {
    const wrapper = mount(MmHeader)

    expect(wrapper.get('h1').text()).toBe('MediaManagarr')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Open settings')

    await wrapper.setProps({
      mode: 'settings',
    })

    expect(wrapper.get('h1').text()).toBe('Settings')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Back to previous view')
  })

  it('updates the title and button when returning to main mode', async () => {
    const wrapper = mount(MmHeader, {
      props: {
        mode: 'settings',
      },
    })

    await wrapper.setProps({
      mode: 'main',
    })

    expect(wrapper.get('h1').text()).toBe('MediaManagarr')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Open settings')
  })

  it('emits the correct event after switching modes', async () => {
    const wrapper = mount(MmHeader)

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('settings')).toHaveLength(1)

    await wrapper.setProps({
      mode: 'settings',
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('back')).toHaveLength(1)
    expect(wrapper.emitted('settings')).toHaveLength(1)
  })

  it('renders different button icons for main and settings modes', async () => {
    const wrapper = mount(MmHeader)

    const settingsIcon = wrapper.get('button svg').html()

    await wrapper.setProps({
      mode: 'settings',
    })

    const backIcon = wrapper.get('button svg').html()

    expect(backIcon).not.toBe(settingsIcon)
  })
})
