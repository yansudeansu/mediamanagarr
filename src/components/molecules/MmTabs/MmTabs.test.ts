import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MmTabs from './MmTabs.vue'
import type { TabItem } from './MmTabs.vue'

const items: TabItem[] = [
  { id: 'connections', label: 'Connections' },
  { id: 'workspace', label: 'Workspace' },
]

const navigationItems: TabItem[] = [
  { id: 'requests', label: 'Requests' },
  { id: 'up-next', label: 'Up Next' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'downloads', label: 'Downloads' },
]

interface TestProps {
  modelValue: string
  items: TabItem[]
  variant: 'tabs' | 'navigation'
  label: string
}

function createWrapper(overrides: Partial<TestProps> = {}) {
  return mount(MmTabs, {
    props: {
      modelValue: 'connections',
      items,
      ...overrides,
    },
  })
}

function createNavigationWrapper(overrides: Partial<TestProps> = {}) {
  return createWrapper({
    modelValue: 'requests',
    items: navigationItems,
    variant: 'navigation',
    ...overrides,
  })
}

function mockScrollDimensions(
  element: HTMLElement,
  {
    clientWidth,
    scrollWidth,
    scrollLeft = 0,
  }: {
    clientWidth: number
    scrollWidth: number
    scrollLeft?: number
  },
): void {
  Object.defineProperties(element, {
    clientWidth: {
      configurable: true,
      value: clientWidth,
    },
    scrollWidth: {
      configurable: true,
      value: scrollWidth,
    },
    scrollLeft: {
      configurable: true,
      writable: true,
      value: scrollLeft,
    },
  })
}

function mockRect(left: number, right: number): DOMRect {
  return {
    x: left,
    y: 0,
    left,
    right,
    top: 0,
    bottom: 42,
    width: right - left,
    height: 42,
    toJSON: () => ({}),
  } as DOMRect
}

