import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmMediaPoster from './MmMediaPoster.vue'

describe('MmMediaPoster', () => {
  it('renders an image when provided', () => {
    const wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Movie',
        type: 'movie',
        image: 'https://example.com/poster.jpg',
      },
    })

    const image = wrapper.find('img')

    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe('https://example.com/poster.jpg')
    expect(image.attributes('alt')).toBe('Example Movie poster')
    expect(image.attributes('loading')).toBe('lazy')
    expect(wrapper.find('.media-poster__placeholder').exists()).toBe(false)
  })

  it('renders a movie placeholder when no image is provided', () => {
    const wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Movie',
        type: 'movie',
      },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.media-poster__placeholder').text()).toContain('🎬')
    expect(wrapper.find('.media-poster__placeholder').attributes('role')).toBe('img')
    expect(wrapper.find('.media-poster__placeholder').attributes('aria-label')).toBe(
      'No poster available for Example Movie',
    )
  })

  it('renders a TV placeholder', () => {
    const wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Series',
        type: 'tv',
      },
    })

    expect(wrapper.find('.media-poster__placeholder').text()).toContain('📺')
  })

  it('treats a null image as missing artwork', () => {
    const wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Movie',
        type: 'movie',
        image: null,
      },
    })

    expect(wrapper.find('.media-poster__placeholder').exists()).toBe(true)
  })

  it('uses default sizing unless specified otherwise', () => {
    const wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Movie',
        type: 'movie',
      },
    })

    expect(wrapper.classes()).not.toContain('media-poster--small')
  })

  it('supports smaller posters', () => {
    const wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Movie',
        type: 'movie',
        size: 'small',
      },
    })

    expect(wrapper.classes()).toContain('media-poster--small')
  })

  it('hides the decorative placeholder emoji from screen readers', () => {
    const wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Series',
        type: 'tv',
      },
    })

    expect(wrapper.find('.media-poster__placeholder span').attributes('aria-hidden')).toBe('true')
  })
})
