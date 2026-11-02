import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmNavigation from './MmNavigation.vue'
import MmTabs from '../MmTabs/MmTabs.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
import { mmNavigationSelectors } from '../../../test/selectors/molecules/mmNavigation.selectors'
import type { TabItem } from '../MmTabs/MmTabs.vue'

const items: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity' },
  { id: 'library', label: 'Library' },
]

interface TestProps {
  activeView: string
  items: TabItem[]
  label: string
}

let wrapper: VueWrapper

const navigation = mmNavigationSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^nav /, ''))
})

function createWrapper(overrides: Partial<TestProps> = {}, attachTo?: HTMLElement) {
  wrapper = mount(MmNavigation, {
    ...(attachTo ? { attachTo } : {}),
    props: {
      activeView: 'overview',
      items,
      ...overrides,
    },
  })
  return wrapper
}

describe('MmNavigation', () => {
  it('renders a semantic navigation landmark', () => {
    createWrapper()

    expect(navigation.get().element.tagName).toBe('NAV')
    expect(navigation.get().attributes('aria-label')).toBe('Main navigation')
  })

  it('supports a custom navigation label', () => {
    createWrapper({ label: 'Library navigation' })

    expect(navigation.labelled('Library navigation').exists()).toBe(true)
  })

  it('uses MmTabs in navigation mode', () => {
    createWrapper()
    const tabs = wrapper.getComponent(MmTabs)

    expect(tabs.props('variant')).toBe('navigation')
    expect(tabs.props('modelValue')).toBe('overview')
    expect(tabs.props('items')).toEqual(items)
  })

  it('renders the supplied navigation items', () => {
    createWrapper()

    expect(wrapper.findAllComponents(MmButton)).toHaveLength(3)
    expect(navigation.button(0).text()).toBe('Overview')
    expect(navigation.button(1).text()).toBe('Activity')
    expect(navigation.button(2).text()).toBe('Library')
  })

  it('supports a different set of navigation items', () => {
    createWrapper({
      activeView: 'movies',
      items: [
        { id: 'movies', label: 'Movies' },
        { id: 'shows', label: 'TV Shows' },
      ],
    })

    expect(navigation.button(0).text()).toBe('Movies')
    expect(navigation.button(1).text()).toBe('TV Shows')
    expect(navigation.current().text()).toBe('Movies')
  })

  it('updates the rendered items when the items prop changes', async () => {
    createWrapper()

    await wrapper.setProps({
      items: [
        { id: 'overview', label: 'Overview' },
        { id: 'settings', label: 'Settings' },
      ],
    })

    expect(navigation.button(0).text()).toBe('Overview')
    expect(navigation.button(1).text()).toBe('Settings')
    expect(navigation.button(2).exists()).toBe(false)
  })

  it('uses ghost buttons with the small size', () => {
    createWrapper()

    for (const button of wrapper.findAll('button')) {
      expect(button.classes()).toContain('button--ghost')
      expect(button.classes()).toContain('button--small')
    }
  })

  it('uses native buttons with explicit button types', () => {
    createWrapper()

    for (const button of wrapper.findAll('button')) {
      expect(button.element.tagName).toBe('BUTTON')
      expect(button.attributes('type')).toBe('button')
    }
  })

  it.each([
    ['overview', 'Overview'],
    ['activity', 'Activity'],
    ['library', 'Library'],
  ])('marks %s as the active view', (activeView, label) => {
    createWrapper({ activeView })

    expect(navigation.current().text()).toBe(label)
    expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1)
  })

  it('does not mark inactive buttons as current', () => {
    createWrapper()

    expect(navigation.button(1).attributes('aria-current')).toBeUndefined()
    expect(navigation.button(2).attributes('aria-current')).toBeUndefined()
  })

  it('emits the selected item ID when clicked', async () => {
    createWrapper()

    await navigation.button(1).trigger('click')

    expect(wrapper.emitted('navigate')).toEqual([['activity']])
  })

  it('does not change the active view without a prop update', async () => {
    createWrapper()

    await navigation.button(1).trigger('click')

    expect(navigation.current().text()).toBe('Overview')
    expect(wrapper.emitted('navigate')).toEqual([['activity']])
  })

  it('updates the active item when the prop changes', async () => {
    createWrapper()

    await wrapper.setProps({ activeView: 'library' })

    expect(navigation.current().text()).toBe('Library')
    expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1)
    expect(wrapper.getComponent(MmTabs).props('modelValue')).toBe('library')
  })

  it('does not emit navigation events when props change', async () => {
    createWrapper()

    await wrapper.setProps({ activeView: 'activity' })

    expect(wrapper.emitted('navigate')).toBeUndefined()
  })

  it('does not navigate when a disabled item is clicked', async () => {
    createWrapper({
      items: [
        { id: 'overview', label: 'Overview' },
        { id: 'activity', label: 'Activity', disabled: true },
      ],
    })

    expect(navigation.button(1).attributes('disabled')).toBeDefined()

    await navigation.button(1).trigger('click')

    expect(wrapper.emitted('navigate')).toBeUndefined()
  })

  it('keeps enabled navigation buttons in the natural tab order', () => {
    createWrapper()

    for (const button of wrapper.findAll('button')) {
      expect(button.attributes('disabled')).toBeUndefined()
      expect(button.attributes('tabindex')).toBeUndefined()
    }
  })

  it('uses navigation semantics rather than ARIA tabs', () => {
    createWrapper()

    expect(navigation.tablist().exists()).toBe(false)
    expect(navigation.tabs().exists()).toBe(false)
    expect(navigation.selectedTabs().exists()).toBe(false)
  })

  it('does not navigate when arrow keys are pressed', async () => {
    createWrapper()

    await navigation.button(0).trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('navigate')).toBeUndefined()
    expect(navigation.current().text()).toBe('Overview')
  })

  it('does not navigate when a button receives focus', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    createWrapper({}, container)

    try {
      const activityButton = navigation.button(1)

      activityButton.element.focus()

      expect(document.activeElement).toBe(activityButton.element)
      expect(navigation.current().text()).toBe('Overview')
      expect(wrapper.emitted('navigate')).toBeUndefined()
    } finally {
      wrapper.unmount()
      container.remove()
    }
  })

  it('does not steal keyboard focus when the active view changes', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    createWrapper({}, container)

    try {
      const activityButton = navigation.button(1)

      activityButton.element.focus()

      await wrapper.setProps({ activeView: 'library' })

      expect(document.activeElement).toBe(activityButton.element)
      expect(navigation.current().text()).toBe('Library')
      expect(wrapper.emitted('navigate')).toBeUndefined()
    } finally {
      wrapper.unmount()
      container.remove()
    }
  })
})
