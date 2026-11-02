import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmFilterGroup from './MmFilterGroup.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import { mmFilterGroupSelectors } from '../../../test/selectors/molecules/mmFilterGroup.selectors'

const options = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
]

let wrapper: VueWrapper

const filters = mmFilterGroupSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.filter-group\[role="group"\] /, ''))
})

function mountFilters(modelValue = 'all', additionalProps: Record<string, unknown> = {}) {
  wrapper = mount(MmFilterGroup, {
    props: {
      modelValue,
      options,
      ...additionalProps,
    },
  })
  return wrapper
}

describe('MmFilterGroup', () => {
  it('renders all filter options', () => {
    mountFilters()

    expect(wrapper.findAllComponents(MmButton)).toHaveLength(3)
    expect(filters.get().text()).toContain('All')
    expect(filters.get().text()).toContain('Pending')
    expect(filters.get().text()).toContain('Approved')
  })

  it('marks the selected filter as pressed', () => {
    mountFilters('pending')

    expect(filters.button(0).attributes('aria-pressed')).toBe('false')
    expect(filters.button(1).attributes('aria-pressed')).toBe('true')
    expect(filters.button(2).attributes('aria-pressed')).toBe('false')
  })

  it('applies active styling to the selected filter', () => {
    mountFilters('approved')

    expect(filters.button(2).classes()).toContain('filter-group__button--active')
    expect(filters.button(0).classes()).not.toContain('filter-group__button--active')
  })

  it('emits the selected filter value', async () => {
    mountFilters()

    await filters.button(1).trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['pending']])
  })

  it('updates the selected filter when modelValue changes', async () => {
    mountFilters()

    await wrapper.setProps({ modelValue: 'approved' })

    expect(filters.button(2).attributes('aria-pressed')).toBe('true')
  })

  it('renders indicators when requested', () => {
    wrapper = mount(MmFilterGroup, {
      props: {
        modelValue: 'all',
        options: [
          { label: 'All', value: 'all' },
          { label: 'New', value: 'new', indicator: true },
        ],
      },
    })

    expect(filters.indicator(0).exists()).toBe(false)
    expect(filters.indicator(1).exists()).toBe(true)
    expect(wrapper.findAll('.filter-group__indicator')).toHaveLength(1)
  })

  it('hides indicators from assistive technology', () => {
    wrapper = mount(MmFilterGroup, {
      props: {
        modelValue: 'all',
        options: [{ label: 'New', value: 'new', indicator: true }],
      },
    })

    expect(filters.decorativeIndicators().exists()).toBe(true)
    expect(filters.indicators().attributes('aria-hidden')).toBe('true')
  })

  it('disables all filters when disabled', async () => {
    mountFilters('all', { disabled: true })

    expect(filters.disabled().exists()).toBe(true)
    expect(filters.enabled().exists()).toBe(false)
    expect(
      wrapper.findAll('button').every((button) => button.attributes('disabled') !== undefined),
    ).toBe(true)

    await filters.button(1).trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('disables individual options', async () => {
    wrapper = mount(MmFilterGroup, {
      props: {
        modelValue: 'all',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'pending', disabled: true },
        ],
      },
    })

    expect(filters.button(0).attributes('disabled')).toBeUndefined()
    expect(filters.button(1).attributes('disabled')).toBeDefined()

    await filters.button(1).trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('provides an accessible group label', () => {
    mountFilters()

    expect(filters.get().attributes('aria-label')).toBe('Filters')
  })

  it('supports a custom accessible label', () => {
    mountFilters('all', { ariaLabel: 'Request status filters' })

    expect(filters.labelled('Request status filters').exists()).toBe(true)
  })

  it('renders an empty group without errors', () => {
    wrapper = mount(MmFilterGroup, {
      props: {
        modelValue: '',
        options: [],
      },
    })

    expect(filters.buttons().exists()).toBe(false)
    expect(wrapper.findAll('button')).toHaveLength(0)
  })
})
