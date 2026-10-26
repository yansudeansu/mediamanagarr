import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmCalendarTemplate from './MmCalendarTemplate.vue'

describe('MmCalendarTemplate', () => {
  it('renders the Calendar heading', () => {
    const wrapper = mount(MmCalendarTemplate)

    expect(wrapper.get('.calendar-template__title').text()).toBe('Calendar')
  })

  it('renders the default description', () => {
    const wrapper = mount(MmCalendarTemplate)

    expect(wrapper.get('.calendar-template__description').text()).toBe(
      'Upcoming TV episodes and movie releases.',
    )
  })

  it('supports a custom description', () => {
    const wrapper = mount(MmCalendarTemplate, {
      slots: {
        description: 'Your upcoming releases.',
      },
    })

    expect(wrapper.get('.calendar-template__description').text()).toBe('Your upcoming releases.')
  })

  it('renders default slot content', () => {
    const wrapper = mount(MmCalendarTemplate, {
      slots: {
        default: '<div class="test-grid">Calendar grid</div>',
      },
    })

    expect(wrapper.get('.test-grid').text()).toBe('Calendar grid')
  })

  it('renders navigation when provided', () => {
    const wrapper = mount(MmCalendarTemplate, {
      slots: {
        navigation: '<div class="test-navigation">Month controls</div>',
      },
    })

    expect(wrapper.get('.test-navigation').text()).toBe('Month controls')
    expect(wrapper.get('.calendar-template__navigation').attributes('aria-label')).toBe(
      'Calendar navigation',
    )
  })

  it('omits navigation when the slot is absent', () => {
    const wrapper = mount(MmCalendarTemplate)

    expect(wrapper.find('.calendar-template__navigation').exists()).toBe(false)
  })

  it('renders filters inside the toolbar', () => {
    const wrapper = mount(MmCalendarTemplate, {
      slots: {
        filters: '<div class="test-filters">All TV Movies</div>',
      },
    })

    expect(wrapper.get('.calendar-template__toolbar .test-filters').text()).toBe('All TV Movies')
    expect(wrapper.find('.calendar-template__actions').exists()).toBe(false)
  })

  it('renders actions inside the toolbar', () => {
    const wrapper = mount(MmCalendarTemplate, {
      slots: {
        actions: '<div class="test-actions">Today Refresh</div>',
      },
    })

    expect(wrapper.get('.calendar-template__toolbar .test-actions').text()).toBe('Today Refresh')
    expect(wrapper.find('.calendar-template__filters').exists()).toBe(false)
  })

  it('places filters before actions in the same toolbar', () => {
    const wrapper = mount(MmCalendarTemplate, {
      slots: {
        filters: '<div data-test="filters">All TV Movies</div>',
        actions: '<div data-test="actions">Today Refresh</div>',
      },
    })

    const toolbar = wrapper.get('.calendar-template__toolbar')

    expect(toolbar.find('.calendar-template__filters').exists()).toBe(true)
    expect(toolbar.find('.calendar-template__actions').exists()).toBe(true)

    expect(
      toolbar.findAll('[data-test]').map((element) => element.attributes('data-test')),
    ).toEqual(['filters', 'actions'])
  })

  it('labels the toolbar', () => {
    const wrapper = mount(MmCalendarTemplate, {
      slots: {
        filters: '<div>Filters</div>',
        actions: '<div>Actions</div>',
      },
    })

    expect(wrapper.get('.calendar-template__toolbar').attributes('aria-label')).toBe(
      'Calendar controls',
    )
  })

  it('omits the toolbar when filters and actions are absent', () => {
    const wrapper = mount(MmCalendarTemplate)

    expect(wrapper.find('.calendar-template__toolbar').exists()).toBe(false)
  })

  it('renders status messages when provided', () => {
    const wrapper = mount(MmCalendarTemplate, {
      slots: {
        status: '<p role="status">Loading calendar…</p>',
      },
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Loading calendar…')
  })

  it('omits the status container when the slot is absent', () => {
    const wrapper = mount(MmCalendarTemplate)

    expect(wrapper.find('.calendar-template__status').exists()).toBe(false)
  })

  it('renders details when provided', () => {
    const wrapper = mount(MmCalendarTemplate, {
      slots: {
        details: '<div class="test-details">Selected day</div>',
      },
    })

    expect(wrapper.get('.test-details').text()).toBe('Selected day')
  })

  it('omits details when the slot is absent', () => {
    const wrapper = mount(MmCalendarTemplate)

    expect(wrapper.find('.calendar-template__details').exists()).toBe(false)
  })

  it('labels the main content using the Calendar heading', () => {
    const wrapper = mount(MmCalendarTemplate)

    expect(wrapper.get('.calendar-template__content').attributes('aria-labelledby')).toBe(
      'calendar-title',
    )

    expect(wrapper.find('#calendar-title').exists()).toBe(true)
  })

  it('renders all slots in the expected order', () => {
    const wrapper = mount(MmCalendarTemplate, {
      slots: {
        filters: '<div data-test="filters" />',
        actions: '<div data-test="actions" />',
        navigation: '<div data-test="navigation" />',
        status: '<div data-test="status" />',
        default: '<div data-test="grid" />',
        details: '<div data-test="details" />',
      },
    })

    const elements = wrapper.findAll('[data-test]')

    expect(elements.map((element) => element.attributes('data-test'))).toEqual([
      'filters',
      'actions',
      'navigation',
      'status',
      'grid',
      'details',
    ])
  })
})
