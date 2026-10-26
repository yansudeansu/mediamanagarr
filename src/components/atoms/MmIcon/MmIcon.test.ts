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

describe('MmIcon', () => {
  it('renders an SVG', () => {
    const wrapper = mountIcon('settings')

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('uses the default size', () => {
    const wrapper = mountIcon('settings')

    const svg = wrapper.get('svg')

    expect(svg.attributes('width')).toBe('18')
    expect(svg.attributes('height')).toBe('18')
  })

  it('supports custom sizes', () => {
    const wrapper = mountIcon('refresh', 24)

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

  it('uses currentColor for its stroke', () => {
    const wrapper = mountIcon('arrow-left')

    expect(wrapper.get('svg').attributes('stroke')).toBe('currentColor')
  })

  it('uses a consistent stroke width', () => {
    const wrapper = mountIcon('settings')

    expect(wrapper.get('svg').attributes('stroke-width')).toBe('2')
  })

  it('renders different SVG paths for different icons', () => {
    const settings = mountIcon('settings')
    const refresh = mountIcon('refresh')

    expect(settings.get('svg').html()).not.toBe(refresh.get('svg').html())
  })

  it('renders the right-arrow icon', () => {
    const wrapper = mountIcon('arrow-right')

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.get('svg').attributes('stroke')).toBe('currentColor')
  })

  it('renders different paths for left and right arrows', () => {
    const left = mountIcon('arrow-left')
    const right = mountIcon('arrow-right')

    expect(left.get('svg').html()).not.toBe(right.get('svg').html())
  })

  it('renders the left chevron', () => {
    const wrapper = mountIcon('chevron-left')

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
  })

  it('renders the right chevron', () => {
    const wrapper = mountIcon('chevron-right')

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
  })

  it('renders different paths for left and right chevrons', () => {
    const left = mountIcon('chevron-left')
    const right = mountIcon('chevron-right')

    expect(left.get('svg').html()).not.toBe(right.get('svg').html())
  })

  it('uses different paths for arrows and chevrons', () => {
    const arrow = mountIcon('arrow-left')
    const chevron = mountIcon('chevron-left')

    expect(arrow.get('svg').html()).not.toBe(chevron.get('svg').html())
  })

  it('renders every supported icon', () => {
    const names: IconName[] = [
      'settings',
      'arrow-left',
      'arrow-right',
      'chevron-left',
      'chevron-right',
      'refresh',
    ]

    for (const name of names) {
      const wrapper = mountIcon(name)

      expect(wrapper.find('svg').exists()).toBe(true)
    }
  })

  it('updates the icon when its name changes', async () => {
    const wrapper = mountIcon('settings')

    const initialMarkup = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'arrow-left',
    })

    expect(wrapper.get('svg').html()).not.toBe(initialMarkup)
  })

  it('updates from left arrow to right arrow', async () => {
    const wrapper = mountIcon('arrow-left')

    const initialMarkup = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'arrow-right',
    })

    expect(wrapper.get('svg').html()).not.toBe(initialMarkup)
  })

  it('updates from left chevron to right chevron', async () => {
    const wrapper = mountIcon('chevron-left')

    const initialMarkup = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'chevron-right',
    })

    expect(wrapper.get('svg').html()).not.toBe(initialMarkup)
  })

  it('updates the SVG dimensions when size changes', async () => {
    const wrapper = mountIcon('settings', 18)

    await wrapper.setProps({
      size: 32,
    })

    expect(wrapper.get('svg').attributes('width')).toBe('32')
    expect(wrapper.get('svg').attributes('height')).toBe('32')
  })
})
