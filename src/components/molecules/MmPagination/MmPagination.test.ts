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
  it('renders numbered page buttons', () => {
    const wrapper = mountPagination(1, 5)

    const pages = wrapper.findAll('.pagination-pages .pagination-page')

    expect(pages.map((button) => button.text())).toEqual(['1', '2', '3', '4', '5'])
  })

  it('renders previous and next arrow icons', () => {
    const wrapper = mountPagination()

    expect(wrapper.get('[aria-label="Previous page"] svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('[aria-label="Next page"] svg').attributes('aria-hidden')).toBe('true')
  })

  it('hides decorative arrow icons from assistive technology', () => {
    const wrapper = mountPagination()

    expect(wrapper.get('[aria-label="Previous page"] svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('[aria-label="Next page"] svg').attributes('aria-hidden')).toBe('true')
  })

  it('marks the current page as active', () => {
    const wrapper = mountPagination(3, 5)

    const active = wrapper.get('.pagination-page.active')

    expect(active.text()).toBe('3')
    expect(active.attributes('aria-current')).toBe('page')
  })

  it('disables the active page button', () => {
    const wrapper = mountPagination(3, 5)

    expect(wrapper.get('.pagination-page.active').attributes('disabled')).toBeDefined()
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

  it('emits the selected page number', async () => {
    const wrapper = mountPagination(1, 5)

    await wrapper.get('[aria-label="Page 3"]').trigger('click')

    expect(wrapper.emitted('update:page')).toEqual([[3]])
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

  it('does not emit when clicking the active page', async () => {
    const wrapper = mountPagination(3, 5)

    await wrapper.get('[aria-label="Page 3"]').trigger('click')

    expect(wrapper.emitted('update:page')).toBeUndefined()
  })

  it('renders seven page slots for large page counts', () => {
    const wrapper = mountPagination(25, 50)

    expect(wrapper.findAll('.pagination-page')).toHaveLength(5)
    expect(wrapper.findAll('.pagination-ellipsis')).toHaveLength(2)
  })

  it('keeps seven page slots near the beginning', () => {
    const wrapper = mountPagination(2, 50)

    expect(wrapper.findAll('.pagination-page')).toHaveLength(6)
    expect(wrapper.findAll('.pagination-ellipsis')).toHaveLength(1)
  })

  it('keeps seven page slots near the end', () => {
    const wrapper = mountPagination(49, 50)

    expect(wrapper.findAll('.pagination-page')).toHaveLength(6)
    expect(wrapper.findAll('.pagination-ellipsis')).toHaveLength(1)
  })

  it('shows adjacent pages around the current page', () => {
    const wrapper = mountPagination(25, 50)

    expect(wrapper.find('[aria-label="Page 24"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Page 25"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Page 26"]').exists()).toBe(true)
  })

  it('shows the first and last pages', () => {
    const wrapper = mountPagination(25, 50)

    expect(wrapper.find('[aria-label="Page 1"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Page 50"]').exists()).toBe(true)
  })

  it('does not show ellipses for seven or fewer pages', () => {
    const wrapper = mountPagination(4, 7)

    expect(wrapper.find('.pagination-ellipsis').exists()).toBe(false)
    expect(wrapper.findAll('.pagination-page')).toHaveLength(7)
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

    expect(wrapper.get('.pagination-page.active').text()).toBe('3')
  })

  it('does not render a Page X of Y label', () => {
    const wrapper = mountPagination(3, 5)

    expect(wrapper.text()).not.toContain('of')
  })
})
