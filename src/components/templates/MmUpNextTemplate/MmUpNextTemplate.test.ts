import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmUpNextTemplate from './MmUpNextTemplate.vue'
import { mmUpNextTemplateSelectors } from '../../../test/selectors/templates/mmUpNextTemplate.selectors'

let wrapper: VueWrapper

const template = mmUpNextTemplateSelectors((selector) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.up-next-template /, ''))
})

describe('MmUpNextTemplate', () => {
  it('renders the Up Next heading', () => {
    wrapper = mount(MmUpNextTemplate)

    expect(template.title().text()).toBe('Up Next')
  })

  it('renders the default description', () => {
    wrapper = mount(MmUpNextTemplate)

    expect(template.description().text()).toBe('Recently added, unwatched media from Jellyfin.')
  })

  it('renders a custom description', () => {
    wrapper = mount(MmUpNextTemplate, {
      slots: { description: '3 new · 42 unwatched items' },
    })

    expect(template.description().text()).toBe('3 new · 42 unwatched items')
    expect(template.get().text()).not.toContain('Recently added, unwatched media from Jellyfin.')
  })

  it('renders default slot content', () => {
    wrapper = mount(MmUpNextTemplate, {
      slots: { default: '<article>Example arrival</article>' },
    })

    expect(template.articles().text()).toBe('Example arrival')
  })

  it('renders filters when provided', () => {
    wrapper = mount(MmUpNextTemplate, {
      slots: { filters: '<button>New</button>' },
    })

    expect(template.filterButtons().text()).toBe('New')
  })

  it('renders pagination when provided', () => {
    wrapper = mount(MmUpNextTemplate, {
      slots: { pagination: '<button>Next</button>' },
    })

    expect(template.paginationButtons().text()).toBe('Next')
  })

  it('renders actions when provided', () => {
    wrapper = mount(MmUpNextTemplate, {
      slots: { actions: '<button>Refresh</button>' },
    })

    expect(template.actionButtons().text()).toBe('Refresh')
  })

  it('supports multiple action buttons', () => {
    wrapper = mount(MmUpNextTemplate, {
      slots: {
        actions: `
          <button>Clear notifications</button>
          <button>Refresh</button>
        `,
      },
    })

    expect(template.actionButtons().exists()).toBe(true)
    expect(template.actionButton(0).text()).toBe('Clear notifications')
    expect(template.actionButton(1).text()).toBe('Refresh')
    expect(wrapper.findAll('.up-next-template__actions button')).toHaveLength(2)
  })

  it('does not render unused optional sections', () => {
    wrapper = mount(MmUpNextTemplate)

    expect(template.filters().exists()).toBe(false)
    expect(template.pagination().exists()).toBe(false)
    expect(template.actions().exists()).toBe(false)
  })

  it('provides an accessible label for filters', () => {
    wrapper = mount(MmUpNextTemplate, {
      slots: { filters: '<button>All</button>' },
    })

    expect(template.labelledFilters().exists()).toBe(true)
    expect(template.filters().attributes('aria-label')).toBe('Arrival filters')
  })

  it('provides an accessible label for pagination', () => {
    wrapper = mount(MmUpNextTemplate, {
      slots: { pagination: '<button>Next</button>' },
    })

    expect(template.labelledPagination().exists()).toBe(true)
    expect(template.pagination().attributes('aria-label')).toBe('Arrival pagination')
  })

  it('associates the content with the Up Next heading', () => {
    wrapper = mount(MmUpNextTemplate)

    expect(template.labelledContent().exists()).toBe(true)
    expect(template.title().attributes('id')).toBe('up-next-title')
  })

  it('uses a semantic heading', () => {
    wrapper = mount(MmUpNextTemplate)

    expect(template.title().element.tagName).toBe('H2')
  })

  it('uses semantic sections for filters and content', () => {
    wrapper = mount(MmUpNextTemplate, {
      slots: {
        filters: '<button>New</button>',
        default: '<article>Arrival</article>',
      },
    })

    expect(template.filters().element.tagName).toBe('SECTION')
    expect(template.content().element.tagName).toBe('SECTION')
  })

  it('uses semantic navigation for pagination', () => {
    wrapper = mount(MmUpNextTemplate, {
      slots: { pagination: '<button>Next</button>' },
    })

    expect(template.pagination().element.tagName).toBe('NAV')
  })

  it('renders all slots together', () => {
    wrapper = mount(MmUpNextTemplate, {
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

    expect(template.description().text()).toContain('2 new · 15 unwatched items')
    expect(template.actions().text()).toContain('Clear notifications')
    expect(template.actions().text()).toContain('Refresh')
    expect(template.filters().text()).toContain('All')
    expect(template.filters().text()).toContain('New')
    expect(template.content().text()).toContain('Example movie')
    expect(template.pagination().text()).toContain('Previous')
  })

  it('keeps the content section when no arrivals are provided', () => {
    wrapper = mount(MmUpNextTemplate)

    expect(template.content().exists()).toBe(true)
    expect(template.content().text()).toBe('')
  })
})
