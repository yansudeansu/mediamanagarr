import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmPagination from './MmPagination.vue'
import { mmPaginationSelectors } from '../../../test/selectors/molecules/mmPagination.selectors'

let wrapper: VueWrapper

const pagination = mmPaginationSelectors((selector) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^nav\.pagination\[aria-label="Pagination"\] /, ''))
})

function mountPagination(page = 1, totalPages = 5) {
  wrapper = mount(MmPagination, { props: { page, totalPages } })
  return wrapper
}

describe('MmPagination', () => {
  it('renders the current page and total pages', () => {
    mountPagination(3, 5)

    expect(pagination.label().text()).toBe('Page 3 of 5')
  })

  it('renders previous and next navigation buttons', () => {
    mountPagination()

    expect(pagination.previous().exists()).toBe(true)
    expect(pagination.next().exists()).toBe(true)
  })

  it('renders previous and next arrow icons', () => {
    mountPagination()

    expect(pagination.previousIcon().exists()).toBe(true)
    expect(pagination.nextIcon().exists()).toBe(true)
  })

  it('hides decorative arrow icons from assistive technology', () => {
    mountPagination()

    expect(pagination.decorativePreviousIcon().exists()).toBe(true)
    expect(pagination.decorativeNextIcon().exists()).toBe(true)
    expect(pagination.previousIcon().attributes('aria-hidden')).toBe('true')
    expect(pagination.nextIcon().attributes('aria-hidden')).toBe('true')
  })

  it('provides an accessible pagination navigation landmark', () => {
    mountPagination()

    expect(pagination.get().element.tagName).toBe('NAV')
    expect(pagination.get().attributes('aria-label')).toBe('Pagination')
  })

  it('announces page changes to assistive technology', () => {
    mountPagination(3, 5)

    expect(pagination.liveLabel().exists()).toBe(true)
    expect(pagination.label().attributes('aria-live')).toBe('polite')
    expect(pagination.label().attributes('aria-atomic')).toBe('true')
  })

  it('disables the previous arrow on the first page', () => {
    mountPagination(1, 5)

    expect(pagination.previousDisabled().exists()).toBe(true)
    expect(pagination.nextEnabled().exists()).toBe(true)
  })

  it('disables the next arrow on the last page', () => {
    mountPagination(5, 5)

    expect(pagination.nextDisabled().exists()).toBe(true)
    expect(pagination.previousEnabled().exists()).toBe(true)
  })

  it('enables both arrows on intermediate pages', () => {
    mountPagination(3, 5)

    expect(pagination.previousEnabled().exists()).toBe(true)
    expect(pagination.nextEnabled().exists()).toBe(true)
  })

  it('emits the previous page', async () => {
    mountPagination(3, 5)

    await pagination.previous().trigger('click')

    expect(wrapper.emitted('update:page')).toEqual([[2]])
  })

  it('emits the next page', async () => {
    mountPagination(3, 5)

    await pagination.next().trigger('click')

    expect(wrapper.emitted('update:page')).toEqual([[4]])
  })

  it('does not emit when clicking the disabled previous arrow', async () => {
    mountPagination(1, 5)

    await pagination.previous().trigger('click')

    expect(wrapper.emitted('update:page')).toBeUndefined()
  })

  it('does not emit when clicking the disabled next arrow', async () => {
    mountPagination(5, 5)

    await pagination.next().trigger('click')

    expect(wrapper.emitted('update:page')).toBeUndefined()
  })

  it('handles large page counts', () => {
    mountPagination(25, 50)

    expect(pagination.label().text()).toBe('Page 25 of 50')
    expect(wrapper.findAll('button.pagination-arrow')).toHaveLength(2)
  })

  it('does not render numbered page buttons or ellipses', () => {
    mountPagination(25, 50)

    expect(pagination.numberedPages().exists()).toBe(false)
    expect(pagination.ellipses().exists()).toBe(false)
  })

  it('hides pagination when there is only one page', () => {
    mountPagination(1, 1)

    expect(pagination.get().exists()).toBe(false)
  })

  it('hides pagination when there are zero pages', () => {
    mountPagination(1, 0)

    expect(pagination.get().exists()).toBe(false)
  })

  it('updates when the current page changes', async () => {
    mountPagination(1, 5)

    await wrapper.setProps({ page: 3 })

    expect(pagination.label().text()).toBe('Page 3 of 5')
  })

  it('updates when the total page count changes', async () => {
    mountPagination(3, 5)

    await wrapper.setProps({ totalPages: 10 })

    expect(pagination.label().text()).toBe('Page 3 of 10')
  })

  it('clamps the current page to the last available page', () => {
    mountPagination(10, 5)

    expect(pagination.label().text()).toBe('Page 5 of 5')
    expect(pagination.nextDisabled().exists()).toBe(true)
  })

  it('clamps the current page to at least one', () => {
    mountPagination(0, 5)

    expect(pagination.label().text()).toBe('Page 1 of 5')
    expect(pagination.previousDisabled().exists()).toBe(true)
  })
})
