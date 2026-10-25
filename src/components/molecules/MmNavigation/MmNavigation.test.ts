import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmNavigation from './MmNavigation.vue'
import MmButton from '../../atoms/MmButton/MmButton.vue'

function createWrapper(activeView: 'requests' | 'up-next' | 'calendar' | 'downloads' = 'requests') {
  return mount(MmNavigation, {
    props: {
      activeView,
    },
  })
}

describe('MmNavigation', () => {
  it('renders a semantic navigation landmark', () => {
    const wrapper = createWrapper()

    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('aria-label')).toBe('Main navigation')
  })

  it('renders four MmButton components', () => {
    const wrapper = createWrapper()

    expect(wrapper.findAllComponents(MmButton)).toHaveLength(4)
  })

  it('renders the correct navigation labels', () => {
    const wrapper = createWrapper()

    expect(wrapper.findAll('button').map((button) => button.text())).toEqual([
      'Requests',
      'Up Next',
      'Calendar',
      'Downloads',
    ])
  })

  it('uses the ghost variant for every button', () => {
    const wrapper = createWrapper()

    for (const button of wrapper.findAll('button')) {
      expect(button.classes()).toContain('button--ghost')
    }
  })

  it('uses the small size for every button', () => {
    const wrapper = createWrapper()

    for (const button of wrapper.findAll('button')) {
      expect(button.classes()).toContain('button--small')
    }
  })

  it('uses native buttons with explicit button types', () => {
    const wrapper = createWrapper()

    for (const button of wrapper.findAll('button')) {
      expect(button.attributes('type')).toBe('button')
    }
  })

  it.each([
    ['requests', 'Requests'],
    ['up-next', 'Up Next'],
    ['calendar', 'Calendar'],
    ['downloads', 'Downloads'],
  ] as const)('marks %s as the active view', (activeView, label) => {
    const wrapper = createWrapper(activeView)

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

  it.each([
    ['Requests', 'requests'],
    ['Up Next', 'up-next'],
    ['Calendar', 'calendar'],
    ['Downloads', 'downloads'],
  ] as const)('emits navigate when %s is clicked', async (label, view) => {
    const wrapper = createWrapper()

    const button = wrapper.findAll('button').find((item) => item.text() === label)

    expect(button).toBeDefined()

    await button!.trigger('click')

    expect(wrapper.emitted('navigate')).toEqual([[view]])
  })

  it('does not change the active view without a prop update', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('button')[1]!.trigger('click')

    expect(wrapper.find('[aria-current="page"]').text()).toBe('Requests')
    expect(wrapper.emitted('navigate')).toEqual([['up-next']])
  })

  it('updates the active item when the prop changes', async () => {
    const wrapper = createWrapper()

    await wrapper.setProps({
      activeView: 'calendar',
    })

    expect(wrapper.find('[aria-current="page"]').text()).toBe('Calendar')
    expect(wrapper.findAll('[aria-current="page"]')).toHaveLength(1)
  })

  it('does not emit navigation events when props change', async () => {
    const wrapper = createWrapper()

    await wrapper.setProps({
      activeView: 'downloads',
    })

    expect(wrapper.emitted('navigate')).toBeUndefined()
  })

  it('keeps all navigation buttons in the natural tab order', () => {
    const wrapper = createWrapper()

    const buttons = wrapper.findAll('button')

    expect(buttons).toHaveLength(4)

    for (const button of buttons) {
      expect(button.element.tagName).toBe('BUTTON')
      expect(button.attributes('disabled')).toBeUndefined()
      expect(button.attributes('tabindex')).toBeUndefined()
    }
  })

  it('uses navigation semantics rather than ARIA tabs', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('[role="tablist"]').exists()).toBe(false)
    expect(wrapper.find('[role="tab"]').exists()).toBe(false)
  })

  it('does not navigate when a button receives focus', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const wrapper = mount(MmNavigation, {
      attachTo: container,
      props: {
        activeView: 'requests',
      },
    })

    try {
      const calendarButton = wrapper.findAll('button')[2]!

      calendarButton.element.focus()

      expect(document.activeElement).toBe(calendarButton.element)
      expect(wrapper.find('[aria-current="page"]').text()).toBe('Requests')
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
        activeView: 'requests',
      },
    })

    try {
      const buttons = wrapper.findAll('button')
      const calendarButton = buttons[2]!

      calendarButton.element.focus()

      await wrapper.setProps({
        activeView: 'downloads',
      })

      expect(document.activeElement).toBe(calendarButton.element)
      expect(wrapper.find('[aria-current="page"]').text()).toBe('Downloads')
      expect(wrapper.emitted('navigate')).toBeUndefined()
    } finally {
      wrapper.unmount()
      container.remove()
    }
  })
})