describe('MmTabs', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders all tab labels', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Connections')
    expect(wrapper.text()).toContain('Workspace')
  })

  it('uses tab semantics by default', () => {
    const wrapper = createWrapper()

    expect(wrapper.get('[role="tablist"]').attributes('aria-label')).toBe('Tabs')
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(2)
  })

  it('supports a custom accessible label', () => {
    const wrapper = createWrapper({ label: 'Settings sections' })

    expect(wrapper.get('[role="tablist"]').attributes('aria-label')).toBe('Settings sections')
  })

  it('marks the selected tab', () => {
    const wrapper = createWrapper()
    const tabs = wrapper.findAll('[role="tab"]')

    expect(tabs[0]?.attributes('aria-selected')).toBe('true')
    expect(tabs[0]?.attributes('tabindex')).toBe('0')
    expect(tabs[1]?.attributes('aria-selected')).toBe('false')
    expect(tabs[1]?.attributes('tabindex')).toBe('-1')
  })

  it('emits an update when another tab is clicked', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('[role="tab"]')[1]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('does not select a disabled tab', async () => {
    const wrapper = createWrapper({
      items: [
        { id: 'connections', label: 'Connections' },
        { id: 'workspace', label: 'Workspace', disabled: true },
      ],
    })

    await wrapper.findAll('[role="tab"]')[1]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('selects the next tab with ArrowRight', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('[role="tab"]')[0]?.trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('wraps to the previous tab with ArrowLeft', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('[role="tab"]')[0]?.trigger('keydown', {
      key: 'ArrowLeft',
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('skips disabled tabs during keyboard navigation', async () => {
    const wrapper = createWrapper({
      items: [
        { id: 'connections', label: 'Connections' },
        { id: 'disabled', label: 'Disabled', disabled: true },
        { id: 'workspace', label: 'Workspace' },
      ],
    })

    await wrapper.findAll('[role="tab"]')[0]?.trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('supports Home and End keyboard navigation', async () => {
    const wrapper = createWrapper({
      items: [
        { id: 'connections', label: 'Connections' },
        { id: 'workspace', label: 'Workspace' },
        { id: 'advanced', label: 'Advanced' },
      ],
    })

    const tabs = wrapper.findAll('[role="tab"]')

    await tabs[0]?.trigger('keydown', { key: 'End' })
    await tabs[2]?.trigger('keydown', { key: 'Home' })

    expect(wrapper.emitted('update:modelValue')).toEqual([['advanced'], ['connections']])
  })

  it('does not change selection for unrelated keys', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('[role="tab"]')[0]?.trigger('keydown', {
      key: 'Escape',
    })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('focuses the target tab during keyboard navigation', async () => {
    const wrapper = createWrapper()
    const tabs = wrapper.findAll('[role="tab"]')
    const target = tabs[1]?.element as HTMLElement
    const focus = vi.spyOn(target, 'focus')

    await tabs[0]?.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
    expect(focus).toHaveBeenCalledOnce()
  })

  it('provides a keyboard entry point for an unknown selection', () => {
    const wrapper = createWrapper({
      modelValue: 'missing',
    })

    const tabs = wrapper.findAll('[role="tab"]')

    expect(tabs[0]?.attributes('tabindex')).toBe('0')
    expect(tabs[1]?.attributes('tabindex')).toBe('-1')
    expect(tabs[0]?.attributes('aria-selected')).toBe('false')
    expect(tabs[1]?.attributes('aria-selected')).toBe('false')
  })

  it('provides a keyboard entry point when the selected tab is disabled', () => {
    const wrapper = createWrapper({
      modelValue: 'connections',
      items: [
        { id: 'connections', label: 'Connections', disabled: true },
        { id: 'workspace', label: 'Workspace' },
      ],
    })

    const tabs = wrapper.findAll('[role="tab"]')

    expect(tabs[0]?.attributes('tabindex')).toBe('-1')
    expect(tabs[1]?.attributes('tabindex')).toBe('0')
  })

  it('does not make disabled tabs keyboard-reachable when all are disabled', () => {
    const wrapper = createWrapper({
      items: items.map((item) => ({ ...item, disabled: true })),
    })

    const tabs = wrapper.findAll('[role="tab"]')

    expect(tabs.every((tab) => tab.attributes('tabindex') === '-1')).toBe(true)
  })

  it('updates the keyboard entry point when items change', async () => {
    const wrapper = createWrapper()

    await wrapper.setProps({
      items: [
        { id: 'connections', label: 'Connections', disabled: true },
        { id: 'workspace', label: 'Workspace' },
      ],
    })

    const tabs = wrapper.findAll('[role="tab"]')

    expect(tabs[0]?.attributes('tabindex')).toBe('-1')
    expect(tabs[1]?.attributes('tabindex')).toBe('0')
  })

  it('uses navigation semantics when requested', () => {
    const wrapper = createWrapper({
      variant: 'navigation',
    })

    expect(wrapper.find('[role="tablist"]').exists()).toBe(false)
    expect(wrapper.find('[role="tab"]').exists()).toBe(false)

    const buttons = wrapper.findAll('.tabs__item')

    expect(buttons[0]?.attributes('aria-current')).toBe('page')
    expect(buttons[1]?.attributes('aria-current')).toBeUndefined()
  })

  it('emits selection updates in navigation mode', async () => {
    const wrapper = createWrapper({
      variant: 'navigation',
    })

    await wrapper.findAll('.tabs__item')[1]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('does not implement tab keyboard behavior in navigation mode', async () => {
    const wrapper = createWrapper({
      variant: 'navigation',
    })

    await wrapper.findAll('.tabs__item')[0]?.trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  describe('scrollable navigation', () => {
    it('does not show scroll arrows when navigation fits', async () => {
      const wrapper = createNavigationWrapper()
      const viewport = wrapper.get('.tabs__viewport').element as HTMLElement

      mockScrollDimensions(viewport, {
        clientWidth: 400,
        scrollWidth: 400,
      })

      await wrapper.get('.tabs__viewport').trigger('scroll')

      expect(wrapper.find('[aria-label="Scroll navigation left"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Scroll navigation right"]').exists()).toBe(false)
    })

    it('shows scroll arrows when navigation overflows', async () => {
      const wrapper = createNavigationWrapper()
      const viewport = wrapper.get('.tabs__viewport').element as HTMLElement

      mockScrollDimensions(viewport, {
        clientWidth: 200,
        scrollWidth: 500,
      })

      await wrapper.get('.tabs__viewport').trigger('scroll')

      const leftArrow = wrapper.get('[aria-label="Scroll navigation left"]')
      const rightArrow = wrapper.get('[aria-label="Scroll navigation right"]')

      expect(leftArrow.attributes('disabled')).toBeDefined()
      expect(rightArrow.attributes('disabled')).toBeUndefined()
    })

    it('updates arrow states as navigation scrolls', async () => {
      const wrapper = createNavigationWrapper()
      const viewport = wrapper.get('.tabs__viewport').element as HTMLElement

      mockScrollDimensions(viewport, {
        clientWidth: 200,
        scrollWidth: 500,
      })

      await wrapper.get('.tabs__viewport').trigger('scroll')

      viewport.scrollLeft = 150
      await wrapper.get('.tabs__viewport').trigger('scroll')

      expect(
        wrapper.get('[aria-label="Scroll navigation left"]').attributes('disabled'),
      ).toBeUndefined()

      expect(
        wrapper.get('[aria-label="Scroll navigation right"]').attributes('disabled'),
      ).toBeUndefined()

      viewport.scrollLeft = 300
      await wrapper.get('.tabs__viewport').trigger('scroll')

      expect(
        wrapper.get('[aria-label="Scroll navigation left"]').attributes('disabled'),
      ).toBeUndefined()

      expect(
        wrapper.get('[aria-label="Scroll navigation right"]').attributes('disabled'),
      ).toBeDefined()
    })

    it('scrolls when an arrow is clicked', async () => {
      const wrapper = createNavigationWrapper()
      const viewport = wrapper.get('.tabs__viewport').element as HTMLElement
      const scrollBy = vi.fn()

      mockScrollDimensions(viewport, {
        clientWidth: 200,
        scrollWidth: 500,
      })

      viewport.scrollBy = scrollBy

      await wrapper.get('.tabs__viewport').trigger('scroll')
      await wrapper.get('[aria-label="Scroll navigation right"]').trigger('click')

      expect(scrollBy).toHaveBeenCalledWith({
        left: 150,
        behavior: 'smooth',
      })

      viewport.scrollLeft = 150
      await wrapper.get('.tabs__viewport').trigger('scroll')
      await wrapper.get('[aria-label="Scroll navigation left"]').trigger('click')

      expect(scrollBy).toHaveBeenLastCalledWith({
        left: -150,
        behavior: 'smooth',
      })
    })

    it('scrolls the selected navigation item into view', async () => {
      const wrapper = createNavigationWrapper()
      const viewport = wrapper.get('.tabs__viewport').element as HTMLElement
      const scrollBy = vi.fn()

      viewport.scrollBy = scrollBy

      vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue(mockRect(0, 200))

      const downloadsButton = wrapper.findAll('.tabs__item')[3]?.element as HTMLElement

      vi.spyOn(downloadsButton, 'getBoundingClientRect').mockReturnValue(mockRect(250, 350))

      await wrapper.setProps({ modelValue: 'downloads' })

      expect(scrollBy).toHaveBeenCalledWith({
        left: 150,
        behavior: 'smooth',
      })
    })

    it('scrolls left when the selected item is outside the left edge', async () => {
      const wrapper = createNavigationWrapper({
        modelValue: 'downloads',
      })

      const viewport = wrapper.get('.tabs__viewport').element as HTMLElement
      const scrollBy = vi.fn()

      viewport.scrollBy = scrollBy

      vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue(mockRect(100, 300))

      const requestsButton = wrapper.findAll('.tabs__item')[0]?.element as HTMLElement

      vi.spyOn(requestsButton, 'getBoundingClientRect').mockReturnValue(mockRect(20, 90))

      await wrapper.setProps({ modelValue: 'requests' })

      expect(scrollBy).toHaveBeenCalledWith({
        left: -80,
        behavior: 'smooth',
      })
    })

    it('refreshes scroll state when navigation items change', async () => {
      const wrapper = createNavigationWrapper()
      const viewport = wrapper.get('.tabs__viewport').element as HTMLElement

      mockScrollDimensions(viewport, {
        clientWidth: 200,
        scrollWidth: 500,
      })

      await wrapper.get('.tabs__viewport').trigger('scroll')

      expect(wrapper.find('[aria-label="Scroll navigation right"]').exists()).toBe(true)

      mockScrollDimensions(viewport, {
        clientWidth: 200,
        scrollWidth: 200,
      })

      await wrapper.setProps({
        items: navigationItems.slice(0, 2),
      })

      await nextTick()
      await wrapper.get('.tabs__viewport').trigger('scroll')

      expect(wrapper.find('[aria-label="Scroll navigation left"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Scroll navigation right"]').exists()).toBe(false)
    })

    it('does not add scroll controls to ordinary tabs', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.tabs__viewport--navigation').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Scroll navigation left"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Scroll navigation right"]').exists()).toBe(false)
    })

    it('observes navigation dimensions and disconnects on unmount', async () => {
      const disconnect = vi.fn()
      const observe = vi.fn()

      class ResizeObserverMock {
        observe = observe
        disconnect = disconnect
      }

      vi.stubGlobal('ResizeObserver', ResizeObserverMock)

      const wrapper = createNavigationWrapper()

      await nextTick()

      expect(observe).toHaveBeenCalledTimes(2)

      const disconnectsBeforeUnmount = disconnect.mock.calls.length

      wrapper.unmount()

      expect(disconnect).toHaveBeenCalledTimes(disconnectsBeforeUnmount + 1)
    })

    it('attaches the resize observer when switching to navigation', async () => {
      const observe = vi.fn()
      const disconnect = vi.fn()

      class ResizeObserverMock {
        observe = observe
        disconnect = disconnect
      }

      vi.stubGlobal('ResizeObserver', ResizeObserverMock)

      const wrapper = createWrapper()

      expect(observe).not.toHaveBeenCalled()

      await wrapper.setProps({ variant: 'navigation' })
      await nextTick()

      expect(observe).toHaveBeenCalledTimes(2)

      await wrapper.setProps({ variant: 'tabs' })
      await nextTick()

      expect(disconnect).toHaveBeenCalled()

      wrapper.unmount()
    })

    it('reattaches the resize observer when navigation items change', async () => {
      const observe = vi.fn()
      const disconnect = vi.fn()

      class ResizeObserverMock {
        observe = observe
        disconnect = disconnect
      }

      vi.stubGlobal('ResizeObserver', ResizeObserverMock)

      const wrapper = createNavigationWrapper()

      await nextTick()

      const initialObservations = observe.mock.calls.length

      await wrapper.setProps({
        items: navigationItems.slice(0, 2),
      })

      await nextTick()
      await nextTick()

      expect(disconnect).toHaveBeenCalled()
      expect(observe.mock.calls.length).toBeGreaterThan(initialObservations)

      wrapper.unmount()
    })
  })
})
