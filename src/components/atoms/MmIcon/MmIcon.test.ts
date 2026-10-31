import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmIcon from './MmIcon.vue'
import type { IconName } from './MmIcon.vue'

function mountIcon(name: IconName, size?: number) {
  return mount(MmIcon, {
    props: {
      name,
      ...(size === undefined ? {} : { size }),
    },
  })
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
    const wrapper = mountIcon('settings')

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('uses 18px as the default size', () => {
    const wrapper = mountIcon('settings')
    const svg = wrapper.get('svg')

    expect(svg.attributes('width')).toBe('18')
    expect(svg.attributes('height')).toBe('18')
  })

  it('supports a custom size', () => {
    const wrapper = mountIcon('settings', 24)
    const svg = wrapper.get('svg')

    expect(svg.attributes('width')).toBe('24')
    expect(svg.attributes('height')).toBe('24')
  })

  it('hides decorative icons from assistive technology', () => {
    const wrapper = mountIcon('settings')
    const svg = wrapper.get('svg')

    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('focusable')).toBe('false')
  })

  it('uses the current text color', () => {
    const wrapper = mountIcon('settings')

    expect(wrapper.get('svg').attributes('stroke')).toBe('currentColor')
  })

  it('uses a consistent stroke width', () => {
    const wrapper = mountIcon('settings')

    expect(wrapper.get('svg').attributes('stroke-width')).toBe('2')
  })

  it('renders different shapes for settings and refresh', () => {
    const settings = mountIcon('settings')
    const refresh = mountIcon('refresh')

    expect(settings.get('svg').html()).not.toBe(refresh.get('svg').html())
  })

  it('renders different shapes for menu and settings', () => {
    const menu = mountIcon('menu')
    const settings = mountIcon('settings')

    expect(menu.get('svg').html()).not.toBe(settings.get('svg').html())
  })

  it('renders different shapes for menu and external-link', () => {
    const menu = mountIcon('menu')
    const externalLink = mountIcon('external-link')

    expect(menu.get('svg').html()).not.toBe(externalLink.get('svg').html())
  })

  it('renders different shapes for left and right arrows', () => {
    const left = mountIcon('arrow-left')
    const right = mountIcon('arrow-right')

    expect(left.get('svg').html()).not.toBe(right.get('svg').html())
  })

  it('renders different shapes for up and down arrows', () => {
    const up = mountIcon('arrow-up')
    const down = mountIcon('arrow-down')

    expect(up.get('svg').html()).not.toBe(down.get('svg').html())
  })

  it('renders different shapes for left and right chevrons', () => {
    const left = mountIcon('chevron-left')
    const right = mountIcon('chevron-right')

    expect(left.get('svg').html()).not.toBe(right.get('svg').html())
  })

  it('renders different shapes for detach and attach', () => {
    const detach = mountIcon('detach')
    const attach = mountIcon('attach')

    expect(detach.get('svg').html()).not.toBe(attach.get('svg').html())
  })

  it('renders different shapes for detach and sidebar', () => {
    const detach = mountIcon('detach')
    const sidebar = mountIcon('sidebar')

    expect(detach.get('svg').html()).not.toBe(sidebar.get('svg').html())
  })

  it('renders different shapes for opening and closing the sidebar', () => {
    const open = mountIcon('sidebar')
    const close = mountIcon('sidebar-close')

    expect(open.get('svg').html()).not.toBe(close.get('svg').html())
  })

  it.each(icons)('renders the %s icon', (name) => {
    const wrapper = mountIcon(name)

    expect(wrapper.findAll('svg')).toHaveLength(1)
    expect(wrapper.get('svg').find('path, line, polyline, rect, circle').exists()).toBe(true)
  })

  it.each(icons)('keeps the %s icon decorative', (name) => {
    const wrapper = mountIcon(name)
    const svg = wrapper.get('svg')

    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('focusable')).toBe('false')
  })

  it('updates when the icon name changes', async () => {
    const wrapper = mountIcon('settings')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'arrow-left',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
  })

  it('updates when switching from settings to menu', async () => {
    const wrapper = mountIcon('settings')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'menu',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
    expect(wrapper.findAll('svg')).toHaveLength(1)
  })

  it('updates when switching from menu to external-link', async () => {
    const wrapper = mountIcon('menu')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'external-link',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
    expect(wrapper.findAll('svg')).toHaveLength(1)
  })

  it('updates when switching between horizontal arrows', async () => {
    const wrapper = mountIcon('arrow-left')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'arrow-right',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
  })

  it('updates when switching between vertical arrows', async () => {
    const wrapper = mountIcon('arrow-up')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'arrow-down',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
  })

  it('updates when switching between chevrons', async () => {
    const wrapper = mountIcon('chevron-left')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'chevron-right',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
  })

  it('updates when switching from detach to attach', async () => {
    const wrapper = mountIcon('detach')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'attach',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
    expect(wrapper.findAll('svg')).toHaveLength(1)
  })

  it('updates when switching from attach to detach', async () => {
    const wrapper = mountIcon('attach')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'detach',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
    expect(wrapper.findAll('svg')).toHaveLength(1)
  })

  it('updates when switching from detach to sidebar', async () => {
    const wrapper = mountIcon('detach')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'sidebar',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
    expect(wrapper.findAll('svg')).toHaveLength(1)
  })

  it('updates when switching from sidebar to detach', async () => {
    const wrapper = mountIcon('sidebar')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'detach',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
    expect(wrapper.findAll('svg')).toHaveLength(1)
  })

  it('updates when switching from sidebar to sidebar-close', async () => {
    const wrapper = mountIcon('sidebar')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'sidebar-close',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
    expect(wrapper.findAll('svg')).toHaveLength(1)
  })

  it('updates when switching from sidebar-close to sidebar', async () => {
    const wrapper = mountIcon('sidebar-close')
    const originalSvg = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'sidebar',
    })

    expect(wrapper.get('svg').html()).not.toBe(originalSvg)
    expect(wrapper.findAll('svg')).toHaveLength(1)
  })

  it('updates when the size changes', async () => {
    const wrapper = mountIcon('settings')

    await wrapper.setProps({
      size: 32,
    })

    const svg = wrapper.get('svg')

    expect(svg.attributes('width')).toBe('32')
    expect(svg.attributes('height')).toBe('32')
  })
})
