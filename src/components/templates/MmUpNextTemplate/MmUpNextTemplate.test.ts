import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmUpNextTemplate from './MmUpNextTemplate.vue'

describe('MmUpNextTemplate', () => {
  it('renders the Up Next heading', () => {
    const wrapper = mount(MmUpNextTemplate)

    expect(wrapper.get('#up-next-title').text()).toBe('Up Next')
  })

  it('renders the default description', () => {
    const wrapper = mount(MmUpNextTemplate)

    expect(wrapper.get('.up-next-template__description').text()).toBe(
      'Recently added, unwatched media from Jellyfin.',
    )
  })

  it('renders a custom description', () => {
    const wrapper = mount(MmUpNextTemplate, {
      slots: {
        description: '3 new · 42 unwatched items',
      },
    })

    expect(wrapper.get('.up-next-template__description').text()).toBe('3 new · 42 unwatched items')

    expect(wrapper.text()).not.toContain('Recently added, unwatched media from Jellyfin.')
  })

  it('renders default slot content', () => {
    const wrapper = mount(MmUpNextTemplate, {
      slots: {
        default: '<article>Example arrival</article>',
      },
    })

    expect(wrapper.get('.up-next-template__content article').text()).toBe('Example arrival')
  })

  it('renders filters when provided', () => {
    const wrapper = mount(MmUpNextTemplate, {
      slots: {
        filters: '<button>New</button>',
      },
    })

    expect(wrapper.get('.up-next-template__filters button').text()).toBe('New')
  })

  it('renders pagination when provided', () => {
    const wrapper = mount(MmUpNextTemplate, {
      slots: {
        pagination: '<button>Next</button>',
      },
    })

    expect(wrapper.get('.up-next-template__pagination button').text()).toBe('Next')
  })

  it('renders actions when provided', () => {
    const wrapper = mount(MmUpNextTemplate, {
      slots: {
        actions: '<button>Refresh</button>',
      },
    })

    expect(wrapper.get('.up-next-template__actions button').text()).toBe('Refresh')
  })

  it('supports multiple action buttons', () => {
    const wrapper = mount(MmUpNextTemplate, {
      slots: {
        actions: `
          <button>Clear notifications</button>
          <button>Refresh</button>
        `,
      },
    })

    const buttons = wrapper.findAll('.up-next-template__actions button')

    expect(buttons).toHaveLength(2)
    expect(buttons[0]?.text()).toBe('Clear notifications')
    expect(buttons[1]?.text()).toBe('Refresh')
  })

  it('does not render unused optional sections', () => {
    const wrapper = mount(MmUpNextTemplate)

    expect(wrapper.find('.up-next-template__filters').exists()).toBe(false)
    expect(wrapper.find('.up-next-template__pagination').exists()).toBe(false)
    expect(wrapper.find('.up-next-template__actions').exists()).toBe(false)
  })

  it('provides an accessible label for filters', () => {
    const wrapper = mount(MmUpNextTemplate, {
      slots: {
        filters: '<button>All</button>',
      },
    })

    expect(wrapper.get('.up-next-template__filters').attributes('aria-label')).toBe(
      'Arrival filters',
    )
  })

  it('provides an accessible label for pagination', () => {
    const wrapper = mount(MmUpNextTemplate, {
      slots: {
        pagination: '<button>Next</button>',
      },
    })

    expect(wrapper.get('.up-next-template__pagination').attributes('aria-label')).toBe(
      'Arrival pagination',
    )
  })

  it('associates the content with the Up Next heading', () => {
    const wrapper = mount(MmUpNextTemplate)

    expect(wrapper.get('.up-next-template__content').attributes('aria-labelledby')).toBe(
      'up-next-title',
    )
  })

  it('uses a semantic heading', () => {
    const wrapper = mount(MmUpNextTemplate)

    expect(wrapper.get('#up-next-title').element.tagName).toBe('H2')
  })

  it('uses semantic sections for filters and content', () => {
    const wrapper = mount(MmUpNextTemplate, {
      slots: {
        filters: '<button>New</button>',
        default: '<article>Arrival</article>',
      },
    })

    expect(wrapper.get('.up-next-template__filters').element.tagName).toBe('SECTION')
    expect(wrapper.get('.up-next-template__content').element.tagName).toBe('SECTION')
  })

  it('uses semantic navigation for pagination', () => {
    const wrapper = mount(MmUpNextTemplate, {
      slots: {
        pagination: '<button>Next</button>',
      },
    })

    expect(wrapper.get('.up-next-template__pagination').element.tagName).toBe('NAV')
  })

  it('renders all slots together', () => {
    const wrapper = mount(MmUpNextTemplate, {
      slots: {
        description: '2 new · 15 unwatched items',
        actions: `
          <button>Clear notifications</button>
          <button>Refresh</button>
        `,
        filters: `
          <button>All</button>
          <button>New</button>
        `,
        default: '<article>Example movie</article>',
        pagination: '<button>Previous</button>',
      },
    })

    expect(wrapper.text()).toContain('2 new · 15 unwatched items')
    expect(wrapper.text()).toContain('Clear notifications')
    expect(wrapper.text()).toContain('Refresh')
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('New')
    expect(wrapper.text()).toContain('Example movie')
    expect(wrapper.text()).toContain('Previous')
  })

  it('keeps the content section when no arrivals are provided', () => {
    const wrapper = mount(MmUpNextTemplate)

    expect(wrapper.find('.up-next-template__content').exists()).toBe(true)
    expect(wrapper.get('.up-next-template__content').text()).toBe('')
  })
})
