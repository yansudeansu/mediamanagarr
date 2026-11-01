import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmNavigation from './MmNavigation.vue'
import MmTabs from '../MmTabs/MmTabs.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'
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

function createWrapper(overrides: Partial<TestProps> = {}) {
  return mount(MmNavigation, {
    props: {
      activeView: 'overview',
      items,
      ...overrides,
    },
  })
}

describe('MmNavigation', () => {
  it('renders a semantic navigation landmark', () => {
    const wrapper = createWrapper()

    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('aria-label')).toBe('Main navigation')
  })

  it('supports a custom navigation label', () => {
    const wrapper = createWrapper({
      label: 'Library navigation',
    })

    expect(wrapper.attributes('aria-label')).toBe('Library navigation')
  })

  it('uses MmTabs in navigation mode', () => {
    const wrapper = createWrapper()
    const tabs = wrapper.getComponent(MmTabs)

    expect(tabs.props('variant')).toBe('navigation')
    expect(tabs.props('modelValue')).toBe('overview')
    expect(tabs.props('items')).toEqual(items)
  })

  it('renders the supplied navigation items', () => {
    const wrapper = createWrapper()

    expect(wrapper.findAllComponents(MmButton)).toHaveLength(3)

    expect(wrapper.findAll('button').map((button) => button.text())).toEqual([
      'Overview',
      'Activity',
      'Library',
    ])
  })

  it('supports a different set of navigation items', () => {
    const wrapper = createWrapper({
      activeView: 'movies',
      items: [
        { id: 'movies', label: 'Movies' },
        { id: 'shows', label: 'TV Shows' },
      ],
    })

    expect(wrapper.findAll('button').map((button) => button.text())).toEqual(['Movies', 'TV Shows'])

    expect(wrapper.get('[aria-current="page"]').text()).toBe('Movies')
  })

  it('updates the rendered items when the items prop changes', async () => {
    const wrapper = createWrapper()

    await wrapper.setProps({
      items: [
        { id: 'overview', label: 'Overview' },
        { id: 'settings', label: 'Settings' },
      ],
    })

    expect(wrapper.findAll('button').map((button) => button.text())).toEqual([
      'Overview',
      'Settings',
    ])
  })

  it('uses ghost buttons with the small size', () => {
    const wrapper = createWrapper()

    for (const button of wrapper.findAll('button')) {
      expect(button.classes()).toContain('button--ghost')
      expect(button.classes()).toContain('button--small')
    }
  })

  it('uses native buttons with explicit button types', () => {
    const wrapper = createWrapper()

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
    const wrapper = createWrapper({ activeView })

    const activeButtons = wrapper.findAll('[aria-current="page"]')

    expect(activeButtons).toHaveLength(1)
    expect(activeButtons[0]?.text()).toBe(label)
  })

  it('does not mark inactive buttons as current', () => {
    const wrapper = createWrapper()

    const inactiveButtons = wrapper.findAll('button').slice(1)

    for (const button of inactiveButtons) {
      expect(button.attributes('aria-current')).toBeUndefined()
    }
  })

  it('emits the selected item ID when clicked', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('button')[1]!.trigger('click')

    expect(wrapper.emitted('navigate')).toEqual([['activity']])
  })

  it('does not change the active view without a prop update', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('button')[1]!.trigger('click')

    expect(wrapper.get('[aria-current="page"]').text()).toBe('Overview')
    expect(wrapper.emitted('navigate')).toEqual([['activity']])
  })

  it('updates the active item when the prop changes', async () => {
    const wrapper = createWrapper()

    await wrapper.setProps({
      activeView: 'library',
    })

    expect(wrapper.get('[aria-current="page"]').text()).toBe('Library')
    expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1)
    expect(wrapper.getComponent(MmTabs).props('modelValue')).toBe('library')
  })

  it('does not emit navigation events when props change', async () => {
    const wrapper = createWrapper()

    await wrapper.setProps({
      activeView: 'activity',
    })

    expect(wrapper.emitted('navigate')).toBeUndefined()
  })

  it('does not navigate when a disabled item is clicked', async () => {
    const wrapper = createWrapper({
      items: [
        { id: 'overview', label: 'Overview' },
        { id: 'activity', label: 'Activity', disabled: true },
      ],
    })

    await wrapper.findAll('button')[1]!.trigger('click')

    expect(wrapper.emitted('navigate')).toBeUndefined()
  })

  it('keeps enabled navigation buttons in the natural tab order', () => {
    const wrapper = createWrapper()

    for (const button of wrapper.findAll('button')) {
      expect(button.attributes('disabled')).toBeUndefined()
      expect(button.attributes('tabindex')).toBeUndefined()
    }
  })

  it('uses navigation semantics rather than ARIA tabs', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('[role="tablist"]').exists()).toBe(false)
    expect(wrapper.find('[role="tab"]').exists()).toBe(false)

    for (const button of wrapper.findAll('button')) {
      expect(button.attributes('aria-selected')).toBeUndefined()
    }
  })

  it('does not navigate when arrow keys are pressed', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('button')[0]!.trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.emitted('navigate')).toBeUndefined()
    expect(wrapper.get('[aria-current="page"]').text()).toBe('Overview')
  })

  it('does not navigate when a button receives focus', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const wrapper = mount(MmNavigation, {
      attachTo: container,
      props: {
        activeView: 'overview',
        items,
      },
    })

    try {
      const activityButton = wrapper.findAll('button')[1]!

      activityButton.element.focus()

      expect(document.activeElement).toBe(activityButton.element)
      expect(wrapper.get('[aria-current="page"]').text()).toBe('Overview')
      expect(wrapper.emitted('navigate')).toBeUndefined()
    } finally {
      wrapper.unmount()
      container.remove()
    }
  })

  it('does not steal keyboard focus when the active view changes', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const wrapper = mount(MmNavigation, {
      attachTo: container,
      props: {
        activeView: 'overview',
        items,
      },
    })

    try {
      const activityButton = wrapper.findAll('button')[1]!

      activityButton.element.focus()

      await wrapper.setProps({
        activeView: 'library',
      })

      expect(document.activeElement).toBe(activityButton.element)
      expect(wrapper.get('[aria-current="page"]').text()).toBe('Library')
      expect(wrapper.emitted('navigate')).toBeUndefined()
    } finally {
      wrapper.unmount()
      container.remove()
    }
  })
})
