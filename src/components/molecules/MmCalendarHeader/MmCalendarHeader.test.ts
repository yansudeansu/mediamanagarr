import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmCalendarHeader from './MmCalendarHeader.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import { mmCalendarHeaderSelectors } from '../../../test/selectors/molecules/mmCalendarHeader.selectors'

let wrapper: VueWrapper

const header = mmCalendarHeaderSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.calendar-header /, ''))
})

function mountHeader(month = '2026-11-01') {
  wrapper = mount(MmCalendarHeader, {
    props: { month },
  })
  return wrapper
}

describe('MmCalendarHeader', () => {
  it('renders the formatted month and year', () => {
    mountHeader()

    expect(header.title().text()).toBe('November 2026')
  })

  it('renders the month title inside the navigation group', () => {
    mountHeader()

    expect(header.navigation().find('.calendar-header__title').text()).toBe('November 2026')
  })

  it('announces month changes', () => {
    mountHeader()

    expect(header.liveTitle().exists()).toBe(true)
    expect(header.title().attributes('aria-live')).toBe('polite')
  })

  it('renders the month navigation group with an accessible label', () => {
    mountHeader()

    expect(header.navigation().attributes('role')).toBe('group')
    expect(header.navigation().attributes('aria-label')).toBe('Calendar month navigation')
  })

  it('uses icon-only chevron buttons for month navigation', () => {
    mountHeader()

    const buttons = header.navigation().findAllComponents(MmButton)

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
    mountHeader()

    expect(header.previous().exists()).toBe(true)
    expect(header.next().exists()).toBe(true)
  })

  it('does not render Today or Refresh controls', () => {
    mountHeader()

    expect(header.get().text()).not.toContain('Today')
    expect(header.get().text()).not.toContain('Refresh')
    expect(header.actions().exists()).toBe(false)
  })

  it('emits previous when the previous-month button is clicked', async () => {
    mountHeader()

    await header.previous().trigger('click')

    expect(wrapper.emitted('previous')).toEqual([[]])
  })

  it('emits next when the next-month button is clicked', async () => {
    mountHeader()

    await header.next().trigger('click')

    expect(wrapper.emitted('next')).toEqual([[]])
  })

  it('does not emit navigation events on mount', () => {
    mountHeader()

    expect(wrapper.emitted('previous')).toBeUndefined()
    expect(wrapper.emitted('next')).toBeUndefined()
  })

  it('updates the displayed month when the prop changes', async () => {
    mountHeader()

    await wrapper.setProps({ month: '2026-12-01' })

    expect(header.title().text()).toBe('December 2026')
  })

  it('handles invalid month values gracefully', () => {
    mountHeader('invalid-date')

    expect(header.title().text()).toBe('Unknown month')
  })

  it('handles an empty month value gracefully', () => {
    mountHeader('')

    expect(header.title().text()).toBe('Unknown month')
  })

  it('handles leap-year February correctly', () => {
    mountHeader('2028-02-01')

    expect(header.title().text()).toBe('February 2028')
  })
})
