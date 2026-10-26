import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmCalendarHeader from './MmCalendarHeader.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'

function mountHeader(month = '2026-11-01') {
  return mount(MmCalendarHeader, {
    props: {
      month,
    },
  })
}

describe('MmCalendarHeader', () => {
  it('renders the formatted month and year', () => {
    const wrapper = mountHeader()

    expect(wrapper.get('.calendar-header__title').text()).toBe('November 2026')
  })

  it('renders the month title inside the navigation group', () => {
    const wrapper = mountHeader()

    expect(wrapper.get('.calendar-header__navigation .calendar-header__title').text()).toBe(
      'November 2026',
    )
  })

  it('announces month changes', () => {
    const wrapper = mountHeader()

    expect(wrapper.get('.calendar-header__title').attributes('aria-live')).toBe('polite')
  })

  it('renders the month navigation group with an accessible label', () => {
    const wrapper = mountHeader()

    expect(wrapper.get('.calendar-header__navigation').attributes('role')).toBe('group')
    expect(wrapper.get('.calendar-header__navigation').attributes('aria-label')).toBe(
      'Calendar month navigation',
    )
  })

  it('uses icon-only chevron buttons for month navigation', () => {
    const wrapper = mountHeader()

    const buttons = wrapper.get('.calendar-header__navigation').findAllComponents(MmButton)

    expect(buttons).toHaveLength(2)

    expect(buttons[0]?.props()).toMatchObject({
      icon: 'chevron-left',
      iconOnly: true,
    })

    expect(buttons[1]?.props()).toMatchObject({
      icon: 'chevron-right',
      iconOnly: true,
    })
  })

  it('provides accessible labels for navigation buttons', () => {
    const wrapper = mountHeader()

    expect(
      wrapper.find('.calendar-header__navigation button[aria-label="Previous month"]').exists(),
    ).toBe(true)

    expect(
      wrapper.find('.calendar-header__navigation button[aria-label="Next month"]').exists(),
    ).toBe(true)
  })

  it('does not render Today or Refresh controls', () => {
    const wrapper = mountHeader()

    expect(wrapper.text()).not.toContain('Today')
    expect(wrapper.text()).not.toContain('Refresh')
    expect(wrapper.find('.calendar-header__actions').exists()).toBe(false)
  })

  it('emits previous when the previous-month button is clicked', async () => {
    const wrapper = mountHeader()

    await wrapper
      .get('.calendar-header__navigation button[aria-label="Previous month"]')
      .trigger('click')

    expect(wrapper.emitted('previous')).toEqual([[]])
  })

  it('emits next when the next-month button is clicked', async () => {
    const wrapper = mountHeader()

    await wrapper
      .get('.calendar-header__navigation button[aria-label="Next month"]')
      .trigger('click')

    expect(wrapper.emitted('next')).toEqual([[]])
  })

  it('does not emit navigation events on mount', () => {
    const wrapper = mountHeader()

    expect(wrapper.emitted('previous')).toBeUndefined()
    expect(wrapper.emitted('next')).toBeUndefined()
  })

  it('updates the displayed month when the prop changes', async () => {
    const wrapper = mountHeader()

    await wrapper.setProps({
      month: '2026-12-01',
    })

    expect(wrapper.get('.calendar-header__title').text()).toBe('December 2026')
  })

  it('handles invalid month values gracefully', () => {
    const wrapper = mountHeader('invalid-date')

    expect(wrapper.get('.calendar-header__title').text()).toBe('Unknown month')
  })

  it('handles an empty month value gracefully', () => {
    const wrapper = mountHeader('')

    expect(wrapper.get('.calendar-header__title').text()).toBe('Unknown month')
  })

  it('handles leap-year February correctly', () => {
    const wrapper = mountHeader('2028-02-01')

    expect(wrapper.get('.calendar-header__title').text()).toBe('February 2028')
  })
})
