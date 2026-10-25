import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmRequestsTemplate from './MmRequestsTemplate.vue'

describe('MmRequestsTemplate', () => {
  it('renders the Requests heading', () => {
    const wrapper = mount(MmRequestsTemplate)

    expect(wrapper.get('#requests-title').text()).toBe('Requests')
  })

  it('renders the description', () => {
    const wrapper = mount(MmRequestsTemplate)

    expect(wrapper.text()).toContain('Browse media requests from Seerr.')
  })

  it('renders default slot content', () => {
    const wrapper = mount(MmRequestsTemplate, {
      slots: {
        default: '<article>Example request</article>',
      },
    })

    expect(wrapper.get('.requests-template__content').text()).toBe('Example request')
  })

  it('renders filters when provided', () => {
    const wrapper = mount(MmRequestsTemplate, {
      slots: {
        filters: '<button>Pending</button>',
      },
    })

    expect(wrapper.get('.requests-template__filters button').text()).toBe('Pending')
  })

  it('renders pagination when provided', () => {
    const wrapper = mount(MmRequestsTemplate, {
      slots: {
        pagination: '<button>Next</button>',
      },
    })

    expect(wrapper.get('.requests-template__pagination button').text()).toBe('Next')
  })

  it('renders actions when provided', () => {
    const wrapper = mount(MmRequestsTemplate, {
      slots: {
        actions: '<button>Refresh</button>',
      },
    })

    expect(wrapper.get('.requests-template__actions button').text()).toBe('Refresh')
  })

  it('does not render unused optional sections', () => {
    const wrapper = mount(MmRequestsTemplate)

    expect(wrapper.find('.requests-template__filters').exists()).toBe(false)
    expect(wrapper.find('.requests-template__pagination').exists()).toBe(false)
    expect(wrapper.find('.requests-template__actions').exists()).toBe(false)
  })

  it('provides an accessible label for filters', () => {
    const wrapper = mount(MmRequestsTemplate, {
      slots: {
        filters: '<button>All</button>',
      },
    })

    expect(wrapper.get('.requests-template__filters').attributes('aria-label')).toBe(
      'Request filters',
    )
  })

  it('provides an accessible label for pagination', () => {
    const wrapper = mount(MmRequestsTemplate, {
      slots: {
        pagination: '<button>Next</button>',
      },
    })

    expect(wrapper.get('.requests-template__pagination').attributes('aria-label')).toBe(
      'Request pagination',
    )
  })

  it('associates the content with the Requests heading', () => {
    const wrapper = mount(MmRequestsTemplate)

    expect(wrapper.get('.requests-template__content').attributes('aria-labelledby')).toBe(
      'requests-title',
    )
  })

  it('renders all slots together', () => {
    const wrapper = mount(MmRequestsTemplate, {
      slots: {
        actions: '<button>Refresh</button>',
        filters: '<button>Approved</button>',
        default: '<article>Movie request</article>',
        pagination: '<button>Previous</button>',
      },
    })

    expect(wrapper.text()).toContain('Refresh')
    expect(wrapper.text()).toContain('Approved')
    expect(wrapper.text()).toContain('Movie request')
    expect(wrapper.text()).toContain('Previous')
  })
})
