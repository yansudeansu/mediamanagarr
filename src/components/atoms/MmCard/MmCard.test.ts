import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmCard from './MmCard.vue'

describe('MmCard', () => {
  it('renders its default slot', () => {
    const wrapper = mount(MmCard, {
      slots: {
        default: '<p>Example content</p>',
      },
    })

    expect(wrapper.get('.mm-card__content').text()).toBe('Example content')
  })

  it('renders as a semantic article', () => {
    const wrapper = mount(MmCard)

    expect(wrapper.element.tagName).toBe('ARTICLE')
  })

  it('uses default styling', () => {
    const wrapper = mount(MmCard)

    expect(wrapper.classes()).toContain('mm-card--default')
    expect(wrapper.classes()).toContain('mm-card--padding-md')
  })

  it('supports the outlined variant', () => {
    const wrapper = mount(MmCard, {
      props: {
        variant: 'outlined',
      },
    })

    expect(wrapper.classes()).toContain('mm-card--outlined')
  })

  it.each(['none', 'sm', 'md'] as const)('supports %s padding', (padding) => {
    const wrapper = mount(MmCard, {
      props: { padding },
    })

    expect(wrapper.classes()).toContain(`mm-card--padding-${padding}`)
  })

  it('renders the header slot when provided', () => {
    const wrapper = mount(MmCard, {
      slots: {
        header: '<h3>Card title</h3>',
        default: '<p>Card body</p>',
      },
    })

    expect(wrapper.get('.mm-card__header').text()).toBe('Card title')
    expect(wrapper.get('.mm-card__content').text()).toBe('Card body')
  })

  it('renders the footer slot when provided', () => {
    const wrapper = mount(MmCard, {
      slots: {
        default: '<p>Card body</p>',
        footer: '<span>Card footer</span>',
      },
    })

    expect(wrapper.get('.mm-card__footer').text()).toBe('Card footer')
  })

  it('does not render unused header or footer elements', () => {
    const wrapper = mount(MmCard, {
      slots: {
        default: '<p>Only content</p>',
      },
    })

    expect(wrapper.find('.mm-card__header').exists()).toBe(false)
    expect(wrapper.find('.mm-card__footer').exists()).toBe(false)
  })

  it('supports all three slots together', () => {
    const wrapper = mount(MmCard, {
      slots: {
        header: '<h3>Title</h3>',
        default: '<p>Description</p>',
        footer: '<button>View details</button>',
      },
    })

    expect(wrapper.get('.mm-card__header h3').text()).toBe('Title')
    expect(wrapper.get('.mm-card__content p').text()).toBe('Description')
    expect(wrapper.get('.mm-card__footer button').text()).toBe('View details')
  })

  it('does not create an interactive control by default', () => {
    const wrapper = mount(MmCard, {
      slots: {
        default: 'Static content',
      },
    })

    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.attributes('tabindex')).toBeUndefined()
  })

  it('updates when its variant changes', async () => {
    const wrapper = mount(MmCard, {
      props: {
        variant: 'default',
      },
    })

    await wrapper.setProps({
      variant: 'outlined',
    })

    expect(wrapper.classes()).toContain('mm-card--outlined')
    expect(wrapper.classes()).not.toContain('mm-card--default')
  })

  it('updates when its padding changes', async () => {
    const wrapper = mount(MmCard, {
      props: {
        padding: 'md',
      },
    })

    await wrapper.setProps({
      padding: 'none',
    })

    expect(wrapper.classes()).toContain('mm-card--padding-none')
    expect(wrapper.classes()).not.toContain('mm-card--padding-md')
  })
})
