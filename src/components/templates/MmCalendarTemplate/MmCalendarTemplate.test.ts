import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmCalendarTemplate from './MmCalendarTemplate.vue'
import { mmCalendarTemplateSelectors } from '../../../test/selectors/templates/mmCalendarTemplate.selectors'

let wrapper: VueWrapper

const template = mmCalendarTemplateSelectors((selector) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.calendar-template /, ''))
})

describe('MmCalendarTemplate', () => {
  it('renders the Calendar heading', () => {
    wrapper = mount(MmCalendarTemplate)

    expect(template.title().text()).toBe('Calendar')
  })

  it('renders the default description', () => {
    wrapper = mount(MmCalendarTemplate)

    expect(template.description().text()).toBe('Upcoming TV episodes and movie releases.')
  })

  it('supports a custom description', () => {
    wrapper = mount(MmCalendarTemplate, {
      slots: { description: 'Your upcoming releases.' },
    })

    expect(template.description().text()).toBe('Your upcoming releases.')
  })

  it('renders default slot content', () => {
    wrapper = mount(MmCalendarTemplate, {
      slots: { default: '<div class="test-grid">Calendar grid</div>' },
    })

    expect(template.content().text()).toBe('Calendar grid')
  })

  it('renders navigation when provided', () => {
    wrapper = mount(MmCalendarTemplate, {
      slots: { navigation: '<div class="test-navigation">Month controls</div>' },
    })

    expect(template.navigation().text()).toBe('Month controls')
    expect(template.labelledNavigation().exists()).toBe(true)
  })

  it('omits navigation when the slot is absent', () => {
    wrapper = mount(MmCalendarTemplate)

    expect(template.navigation().exists()).toBe(false)
  })

  it('renders filters inside the toolbar', () => {
    wrapper = mount(MmCalendarTemplate, {
      slots: { filters: '<div class="test-filters">All TV Movies</div>' },
    })

    expect(template.filters().text()).toBe('All TV Movies')
    expect(template.actions().exists()).toBe(false)
  })

  it('renders actions inside the toolbar', () => {
    wrapper = mount(MmCalendarTemplate, {
      slots: { actions: '<div class="test-actions">Today Refresh</div>' },
    })

    expect(template.actions().text()).toBe('Today Refresh')
    expect(template.filters().exists()).toBe(false)
  })

  it('places filters before actions in the same toolbar', () => {
    wrapper = mount(MmCalendarTemplate, {
      slots: {
        filters: '<div data-test="filters">All TV Movies</div>',
        actions: '<div data-test="actions">Today Refresh</div>',
      },
    })

    expect(template.filters().exists()).toBe(true)
    expect(template.actions().exists()).toBe(true)
    expect(
      template
        .toolbar()
        .findAll('[data-test]')
        .map((element) => element.attributes('data-test')),
    ).toEqual(['filters', 'actions'])
  })

  it('labels the toolbar', () => {
    wrapper = mount(MmCalendarTemplate, {
      slots: {
        filters: '<div>Filters</div>',
        actions: '<div>Actions</div>',
      },
    })

    expect(template.labelledToolbar().exists()).toBe(true)
    expect(template.toolbar().attributes('aria-label')).toBe('Calendar controls')
  })

  it('omits the toolbar when filters and actions are absent', () => {
    wrapper = mount(MmCalendarTemplate)

    expect(template.toolbar().exists()).toBe(false)
  })

  it('renders status messages when provided', () => {
    wrapper = mount(MmCalendarTemplate, {
      slots: { status: '<p role="status">Loading calendar…</p>' },
    })

    expect(template.statusMessage().text()).toBe('Loading calendar…')
  })

  it('omits the status container when the slot is absent', () => {
    wrapper = mount(MmCalendarTemplate)

    expect(template.status().exists()).toBe(false)
  })

  it('renders details when provided', () => {
    wrapper = mount(MmCalendarTemplate, {
      slots: { details: '<div class="test-details">Selected day</div>' },
    })

    expect(template.details().text()).toBe('Selected day')
  })

  it('omits details when the slot is absent', () => {
    wrapper = mount(MmCalendarTemplate)

    expect(template.details().exists()).toBe(false)
  })

  it('labels the main content using the Calendar heading', () => {
    wrapper = mount(MmCalendarTemplate)

    expect(template.labelledContent().exists()).toBe(true)
    expect(template.title().attributes('id')).toBe('calendar-title')
  })

  it('renders all slots in the expected order', () => {
    wrapper = mount(MmCalendarTemplate, {
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
