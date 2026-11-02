import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmCard from './MmCard.vue'
import { mmCardSelectors } from '../../../test/selectors/atoms/mmCard.selectors'

let wrapper: VueWrapper

const card = mmCardSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector)
})

describe('MmCard', () => {
  it('renders its default slot', () => {
    wrapper = mount(MmCard, {
      slots: {
        default: '<p>Example content</p>',
      },
    })

    expect(card.content().text()).toBe('Example content')
  })

  it('renders as a semantic article', () => {
    wrapper = mount(MmCard)

    expect(card.get().element.tagName).toBe('ARTICLE')
  })

  it('uses default styling', () => {
    wrapper = mount(MmCard)

    expect(card.variant('default').exists()).toBe(true)
    expect(card.padding('md').exists()).toBe(true)
  })

  it('supports the outlined variant', () => {
    wrapper = mount(MmCard, {
      props: {
        variant: 'outlined',
      },
    })

    expect(card.variant('outlined').exists()).toBe(true)
  })

  it.each(['none', 'sm', 'md'] as const)('supports %s padding', (padding) => {
    wrapper = mount(MmCard, {
      props: { padding },
    })

    expect(card.padding(padding).exists()).toBe(true)
  })

  it('renders the header slot when provided', () => {
    wrapper = mount(MmCard, {
      slots: {
        header: '<h3>Card title</h3>',
        default: '<p>Card body</p>',
      },
    })

    expect(card.header().text()).toBe('Card title')
    expect(card.content().text()).toBe('Card body')
  })

  it('renders the footer slot when provided', () => {
    wrapper = mount(MmCard, {
      slots: {
        default: '<p>Card body</p>',
        footer: '<span>Card footer</span>',
      },
    })

    expect(card.footer().text()).toBe('Card footer')
  })

  it('does not render unused header or footer elements', () => {
    wrapper = mount(MmCard, {
      slots: {
        default: '<p>Only content</p>',
      },
    })

    expect(card.header().exists()).toBe(false)
    expect(card.footer().exists()).toBe(false)
  })

  it('supports all three slots together', () => {
    wrapper = mount(MmCard, {
      slots: {
        header: '<h3>Title</h3>',
        default: '<p>Description</p>',
        footer: '<button>View details</button>',
      },
    })

    expect(card.header().find('h3').text()).toBe('Title')
    expect(card.content().find('p').text()).toBe('Description')
    expect(card.footer().find('button').text()).toBe('View details')
  })

  it('does not create an interactive control by default', () => {
    wrapper = mount(MmCard, {
      slots: {
        default: 'Static content',
      },
    })

    expect(card.get().find('button').exists()).toBe(false)
    expect(card.get().find('a').exists()).toBe(false)
    expect(card.get().attributes('tabindex')).toBeUndefined()
  })

  it('updates when its variant changes', async () => {
    wrapper = mount(MmCard, {
      props: {
        variant: 'default',
      },
    })

    await wrapper.setProps({
      variant: 'outlined',
    })

    expect(card.variant('outlined').exists()).toBe(true)
    expect(card.variant('default').exists()).toBe(false)
  })

  it('updates when its padding changes', async () => {
    wrapper = mount(MmCard, {
      props: {
        padding: 'md',
      },
    })

    await wrapper.setProps({
      padding: 'none',
    })

    expect(card.padding('none').exists()).toBe(true)
    expect(card.padding('md').exists()).toBe(false)
  })
})
