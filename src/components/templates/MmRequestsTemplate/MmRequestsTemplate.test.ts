import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmRequestsTemplate from './MmRequestsTemplate.vue'
import { mmRequestsTemplateSelectors } from '../../../test/selectors/templates/mmRequestsTemplate.selectors'

let wrapper: VueWrapper

const template = mmRequestsTemplateSelectors((selector) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.requests-template /, ''))
})

describe('MmRequestsTemplate', () => {
  it('renders the Requests heading', () => {
    wrapper = mount(MmRequestsTemplate)

    expect(template.title().text()).toBe('Requests')
  })

  it('renders the description', () => {
    wrapper = mount(MmRequestsTemplate)

    expect(template.description().text()).toBe('Browse media requests from Seerr.')
  })

  it('renders default slot content', () => {
    wrapper = mount(MmRequestsTemplate, {
      slots: { default: '<article>Example request</article>' },
    })

    expect(template.content().text()).toBe('Example request')
  })

  it('renders filters when provided', () => {
    wrapper = mount(MmRequestsTemplate, {
      slots: { filters: '<button>Pending</button>' },
    })

    expect(template.filterButtons().text()).toBe('Pending')
  })

  it('renders pagination when provided', () => {
    wrapper = mount(MmRequestsTemplate, {
      slots: { pagination: '<button>Next</button>' },
    })

    expect(template.paginationButtons().text()).toBe('Next')
  })

  it('renders actions when provided', () => {
    wrapper = mount(MmRequestsTemplate, {
      slots: { actions: '<button>Refresh</button>' },
    })

    expect(template.actionButtons().text()).toBe('Refresh')
  })

  it('does not render unused optional sections', () => {
    wrapper = mount(MmRequestsTemplate)

    expect(template.filters().exists()).toBe(false)
    expect(template.pagination().exists()).toBe(false)
    expect(template.actions().exists()).toBe(false)
  })

  it('provides an accessible label for filters', () => {
    wrapper = mount(MmRequestsTemplate, {
      slots: { filters: '<button>All</button>' },
    })

    expect(template.labelledFilters().exists()).toBe(true)
    expect(template.filters().attributes('aria-label')).toBe('Request filters')
  })

  it('provides an accessible label for pagination', () => {
    wrapper = mount(MmRequestsTemplate, {
      slots: { pagination: '<button>Next</button>' },
    })

    expect(template.labelledPagination().exists()).toBe(true)
    expect(template.pagination().attributes('aria-label')).toBe('Request pagination')
  })

  it('associates the content with the Requests heading', () => {
    wrapper = mount(MmRequestsTemplate)

    expect(template.labelledContent().exists()).toBe(true)
    expect(template.title().attributes('id')).toBe('requests-title')
  })

  it('renders all slots together', () => {
    wrapper = mount(MmRequestsTemplate, {
      slots: {
        actions: '<button>Refresh</button>',
        filters: '<button>Approved</button>',
        default: '<article>Movie request</article>',
        pagination: '<button>Previous</button>',
      },
    })

    expect(template.actions().text()).toContain('Refresh')
    expect(template.filters().text()).toContain('Approved')
    expect(template.content().text()).toContain('Movie request')
    expect(template.pagination().text()).toContain('Previous')
  })
})
