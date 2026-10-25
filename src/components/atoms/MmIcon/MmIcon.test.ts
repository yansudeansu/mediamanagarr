import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmIcon from './MmIcon.vue'

describe('MmIcon', () => {
  it('renders an SVG', () => {
    const wrapper = mount(MmIcon, {
      props: {
        name: 'settings',
      },
    })

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('uses the default size', () => {
    const wrapper = mount(MmIcon, {
      props: {
        name: 'settings',
      },
    })

    const svg = wrapper.get('svg')

    expect(svg.attributes('width')).toBe('18')
    expect(svg.attributes('height')).toBe('18')
  })

  it('supports custom sizes', () => {
    const wrapper = mount(MmIcon, {
      props: {
        name: 'refresh',
        size: 24,
      },
    })

    const svg = wrapper.get('svg')

    expect(svg.attributes('width')).toBe('24')
    expect(svg.attributes('height')).toBe('24')
  })

  it('hides decorative icons from assistive technology', () => {
    const wrapper = mount(MmIcon, {
      props: {
        name: 'settings',
      },
    })

    const svg = wrapper.get('svg')

    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('focusable')).toBe('false')
  })

  it('uses currentColor for its stroke', () => {
    const wrapper = mount(MmIcon, {
      props: {
        name: 'arrow-left',
      },
    })

    expect(wrapper.get('svg').attributes('stroke')).toBe('currentColor')
  })

  it('uses a consistent stroke width', () => {
    const wrapper = mount(MmIcon, {
      props: {
        name: 'settings',
      },
    })

    expect(wrapper.get('svg').attributes('stroke-width')).toBe('2')
  })

  it('renders different SVG paths for different icons', () => {
    const settings = mount(MmIcon, {
      props: {
        name: 'settings',
      },
    })

    const refresh = mount(MmIcon, {
      props: {
        name: 'refresh',
      },
    })

    expect(settings.get('svg').html()).not.toBe(refresh.get('svg').html())
  })

  it('renders the right-arrow icon', () => {
    const wrapper = mount(MmIcon, {
      props: {
        name: 'arrow-right',
      },
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.get('svg').attributes('stroke')).toBe('currentColor')
  })

  it('renders different paths for left and right arrows', () => {
    const left = mount(MmIcon, {
      props: {
        name: 'arrow-left',
      },
    })

    const right = mount(MmIcon, {
      props: {
        name: 'arrow-right',
      },
    })

    expect(left.get('svg').html()).not.toBe(right.get('svg').html())
  })

  it('updates the icon when its name changes', async () => {
    const wrapper = mount(MmIcon, {
      props: {
        name: 'settings',
      },
    })

    const initialMarkup = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'arrow-left',
    })

    expect(wrapper.get('svg').html()).not.toBe(initialMarkup)
  })

  it('updates from left arrow to right arrow', async () => {
    const wrapper = mount(MmIcon, {
      props: {
        name: 'arrow-left',
      },
    })

    const initialMarkup = wrapper.get('svg').html()

    await wrapper.setProps({
      name: 'arrow-right',
    })

    expect(wrapper.get('svg').html()).not.toBe(initialMarkup)
  })

  it('updates the SVG dimensions when size changes', async () => {
    const wrapper = mount(MmIcon, {
      props: {
        name: 'settings',
        size: 18,
      },
    })

    await wrapper.setProps({
      size: 32,
    })

    expect(wrapper.get('svg').attributes('width')).toBe('32')
    expect(wrapper.get('svg').attributes('height')).toBe('32')
  })
})
