import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmMediaPoster from './MmMediaPoster.vue'
import { mmMediaPosterSelectors } from '../../../test/selectors/atoms/mmMediaPoster.selectors'

let wrapper: VueWrapper

const poster = mmMediaPosterSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.media-poster /, ''))
})

describe('MmMediaPoster', () => {
  it('renders an image when provided', () => {
    wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Movie',
        type: 'movie',
        image: 'https://example.com/poster.jpg',
      },
    })

    const image = poster.image()

    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe('https://example.com/poster.jpg')
    expect(image.attributes('alt')).toBe('Example Movie poster')
    expect(image.attributes('loading')).toBe('lazy')
    expect(poster.placeholder().exists()).toBe(false)
  })

  it('renders a movie placeholder when no image is provided', () => {
    wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Movie',
        type: 'movie',
      },
    })

    expect(poster.image().exists()).toBe(false)
    expect(poster.placeholder().text()).toContain('🎬')
    expect(poster.placeholder().attributes('role')).toBe('img')
    expect(poster.placeholder().attributes('aria-label')).toBe(
      'No poster available for Example Movie',
    )
  })

  it('renders a TV placeholder', () => {
    wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Series',
        type: 'tv',
      },
    })

    expect(poster.placeholder().text()).toContain('📺')
  })

  it('treats a null image as missing artwork', () => {
    wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Movie',
        type: 'movie',
        image: null,
      },
    })

    expect(poster.placeholder().exists()).toBe(true)
  })

  it('uses default sizing unless specified otherwise', () => {
    wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Movie',
        type: 'movie',
      },
    })

    expect(poster.size('default').exists()).toBe(true)
  })

  it('supports smaller posters', () => {
    wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Movie',
        type: 'movie',
        size: 'small',
      },
    })

    expect(poster.size('small').exists()).toBe(true)
  })

  it('hides the decorative placeholder emoji from screen readers', () => {
    wrapper = mount(MmMediaPoster, {
      props: {
        title: 'Example Series',
        type: 'tv',
      },
    })

    expect(poster.placeholderIcon().exists()).toBe(true)
    expect(poster.placeholderIcon().attributes('aria-hidden')).toBe('true')
  })
})
