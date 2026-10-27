import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmPagination from './MmPagination.vue'

function mountPagination(page = 1, totalPages = 5) {
  return mount(MmPagination, {
    props: {
      page,
      totalPages,
    },
  })
}

describe('MmPagination', () => {
  it('renders the current page and total pages', () => {
    const wrapper = mountPagination(3, 5)

    expect(wrapper.get('.pagination-label').text()).toBe('Page 3 of 5')
  })

  it('renders previous and next navigation buttons', () => {
    const wrapper = mountPagination()

    expect(wrapper.find('[aria-label="Previous page"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Next page"]').exists()).toBe(true)
  })

  it('renders previous and next arrow icons', () => {
    const wrapper = mountPagination()

    expect(wrapper.find('[aria-label="Previous page"] svg').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Next page"] svg').exists()).toBe(true)
  })

  it('hides decorative arrow icons from assistive technology', () => {
    const wrapper = mountPagination()

    expect(wrapper.get('[aria-label="Previous page"] svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('[aria-label="Next page"] svg').attributes('aria-hidden')).toBe('true')
  })

  it('provides an accessible pagination navigation landmark', () => {
    const wrapper = mountPagination()

    expect(wrapper.get('nav.pagination').attributes('aria-label')).toBe('Pagination')
  })

  it('announces page changes to assistive technology', () => {
    const wrapper = mountPagination(3, 5)

    const label = wrapper.get('.pagination-label')

    expect(label.attributes('aria-live')).toBe('polite')
    expect(label.attributes('aria-atomic')).toBe('true')
  })

  it('disables the previous arrow on the first page', () => {
    const wrapper = mountPagination(1, 5)

    expect(wrapper.get('[aria-label="Previous page"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[aria-label="Next page"]').attributes('disabled')).toBeUndefined()
  })

  it('disables the next arrow on the last page', () => {
    const wrapper = mountPagination(5, 5)

    expect(wrapper.get('[aria-label="Next page"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[aria-label="Previous page"]').attributes('disabled')).toBeUndefined()
  })

  it('enables both arrows on intermediate pages', () => {
    const wrapper = mountPagination(3, 5)

    expect(wrapper.get('[aria-label="Previous page"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.get('[aria-label="Next page"]').attributes('disabled')).toBeUndefined()
  })

  it('emits the previous page', async () => {
    const wrapper = mountPagination(3, 5)

    await wrapper.get('[aria-label="Previous page"]').trigger('click')

    expect(wrapper.emitted('update:page')).toEqual([[2]])
  })

  it('emits the next page', async () => {
    const wrapper = mountPagination(3, 5)

    await wrapper.get('[aria-label="Next page"]').trigger('click')

    expect(wrapper.emitted('update:page')).toEqual([[4]])
  })

  it('does not emit when clicking the disabled previous arrow', async () => {
    const wrapper = mountPagination(1, 5)

    await wrapper.get('[aria-label="Previous page"]').trigger('click')

    expect(wrapper.emitted('update:page')).toBeUndefined()
  })

  it('does not emit when clicking the disabled next arrow', async () => {
    const wrapper = mountPagination(5, 5)

    await wrapper.get('[aria-label="Next page"]').trigger('click')

    expect(wrapper.emitted('update:page')).toBeUndefined()
  })

  it('handles large page counts', () => {
    const wrapper = mountPagination(25, 50)

    expect(wrapper.get('.pagination-label').text()).toBe('Page 25 of 50')
    expect(wrapper.findAll('.pagination-arrow')).toHaveLength(2)
  })

  it('does not render numbered page buttons or ellipses', () => {
    const wrapper = mountPagination(25, 50)

    expect(wrapper.find('.pagination-page').exists()).toBe(false)
    expect(wrapper.find('.pagination-ellipsis').exists()).toBe(false)
  })

  it('hides pagination when there is only one page', () => {
    const wrapper = mountPagination(1, 1)

    expect(wrapper.find('.pagination').exists()).toBe(false)
  })

  it('hides pagination when there are zero pages', () => {
    const wrapper = mountPagination(1, 0)

    expect(wrapper.find('.pagination').exists()).toBe(false)
  })

  it('updates when the current page changes', async () => {
    const wrapper = mountPagination(1, 5)

    await wrapper.setProps({ page: 3 })

    expect(wrapper.get('.pagination-label').text()).toBe('Page 3 of 5')
  })

  it('updates when the total page count changes', async () => {
    const wrapper = mountPagination(3, 5)

    await wrapper.setProps({ totalPages: 10 })

    expect(wrapper.get('.pagination-label').text()).toBe('Page 3 of 10')
  })

  it('clamps the current page to the last available page', () => {
    const wrapper = mountPagination(10, 5)

    expect(wrapper.get('.pagination-label').text()).toBe('Page 5 of 5')
    expect(wrapper.get('[aria-label="Next page"]').attributes('disabled')).toBeDefined()
  })

  it('clamps the current page to at least one', () => {
    const wrapper = mountPagination(0, 5)

    expect(wrapper.get('.pagination-label').text()).toBe('Page 1 of 5')
    expect(wrapper.get('[aria-label="Previous page"]').attributes('disabled')).toBeDefined()
  })
})
