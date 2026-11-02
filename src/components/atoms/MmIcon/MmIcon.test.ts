import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmIcon from './MmIcon.vue'
import type { IconName } from './MmIcon.vue'
import { mmIconSelectors } from '../../../test/selectors/atoms/mmIcon.selectors'

let wrapper: VueWrapper

const icon = mmIconSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replaceAll('svg.lucide ', ''))
})

function mountIcon(name: IconName, size?: number) {
  wrapper = mount(MmIcon, {
    props: {
      name,
      ...(size === undefined ? {} : { size }),
    },
  })

  return wrapper
}

const icons: IconName[] = [
  'settings',
  'menu',
  'external-link',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'arrow-down',
  'chevron-left',
  'chevron-right',
  'refresh',
  'detach',
  'attach',
  'sidebar',
  'sidebar-close',
]

describe('MmIcon', () => {
  it('renders an SVG', () => {
    mountIcon('settings')

    expect(icon.get().exists()).toBe(true)
  })

  it('uses 18px as the default size', () => {
    mountIcon('settings')

    expect(icon.size(18).exists()).toBe(true)
  })

  it('supports a custom size', () => {
    mountIcon('settings', 24)

    expect(icon.size(24).exists()).toBe(true)
  })

  it('hides decorative icons from assistive technology', () => {
    mountIcon('settings')

    expect(icon.decorative().exists()).toBe(true)
  })

  it('uses the current text color', () => {
    mountIcon('settings')

    expect(icon.stroke().exists()).toBe(true)
  })

  it('uses a consistent stroke width', () => {
    mountIcon('settings')

    expect(icon.strokeWidth(2).exists()).toBe(true)
  })

  it('renders different shapes for settings and refresh', () => {
    const settingsMarkup = icon.get().html()
    const refresh = mountIcon('refresh')

    expect(settingsMarkup).not.toBe(refresh.get('svg').html())
  })

  it('renders different shapes for menu and settings', () => {
    const menuMarkup = icon.get().html()
    const settings = mountIcon('settings')

    expect(menuMarkup).not.toBe(settings.get('svg').html())
  })

  it('renders different shapes for menu and external-link', () => {
    const menuMarkup = icon.get().html()
    const externalLink = mountIcon('external-link')

    expect(menuMarkup).not.toBe(externalLink.get('svg').html())
  })

  it('renders different shapes for left and right arrows', () => {
    const leftMarkup = icon.get().html()
    const right = mountIcon('arrow-right')

    expect(leftMarkup).not.toBe(right.get('svg').html())
  })

  it('renders different shapes for up and down arrows', () => {
    const upMarkup = icon.get().html()
    const down = mountIcon('arrow-down')

    expect(upMarkup).not.toBe(down.get('svg').html())
  })

  it('renders different shapes for left and right chevrons', () => {
    const leftMarkup = icon.get().html()
    const right = mountIcon('chevron-right')

    expect(leftMarkup).not.toBe(right.get('svg').html())
  })

  it('renders different shapes for detach and attach', () => {
    const detachMarkup = icon.get().html()
    const attach = mountIcon('attach')

    expect(detachMarkup).not.toBe(attach.get('svg').html())
  })

  it('renders different shapes for detach and sidebar', () => {
    const detachMarkup = icon.get().html()
    const sidebar = mountIcon('sidebar')

    expect(detachMarkup).not.toBe(sidebar.get('svg').html())
  })

  it('renders different shapes for opening and closing the sidebar', () => {
    const openMarkup = icon.get().html()
    const close = mountIcon('sidebar-close')

    expect(openMarkup).not.toBe(close.get('svg').html())
  })

  it.each(icons)('renders the %s icon', (name) => {
    mountIcon(name)

    expect(icon.get().exists()).toBe(true)
    expect(icon.shapes().exists()).toBe(true)
  })

  it.each(icons)('keeps the %s icon decorative', (name) => {
    mountIcon(name)

    expect(icon.decorative().exists()).toBe(true)
  })

  it('updates when the icon name changes', async () => {
    mountIcon('settings')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'arrow-left' })

    expect(icon.get().html()).not.toBe(originalSvg)
  })

  it('updates when switching from settings to menu', async () => {
    mountIcon('settings')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'menu' })

    expect(icon.get().html()).not.toBe(originalSvg)
    expect(icon.get().exists()).toBe(true)
  })

  it('updates when switching from menu to external-link', async () => {
    mountIcon('menu')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'external-link' })

    expect(icon.get().html()).not.toBe(originalSvg)
    expect(icon.get().exists()).toBe(true)
  })

  it('updates when switching between horizontal arrows', async () => {
    mountIcon('arrow-left')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'arrow-right' })

    expect(icon.get().html()).not.toBe(originalSvg)
  })

  it('updates when switching between vertical arrows', async () => {
    mountIcon('arrow-up')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'arrow-down' })

    expect(icon.get().html()).not.toBe(originalSvg)
  })

  it('updates when switching between chevrons', async () => {
    mountIcon('chevron-left')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'chevron-right' })

    expect(icon.get().html()).not.toBe(originalSvg)
  })

  it('updates when switching from detach to attach', async () => {
    mountIcon('detach')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'attach' })

    expect(icon.get().html()).not.toBe(originalSvg)
    expect(icon.get().exists()).toBe(true)
  })

  it('updates when switching from attach to detach', async () => {
    mountIcon('attach')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'detach' })

    expect(icon.get().html()).not.toBe(originalSvg)
    expect(icon.get().exists()).toBe(true)
  })

  it('updates when switching from detach to sidebar', async () => {
    mountIcon('detach')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'sidebar' })

    expect(icon.get().html()).not.toBe(originalSvg)
    expect(icon.get().exists()).toBe(true)
  })

  it('updates when switching from sidebar to detach', async () => {
    mountIcon('sidebar')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'detach' })

    expect(icon.get().html()).not.toBe(originalSvg)
    expect(icon.get().exists()).toBe(true)
  })

  it('updates when switching from sidebar to sidebar-close', async () => {
    mountIcon('sidebar')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'sidebar-close' })

    expect(icon.get().html()).not.toBe(originalSvg)
    expect(icon.get().exists()).toBe(true)
  })

  it('updates when switching from sidebar-close to sidebar', async () => {
    mountIcon('sidebar-close')
    const originalSvg = icon.get().html()

    await wrapper.setProps({ name: 'sidebar' })

    expect(icon.get().html()).not.toBe(originalSvg)
    expect(icon.get().exists()).toBe(true)
  })

  it('updates when the size changes', async () => {
    mountIcon('settings')

    await wrapper.setProps({ size: 32 })

    expect(icon.size(32).exists()).toBe(true)
  })
})
