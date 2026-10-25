import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmFilterGroup from './MmFilterGroup.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'

const options = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
]

function mountFilters(modelValue = 'all', additionalProps: Record<string, unknown> = {}) {
  return mount(MmFilterGroup, {
    props: {
      modelValue,
      options,
      ...additionalProps,
    },
  })
}

describe('MmFilterGroup', () => {
  it('renders all filter options', () => {
    const wrapper = mountFilters()

    expect(wrapper.findAllComponents(MmButton)).toHaveLength(3)
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Pending')
    expect(wrapper.text()).toContain('Approved')
  })

  it('marks the selected filter as pressed', () => {
    const wrapper = mountFilters('pending')
    const buttons = wrapper.findAll('button')

    expect(buttons[0]?.attributes('aria-pressed')).toBe('false')
    expect(buttons[1]?.attributes('aria-pressed')).toBe('true')
    expect(buttons[2]?.attributes('aria-pressed')).toBe('false')
  })

  it('applies active styling to the selected filter', () => {
    const wrapper = mountFilters('approved')
    const buttons = wrapper.findAll('button')

    expect(buttons[2]?.classes()).toContain('filter-group__button--active')
    expect(buttons[0]?.classes()).not.toContain('filter-group__button--active')
  })

  it('emits the selected filter value', async () => {
    const wrapper = mountFilters()

    await wrapper.findAll('button')[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['pending']])
  })

  it('updates the selected filter when modelValue changes', async () => {
    const wrapper = mountFilters()

    await wrapper.setProps({ modelValue: 'approved' })

    expect(wrapper.findAll('button')[2]?.attributes('aria-pressed')).toBe('true')
  })

  it('renders indicators when requested', () => {
    const wrapper = mount(MmFilterGroup, {
      props: {
        modelValue: 'all',
        options: [
          { label: 'All', value: 'all' },
          { label: 'New', value: 'new', indicator: true },
        ],
      },
    })

    expect(wrapper.findAll('.filter-group__indicator')).toHaveLength(1)
  })

  it('hides indicators from assistive technology', () => {
    const wrapper = mount(MmFilterGroup, {
      props: {
        modelValue: 'all',
        options: [{ label: 'New', value: 'new', indicator: true }],
      },
    })

    expect(wrapper.get('.filter-group__indicator').attributes('aria-hidden')).toBe('true')
  })

  it('disables all filters when disabled', async () => {
    const wrapper = mountFilters('all', { disabled: true })

    const buttons = wrapper.findAll('button')

    expect(buttons.every((button) => button.attributes('disabled') !== undefined)).toBe(true)

    await buttons[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('disables individual options', async () => {
    const wrapper = mount(MmFilterGroup, {
      props: {
        modelValue: 'all',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'pending', disabled: true },
        ],
      },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons[0]?.attributes('disabled')).toBeUndefined()
    expect(buttons[1]?.attributes('disabled')).toBeDefined()

    await buttons[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('provides an accessible group label', () => {
    const wrapper = mountFilters()

    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('Filters')
  })

  it('supports a custom accessible label', () => {
    const wrapper = mountFilters('all', { ariaLabel: 'Request status filters' })

    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('Request status filters')
  })

  it('renders an empty group without errors', () => {
    const wrapper = mount(MmFilterGroup, {
      props: {
        modelValue: '',
        options: [],
      },
    })

    expect(wrapper.findAll('button')).toHaveLength(0)
  })
})
