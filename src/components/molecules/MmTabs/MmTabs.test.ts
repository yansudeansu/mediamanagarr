import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import MmTabs from './MmTabs.vue'
import type { TabItem } from './MmTabs.vue'
import { mmTabsSelectors } from '../../../test/selectors/molecules/mmTabs.selectors'

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

let wrapper: VueWrapper

const tabs = mmTabsSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.tabs /, ''))
})

function createWrapper(overrides: Partial<TestProps> = {}) {
  wrapper = mount(MmTabs, {
    props: {
      modelValue: 'connections',
      items,
      ...overrides,
    },
  })
  return wrapper
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
    clientWidth: { configurable: true, value: clientWidth },
    scrollWidth: { configurable: true, value: scrollWidth },
    scrollLeft: { configurable: true, writable: true, value: scrollLeft },
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
    createWrapper()

    expect(tabs.get().text()).toContain('Connections')
    expect(tabs.get().text()).toContain('Workspace')
  })

  it('uses tab semantics by default', () => {
    createWrapper()

    expect(tabs.tablist().attributes('aria-label')).toBe('Tabs')
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(2)
  })

  it('supports a custom accessible label', () => {
    createWrapper({ label: 'Settings sections' })

    expect(tabs.labelled('Settings sections').exists()).toBe(true)
  })

  it('marks the selected tab', () => {
    createWrapper()

    expect(tabs.tab(0).attributes('aria-selected')).toBe('true')
    expect(tabs.tab(0).attributes('tabindex')).toBe('0')
    expect(tabs.tab(1).attributes('aria-selected')).toBe('false')
    expect(tabs.tab(1).attributes('tabindex')).toBe('-1')
  })

  it('emits an update when another tab is clicked', async () => {
    createWrapper()

    await tabs.tab(1).trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('does not select a disabled tab', async () => {
    createWrapper({
      items: [
        { id: 'connections', label: 'Connections' },
        { id: 'workspace', label: 'Workspace', disabled: true },
      ],
    })

    await tabs.tab(1).trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('selects the next tab with ArrowRight', async () => {
    createWrapper()

    await tabs.tab(0).trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('wraps to the previous tab with ArrowLeft', async () => {
    createWrapper()

    await tabs.tab(0).trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('skips disabled tabs during keyboard navigation', async () => {
    createWrapper({
      items: [
        { id: 'connections', label: 'Connections' },
        { id: 'disabled', label: 'Disabled', disabled: true },
        { id: 'workspace', label: 'Workspace' },
      ],
    })

    await tabs.tab(0).trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('supports Home and End keyboard navigation', async () => {
    createWrapper({
      items: [
        { id: 'connections', label: 'Connections' },
        { id: 'workspace', label: 'Workspace' },
        { id: 'advanced', label: 'Advanced' },
      ],
    })

    await tabs.tab(0).trigger('keydown', { key: 'End' })
    await tabs.tab(2).trigger('keydown', { key: 'Home' })

    expect(wrapper.emitted('update:modelValue')).toEqual([['advanced'], ['connections']])
  })

  it('does not change selection for unrelated keys', async () => {
    createWrapper()

    await tabs.tab(0).trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('focuses the target tab during keyboard navigation', async () => {
    createWrapper()

    const focus = vi.spyOn(tabs.tab(1).element as HTMLElement, 'focus')

    await tabs.tab(0).trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
    expect(focus).toHaveBeenCalledOnce()
  })

  it('provides a keyboard entry point for an unknown selection', () => {
    createWrapper({ modelValue: 'missing' })

    expect(tabs.tab(0).attributes('tabindex')).toBe('0')
    expect(tabs.tab(1).attributes('tabindex')).toBe('-1')
    expect(tabs.tab(0).attributes('aria-selected')).toBe('false')
    expect(tabs.tab(1).attributes('aria-selected')).toBe('false')
  })

  it('provides a keyboard entry point when the selected tab is disabled', () => {
    createWrapper({
      modelValue: 'connections',
      items: [
        { id: 'connections', label: 'Connections', disabled: true },
        { id: 'workspace', label: 'Workspace' },
      ],
    })

    expect(tabs.tab(0).attributes('tabindex')).toBe('-1')
    expect(tabs.tab(1).attributes('tabindex')).toBe('0')
  })

  it('does not make disabled tabs keyboard-reachable when all are disabled', () => {
    createWrapper({
      items: items.map((item) => ({ ...item, disabled: true })),
    })

    expect(
      wrapper.findAll('[role="tab"]').every((tab) => tab.attributes('tabindex') === '-1'),
    ).toBe(true)
  })

  it('updates the keyboard entry point when items change', async () => {
    createWrapper()

    await wrapper.setProps({
      items: [
        { id: 'connections', label: 'Connections', disabled: true },
        { id: 'workspace', label: 'Workspace' },
      ],
    })

    expect(tabs.tab(0).attributes('tabindex')).toBe('-1')
    expect(tabs.tab(1).attributes('tabindex')).toBe('0')
  })

  it('uses navigation semantics when requested', () => {
    createWrapper({ variant: 'navigation' })

    expect(tabs.tablist().exists()).toBe(false)
    expect(tabs.tabButtons().exists()).toBe(false)
    expect(tabs.button(0).attributes('aria-current')).toBe('page')
    expect(tabs.button(1).attributes('aria-current')).toBeUndefined()
  })

  it('emits selection updates in navigation mode', async () => {
    createWrapper({ variant: 'navigation' })

    await tabs.button(1).trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('does not implement tab keyboard behavior in navigation mode', async () => {
    createWrapper({ variant: 'navigation' })

    await tabs.button(0).trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  describe('scrollable navigation', () => {
    it('does not show scroll arrows when navigation fits', async () => {
      createNavigationWrapper()

      const viewport = tabs.viewport().element as HTMLElement

      mockScrollDimensions(viewport, { clientWidth: 400, scrollWidth: 400 })

      await tabs.viewport().trigger('scroll')

      expect(tabs.scrollLeft().exists()).toBe(false)
      expect(tabs.scrollRight().exists()).toBe(false)
    })

    it('shows scroll arrows when navigation overflows', async () => {
      createNavigationWrapper()

      const viewport = tabs.viewport().element as HTMLElement

      mockScrollDimensions(viewport, { clientWidth: 200, scrollWidth: 500 })

      await tabs.viewport().trigger('scroll')

      expect(tabs.disabledScrollLeft().exists()).toBe(true)
      expect(tabs.enabledScrollRight().exists()).toBe(true)
    })

    it('updates arrow states as navigation scrolls', async () => {
      createNavigationWrapper()

      const viewport = tabs.viewport().element as HTMLElement

      mockScrollDimensions(viewport, { clientWidth: 200, scrollWidth: 500 })

      await tabs.viewport().trigger('scroll')

      viewport.scrollLeft = 150
      await tabs.viewport().trigger('scroll')

      expect(tabs.enabledScrollLeft().exists()).toBe(true)
      expect(tabs.enabledScrollRight().exists()).toBe(true)

      viewport.scrollLeft = 300
      await tabs.viewport().trigger('scroll')

      expect(tabs.enabledScrollLeft().exists()).toBe(true)
      expect(tabs.disabledScrollRight().exists()).toBe(true)
    })

    it('scrolls when an arrow is clicked', async () => {
      createNavigationWrapper()

      const viewport = tabs.viewport().element as HTMLElement
      const scrollBy = vi.fn()

      mockScrollDimensions(viewport, { clientWidth: 200, scrollWidth: 500 })
      viewport.scrollBy = scrollBy

      await tabs.viewport().trigger('scroll')
      await tabs.scrollRight().trigger('click')

      expect(scrollBy).toHaveBeenCalledWith({
        left: 150,
        behavior: 'smooth',
      })

      viewport.scrollLeft = 150
      await tabs.viewport().trigger('scroll')
      await tabs.scrollLeft().trigger('click')

      expect(scrollBy).toHaveBeenLastCalledWith({
        left: -150,
        behavior: 'smooth',
      })
    })

    it('scrolls the selected navigation item into view', async () => {
      createNavigationWrapper()

      const viewport = tabs.viewport().element as HTMLElement
      const scrollBy = vi.fn()

      viewport.scrollBy = scrollBy

      vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue(mockRect(0, 200))
      vi.spyOn(tabs.button(3).element as HTMLElement, 'getBoundingClientRect').mockReturnValue(
        mockRect(250, 350),
      )

      await wrapper.setProps({ modelValue: 'downloads' })

      expect(scrollBy).toHaveBeenCalledWith({
        left: 150,
        behavior: 'smooth',
      })
    })

    it('scrolls left when the selected item is outside the left edge', async () => {
      createNavigationWrapper({ modelValue: 'downloads' })

      const viewport = tabs.viewport().element as HTMLElement
      const scrollBy = vi.fn()

      viewport.scrollBy = scrollBy

      vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue(mockRect(100, 300))
      vi.spyOn(tabs.button(0).element as HTMLElement, 'getBoundingClientRect').mockReturnValue(
        mockRect(20, 90),
      )

      await wrapper.setProps({ modelValue: 'requests' })

      expect(scrollBy).toHaveBeenCalledWith({
        left: -80,
        behavior: 'smooth',
      })
    })

    it('refreshes scroll state when navigation items change', async () => {
      createNavigationWrapper()

      const viewport = tabs.viewport().element as HTMLElement

      mockScrollDimensions(viewport, { clientWidth: 200, scrollWidth: 500 })

      await tabs.viewport().trigger('scroll')

      expect(tabs.scrollRight().exists()).toBe(true)

      mockScrollDimensions(viewport, { clientWidth: 200, scrollWidth: 200 })

      await wrapper.setProps({ items: navigationItems.slice(0, 2) })
      await nextTick()
      await tabs.viewport().trigger('scroll')

      expect(tabs.scrollLeft().exists()).toBe(false)
      expect(tabs.scrollRight().exists()).toBe(false)
    })

    it('does not add scroll controls to ordinary tabs', () => {
      createWrapper()

      expect(tabs.navigationViewport().exists()).toBe(false)
      expect(tabs.scrollLeft().exists()).toBe(false)
      expect(tabs.scrollRight().exists()).toBe(false)
    })

    it('observes navigation dimensions and disconnects on unmount', async () => {
      const disconnect = vi.fn()
      const observe = vi.fn()

      class ResizeObserverMock {
        observe = observe
        disconnect = disconnect
      }

      vi.stubGlobal('ResizeObserver', ResizeObserverMock)

      createNavigationWrapper()
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

      createWrapper()

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

      createNavigationWrapper()
      await nextTick()

      const initialObservations = observe.mock.calls.length

      await wrapper.setProps({ items: navigationItems.slice(0, 2) })
      await nextTick()
      await nextTick()

      expect(disconnect).toHaveBeenCalled()
      expect(observe.mock.calls.length).toBeGreaterThan(initialObservations)

      wrapper.unmount()
    })
  })
})
